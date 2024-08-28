# ERIS in Nix cookbook

This document is just a quick tutorial for getting started with ERIS in a Nix OS environment.

## What is ERIS ?

ERIS stands for Encoding for Robust Immutable Storage. It supports different network protocols and can encode any files to some encrypted blocks, and can provide an unique URN to access each of the files. You can syndicate different ERIS servers together to access more content. Each server can be read-write or read-only, and can be accessible through different protocols (http, soap, 9p), and deliver the contents encoded or decoded.

## Installing ERIS

The recommended implementation is the one in Go, [eris-go](https://codeberg.org/eris/eris-go) (at the moment, it has the most features implemented).

### Compile from the source

You can do a `go build` in the source code folder to compile your own (supported architectures are darwin, dragonfly, freebsd, linux, netbsd, openbsd and solaris, but some may not have fuse or specific fs driver compatibility). 

We can move the binary to an accessible path `cp eris-go /usr/local/bin/eris-go`.

### Or use the nix package 

You can run `nix-shell -p eris-go` to get the program in a temporary shell, or add the `eris-go` package to your configuration to have it permanently.

### Or install the ERIS server as a service with the nix module 

There also is a convenient nix module to get your `eris-go` server running on Nix OS [with configuration options](https://search.nixos.org/options?channel=24.05&from=0&size=50&sort=relevance&type=packages&query=eris-server).

```nix
services.eris-server {
  enable = true;
  backends = [
      "badger+file:///var/eris?put&get" # local one on /var/eris
      # "coap+tcp://eris.example.com:5683?get" # an online one
  ];
  mountpoint = "/mnt/media/eris"; # useful to mount eris-fs folders
  listenHttp = ":8080"; # or "[::1]:8080"
  listenCoap = ":5683"; # or "[::1]:5683"
  decode = true; # for http access via https://127.0.0.1:8080/uri-res/N2R?urn:eris:...
  package = pkgs.eris-go; # default package
};
```

## Starting your server

### Choosing a backend store

We need to choose one of the backends to use for the server. For local usage, BADGERDB is recommended et for network storage COAP+TCP

| Backend     | Url syntax                             | Comment                       |
| ----------- | -------------------------------------- | ----------------------------- |
| COAP        | `coap://*host*:*port*?[get&put]`         | UDP is slower                 |
| COAP+TCP    | `coap+tcp://*host*:*port*?[get&put]`     | TCP is prefered               |
| DIRECTORIES | `dir+fs://*path*?[get&put]`              |                               |
| HTTP        | `http://*host*:*port*?[get&put]`         |                               |
| BADGERDB    | `badger+file://*...*?[get&put&cache]`    | recommended for local storage |
| BOLTDB      | `bolt+file://*...*?[get&put&cache]`      |                               |
| CBOR        | `cbor+file://*...*?[?put&cache]`         | write-only                    |
| MEMORY      | `memory://`                              |                               |

> [!TIP]
> You simply can add `get` (for read access to blocks) or `put` (for write access to blocks) as parameters of your backend Url to have some basic access controls. You can combine get and put example: `?get&put`.  

### Choosing a network protocol

You can use **9p address**, **coap host:port** and **http host:port**.
All the three together is possible, but only one option per protocol.

### Launch the server with chosen options

In order to get your ERIS server to start you need to export in your environment `ERIS_STORE_URL` that may contain one or more resources urls to ERIS servers, separated by spaces.

For now, let's use badger, the recommended backend for local storage and have a unique server with get and put access : 

```bash
ERIS_FOLDER=~/eris/storage # or any folder you have access to
export ERIS_STORE_URL="badger+file://$ERIS_FOLDER?put&get"
```


Then let's start the server with an coap access on the standard port, and a http access on port 8080 (will be useful for streaming) 

```bash
eris-go server -coap 127.0.0.1:5683 -http 127.0.0.1:8080 -encode -decode 
```

> [!TIP]
> The `-encode` and `-decode` parameters are necessary if you want to transfer files from/to and classic file-system.
> You could also use `-mountpoint ~/eris/mount` to create a mountpoint to access URNs later.

## Using the client to access storage

We are using the coap protocol to let the client access the ERIS server, so we update the `ERIS_STORE_URL`.

```bash
export ERIS_STORE_URL="coap+tcp://127.0.0.1:5683?put&get"
```

## Adding files to your server

We need the `-convergent` argument to encode the files.

```bash
eris-go put -convergent < /path/to/file 
```
This command returns an URN that identifies the content sent.

> [!WARNING]
> This URN is the only way to access your file, so maybe save it somewhere, like as a file, like in the example below. 

```bash
eris-go put -convergent < /path/to/file > ~/eris/*file*.eris
```

You can add folders by creating an eris-fs URN with
```bash
eris-go put -convergent < /path/to/file > ~/eris/*file*.eris
```


## Getting files from your server

### Copy to your filesystem

```bash
eris-go get urn:eris:YOUR_URN > /path/to/file.ext
```

Where `YOUR_URN` should be replaced by your actual URN.

### Launch in an application

Piping in a media player (for example) is also possible

```bash
eris-go get urn:eris:YOUR_URN | mpv -
```

### Stream to your media player

You can access an URN from `http://127.0.0.1:8080/uri-res/N2R?urn:eris:YOUR_URN`

Where `YOUR_URN` should be replaced by your actual URN.

You could open it as a network media source in VLC or mpv

### Access eris-fs folders

The simplest way is to use a fuse mounted URN from the `~/eris/mount/urn:eris:YOUR_URN`.

Where `YOUR_URN` should be replaced by the actual eris-fs folder URN.


## Add another server to your server

If somebody is sharing his storage backend Url with you, you can add it to your server by:

- stopping the running server
- add the new backend url to your ERIS_STORE_URL with a space to separate them
```bash
ERIS_STORE_URL = "$ERIS_STORE_URL coap+tcp://192.168.1.220:5683?get"
```
- restart your server

Now the URNs from this new server are available.

## Resources

- <https://eris.codeberg.page/spec/> : ERIS specs
- <https://codeberg.org/eris/eris-go/src/branch/trunk/eris-go.1.md> : eric-go man page
