// Copyright (c) 2023 Hans van Leeuwen. MIT Licensed. See LICENSE.md for full license.

package yaid_test

import (
	"fmt"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/hnz/yaid"
)

func Example() {
	y := yaid.YAID{}
	t := time.Date(2222, 1, 2, 3, 4, 5, 6, time.UTC)
	y.SetTime(t)
	y.SetShard([]byte("X"))

	fmt.Println("yaid: ", y)
	fmt.Println("time: ", y.Time().UTC())
	fmt.Println("shard:", y.Shard())

	// Output:
	// yaid:  BJA1W6ST0002R
	// time:  2222-01-02 03:04:05 +0000 UTC
	// shard: [88]
}

func ExampleParse() {
	y, err := yaid.Parse("BJA1W6ST0002R")
	if err != nil {
		fmt.Println("Error!", err)
	}

	fmt.Println("yaid: ", y)
	fmt.Println("time: ", y.Time().UTC())
	fmt.Println("shard:", y.Shard())
	// Output:
	// yaid:  BJA1W6ST0002R
	// time:  2222-01-02 03:04:05 +0000 UTC
	// shard: [88]
}

func ExampleYAID_SetTime() {
	y := yaid.YAID{}
	fmt.Println(y.Time().UTC())

	t := time.Date(2222, 1, 2, 3, 4, 5, 6, time.UTC)
	y.SetTime(t)
	fmt.Println(y.Time().UTC())

	// Output:
	// 1970-01-01 00:00:00 +0000 UTC
	// 2222-01-02 03:04:05 +0000 UTC
}

func BenchmarkYAID(b *testing.B) {
	for i := 0; i < b.N; i++ {
		yaid.New([]byte("X"))
	}
}

func BenchmarkUUIDv1(b *testing.B) {
	for i := 0; i < b.N; i++ {
		uuid.NewUUID()
	}
}

func BenchmarkUUIDv4(b *testing.B) {
	for i := 0; i < b.N; i++ {
		uuid.New()
	}
}
