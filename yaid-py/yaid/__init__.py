"""
YAID package

bla die bla.

>>> from yaid import YAID
>>> from datetime import datetime
>>> y = YAID()
>>> print(y)
0000000000000
>>> y.set_meta(123)
>>> y.meta()
123
>>> print(y)
000000000007P
>>> d = datetime(2222, 1, 2, 3, 4, 5, 6)
>>> y.set_time(d)
>>> y.time()
datetime.datetime(2222, 1, 2, 3, 4, 5, 6)
"""

import krock32
import os
from datetime import datetime
from typing import Optional

TIME_BYTES: int = 5
DIFF_BYTES: int = 2
META_BYTES: int = 1

SIZE: int = TIME_BYTES + DIFF_BYTES + META_BYTES

DEFIDER: int = 10

MAX_TIMESTAMP: int = 1099511627775

class YAID:
    bytes: bytearray

    def __init__(self, bytes_array= bytearray([0,0,0,0,0,0,0,0])) -> None:
        if len(bytes_array) != SIZE:
            raise ValueError(f"bytes length must be {SIZE} not {len(bytes_array)}")
        self.bytes = bytes_array

    def differentiator(self) -> bytearray:
        return self.bytes[TIME_BYTES:TIME_BYTES + DIFF_BYTES]

    def set_differentiator(self, d: bytearray) -> None:
        self.bytes[TIME_BYTES:TIME_BYTES + DIFF_BYTES] = d

    def meta(self) -> int:
        return self.bytes[TIME_BYTES + DIFF_BYTES]

    def set_meta(self, i: int) -> None:
        if i < 0 or i > 255:
            raise ValueError("meta must be within 0-255")
        self.bytes[TIME_BYTES + DIFF_BYTES] = i

    def time(self) -> datetime:
        ms: int = self.timestamp() * DEFIDER
        return datetime.utcfromtimestamp(ms / 1000.0)

    def set_time(self, t: datetime) -> None:
        cs: int = t.timestamp() * DEFIDER
        self.set_timestamp(cs)

    def timestamp(self) -> int:
        t: int = 0
        for i in range(TIME_BYTES):
            t += self.bytes[TIME_BYTES - 1 - i] << (i * 8)
        return t

    def set_timestamp(self, t: int) -> None:
        t = int(t)
        if t > MAX_TIMESTAMP:
            raise ValueError(f"timestamp must not be greater than {MAX_TIMESTAMP}")
        for i in range(TIME_BYTES):
            self.bytes[TIME_BYTES - 1 - i] = (t >> (i * 8)) & 0xFF

    def __str__(self) -> str:
        encoder = krock32.Encoder(checksum=False)
        encoder.update(self.bytes)
        return encoder.finalize()


def new(meta: Optional[int] = None, size: int = 8, time: Optional[datetime] = None) -> YAID:
    if meta is None:
        meta = _random_bytes(META_BYTES)[0]

    y = YAID(bytearray(SIZE))
    y.set_time(time or datetime.utcnow())
    y.set_differentiator(_random_bytes(DIFF_BYTES))
    y.set_meta(meta)

    return y


def parse(yaid: str) -> YAID:
    decoder = krock32.Decoder(strict=True, checksum=False)
    b: bytes = decoder.update(yaid)
    return YAID(bytearray(b))


def _random_bytes(n: int) -> bytearray:
    return bytearray(os.urandom(n))
