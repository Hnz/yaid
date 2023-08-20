import { New, Parse } from "../yaid-js/yaid.ts";

class YaidForm extends HTMLElement {
	constructor() {
		super();
		//this.attachShadow({ mode: "open" });
	}
	/*
	// component attributes
	static get observedAttributes() {
		return ["meta", "timestamp"];
	}

	// attribute change
	attributeChangedCallback(property, oldValue, newValue) {
		if (oldValue === newValue) return;
		this[property] = newValue;
	}
*/
	// connect component
	connectedCallback() {
		this.innerHTML = `
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

		this.yaid = document.getElementById("yaid");
		this.buttonGenerate = document.getElementById("buttonGenerate");
		this.errorBox = document.getElementById("errorBox");
		this.date = document.getElementById("date");
		this.meta = document.getElementById("meta");
		this.bytes = document.getElementById("bytes");

		this.yaid.addEventListener("input", this.update);
		this.buttonGenerate.addEventListener("click", this.generate);
		this.date.addEventListener("click", this.updateId);
		this.meta.addEventListener("click", this.updateId);

		this.generate();
	}

	showError(err) {
		if (err) {
			this.yaid.setAttribute("aria-invalid", "true");
			this.errorBox.style.display = "block";
			this.errorBox.innerText = err;
		} else {
			this.yaid.setAttribute("aria-invalid", "false");
			this.errorBox.style.display = "none";
		}
	}

	updateInfo() {
		// Strip the last character to correctly format the date
		this.date.value = this.y.time().toISOString().slice(0, -1);
		this.meta.value = this.y.meta();
		this.bytes.value = "[" + this.y.bytes + "]";
		this.showError();

		console.log("updateInfo", date.value);
	}

	update() {
		try {
			this.y = Parse(yaid.value);
			this.updateInfo();
		} catch (err) {
			this.showError(err);
		}
	}

	updateId() {
		this.y.setMeta(meta.value);
		this.y.setTime(new Date(date.value));
		this.yaid.value = this.y;
		this.bytes.value = "[" + window.y.bytes + "]";

		console.log("updateId", date.value);
	}

	generate() {
		console.log(this.yaid);
		this.y = New();
		this.yaid.value = this.y.toString();
		this.updateInfo();
	}
}

// register component
customElements.define("yaid-form", YaidForm);
