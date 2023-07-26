toggleSwitch.addEventListener("change", switchTheme, false);

function switchTheme(e) {
	if (e.target.checked) {
		document.documentElement.setAttribute("data-theme", "dark");
		localStorage.setItem("theme", "dark"); //add this
	} else {
		document.documentElement.setAttribute("data-theme", "light");
		localStorage.setItem("theme", "light"); //add this
	}
}

// Set stored theme on load
const currentTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : null;

if (currentTheme) {
	document.documentElement.setAttribute("data-theme", currentTheme);
	toggleSwitch.checked = currentTheme === "dark" ? "dark" : "light";
}
