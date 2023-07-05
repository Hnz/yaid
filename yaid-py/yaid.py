"""
YAID package

bla die bla.
"""

import argparse
import krock32
import os
from datetime import datetime
from typing import Optional

TIME_BYTES: int = 5
DIFF_BYTES: int = 2
META_BYTES: int = 1

SIZE: int = TIME_BYTES + DIFF_BYTES + META_BYTES

DEFIDER: int = 10

"""Maximum value of the timestamp"""
MAX_TIMESTAMP: int = 1099511627775


class YAID:
    """
    Yet Another ID

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
    >>> y.set_differentiator(bytearray([1,255]))
    >>> print(y)
    0000000007ZQP
    >>> d = datetime(2222, 1, 2, 3, 4, 5, 54321)
    >>> y.set_time(d)
    >>> y.time()
    datetime.datetime(2222, 1, 2, 3, 4, 5, 50000)
    """

    bytes: bytearray

    def __init__(self, bytes=bytearray(b"\x00\x00\x00\x00\x00\x00\x00\x00")) -> None:
        if len(bytes) != SIZE:
            raise ValueError(f"bytes length must be {SIZE} not {len(bytes)}")
        self.bytes = bytearray(bytes)

    def differentiator(self) -> bytearray:
        return self.bytes[TIME_BYTES : TIME_BYTES + DIFF_BYTES]

    def set_differentiator(self, d: bytearray) -> None:
        self.bytes[TIME_BYTES : TIME_BYTES + DIFF_BYTES] = d

    def meta(self) -> int:
        """
        Return the meta byte
        """
        return self.bytes[TIME_BYTES + DIFF_BYTES]

    def set_meta(self, i: int) -> None:
        """
        Set the meta byte. Value must be between 0-255.
        """
        if i < 0 or i > 255:
            raise ValueError("meta must be within 0-255")
        self.bytes[TIME_BYTES + DIFF_BYTES] = i

    def time(self) -> datetime:
        """
        Return the date and time with a percision of a hundredth of a second
        """
        ms = self.timestamp() * DEFIDER
        return datetime.utcfromtimestamp(ms / 1000.0)

    def set_time(self, t: datetime) -> None:
        ts = int(t.timestamp() * 1000.0 / DEFIDER)
        self.set_timestamp(ts)

    def timestamp(self) -> int:
        """
        Time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
        """
        t: int = 0
        for i in range(TIME_BYTES):
            t += self.bytes[TIME_BYTES - 1 - i] << (i * 8)
        return t

    def set_timestamp(self, t: int) -> None:
        """
        Set the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
        """
        t = int(t)
        if t > MAX_TIMESTAMP:
            raise ValueError(f"timestamp must not be greater than {MAX_TIMESTAMP}")
        for i in range(TIME_BYTES):
            self.bytes[TIME_BYTES - 1 - i] = (t >> (i * 8)) & 0xFF

    def __str__(self) -> str:
        """
        Return id as a crockford base32-encoded string
        """
        encoder = krock32.Encoder(checksum=False)
        encoder.update(self.bytes)
        return encoder.finalize()


def new(meta: Optional[int] = None, time: Optional[datetime] = None) -> YAID:
    """
    Return a new random id
    """
    if meta is None:
        meta = _random_bytes(META_BYTES)[0]
    if time is None:
        time = datetime.utcnow()

    y = YAID(bytearray(SIZE))
    y.set_time(time)
    y.set_differentiator(_random_bytes(DIFF_BYTES))
    y.set_meta(meta)

    return y


def parse(yaid: str) -> YAID:
    """
    Create a YAID object from an encoded string
    """
    decoder = krock32.Decoder(strict=True, checksum=False)
    decoder.update(yaid)
    b = decoder.finalize()
    return YAID(bytearray(b))


def _random_bytes(n: int) -> bytearray:
    return bytearray(os.urandom(n))


def main():
    """Run the commandline application"""
    parser = argparse.ArgumentParser(description="Yet Another ID")
    parser.add_argument(
        "-i",
        "--info",
        type=str,
        help="print info on the given id",
    )
    parser.add_argument(
        "-m",
        "--meta",
        type=int,
        help="number beteen 0-255. Defaults to a random value.",
    )
    arguments = parser.parse_args()

    if arguments.info:
        y = parse(arguments.info)
        print("Time:", y.time())
        print("Meta:", y.meta())
    else:
        y = new(arguments.meta)
        print(y)


if __name__ == "__main__":
    main()
