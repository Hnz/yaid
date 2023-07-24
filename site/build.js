import handlebars from "handlebars";
import { Remarkable } from "remarkable";
import { copyFile, readFile, writeFile, mkdir } from "fs/promises";

const md = new Remarkable({ html: true });

async function main() {
	try {
		await mkdir("dist");
	} catch {}

	await copyFile("assets/logo-js.svg", "dist/logo-js.svg");
	await copyFile("assets/logo-py.svg", "dist/logo-py.svg");
	await copyFile("assets/logo-go.svg", "dist/logo-go.svg");
	//await copyFile("script.js", "dist/script.js");
	await copyFile("node_modules/@picocss/pico/css/pico.min.css", "dist/style.css");

	return buildIndex();
}

async function buildIndex() {
	// Load template
	const f = await readFile("template.handlebars");
	const template = handlebars.compile(f.toString());

	// Insert markdown
	const buf = await readFile("../README.md");
	const html = md.render(buf.toString());

	// Write html
	const data = template({ title: "YAID", html });
	return writeFile("dist/index.html", data);
}

main().then(() => {
	console.log("done");
});
