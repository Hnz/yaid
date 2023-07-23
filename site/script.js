import { New, Parse } from "../../yaid-ts/yaid.js";

function showError(err) {
	if (err) {
		yaid.setAttribute("aria-invalid", "true");
		errorBox.style.display = "block";
		errorBox.innerText = err;
	} else {
		yaid.setAttribute("aria-invalid", "false");
		errorBox.style.display = "none";
	}
}

function updateInfo(y) {
	time.innerText = y.time().toUTCString();
	meta.innerText = y.meta();
	bytes.innerText = y.bytes;
	showError();
}

window.update = function () {
	console.log("UPDATE");
	try {
		const y = Parse(yaid.value);
		updateInfo(y);
	} catch (err) {
		showError(err);
	}
};

window.generate = function () {
	const y = New();
	yaid.value = y;
	updateInfo(y);
};

generate();
