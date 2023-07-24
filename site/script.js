import { New, Parse } from "../yaid-ts/yaid.ts";

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
	bytes.value = "[" + y.bytes + "]";
	showError();
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
	y.setMeta(meta.value);
	y.setTime(new Date(date.value));
	yaid.value = y;
	bytes.value = "[" + y.bytes + "]";
};

window.generate = function () {
	y = New();
	yaid.value = y;
	updateInfo(y);
};

window.y = New();
generate();
