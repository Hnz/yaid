// Copyright (c) 2023 Hans van Leeuwen. MIT Licensed. See LICENSE.md for full license.

/*
Package yaid is a go package that implements [Yet Another ID]

# Example

	import (
		"github.com/hnz/yaid/yaid-go"
	)

	y := yaid.NewGenerator()
	id := y()

[Yet Another ID]: https://github.io/yaid
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
var maxTimestamp = YAID{255, 255, 255, 255, 255, 255, 255, 255}.Timestamp()

const (
	TimeBytes = 5 // TimeBytes specifies how many bytes are used for the timestamp
	DiffBytes = 2 // DiffBytes specifies how many bytes are used for the differentiator
	MetaBytes = 1 // MetaBytes specifies how many bytes are used for metadata

	// Defider of the timestamp. 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
	Defider = 10
)

type YAID [TimeBytes + DiffBytes + MetaBytes]byte

// Return the
func (y YAID) Int() uint64 {
	return binary.BigEndian.Uint64(y[:])
}

// Return id as Base32 crockford encoded string
func (y YAID) String() string {
	return crock32.Encode(y[:])
}

func (y *YAID) Differentiator() []byte {
	return y[TimeBytes : TimeBytes+DiffBytes]
}

// Set the differentiator
func (y *YAID) SetDifferentiator(b []byte) error {

	if len(b) != DiffBytes {
		return fmt.Errorf("random part must be exactly %d bytes", DiffBytes)
	}

	for i := 0; i < DiffBytes; i++ {
		(*y)[i+TimeBytes] = b[i]
	}

	return nil
}

func (y *YAID) Meta() []byte {
	return y[TimeBytes+DiffBytes:]
}

func (y *YAID) SetMeta(meta []byte) error {
	if len(meta) > MetaBytes {
		return fmt.Errorf("meta key must not be longer than %d bytes", MetaBytes)
	}

	for i := 0; i < MetaBytes; i++ {
		(*y)[i+TimeBytes+DiffBytes] = meta[i]
	}

	return nil
}

func (y YAID) Time() time.Time {
	ms := y.Timestamp() * Defider
	return time.UnixMilli(int64(ms))
}

func (y *YAID) SetTime(t time.Time) error {
	ms := t.UnixMilli() / Defider
	return y.SetTimestamp(uint64(ms))
}

func (y YAID) MarshalText() ([]byte, error) {
	return []byte(y.String()), nil
}

func (y *YAID) UnmarshalText(text []byte) (err error) {
	*y, err = Parse(string(text))
	return err
}

// Returns the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
func (y YAID) Timestamp() uint64 {
	return uint64(y[4]) |
		uint64(y[3])<<8 |
		uint64(y[2])<<16 |
		uint64(y[1])<<24 |
		uint64(y[0])<<32
}

// Set the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
func (y *YAID) SetTimestamp(t uint64) error {
	if t > maxTimestamp {
		return fmt.Errorf("epoch must not be greater than %d", maxTimestamp)
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

	b := make([]byte, DiffBytes)
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
	if len(b) != TimeBytes+DiffBytes+MetaBytes {
		return y, fmt.Errorf("yaid must be exactly %d bytes", TimeBytes+DiffBytes+MetaBytes)
	}

	copy(y[:], b)

	return y, nil
}
