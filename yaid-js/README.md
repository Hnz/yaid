# 🆔 YAID-js

_Javascript implementation of Yet Another ID_

## Install

    npm install yaid

## Usage

```js
import { New, Parse } from "yaid";

// Create a new random id
const id = New();

// Parse an existing id
id = Parse("4X85W9A0Y9TQP");
```

## Command line

This package comes with a commandline utility called `yaid`.

    yaid
    4X85VYWZC9ABP

Set metadata

    yaid -m 123
    4X85W9A0Y9TQP

Show info

    yaid -i 4X85W9A0Y9TQP
    Time: 2023-07-05 01:31:57.440000
    Meta: 123

## Develop

This package uses [bun](https://bun.sh).

Build

    npm run build

Lint

    npm run lint

Test

    npm run test