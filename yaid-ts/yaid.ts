import { CrockfordBase32 } from "crockford-base32";

const TIME_BYTES = 5;
const DIFF_BYTES = 2;
const META_BYTES = 1;

const SIZE = TIME_BYTES + DIFF_BYTES + META_BYTES;

// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
const DEFIDER = 10;

var c: Crypto;

if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    // Use built-in webcrypto
    c = crypto;
} else {
    // import node.js webcrypto
    c = require("crypto").webcrypto;
}

export class YAID {
    constructor(private bytes: Uint8Array) {
        if (bytes.length != SIZE) {
            throw "bytes length must be " + SIZE;
        }
    }

    toBytes(): Uint8Array {
        return this.bytes;
    }

    toString(): string {
        const b = Buffer.from(this.bytes);
        return CrockfordBase32.encode(b);
    }
}

export function New(): string {
    const b = new Uint8Array(SIZE);

    // Fill random buffer and copy it into place
    const r = new Uint8Array(DIFF_BYTES);
    b.set(c.getRandomValues(r), TIME_BYTES);

    const y = new YAID(b);
    return y.toString();
}

export function Parse(yaid: string): YAID {
    return new YAID(CrockfordBase32.decode(yaid));
}
/*
async function randomFactory(): Promise<(size: number) => Buffer> {
	if (randomBytes) {
		return randomBytes;
	} else if (crypto && crypto.getRandomValues) {
		return function (size: number): Buffer {
			return crypto.getRandomValues(Buffer.alloc(size));
		};
	} else {
		throw "Could not find a secure random source";
	}
}
*/
