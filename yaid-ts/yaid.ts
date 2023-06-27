import { base32Decode, base32Encode } from "./crockford";

const TIME_BYTES = 5;
const DIFF_BYTES = 2;
const META_BYTES = 1;

const SIZE = TIME_BYTES + DIFF_BYTES + META_BYTES;

// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
const DEFIDER = 10;

let c: Crypto;

if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    // Use built-in webcrypto
    c = crypto;
} else {
    // import node.js webcrypto
    c = require("crypto").webcrypto;
}

export class YAID {
    constructor(private bytes: Uint8Array) {
        if (bytes.byteLength != SIZE) {
            throw new Error("bytes length must be " + SIZE);
        }
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

    return new YAID(b);
}

export function Parse(yaid: string): YAID {
    return new YAID(base32Decode(yaid));
}
