[![go.mod Go version](https://img.shields.io/github/go-mod/go-version/hnz/yaid?filename=yaid-go%2Fgo.mod&style=flat-square)](https://go.dev/doc/devel/release)
[![Go.Dev reference](https://img.shields.io/badge/go.dev-reference-blue?logo=go&logoColor=white&style=flat-square)](https://pkg.go.dev/github.com/hnz/yaid/yaid-go#section-readme)
[![Go Report Card](https://goreportcard.com/badge/github.com/hnz/yaid/yaid-go?style=flat-square)](https://goreportcard.com/report/github.com/hnz/yaid/yaid-go)
[![License](https://img.shields.io/github/license/hnz/yaid?style=flat-square)](https://github.com/hnz/yaid/blob/main/LICENSE)
[![Build status](https://img.shields.io/github/actions/workflow/status/hnz/yaid/check-go.yml?style=flat-square)](https://github.com/hnz/yaid/actions/workflows/check-go.yml)

# 🆔 YAID-go

_Go implementation of [Yet Another ID]_

## Install library

    go get github.com/hnz/yaid/yaid-go

## Usage

```go
package main

import (
	"fmt"
	"github.com/hnz/yaid/yaid-go"
)

func main() {
	id, err := yaid.New([]byte{123})
	fmt.Println(id, err)
}
```

See full api specifications and examples [here](https://pkg.go.dev/github.com/hnz/yaid/yaid-go#section-readme).

## Command line

This package comes with a commandline utility called `yaid`.
You can install it by running `go install github.com/hnz/yaid/yaid-go/cmd`.

    yaid
    4X85VYWZC9ABP

Set metadata

    yaid -m 123
    4X85W9A0Y9TQP

Show info

    yaid -i 4X85W9A0Y9TQP
    Time: 2023-07-05 01:31:57.440000
    Meta: 123

# Benchmark vs other implementations

    goos: windows
    goarch: amd64
    pkg: github.com/hnz/yaid
    cpu: AMD Ryzen 7 3700X 8-Core Processor
    BenchmarkYAID-16              5198966       231.2 ns/op      76 B/op	       4 allocs/op
    BenchmarkYAIDGenerator-16     7151988       168.3 ns/op      26 B/op	       2 allocs/op
    BenchmarkUUIDv1-16           38715171       30.42 ns/op       0 B/op	       0 allocs/op
    BenchmarkUUIDv4-16            6573123       180.4 ns/op      40 B/op	       2 allocs/op
    BenchmarkULID-16              6184029       193.5 ns/op      40 B/op	       2 allocs/op

## Develop

Build

    go build -o yaid ./cmd

Lint

    golint .

Test

    go test

[Yet Another ID]: https://hnz.github.io/yaid
