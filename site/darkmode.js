function setTheme(theme) {
	document.documentElement.setAttribute("data-theme", theme);
}

function switchTheme(e) {
	const theme = e.target.checked ? "dark" : "light";
	setTheme(theme);
	localStorage.setItem("theme", theme);
}

toggleSwitch.addEventListener("change", switchTheme, false);

// Set stored theme on load
let theme = localStorage.getItem("theme");
if (theme) {
	setTheme(theme);
} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
	setTheme("dark");
	toggleSwitch.checked = true;
}
