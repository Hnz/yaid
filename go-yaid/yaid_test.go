// Copyright (c) 2023 Hans van Leeuwen. MIT Licensed. See LICENSE.md for full license.

package yaid_test

import (
	"crypto/rand"
	"fmt"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/hnz/yaid/go-yaid"
	"github.com/oklog/ulid/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Example() {
	y := yaid.YAID{}
	t := time.Date(2222, 1, 2, 3, 4, 5, 6, time.UTC)
	y.SetTime(t)
	y.SetMeta([]byte{123})

	fmt.Println("yaid: ", y)
	fmt.Println("int:  ", y.Int())
	fmt.Println("time: ", y.Time().UTC())
	fmt.Println("shard:", y.Meta())

	y, err := yaid.Parse(y.String())
	if err != nil {
		fmt.Println("Error!", err)
	}

	fmt.Println("time: ", y.Time().UTC())
	fmt.Println("shard:", y.Meta())
	fmt.Println("error:", err)

	// Output:
	//
	// yaid:  BJA1W6ST0003V
	// int:   13341980100657152123
	// time:  2222-01-02 03:04:05 +0000 UTC
	// shard: [123]
	// time:  2222-01-02 03:04:05 +0000 UTC
	// shard: [123]
	// error: <nil>
}

func ExampleFactory() {
	f := yaid.Factory([]byte{123})
	id, err := f()
	if err != nil {
		panic(err)
	}
	fmt.Println(id.Meta())

	// Output:
	//
	// [123]
}

func ExampleYAID_SetMeta() {
	y := yaid.YAID{}
	fmt.Println(y.Meta())

	y.SetMeta([]byte{123})
	fmt.Println(y.Meta())

	// Output:
	// [0]
	// [123]
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

func BenchmarkYAIDGenerator(b *testing.B) {
	id := yaid.Factory([]byte("X"))
	for i := 0; i < b.N; i++ {
		id()
	}
}

func BenchmarkObjectID(b *testing.B) {
	for i := 0; i < b.N; i++ {
		primitive.NewObjectID()
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

func BenchmarkULID(b *testing.B) {
	for i := 0; i < b.N; i++ {
		ms := time.Now().UnixMilli()
		ulid.New(uint64(ms), rand.Reader)
	}
}
