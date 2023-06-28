import { expect, test } from "@jest/globals";
import { New, Parse, YAID } from "./yaid";

test("parse", async () => {
    const y = Parse("BJA1W6ST0003V");
    expect(y.toString()).toEqual("BJA1W6ST0003V");
    expect(y.toBytes()).toEqual(new Uint8Array([92, 148, 30, 27, 58, 0, 0, 61]));
});

test("parse with incorrect length", async () => {
    const buf = Buffer.from([1, 2, 3]);
    expect(() => new YAID(buf)).toThrow("bytes length must be 8");
});
