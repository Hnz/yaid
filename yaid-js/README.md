# 🆔 YAID-js

_Javascript implementation of Yet Another ID_

## Install

```shell
$ npm install yaid
```

## Usage

```js
import { New, Parse } from "yaid";

const id = New();
```

## Command line

This package comes with a commandline utility called `yaid`.

```shell
$ yaid
4X85VYWZC9ABP
```

Set metadata

```shell
$ yaid -m 123
4X85W9A0Y9TQP
```

Show info

```shell
$ yaid -i 4X85W9A0Y9TQP
Time: 2023-07-05 01:31:57.440000
Meta: 123
```

## Develop

This package uses [bun](https://bun.sh).

Build

```shell
npm run build
```

Lint

```shell
npm run lint
```

Test

```shell
 npm run test
```
