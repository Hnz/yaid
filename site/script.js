import { New, Parse } from "../yaid-js/yaid.ts";

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
	// Strip the last character to correctly format the date
	date.value = y.time().toISOString().slice(0, -1);
	meta.value = y.meta();
	bytes.value = "[" + window.y.bytes + "]";
	showError();

	console.log("updateInfo", date.value);
}

window.update = function () {
	try {
		y = Parse(yaid.value);
		updateInfo(y);
	} catch (err) {
		showError(err);
	}
};

window.updateId = function () {
	window.y.setMeta(meta.value);
	window.y.setTime(new Date(date.value));
	yaid.value = window.y;
	bytes.value = "[" + window.y.bytes + "]";

	console.log("updateId", date.value);
};

window.generate = function () {
	window.y = New();
	yaid.value = window.y;
	updateInfo(window.y);
};

generate();
