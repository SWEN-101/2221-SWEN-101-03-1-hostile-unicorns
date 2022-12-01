import Handsigns from "./handsigns/alphabet.js";
const GE = new fp.GestureEstimator(Handsigns);
const letter = document.getElementById("letter");

function generateEstimator(letters)
{
	let out = [];
	letters = letters.toLowerCase();
	let a = "a".charCodeAt(0);
	for(let i = 0; i<letters.length; i++)
	{
		out.push(Handsigns[letters.charAt(i).charCodeAt(0)-a]);
	}
	return new fp.GestureEstimator(out);
}

const video = document.getElementById("video");

var estimator = generateEstimator("abcdefghijklmnopqrstuvwxyz");

navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
	video.srcObject = stream;
	//ic = new ImageCapture(video.srcObject.getVideoTracks()[0]);
	//overlayCanvas(video, canvas); 
});

console.log("loading");
const model = await handpose.load();
console.log("done");
console.log(Handsigns);
setInterval(async () => {
	let predictions = await model.estimateHands(video, true);
	if(predictions[0])
	{
		let estimatedGestures = estimator.estimate(predictions[0].landmarks, 0);
		estimatedGestures.gestures.sort((a, b) => {
			return b.score-a.score;
		});
		console.log(estimatedGestures);
		if(estimatedGestures.gestures[0])
		{
			console.log(estimatedGestures.gestures[0].name);
			letter.innerHTML = estimatedGestures.gestures[0].name;
		}
	}
}, 200);

let resize = () => {
	if(video.videoWidth/video.videoHeight>window.innerWidth/window.innerHeight)
	{
		video.style.width = "100%";
		video.style.height = "auto";
	}
	else
	{
		video.style.width = "auto";
		video.style.height = "100%";
	}
};

resize();

video.addEventListener("loadedmetadata", resize);

window.addEventListener("resize", resize);