// Copyright (c) 2023 Hans van Leeuwen. MIT Licensed. See LICENSE.md for full license.

/*
yaid is a go package that implements [YAID]

# Example

	import (
		"github.com/hnz/yaid/yaid-go"
	)

	y := yaid.NewGenerator()
	id := y()

[YAID]: https://github.com/hnz/yaid
*/
package yaid

import (
	"crypto/rand"
	"encoding/binary"
	"fmt"
	"io"
	"time"

	"github.com/ilius/crock32"
)

// Get the maximum timestamp by setting all bytes to maximum value
var max_timestamp = YAID{255, 255, 255, 255, 255, 255, 255, 255}.timestamp()

const (
	TIME_BYTES = 5
	DIFF_BYTES = 2
	META_BYTES = 1

	// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
	DEFIDER = 10
)

type YAID [TIME_BYTES + DIFF_BYTES + META_BYTES]byte

func (y YAID) Int() uint64 {
	return binary.BigEndian.Uint64(y[:])
}

// Return id as Base32 crockford encoded string
func (y YAID) String() string {
	return crock32.Encode(y[:])
}

func (y *YAID) Differentiator() []byte {
	return y[TIME_BYTES : TIME_BYTES+DIFF_BYTES]
}

// Set the differentiator
func (y *YAID) SetDifferentiator(b []byte) error {

	if len(b) != DIFF_BYTES {
		return fmt.Errorf("random part must be exactly %d bytes", DIFF_BYTES)
	}

	for i := 0; i < DIFF_BYTES; i++ {
		(*y)[i+TIME_BYTES] = b[i]
	}

	return nil
}

func (y *YAID) Meta() []byte {
	return y[TIME_BYTES+DIFF_BYTES:]
}

func (y *YAID) SetMeta(meta []byte) error {
	if len(meta) > META_BYTES {
		return fmt.Errorf("meta key must not be longer than %d bytes", META_BYTES)
	}

	for i := 0; i < META_BYTES; i++ {
		(*y)[i+TIME_BYTES+DIFF_BYTES] = meta[i]
	}

	return nil
}

func (y YAID) Time() time.Time {
	ms := y.timestamp() * DEFIDER
	return time.UnixMilli(int64(ms))
}

func (y *YAID) SetTime(t time.Time) error {
	ms := t.UnixMilli() / DEFIDER
	return y.setTimestamp(uint64(ms))
}

func (y YAID) MarshalText() ([]byte, error) {
	return []byte(y.String()), nil
}

func (y *YAID) UnmarshalText(text []byte) (err error) {
	*y, err = Parse(string(text))
	return err
}

// Returns the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
func (y YAID) timestamp() uint64 {
	return uint64(y[4]) |
		uint64(y[3])<<8 |
		uint64(y[2])<<16 |
		uint64(y[1])<<24 |
		uint64(y[0])<<32
}

// Set the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
func (y *YAID) setTimestamp(t uint64) error {
	if t > max_timestamp {
		return fmt.Errorf("epoch must not be greater than %d", max_timestamp)
	}

	(*y)[0] = byte(t >> 32)
	(*y)[1] = byte(t >> 24)
	(*y)[2] = byte(t >> 16)
	(*y)[3] = byte(t >> 8)
	(*y)[4] = byte(t)

	return nil
}

type Generator struct {
	Meta   []byte
	Random io.Reader
}

func (g Generator) New() (y YAID, err error) {
	err = y.SetTime(time.Now())
	if err != nil {
		return y, err
	}

	err = y.SetMeta(g.Meta)
	if err != nil {
		return y, err
	}

	b := make([]byte, DIFF_BYTES)
	_, err = g.Random.Read(b)
	if err != nil {
		return y, err
	}
	y.SetDifferentiator(b)

	return y, err
}

// Create a factory that returns ids.
func Factory(meta []byte) func() (y YAID, err error) {
	g := Generator{meta, rand.Reader}
	return func() (y YAID, err error) {
		return g.New()
	}
}

func New(meta []byte) (y YAID, err error) {
	return Factory(meta)()
}

func Parse(yaid string) (y YAID, err error) {
	b, err := crock32.Decode(yaid)
	if err != nil {
		return y, err
	}
	if len(b) != TIME_BYTES+DIFF_BYTES+META_BYTES {
		return y, fmt.Errorf("yaid must be exactly %d bytes", TIME_BYTES+DIFF_BYTES+META_BYTES)
	}

	copy(y[:], b)

	return y, nil
}
