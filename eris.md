# ERIS Cookbook

This document is just a quick tutorial for getting started with ERIS.

## What is ERIS ?

ERIS stands for Encoding for Robust Immutable Storage. It supports different network protocols and can encode any files to some encrypted blocks, and can provide an unique URN to access each of the files. You can syndicate different ERIS servers together to access more content. Each server can be read-write or read-only, and can be accessible through different protocols (http, soap, 9p), and deliver the contents encoded or decoded.

## Installing ERIS

The recommended implementation is the one in Go, [eris-go](https://codeberg.org/eris/eris-go) (at the moment, it has the most features implemented).

You can do a `go build` in the source code folder to compile your own (supported architectures are darwin, dragonfly, freebsd, linux, netbsd, openbsd and solaris, but some may not have fuse or specific fs driver compatibility). 

We can move the binary to an accessible path `cp eris-go /usr/local/bin/eris-go`.

> [!TIP]
> There is a convenient nix module to get your server running on Nix OS cf. <https://search.nixos.org/options?channel=24.05&from=0&size=50&sort=relevance&type=packages&query=eris-server>

### Choosing a backend

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
All the three together is possible, but only one per protocol

## Starting your server

In order to get your ERIS server to start you need to export in your environment `ERIS_STORE_URL` that may contain one or more resources urls to ERIS servers, separated by spaces.

For now, let's use badger, the recommended backend for local storage and have a unique server with get and put access: 

```bash
export ERIS_STORE_URL='badger+file:///var/eris/storage?put&get'
```


Then let's start the server with an coap access on the standard port, and a http access on port 8080 (will be useful for streaming) 

```bash
eris-go server -coap 127.0.0.1:5683 -http 127.0.0.1:8080 -encode -decode 
```

> [!TIP]
> the `-encode` and `-decode` parameters are necessary if you want to transfert files from/to and classic filesystem.

## Adding files to your server

We need the `-convergent` argument to encode the files.

```bash
eris-go put -convergent < /path/to/file 
```
This command returns an URN that identifies the content sent.

> [!WARNING]
> This URN is the only 

```bash
eris-go put -convergent < /path/to/file > /var/eris/*file*.eris
```

## Getting files from your server

### Copy to your filesystem



### Stream to your media player

You can access an URN from `http://127.0.0.1:8080/uri-res/N2R?urn:eris:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

You could open it as a network media source in VLC or mpv

## Add another server to your server

## Public read-only, local read-write servers

## Resources

- <https://eris.codeberg.page/spec/> : ERIS specs
- <https://codeberg.org/eris/eris-go/src/branch/trunk/eris-go.1.md> : eric-go man page
