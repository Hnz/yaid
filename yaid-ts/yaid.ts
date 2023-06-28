import { base32Decode, base32Encode } from "./crockford";

const TIME_BYTES = 5;
const DIFF_BYTES = 2;
const META_BYTES = 1;

const SIZE = TIME_BYTES + DIFF_BYTES + META_BYTES;

// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
const DEFIDER = 10;

const max_timestamp = 1099511627775;

let c: Crypto = globalThis.crypto || crypto;

// NodeJS < 20 does not support globalThis.
// Import node.js webcrypto
if (!c) {
    c = require("crypto").webcrypto;
}

export class YAID {
    constructor(private bytes: Uint8Array) {
        if (bytes.byteLength != SIZE) {
            throw new RangeError("bytes length must be " + SIZE);
        }
    }

    meta(): number {
        return this.bytes[SIZE];
    }

    setMeta(i: number) {
        if (i < 0 || i > 255) {
            throw new RangeError("meta must be within 0-255");
        }
        this.bytes[SIZE] = i;
    }

    time(): Date {
        const ms = this.timestamp() * DEFIDER;
        return new Date(ms);
    }

    setTime(t: Date) {
        const cs = t.getTime() / DEFIDER;
        this.setTimestamp(cs);
    }

    // Time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
    timestamp(): number {
        return (
            this.bytes[4] |
            (this.bytes[3] << 8) |
            (this.bytes[2] << 16) |
            (this.bytes[1] << 24) |
            (this.bytes[0] << 32)
        );
    }

    // Set the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC
    setTimestamp(t: number) {
        if (t > max_timestamp) {
            throw new Error("timestamp must not be greater than " + max_timestamp);
        }

        this.bytes[0] = t >> 32;
        this.bytes[1] = t >> 24;
        this.bytes[2] = t >> 16;
        this.bytes[3] = t >> 8;
        this.bytes[4] = t;
    }

    toBytes(): Uint8Array {
        return this.bytes;
    }

    toString(): string {
        const b = Buffer.from(this.bytes);
        return base32Encode(b);
    }
}

export function New(): YAID {
    const b = new Uint8Array(SIZE);

    // Fill random buffer and copy it into place
    const r = new Uint8Array(DIFF_BYTES);
    b.set(c.getRandomValues(r), TIME_BYTES);

    const y = new YAID(b);
    y.setTime(new Date());
    return y;
}

export function Parse(yaid: string): YAID {
    return new YAID(base32Decode(yaid));
}
