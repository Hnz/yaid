/*
Command line utility for handeling [YAID] ids

[YAID]: github.com/hnz/yaid
*/
package main

import (
	"crypto/rand"
	"encoding/binary"
	"flag"
	"fmt"
	"os"

	"github.com/hnz/yaid/go-yaid"
)

func main() {
	meta := *flag.Int("m", -1, "Metadata. Number beteen 0-255. Use random value if undefined.")
	info := flag.String("i", "", "Show id info")

	flag.Parse()

	if len(flag.Args()) > 1 {
		fmt.Fprintln(os.Stderr, "Too many arguments")
		os.Exit(1)
	}

	if *info == "" {
		// Generate id
		r := make([]byte, 1)

		if meta == -1 {
			rand.Read(r)
		} else {
			binary.LittleEndian.PutUint16(r, uint16(meta))
		}

		y, err := yaid.New(r)
		if err != nil {
			panic(err)
		}
		fmt.Println(y)
	} else {
		// Show info
		y, err := yaid.Parse(*info)
		if err != nil {
			panic(err)
		}
		fmt.Println("Time:", y.Time())
		fmt.Println("Meta:", y.Meta())
	}

}
