# 🆔 YAID-py

_Python implementation of Yet Another ID_

## Install

    pip3 install yaid

## Test

    python3 -m test

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

## Usage

    from yaid import new
    id = new()

## Building the documentation

    pydoc-markdown -p yaid > dist/yaid.md
