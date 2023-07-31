[![GitHub package.json version](https://img.shields.io/github/package-json/v/hnz/yaid?filename=yaid-js%2Fpackage.json&style=for-the-badge)](https://github.com/Hnz/yaid/blob/main/yaid-js/package.json)
[![License](https://img.shields.io/github/license/hnz/yaid?style=for-the-badge)](https://github.com/hnz/yaid/blob/main/LICENSE)
[![Build status](https://img.shields.io/github/actions/workflow/status/hnz/yaid/check-js.yml?style=for-the-badge)](https://github.com/hnz/yaid/actions/workflows/check-js.yml)

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
