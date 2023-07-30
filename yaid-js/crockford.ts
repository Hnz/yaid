/*
Copyright (c) 2023 Hans van Leeuwen
Copyright (c) Scott Cooper <scttcper@gmail.com>
Copyright (c) 2016-2017 Linus Unnebäck
MIT Licensed
Based on www.npmjs.com/package/@ctrl/ts-base32
*/
const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function base32Encode(
	buffer: Uint8Array,
	options: Partial<{ padding: boolean }> = {},
): string {
	const padding = options.padding;
	const length = buffer.byteLength;
	const view = new Uint8Array(buffer);

	let bits = 0;
	let value = 0;
	let output = "";

	for (let i = 0; i < length; i++) {
		value = (value << 8) | view[i];
		bits += 8;

		while (bits >= 5) {
			output += alphabet[(value >>> (bits - 5)) & 31];
			bits -= 5;
		}
	}

	if (bits > 0) {
		output += alphabet[(value << (5 - bits)) & 31];
	}

	if (padding) {
		while (output.length % 8 !== 0) {
			output += "=";
		}
	}

	return output;
}

function readChar(alphabet: string, char: string): number {
	const idx = alphabet.indexOf(char);

	if (idx === -1) {
		throw new Error("Invalid character found: " + char);
	}

	return idx;
}

export function base32Decode(input: string): Uint8Array {
	const { length } = input.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1");

	let bits = 0;
	let value = 0;

	let index = 0;
	const output = new Uint8Array(((length * 5) / 8) | 0);

	for (let i = 0; i < length; i++) {
		value = (value << 5) | readChar(alphabet, input[i]);
		bits += 5;

		if (bits >= 8) {
			output[index++] = (value >>> (bits - 8)) & 255;
			bits -= 8;
		}
	}

	return output;
}

/**
 * Turn a string of hexadecimal characters into an ArrayBuffer
 */
export function hexToArrayBuffer(hex: string): ArrayBufferLike {
	if (hex.length % 2 !== 0) {
		throw new RangeError("Expected string to be an even number of characters");
	}

	const view = new Uint8Array(hex.length / 2);

	for (let i = 0; i < hex.length; i += 2) {
		view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
	}

	return view.buffer;
}
