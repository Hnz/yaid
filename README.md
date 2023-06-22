# 🆔 YAID

_Yet Another ID_

## Features

🔸 Only 8 bytes long </br>
🔸 Includes a centisecond timestamp </br>
🔸 Integrated `int8` shard id </br>
🔸 Rendered as 13 character [Base32] strings

## Comparison

A mix of [ULID] and [UUIDv7].

# Specifications

Version 0.1

## Layout

| Bits    | Bytes | Content        |
| ------- | :---: | -------------- |
| 0 - 39  |   5   | Timestamp      |
| 40 - 55 |   2   | Differentiator |
| 56 - 63 |   1   | Descriptor     |

## Timestamp

Big-endian 40 bit integer.
Represents the time passed since `January 1, 1970 12:00:00 AM UTC` in
hundredths of a second.

The timestamp will roll over on `June 4, 2318 6:57:57.760 AM UTC`.

## Differentiator

16 bits that are used to make the id unique within a given timestamp.
A random value or a counter could for example be used.

## Descriptor

8 bit value that information about the id. A database shard id for example.

[Base32]: https://www.crockford.com/base32.html
[yaid]: https://pkg.go.dev/github.com/hnz/yaid#section-readme
[ULID]: https://github.com/ulid/spec
[UUIDv7]: https://www.ietf.org/archive/id/draft-peabody-dispatch-new-uuid-format-01.html#name-uuidv7-layout-and-bit-order
