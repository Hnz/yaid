import { base32Encode, base32Decode } from "./crockford.js";

const TIME_BYTES = 5;
const DIFF_BYTES = 2;
const META_BYTES = 1;

const SIZE = TIME_BYTES + DIFF_BYTES + META_BYTES;

// 1 for miliseconds, 10 for centiseconds, 1000 for seconds, etc.
const DEFIDER = 10;

export const MAX_TIMESTAMP = 1099511627775;

const c: Crypto = globalThis.crypto || crypto;

export class YAID {
	constructor(private bytes = new Uint8Array(SIZE)) {
		if (bytes.byteLength != SIZE) {
			throw new RangeError("bytes length must be " + SIZE + " not " + bytes.byteLength);
		}
	}

	differentiator(): Uint8Array {
		return this.bytes.slice(TIME_BYTES, TIME_BYTES + DIFF_BYTES);
	}

	setDifferentiator(d: Uint8Array) {
		this.bytes.set(d, TIME_BYTES);
	}

	meta(): number {
		return this.bytes[TIME_BYTES + DIFF_BYTES];
	}

	/**
	 * Set meta data
	 * @param number between 0 and 255
	 */
	setMeta(i: number) {
		if (i < 0 || i > 255) {
			throw new RangeError("meta must be within 0-255");
		}
		this.bytes[TIME_BYTES + DIFF_BYTES] = i;
	}

	time(): Date {
		const ms = this.timestamp() * DEFIDER;
		return new Date(ms);
	}

	setTime(t: Date) {
		const cs = t.getTime() / DEFIDER;
		this.setTimestamp(cs);
	}

	/** Time as hundredth of a second since January 1, 1970 12:00:00 AM UTC */
	timestamp(): number {
		let number = 0;
		for (let i = 0; i < 5; i++) {
			number += this.bytes[i] * Math.pow(2, 8 * (4 - i));
		}

		return number;
	}

	/** Set the time as hundredth of a second since January 1, 1970 12:00:00 AM UTC */
	setTimestamp(t: number) {
		if (t > MAX_TIMESTAMP) {
			throw new Error("timestamp must not be greater than " + MAX_TIMESTAMP);
		}
		for (let i = 0, j = 1; i < TIME_BYTES; i++, j *= 0x100) {
			this.bytes[TIME_BYTES - 1 - i] = (t / j) & 0xff;
		}
		/*
		this.bytes[0] = t >> 32;
		this.bytes[1] = (t >> 24) & 255;
		this.bytes[2] = (t >> 16) & 255;
		this.bytes[3] = (t >> 8) & 255;
		this.bytes[4] = t & 255;
		*/
	}

	toBytes(): Uint8Array {
		return this.bytes;
	}

	toString(): string {
		return base32Encode(this.bytes);
	}
}

/**
 * New YAID
 * @param meta
 * @param time
 * @returns YAID
 */
export function New(meta?: number, time = new Date()): YAID {
	if (typeof meta === "undefined") {
		meta = random(META_BYTES)[0];
	}

	const y = new YAID();
	y.setTime(time);
	y.setDifferentiator(random(DIFF_BYTES));
	y.setMeta(meta);

	return y;
}

export function Parse(yaid: string): YAID {
	const b = base32Decode(yaid);
	return new YAID(b);
}

// Return n bytes of random data
function random(n: number): Uint8Array {
	const m = new Uint8Array(n);
	return c.getRandomValues(m);
}
