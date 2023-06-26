import { CrockfordBase32 } from "crockford-base32";
//import { randomBytes } from "crypto";
//const { getRandomValues } = require("node:crypto").webcrypto;

//const { getRandomValues } = globalThis.crypto;
//import {randomBytes} from "node:crypto";
//window.crypto.getRandomValues

const TIME_BYTES = 5;
const DIFF_BYTES = 2;
const META_BYTES = 1;

const SIZE = TIME_BYTES + DIFF_BYTES + META_BYTES;

// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
const DEFIDER = 10;

export class YAID {
    constructor(private bytes: Uint8Array) {
        if (bytes.length != SIZE) {
            throw "bytes length must be " + SIZE;
        }
    }

    toString(): string {
        const b = Buffer.from(this.bytes);
        return CrockfordBase32.encode(b);
    }
}

export function New(): string {
    const b = new Uint8Array(SIZE);
    b.set(globalThis.crypto.getRandomValues(new Uint8Array(DIFF_BYTES)));

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
