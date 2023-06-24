/*
Command line utility for handeling [YAID] ids

[YAID]: github.com/hnz/yaid
*/
package main

import (
	"crypto/rand"
	"flag"
	"fmt"
	"os"

	"github.com/hnz/yaid/go-yaid"
)

func main() {
	meta := flag.Int("m", -1, "Metadata. Number beteen 0-255. Use random value if negative.")
	info := flag.String("i", "", "Show id info")

	flag.Parse()

	if len(flag.Args()) > 1 {
		fmt.Fprintln(os.Stderr, "Too many arguments")
		os.Exit(1)
	}

	if *info == "" {
		// Generate id
		r := make([]byte, 1)

		if *meta < 0 {
			rand.Read(r)
		} else if *meta < 256 {
			r = []byte{uint8(*meta)}
		} else {
			fmt.Fprintln(os.Stderr, "Maximum meta value exceeded")
			os.Exit(1)
		}

		y, err := yaid.New(r)
		handleError(err)
		fmt.Println(y)
	} else {
		// Show info
		y, err := yaid.Parse(*info)
		handleError(err)
		fmt.Println("Time:", y.Time().Format("2006-01-02 15:04:05.00 -07:00:00"))
		fmt.Println("Meta:", uint8(y.Meta()[0]))
	}
}

func handleError(err error) {
	if err != nil {
		panic(err)
	}
}
