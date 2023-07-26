import { Application, TSConfigReader } from "typedoc";
import { Remarkable } from "remarkable";
import { copyFile, readFile, writeFile, mkdir } from "node:fs/promises";
import { chdir } from "node:process";
import { exec } from "node:child_process";

const md = new Remarkable({ html: true });

async function main() {
	try {
		await mkdir("dist");
	} catch {}

	await copyFile("darkmode.js", "dist/darkmode.js");
	await copyFile("assets/logo-js.svg", "dist/logo-js.svg");
	await copyFile("assets/logo-py.svg", "dist/logo-py.svg");
	await copyFile("assets/logo-go.svg", "dist/logo-go.svg");
	//await copyFile("script.js", "dist/script.js");
	await copyFile("node_modules/@picocss/pico/css/pico.min.css", "dist/pico.min.css");
	await copyFile("node_modules/@picocss/pico/css/pico.min.css.map", "dist/pico.min.css.map");

	await buildIndex();
	//await buildJs();

	return;
}

async function buildIndex() {
	// Load template
	const template = await readFile("template.html");
	const app = await readFile("app.html");

	// Insert markdown
	const buf = await readFile("../README.md");
	const html = app.toString() + md.render(buf.toString());

	// Write html
	const data = template.toString().replace("{{main}}", html);
	return writeFile("dist/index.html", data);
}

async function buildJs() {
	chdir("../yaid-ts/");

	const app = new Application();

	// If you want TypeDoc to load tsconfig.json / typedoc.json files
	app.options.addReader(new TSConfigReader());
	//app.options.addReader(new TypeDoc.TypeDocReader());

	app.bootstrap({
		// typedoc options here
		entryPoints: ["yaid.ts"],
	});

	const project = app.convert();

	if (project) {
		// Project may not have converted correctly
		const outputDir = "../site/docs/yaid-ts";

		// Rendered docs
		await app.generateDocs(project, outputDir);
		// Alternatively generate JSON output
		//await app.generateJson(project, outputDir + "/documentation.json");
	}
}
main().then(() => {
	console.log("done");
});
