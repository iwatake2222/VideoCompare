"use strict";

const elemTextUrl0 = document.getElementById("textUrl0");
const elemTextUrl1 = document.getElementById("textUrl1");
const elemVideo0 = document.getElementById("video0");
const elemVideo1 = document.getElementById("video1");
const objTextFps = document.getElementById("textFps");
const objTextFrameCnt = document.getElementById("textFrameCnt");
const objTextFrameNum = document.getElementById("textFrameNum");
const objButtonPlay = document.getElementById("buttonPlay");
const objButtonBack = document.getElementById("buttonBack");
const objButtonNext = document.getElementById("buttonNext");

/*** Video size adjustimeng ***/
function adjustVideoSize() {
	const videoSize = document.documentElement.scrollWidth / 2 * 0.95;
	elemVideo0.width = videoSize;
	elemVideo1.width = videoSize;
}

window.onload = function() {
	adjustVideoSize();
}
window.onresize = function(){
	adjustVideoSize();
}

/*** Sync two videos ***/
elemVideo0.addEventListener("play", function() {
	console.log("play");
	elemVideo1.play();
}, false);

elemVideo0.addEventListener("pause", function() {
	console.log("pause");
	elemVideo1.pause();
}, false);

elemVideo0.addEventListener("seeked", function() {
	console.log("seeked");
	elemVideo1.currentTime  = elemVideo0.currentTime;
}, false);

elemVideo0.addEventListener("loadeddata", function() {
	console.log("loadeddata");
}, false);

elemVideo0.addEventListener("timeupdate", function() {
	console.log("timeupdate");
}, false);


/*** Video Controllers ***/
function controlPlayPause() {
	if (elemVideo0.paused) {
		elemVideo0.play();
	} else {
		elemVideo0.pause();
	}
}

function controlStepBack() {
	elemVideo0.currentTime = Math.max(0, elemVideo0.currentTime - 1/objTextFps.value);
}

function controlStepNext() {
	elemVideo0.currentTime = Math.min(elemVideo0.duration, elemVideo0.currentTime + 1/objTextFps.value);
}

objButtonPlay.addEventListener("click", function() {
	console.log("objButtonPlay");
	controlPlayPause();
}, false);

objButtonBack.addEventListener("click", function() {
	console.log("objButtonBack");
	controlStepBack();
}, false);

objButtonNext.addEventListener("click", function() {
	console.log("objButtonNext");
	controlStepNext();
}, false);

window.addEventListener("keydown", (e)=>{
	console.log(e.code);
	switch (e.code) {
		case "KeyP":
			controlPlayPause();
			break;
		case "KeyB":
			controlStepBack();
			break;
		case "KeyN":
			controlStepNext();
			break;
	}
});

/*** File input ***/
elemTextUrl0.addEventListener("change", function() {
	console.log(elemTextUrl0.files);
	elemVideo0.src = elemTextUrl0.files[0].name;
}, false);

elemTextUrl1.addEventListener("change", function() {
	console.log(elemTextUrl1.files);
	elemVideo1.src = elemTextUrl1.files[0].name;
}, false);

