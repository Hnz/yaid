import { CrockfordBase32 } from "crockford-base32";
//import { randomBytes } from "crypto";

const crypto = new Crypto();

const TIME_BYTES = 5;
const DIFF_BYTES = 2;
const META_BYTES = 1;

const SIZE = TIME_BYTES + DIFF_BYTES + META_BYTES;

// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
const DEFIDER = 10;

export class YAID {
	bytes: Uint8Array;

	constructor(b: Uint8Array) {
		if (b.length != SIZE) {
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
	b.set(crypto.getRandomValues(r), TIME_BYTES);
	const y = new YAID(b);
	return y.String();
}

export function Parse(yaid: string): YAID {
	return new YAID(CrockfordBase32.decode(yaid));
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
