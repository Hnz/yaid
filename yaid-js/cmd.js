/* eslint-env node */

import { New, Parse } from "./dist/yaid.js";

const help = `usage: yaid [-h] | [-i INFO] | [-m META]

Yet Another ID

options:
  -h, --help            show this help message and exit
  -i INFO, --info INFO  print info on the given id
  -m META, --meta META  number between 0-255. Defaults to a random value.`;

if (process.argv.includes("-h") || process.argv.includes("--help")) {
	console.log(help);
} else if (process.argv.includes("-i") || process.argv.includes("--info")) {
	const id = process.argv[3];
	const y = Parse(id);
	console.log("Time:", y.time());
	console.log("Meta:", y.meta());
} else if (process.argv.includes("-m") || process.argv.includes("--meta")) {
	const meta = process.argv[3];
	const s = New(meta).toString();
	console.log(s);
} else {
	const s = New().toString();
	console.log(s);
}
