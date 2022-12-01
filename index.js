let video = document.getElementById("video");
let t = document.getElementById("text");
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");


const socket = io();

let ic = undefined;

navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
	video.srcObject = stream;
	ic = new ImageCapture(video.srcObject.getVideoTracks()[0]);
	overlayCanvas(video, canvas); 
});

window.addEventListener("keydown", async x => {
	console.log(x.key);
	if(x.key.toLowerCase() === "w")
	{
		let img = bitmapToImage(await ic.grabFrame());
		socket.emit("image", pako.gzip(img, {to: 'string'}));
	}
});

function bitmapToImage(bitmap)
{
	let canvas = document.createElement("canvas");
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;
	canvas.getContext("2d").drawImage(bitmap, 0, 0);
	return canvas.toDataURL("image/jpg");
}

let classes = [];

for(let i = 0; i<26; i++)
{
	let c = String.fromCharCode("A".charCodeAt(0)+i);
	if(c != "J" && c != "Z")
	{
		classes.push(c);
	}
}

socket.on("image", data => {
	console.log(data.substring(0, data.indexOf("]")+1).replaceAll(/ +/g, ",").replaceAll(".,", ".0,").replaceAll(".]", ".0]").replaceAll("[,", "["));
	let a = JSON.parse(data.substring(0, data.indexOf("]")+1).replaceAll(/ +/g, ",").replaceAll(".,", ".0,").replaceAll(".]", ".0]").replaceAll("[,", "["));
	console.log(data.substring(data.indexOf("]")+1, data.indexOf("]", data.indexOf("]")+1)+1).replaceAll(/ +/g, ",").replaceAll(",]", "]").replaceAll(".,", ".0,").replaceAll(".]", ".0]").replaceAll("[,", "["));
	let b = JSON.parse(data.substring(data.indexOf("]")+1, data.indexOf("]", data.indexOf("]")+1)+1).replaceAll(/ +/g, ",").replaceAll(",]", "]").replaceAll(".,", ".0,").replaceAll(".]", ".0]").replaceAll("[,", "["));
	console.log(data.substring(data.indexOf("]", data.indexOf("]")+1)+1).replaceAll(/ +/g, ",").replaceAll("\n", "").replaceAll(",]", "]").replaceAll(".,", ".0,").replaceAll(".]", ".0]").replaceAll("[,", "["));
	let c = JSON.parse(data.substring(data.indexOf("]", data.indexOf("]")+1)+1).replaceAll(/ +/g, ",").replaceAll("\n", "").replaceAll(",]", "]").replaceAll(".,", ".0,").replaceAll(".]", ".0]").replaceAll("[,", "["));
	t.innerHTML = classes[a[0]] + ": " + (b[0]-b[0]%0.01)*100 + "% " + classes[a[1]] + ": " + (b[1]-b[1]%0.01)*100 + "% " + classes[a[2]] + ": " + (b[2]-b[2]%0.01)*100 + "%";
	console.log(c);
	overlayCanvas(video, canvas);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = "black";
	context.strokeWidth = "10px";
	context.rect(canvas.width-canvas.width*c[0][1], canvas.height*c[0][0], -canvas.width*(c[0][3]-c[0][1]), canvas.height*(c[0][2]-c[0][0]));
	context.stroke();
	context.strokeStyle = "white";
	context.strokeWidth = "5px";
	context.rect(canvas.width-canvas.width*c[0][1], canvas.height*c[0][0], -canvas.width*(c[0][3]-c[0][1]), canvas.height*(c[0][2]-c[0][0]));
	context.stroke();
});

function overlayCanvas(a, canvas)
{
	let w = a.offsetWidth;
	let h = a.offsetHeight;
	let cv = canvas;
	cv.width = w;
	cv.height = h;
}