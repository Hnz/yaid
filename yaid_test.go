// Copyright (c) 2023 Hans van Leeuwen. MIT Licensed. See LICENSE.md for full license.

package yaid_test

import (
	"fmt"
	"testing"

	"github.com/google/uuid"
	"github.com/hnz/yaid"
)

func Example() {
	y := yaid.YAID{}
	y.SetEpoch(1687446557)
	y.SetShard([]byte("X"))

	fmt.Println("yaid: ", y)
	fmt.Println("time: ", y.Time())
	fmt.Println("epoch:", y.Epoch())
	//	fmt.Println("shard:", )

	// Output:
	// yaid:  0S4MCGEG002R
	// time:  1970-01-20 13:44:06.557 +0100 CET
	// epoch: 1687446557
}

func ExampleParse() {
	y, err := yaid.Parse("0S4MCGEG002R")
	if err != nil {
		fmt.Println("Error!", err)
	}

	fmt.Println("yaid: ", y)
	fmt.Println("time: ", y.Time())
	fmt.Println("epoch:", y.Epoch())
	// Output:
	// yaid:  0S4MCGEG002R
	// time:  1970-01-20 13:44:06.557 +0100 CET
	// epoch: 1687446557
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
