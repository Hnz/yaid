var l=function(f){document.documentElement.setAttribute("data-theme",f)},a=function(f){const n=f.target.checked?"dark":"light";l(n),localStorage.setItem("theme",n)};toggleSwitch.addEventListener("change",a,!1);var k=localStorage.getItem("theme");if(k)l(k),toggleSwitch.checked=k==="dark";else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)l("dark"),toggleSwitch.checked=!0;

//# debugId=A71066E16BA6682464756e2164756e21
