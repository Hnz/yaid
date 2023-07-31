[![PyPI](https://img.shields.io/pypi/v/yaid?style=flat-square)](https://pypi.org/project/yaid)
[![black](https://img.shields.io/badge/code--style-black-black?style=flat-square)](https://black.readthedocs.io/)
[![License](https://img.shields.io/github/license/hnz/yaid?style=flat-square)](https://github.com/hnz/yaid/blob/main/LICENSE)
[![Build status](https://img.shields.io/github/actions/workflow/status/hnz/yaid/check-py.yml?style=flat-square)](https://github.com/hnz/yaid/actions/workflows/check-py.yml)

# 🆔 YAID-py

_Python implementation of Yet Another ID_

## Install

    pip3 install yaid

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

    yaid
    4X85VYWZC9ABP

or as a module

    python3 -m yaid
    4X85VYWZC9ABP

Set metadata

    yaid -m 123
    4X85W9A0Y9TQP

Show info

    yaid -i 4X85W9A0Y9TQP
    Time: 2023-07-05 01:31:57.440000
    Meta: 123

## Test

    python3 yaid_test.py

## Building the documentation

    pydoc-markdown -p yaid > dist/yaid.md
