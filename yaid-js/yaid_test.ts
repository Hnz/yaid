import { expect, test } from "bun:test";
import { MAX_TIMESTAMP, Parse, YAID } from "./yaid";

test("parse min", async () => {
	const y = Parse("0000000000000");
	expect(y.toBytes()).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]));
	expect(y.toString()).toEqual("0000000000000");
	expect(y.time()).toEqual(new Date(0));
});

test("parse max", async () => {
	const y = Parse("ZZZZZZZZZZZZZ");
	expect(y.toBytes()).toEqual(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]));
	//expect(y.toString()).toEqual("ZZZZZZZZZZZZZ");
	expect(y.time()).toEqual(new Date("2318-06-04T06:57:57.750Z"));
});

test("parse", async () => {
	const y = Parse("4X7BMTC6T6XEW");
	expect(y.toBytes()).toEqual(new Uint8Array([39, 78, 186, 105, 134, 209, 186, 238]));
	expect(y.toString()).toEqual("4X7BMTC6T6XEW");
});

test("toString", async () => {
	const b = new Uint8Array([39, 78, 186, 105, 134, 209, 186, 238]);
	const y = new YAID(b);

	expect(y.toString()).toEqual("4X7BMTC6T6XEW");
});

test("toNumber", async () => {
	const min = Parse("0000000000000");
	const max = Parse("ZZZZZZZZZZZZZ");

	expect(min.toNumber()).toEqual(0);
	//expect(max.toNumber()).toEqual(18446744073709551616n);
});

test("set and get meta", async () => {
	const y = new YAID();

	y.setMeta(0);
	expect(y.meta()).toEqual(0);
	y.setMeta(255);
	expect(y.meta()).toEqual(255);
	y.setMeta(123);
	expect(y.meta()).toEqual(123);
});

test("set and get timestamp", async () => {
	const y = new YAID();

	y.setTimestamp(0);
	expect(y.toBytes()).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]));

	y.setTimestamp(1);
	expect(y.toBytes()).toEqual(new Uint8Array([0, 0, 0, 0, 1, 0, 0, 0]));

	y.setTimestamp(32769);
	expect(y.toBytes()).toEqual(new Uint8Array([0, 0, 0, 128, 1, 0, 0, 0]));
	expect(y.timestamp()).toEqual(32769);

	y.setTimestamp(795243984505);
	expect(y.toBytes()).toEqual(new Uint8Array([185, 40, 60, 54, 121, 0, 0, 0]));
	expect(y.timestamp()).toEqual(795243984505);

	y.setTimestamp(MAX_TIMESTAMP);
	expect(y.toBytes()).toEqual(new Uint8Array([255, 255, 255, 255, 255, 0, 0, 0]));
	expect(y.timestamp()).toEqual(MAX_TIMESTAMP);
});

test("set and get time", async () => {
	const y = new YAID();
	const d = new Date(2222, 1, 2, 3, 4, 5, 678);
	y.setTime(d);
	expect(y.time()).toEqual(new Date(2222, 1, 2, 3, 4, 5, 670));
	//expect(y.timestamp()).toEqual(795243984505);
	//expect(y.toBytes()).toEqual(new Uint8Array([185, 40, 60, 54, 121, 0, 0, 0]));
});

test("parse with incorrect length", async () => {
	const buf1 = Uint8Array.from([1, 2, 3, 4, 5, 6, 7]);
	expect(() => new YAID(buf1)).toThrow("bytes length must be 8");
	const buf2 = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	expect(() => new YAID(buf2)).toThrow("bytes length must be 8");
});
