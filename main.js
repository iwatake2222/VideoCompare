"use strict";

const elemTextUrl0 = document.getElementById("textUrl0");
const elemTextUrl1 = document.getElementById("textUrl1");
const elemVideo0 = document.getElementById("video0");
const elemVideo1 = document.getElementById("video1");
const elemImg0 = document.getElementById("img0");
const elemImg1 = document.getElementById("img1");
const elemSelectImg0 = document.getElementById("selectImg0");
const elemSelectImg1 = document.getElementById("selectImg1");
const objTextFps = document.getElementById("textFps");
const objTextFrameCnt = document.getElementById("textFrameCnt");
const objTextFrameNum = document.getElementById("textFrameNum");
const objButtonPlay = document.getElementById("buttonPlay");
const objButtonBack = document.getElementById("buttonBack");
const objButtonNext = document.getElementById("buttonNext");

let g_currentMode = "video";
let g_stillList0 = [];
let g_stillList1 = [];
let g_stillIndex = 0;

/*** Element view setting ***/
function setForVideoInput() {
	elemVideo0.hidden=""
	elemVideo1.hidden=""
	elemImg0.hidden="hidden";
	elemImg1.hidden="hidden";
	elemSelectImg0.hidden="hidden";
	elemSelectImg1.hidden="hidden";
	elemTextUrl0.multiple="";
	elemTextUrl1.multiple="";
	elemTextUrl0.accept="video/*";
	elemTextUrl1.accept="video/*";
	objTextFps.hidden="";
	objButtonPlay.hidden="";
	g_currentMode = "video";
	document.getElementById("radioImageTypeVideo").checked="checked";
}
function setForStillInput() {
	elemVideo0.hidden="hidden"
	elemVideo1.hidden="hidden"
	elemImg0.hidden="";
	elemImg1.hidden="";
	elemSelectImg0.hidden="";
	elemSelectImg1.hidden="";
	elemTextUrl0.multiple="multiple";
	elemTextUrl1.multiple="multiple";
	elemTextUrl0.accept="image/*";
	elemTextUrl1.accept="image/*";
	objTextFps.hidden="hidden";
	objButtonPlay.hidden="hidden";
	g_currentMode = "stills";
	document.getElementById("radioImageTypeStills").checked="checked";
	g_stillIndex = 0;
}

function adjustVideoSize() {
	const videoSize = document.documentElement.scrollWidth / 2 * 0.95;
	elemVideo0.width = videoSize;
	elemVideo1.width = videoSize;
	elemImg0.width = videoSize;
	elemImg1.width = videoSize;
	elemSelectImg0.style.width = videoSize + "px";
	elemSelectImg1.style.width = videoSize + "px";
}

window.onload = function() {
	adjustVideoSize();
	setForVideoInput();
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

/*** Still images ***/
function displayStill(index) {
	let filename = "";
	if (index < g_stillList0.length) {
		let fr0 = new FileReader();
		filename = g_stillList0[index].name;
		fr0.readAsDataURL(g_stillList0[index]);
		fr0.onload = function(e) {
			elemImg0.src = e.target.result;
		}
	}
	for (let i = 0; i < g_stillList1.length; i++) {
		if (g_stillList1[i].name == filename) {
			let fr1 = new FileReader();
			fr1.readAsDataURL(g_stillList1[i]);
			fr1.onload = function(e) {
			elemImg1.src = e.target.result;
			}
		}
	}
	/* use the following if you want to display the same index */
	// if (index < g_stillList1.length) {
	// 	let fr1 = new FileReader();
	// 	fr1.readAsDataURL(g_stillList1[index]);
	// 	fr1.onload = function(e) {
	// 		elemImg1.src = e.target.result;
	// 	}
	// }

	elemSelectImg0.value = filename;
	elemSelectImg1.value = filename;
}

elemSelectImg0.addEventListener("change", function() {
	console.log(elemSelectImg0.value);
	for (let i = 0; i < g_stillList0.length; i++) {
		if (g_stillList0[i].name == elemSelectImg0.value) {
			g_stillIndex = i;
			displayStill(g_stillIndex);
			break;
		}
	}
}, false);


/*** Controllers ***/
function controlPlayPause() {
	if (elemVideo0.paused) {
		elemVideo0.play();
	} else {
		elemVideo0.pause();
	}
}

function controlStepBack() {
	if (g_currentMode == "video") {
		elemVideo0.currentTime = Math.max(0, elemVideo0.currentTime - 1/objTextFps.value);
	} else {
		if (--g_stillIndex < 0) {
			g_stillIndex = 0;
		}
		displayStill(g_stillIndex);
	}
}

function controlStepNext() {
	if (g_currentMode == "video") {
		elemVideo0.currentTime = Math.min(elemVideo0.duration, elemVideo0.currentTime + 1/objTextFps.value);
	} else {
		if (++g_stillIndex >= g_stillList0.length ) {
			g_stillIndex = g_stillList0.length - 1;
		}
		displayStill(g_stillIndex);
	}
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
document.getElementsByName("radioGroupImageType").forEach(function(e) {
	e.addEventListener("click", function() {
		const imageType = document.querySelector("input:checked[name=radioGroupImageType]").value;
		console.log("imageType = " + imageType);
		switch (imageType) {
			case "video":
				setForVideoInput();
				break;
			case "stills":
				setForStillInput();
				break;
			default:
				console.log("undefined image type");
				break;
		}
	});
});

elemTextUrl0.addEventListener("change", function() {
	console.log(elemTextUrl0.files);
	if (g_currentMode == "video") {
		if (elemTextUrl0.files.length != 1) return;
		console.log(elemTextUrl0.files[0].name)
		// elemVideo0.src = elemTextUrl0.files[0].name;
		let fr0 = new FileReader();
		fr0.readAsDataURL(elemTextUrl0.files[0]);
		fr0.onload = function(e) {
			elemVideo0.src = e.target.result;
		}
	} else {
		g_stillList0 = [];
		for (let i = 0; i < elemTextUrl0.files.length; i++) {
			g_stillList0.push(elemTextUrl0.files[i]);
			let option = document.createElement("option");
			option.text = elemTextUrl0.files[i].name;
			option.val = elemTextUrl0.files[i].name;
			elemSelectImg0.appendChild(option);
		}
		displayStill(g_stillIndex);
	}
}, false);

elemTextUrl1.addEventListener("change", function() {
	console.log(elemTextUrl1.files);
	if (g_currentMode == "video") {
		if (elemTextUrl1.files.length != 1) return;
		console.log(elemTextUrl1.files[0].name)
		// elemVideo1.src = elemTextUrl1.files[0].name;
		let fr1 = new FileReader();
		fr1.readAsDataURL(elemTextUrl1.files[0]);
		fr1.onload = function(e) {
			elemVideo1.src = e.target.result;
		}
	} else {
		g_stillList1 = [];
		for (let i = 0; i < elemTextUrl1.files.length; i++) {
			g_stillList1.push(elemTextUrl1.files[i]);
			let option = document.createElement("option");
			option.text = elemTextUrl1.files[i].name;
			option.val = elemTextUrl1.files[i].name;
			option.disabled = "disabled";
			elemSelectImg1.appendChild(option);
		}
		displayStill(g_stillIndex);
	}
}, false);

