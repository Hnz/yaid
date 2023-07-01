import { MAX_TIMESTAMP, Parse, YAID } from "./yaid";

test("parse", async () => {
	const y = Parse("0000000000000");
	expect(y.toBytes()).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]));
	expect(y.toString()).toEqual("0000000000000");
});

test("set and get meta", async () => {
	const y = new YAID(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 123]));
	expect(y.meta()).toEqual(123);
});

test("set and get timestamp", async () => {
	const y = new YAID(new Uint8Array([185, 40, 60, 54, 116, 0, 0, 0]));
	expect(y.timestamp()).toEqual(675034877);

	y.setTimestamp(0);
	expect(y.toBytes()).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]));

	y.setTimestamp(MAX_TIMESTAMP);
	expect(y.toBytes()).toEqual(new Uint8Array([255, 255, 255, 255, 255, 0, 0, 0]));

	y.setTimestamp(1);
	expect(y.toBytes()).toEqual(new Uint8Array([0, 0, 0, 0, 1, 0, 0, 0]));

	y.setTimestamp(32769);
	expect(y.toBytes()).toEqual(new Uint8Array([0, 0, 0, 128, 1, 0, 0, 0]));
	expect(y.timestamp()).toEqual(32769);
});

test("parse with incorrect length", async () => {
	const buf = Buffer.from([1, 2, 3]);
	expect(() => new YAID(buf)).toThrow("bytes length must be 8");
});
