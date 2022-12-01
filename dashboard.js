//A Pen by X - MrG3P5 on CodePen.

console.log("hello!!!!!!!!!");

document.addEventListener("DOMContentLoaded", () => {
	let discovertab = document.getElementById("discovertab");
	let discoverbutton = document.getElementById("discoverbutton");
	let challengetab = document.getElementById("challengetab");
	let challengebutton = document.getElementById("challengebutton");
	let game = document.getElementById("minigame");
	console.log(discoverbutton);
	discoverbutton.addEventListener("click", () => {
		discovertab.hidden = false;
		challengetab.hidden = true;
		game.src = "about:blank";
	});

	challengebutton.addEventListener("click", () => {
		discovertab.hidden = true;
		challengetab.hidden = false;
		game.src = "minigame.html";
	});
});