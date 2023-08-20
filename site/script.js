import { New, Parse } from "../yaid-js/yaid.ts";

const template = document.createElement("template");
template.innerHTML = `
<div class="grid">
	<article>
		<header>YAID</header>
		<div class="grid">
			<div>
				<label>
					ID
					<input id="yaid" type="text" minlength="8" autofocus />
				</label>
				<button id="buttonGenerate">Generate</button>
				<mark id="errorBox"></mark>
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

class YaidComponent extends HTMLElement {
	constructor() {
		super();

		const templateContent = template.content;

		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(templateContent.cloneNode(true));

		this.y = New();
		this.yaidInput = this.shadowRoot.getElementById("yaid");
		this.dateInput = this.shadowRoot.getElementById("date");
		this.metaInput = this.shadowRoot.getElementById("meta");
		this.bytesInput = this.shadowRoot.getElementById("bytes");
		this.errorBox = this.shadowRoot.getElementById("errorBox");

		this.updateInfo();

		this.yaidInput.addEventListener("input", this.update.bind(this));
		this.dateInput.addEventListener("change", this.updateId.bind(this));
		this.metaInput.addEventListener("change", this.updateId.bind(this));
		this.shadowRoot
			.getElementById("buttonGenerate")
			.addEventListener("click", this.generate.bind(this));
	}

	showError(err) {
		if (err) {
			this.yaidInput.setAttribute("aria-invalid", "true");
			this.errorBox.style.display = "block";
			this.errorBox.innerText = err;
		} else {
			this.yaidInput.setAttribute("aria-invalid", "false");
			this.errorBox.style.display = "none";
		}
	}

	updateInfo() {
		this.dateInput.value = this.y.time().toISOString().slice(0, -1);
		this.metaInput.value = this.y.meta();
		this.bytesInput.value = `[${this.y.bytes}]`;
		this.showError();
	}

	update() {
		try {
			this.y = Parse(this.yaidInput.value);
			this.updateInfo();
		} catch (err) {
			this.showError(err);
		}
	}

	updateId() {
		this.y.setMeta(this.metaInput.value);
		this.y.setTime(new Date(this.dateInput.value));
		this.yaidInput.value = this.y;
		this.bytesInput.value = `[${this.y.bytes}]`;
	}

	generate() {
		this.y = New();
		this.yaidInput.value = this.y;
		this.updateInfo();
	}
}

customElements.define("yaid-component", YaidComponent);
