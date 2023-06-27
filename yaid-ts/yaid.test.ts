import { expect, test } from "@jest/globals";
import { New, Parse, YAID } from "./yaid";

test("parse", async () => {
    const y = Parse("BJA1W6ST0003V");
    //expect(y.toBytes()).toEqual(new Uint8Array([185, 40, 60, 54, 116, 0, 0, 123]));
    expect(y.toString()).toEqual("BJA1W6ST0003V");
});

test("parse with incorrect length", async () => {
    const buf = Buffer.from([1, 2, 3]);
    expect(() => new YAID(buf)).toThrow("bytes length must be 8");
});
