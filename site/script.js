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
	date.valueAsDate = y.time();
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
	y.setTime(date.valueAsDate);
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
