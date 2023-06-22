/*
Command line utility for handeling [YAID] ids

[YAID]: github.com/hnz/yaid
*/
package main

import (
	"fmt"

	"github.com/hnz/yaid"
)

func main() {
	y, err := yaid.New([]byte("X"))
	if err != nil {
		panic(err)
	}
	fmt.Println(y)
}
