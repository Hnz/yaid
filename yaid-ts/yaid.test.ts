import { expect, test } from "bun:test";
import { New, Parse } from "./yaid";

test("parse", async () => {
	const y = Parse("BJA1W6ST0003V");
	expect(y.bytes).toEqual(new Uint8Array([185, 40, 60, 54, 116, 0, 0, 123]));
	expect(y.String()).toEqual("BJA1W6ST0003V");
});
