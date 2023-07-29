# 🆔 YAID-py

_Python implementation of Yet Another ID_

## Install

```shell
$ pip3 install yaid
```

## Usage

```python
from yaid import new, parse

# Create a new random id
id = new()

# Parse an id
id = parse("4X85VYWZC9ABP")
```

## Command line

This package comes with a commandline utility called `yaid`.
You can run it from the command line

```shell
$ yaid
4X85VYWZC9ABP
```

or as a module

```shell
$ python3 -m yaid
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

## Test

```shell
$ python3 -m unittest
```

## Building the documentation

```shell
$ pydoc-markdown -p yaid > dist/yaid.md
```
