import { CrockfordBase32 } from "crockford-base32";
//import { randomBytes } from "crypto";
const { getRandomValues } = require("node:crypto").webcrypto;

//const { getRandomValues } = globalThis.crypto;

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

	String(): string {
		const b = Buffer.from(this.bytes);
		const x = CrockfordBase32.encode(b);
		console.log(x, b);
		return x;
	}
}

export function New() {
	const b = new Uint8Array(SIZE);
	const r = new Uint8Array(DIFF_BYTES);
	b.set(getRandomValues(r), TIME_BYTES);
	const y = new YAID(b);
	return y.String();
}

export function Parse(yaid: string): YAID {
	return new YAID(CrockfordBase32.decode(yaid));
}

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}
