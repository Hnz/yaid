import { copyFile, readFile, writeFile, mkdir } from "node:fs/promises";
import { exec } from "node:child_process";
import markdownIt from "markdown-it";
import markdownCopy from "markdown-it-copy";
import highlightjs from "markdown-it-highlightjs";
import { compileAsync } from "sass";

const md = markdownIt({ html: true }).use(highlightjs).use(markdownCopy, { btnText: "📋" });
const gitrev = await run("git rev-parse --short HEAD");

async function main() {
	try {
		await mkdir("dist");
	} catch {}

	const template = await readFile("template.html");
	const app = await readFile("app.html");

	return Promise.all([
		// Create skeleton in ./dist
		copyFile("darkmode.js", "dist/darkmode.js"),
		copyFile("assets/logo-js.svg", "dist/logo-js.svg"),
		copyFile("assets/logo-py.svg", "dist/logo-py.svg"),
		copyFile("assets/logo-go.svg", "dist/logo-go.svg"),

		// Compile CSS
		compileCSS(),

		// Create index.html
		handleMarkdown(
			template,
			"../README.md",
			"dist/index.html",
			"YAID",
			"Yet Another ID",
			app.toString(),
		),

		// Create yaid-go
		handleMarkdown(
			template,
			"../yaid-go/README.md",
			"dist/yaid-go.html",
			"yaid-go",
			"Go SDK for YAID",
		),

		// Create yaid-js
		handleMarkdown(
			template,
			"../yaid-js/README.md",
			"dist/yaid-js.html",
			"yaid-js",
			"Javascript SDK for YAID",
		),

		// Create yaid-py
		handleMarkdown(
			template,
			"../yaid-py/README.md",
			"dist/yaid-py.html",
			"yaid-py",
			"Python SDK for YAID",
		),
	]);
}

async function compileCSS() {
	const res = await compileAsync("style.scss", { style: "compressed" });
	return writeFile("dist/style.css", res.css);
}

async function handleMarkdown(
	template,
	mdfile,
	outfile,
	title = "",
	description = "",
	prefix = "",
) {
	const markdown = await readFile(mdfile);
	const main = "\n" + prefix + md.render(markdown.toString());
	const html = template
		.toString()
		.replace("{{title}}", title)
		.replace("{{description}}", description)
		.replace("{{gitrev}}", gitrev)
		.replace("{{main}}", main);

	return writeFile(outfile, html);
}

async function run(cmd): Promise<String> {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				return reject(error);
			}
			if (stderr) {
				return reject(stderr);
			}
			resolve(stdout);
		});
	});
}

main().catch(console.error);
