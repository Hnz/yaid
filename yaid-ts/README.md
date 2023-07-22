# 🆔 YAID-js

_Javascript implementation of Yet Another ID_

## Install

    npm install yaid

## Command line

This package comes with a commandline utility called `yaid`.
You can run it from the command line

    $ yaid
    4X85VYWZC9ABP

or as a module

    $ python3 -m yaid
    4X85VYWZC9ABP

Set metadata

    $ yaid -m 123
    4X85W9A0Y9TQP

Show info

    $ yaid -i 4X85W9A0Y9TQP
    Time: 2023-07-05 01:31:57.440000
    Meta: 123

## Develop

This package uses [bun].

### Build

    npm run build

### Lint

    npm run lint

### Test

    npm run test

[bun]: bun.sh
