// Copyright (c) 2023 Hans van Leeuwen. MIT Licensed. See LICENSE.md for full license.

// yaid is a go package that implements YAID
//
// [YAID]: https://github.com/hnz/yaid
package yaid

import (
	"crypto/rand"
	"fmt"
	"io"
	"time"

	"github.com/ilius/crock32"
)

const (
	TIME_BYTES   = 5
	RANDOM_BYTES = 2
	SHARD_BYTES  = 1

	// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
	DEFIDER = 10
)

var MAX_TIMESTAMP = YAID{0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}.timestamp()

type YAID [TIME_BYTES + RANDOM_BYTES + SHARD_BYTES]byte

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
	if t > MAX_TIMESTAMP {
		return fmt.Errorf("epoch must not be greater than %d", MAX_TIMESTAMP)
	}

	(*y)[0] = byte(t >> 32)
	(*y)[1] = byte(t >> 24)
	(*y)[2] = byte(t >> 16)
	(*y)[3] = byte(t >> 8)
	(*y)[4] = byte(t)

	return nil
}

// Set the random section
func (y *YAID) SetRandom(b []byte) error {

	if len(b) != RANDOM_BYTES {
		return fmt.Errorf("random part must be exactly %d bytes", RANDOM_BYTES)
	}

	for i := 0; i < RANDOM_BYTES; i++ {
		(*y)[i+TIME_BYTES] = b[i]
	}

	return nil
}

func (y *YAID) Shard() []byte {
	return y[TIME_BYTES+RANDOM_BYTES:]
}

func (y *YAID) SetShard(shard []byte) error {
	if len(shard) > SHARD_BYTES {
		return fmt.Errorf("shard key must not be longer than %d bytes", SHARD_BYTES)
	}

	for i := 0; i < SHARD_BYTES; i++ {
		(*y)[i+TIME_BYTES+RANDOM_BYTES] = shard[i]
	}

	return nil
}

func (y *YAID) SetTime(t time.Time) error {
	ms := t.UnixMilli() / DEFIDER
	return y.setTimestamp(uint64(ms))
}

func (y YAID) String() string {
	return crock32.Encode(y[:])
}

func (y YAID) Time() time.Time {
	ms := y.timestamp() * DEFIDER
	return time.UnixMilli(int64(ms))
}

type Generator struct {
	Shard  []byte
	Random io.Reader
}

func (g Generator) New() (y YAID, err error) {
	err = y.SetTime(time.Now())
	if err != nil {
		return y, err
	}

	err = y.SetShard(g.Shard)
	if err != nil {
		return y, err
	}

	b := make([]byte, RANDOM_BYTES)
	_, err = g.Random.Read(b)
	if err != nil {
		return y, err
	}
	y.SetRandom(b)

	return y, err
}

func NewGenerator(shard []byte) Generator {
	return Generator{shard, rand.Reader}
}

func New(shard []byte) (y YAID, err error) {
	return NewGenerator(shard).New()
}

func Parse(yaid string) (y YAID, err error) {
	b, err := crock32.Decode(yaid)
	if err != nil {
		return y, err
	}
	if len(b) != TIME_BYTES+RANDOM_BYTES+SHARD_BYTES {
		return y, fmt.Errorf("yaid must be exactly %d bytes", TIME_BYTES+RANDOM_BYTES+SHARD_BYTES)
	}

	copy(y[:], b)

	return y, nil
}
