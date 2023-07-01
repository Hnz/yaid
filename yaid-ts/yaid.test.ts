import { expect, test } from "@jest/globals";
import { MAX_TIMESTAMP, Parse, YAID } from "./yaid";

test("set and get timestamp", async () => {
    const y = new YAID();

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

test("parse", async () => {
    const y = Parse("BJA1W6ST0003V");
    //expect(y.toBytes()).toEqual(new Uint8Array([185, 40, 60, 54, 116, 0, 0, 123]));
    expect(y.toString()).toEqual("BJA1W6ST0003V");
});

test("parse with incorrect length", async () => {
    const buf = Buffer.from([1, 2, 3]);
    expect(() => new YAID(buf)).toThrow("bytes length must be 8");
});
