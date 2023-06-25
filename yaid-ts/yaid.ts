import { CrockfordBase32 } from "crockford-base32";

const TIME_BYTES = 5;
const DIFF_BYTES = 2;
const META_BYTES = 1;

// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
const DEFIDER = 10;

export class YAID {
	bytes: Uint8Array;

	constructor(private b: Uint8Array) {
		this.bytes = b;
	}

	String(): string {
		return CrockfordBase32.encode(Buffer.from(this.bytes));
	}
}

export function New() {
	return CrockfordBase32.encode(Buffer.from(this.bytes));
}

export function Parse(yaid: string): YAID {
	return new YAID(CrockfordBase32.decode(yaid));
}
