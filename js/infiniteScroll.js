var scroll = function test()
{
	console.log(document.getElementById("infinite").style.height)
	var el = document.getElementById("infinite");
	var newHeight = document.getElementById("infinite").offsetHeight + 200;
	el.style.height = newHeight + "px";
}

window.addEventListener("scroll", scroll, false);
