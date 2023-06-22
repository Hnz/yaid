// Copyright (c) 2023 Hans van Leeuwen. MIT Licensed. See LICENSE.md for full license.

/*
[yaid] is a go package that implements Yet Another ID

# Yet Another ID

A mix of [ULID] and [UUIDv7].

A ULID is a 16 byte Universally Unique Lexicographically Sortable Identifier

	The components are encoded as 16 octets.
	Each component is encoded with the MSB first (network byte order).

	0                   1                   2                   3
	0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
	+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	|                      32_bit_uint_time_high                    |
	+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	|     16_bit_uint_time_low      |       16_bit_uint_random      |
	+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	|                       32_bit_uint_random                      |
	+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	|     16_bit_uint_random        |     16_bit_uint_descriptor    |
	+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

bla.

5 byte timestamp as hundredths of a second passed since January 1, 1970 12:00:00 AM UTC
2 byte random
1 byte shard key

[yaid]: https://pkg.go.dev/github.com/hnz/yaid#section-readme
[ULID]: https://github.com/ulid/spec
[UUIDv7]: https://www.ietf.org/archive/id/draft-peabody-dispatch-new-uuid-format-01.html#name-uuidv7-layout-and-bit-order
*/
package yaid

import (
	"crypto/rand"
	"fmt"
	"io"
	"time"

	"github.com/btcsuite/btcutil/base58"
	"github.com/ilius/crock32"
)

const (
	TIME_BYTES   = 5
	RANDOM_BYTES = 2
	SHARD_BYTES  = 1

	// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
	DEFIDER = 10
)

var (
	MaxEpoch = YAID{0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}.Epoch()

	ErrorEpochSize  = fmt.Errorf("epoch must not be greater than %d", MaxEpoch)
	ErrorRandomSize = fmt.Errorf("random part must be exactly %d bytes", RANDOM_BYTES)
	ErrorShardSize  = fmt.Errorf("shard key must not be longer than %d bytes", SHARD_BYTES)
	ErrorYaidSize   = fmt.Errorf("yaid must be exactly %d bytes", TIME_BYTES+RANDOM_BYTES+SHARD_BYTES)
)

type YAID [TIME_BYTES + RANDOM_BYTES + SHARD_BYTES]byte

func (y *YAID) Base58() string {
	return base58.Encode(y[:])
}

// Returns the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
func (y YAID) Epoch() uint64 {
	return uint64(y[4]) | uint64(y[3])<<8 |
		uint64(y[2])<<16 | uint64(y[1])<<24 |
		uint64(y[0])<<32
}

// Set the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
func (y *YAID) SetEpoch(epoch uint64) error {
	if epoch > MaxEpoch {
		return ErrorEpochSize
	}

	(*y)[0] = byte(epoch >> 32)
	(*y)[1] = byte(epoch >> 24)
	(*y)[2] = byte(epoch >> 16)
	(*y)[3] = byte(epoch >> 8)
	(*y)[4] = byte(epoch)

	return nil
}

// Override the random section
func (y *YAID) SetRandom(b []byte) error {
	for i := 0; i < RANDOM_BYTES; i++ {
		(*y)[i+TIME_BYTES] = b[i]
	}

	return nil
}

func (y *YAID) SetShard(shard []byte) error {
	if len(shard) > SHARD_BYTES {
		return ErrorShardSize
	}

	for i := 0; i < SHARD_BYTES; i++ {
		(*y)[i+TIME_BYTES+RANDOM_BYTES] = shard[i]
	}

	return nil
}

func (y *YAID) SetTime(t time.Time) error {
	ms := t.UnixMilli() / DEFIDER
	return y.SetEpoch(uint64(ms))
}

func (y YAID) String() string {
	return crock32.Encode(y[:])
}

func (y YAID) Time() time.Time {
	ms := y.Epoch() * DEFIDER
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

func New(shard []byte) (y YAID, err error) {
	return Generator{shard, rand.Reader}.New()
}

func Parse(yaid string) (y YAID, err error) {
	b, err := crock32.Decode(yaid)
	if err != nil {
		return y, err
	}
	if len(b) != TIME_BYTES+RANDOM_BYTES+SHARD_BYTES {
		return y, ErrorYaidSize
	}
	copy(y[:], b)
	return y, nil
}
