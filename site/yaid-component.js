/**
 * Yaid generator
 *
 * @copyright 2023 Hans van Leeuwen
 * @license MIT
 * @see https://github.com/Hnz/yaid/tree/main/site/yaid-component.js
 * @example
 * <script type="module" src="yaid-component.js"></script>
 * <yaid-component></yaid-component>
 */

import { New, Parse } from "../yaid-js/yaid.js";

const html = /*html*/ `
	<div class="grid">
		<article>
			<header>YAID</header>
			<div class="grid">
				<div>
					<label>
						ID
						<input id="yaid" type="text" minlength="8" autofocus />
					</label>
					<div class="grid">
						<button id="generateButton">Generate</button>
						<button id="copyButton">Copy</button>
					</div>
					<mark id="errorBox" style="display:none"></mark>
					<div id="infoBox" class="secondary" style="display:none"></div>
				</div>
				<div>
					<label>
						UTC Date
						<input
							id="date"
							type="datetime-local"
							min="1970-01-01T00:00:00.000"
							max="2318-06-04T06:57:57.750"
						/>
					</label>
					<label>
						Meta
						<input type="number" id="meta" min="0" max="255" />
					</label>
					<label>
						Bytes
						<input type="text" id="bytes" readonly />
					</label>
				</div>
			</div>
		</article>
	</div>
`;

/**
 * Yaid generator as webcomponents.
 *
 * Note that this webcomponent does not use a shadowdom
 * and is styled using global css.
 *
 * @export
 * @class YaidComponent
 * @extends {HTMLElement}
 */
export class YaidComponent extends HTMLElement {
	connectedCallback() {
		this.innerHTML = html;

		this.bytesInput = document.getElementById("bytes");
		this.copyButton = document.getElementById("copyButton");
		this.dateInput = document.getElementById("date");
		this.errorBox = document.getElementById("errorBox");
		this.generateButton = document.getElementById("generateButton");
		this.infoBox = document.getElementById("infoBox");
		this.metaInput = document.getElementById("meta");
		this.yaidInput = document.getElementById("yaid");

		this.generate();

		this.dateInput.addEventListener("change", this.updateId.bind(this));
		this.generateButton.addEventListener("click", this.generate.bind(this));
		this.metaInput.addEventListener("change", this.updateId.bind(this));
		this.yaidInput.addEventListener("input", () => {
			this.yaidInput.value = this.yaidInput.value.toUpperCase();
			this.parse();
		});
		this.copyButton.addEventListener("click", () => {
			navigator.clipboard.writeText(this.yaidInput.value);
			this.showInfo("ID copied to clipboard");
		});
	}

	/** Generate a new id */
	generate() {
		this.y = New();
		this.yaidInput.value = this.y;
		this.updateInfo();
	}

	/** Update the info from the id */
	parse() {
		try {
			this.y = Parse(this.yaidInput.value);
			this.updateInfo();
		} catch (err) {
			this.showError(err);
		}
	}

	/**
	 * Display error message.
	 * Pass nill to remove error.
	 * @param {string} msg
	 */
	showError(msg) {
		if (msg) {
			this.errorBox.style.display = "block";
			this.errorBox.innerText = msg;
		} else {
			this.errorBox.style.display = "none";
		}
	}

	/**
	 * Display error message.
	 * Pass nill to remove error.
	 * @param {string} msg
	 */
	showInfo(msg) {
		if (msg) {
			this.infoBox.style.display = "block";
			this.infoBox.innerText = msg;
		} else {
			this.infoBox.style.display = "none";
		}
	}

	/** Update the info from the id */
	updateInfo() {
		this.dateInput.value = this.y.time().toISOString().slice(0, -1);
		this.metaInput.value = this.y.meta();
		this.bytesInput.value = `[${this.y.bytes}]`;
		this.showError();
	}

	/** Update the id from the info */
	updateId() {
		this.y.setMeta(this.metaInput.value);
		this.y.setTime(new Date(this.dateInput.value));
		this.yaidInput.value = this.y;
		this.bytesInput.value = `[${this.y.bytes}]`;
	}
}

customElements.define("yaid-component", YaidComponent);
