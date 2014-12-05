"use strict";

var socket;
var ctx, canvas;
// save somewhere else?
// allow user to select different color/generate new color
// shift color over time
var userColor, userRad;
// removed ui component - still needed? or put into config
var refreshRate;
var fadeOpacity;

var FADE_MIN = 0.01;
var FADE_RANGE = 0.25;

// make this another shape?
function Circle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.r = userRad;
}

function initDraw() {
    socket = io.connect();
    setupSocket();

    var colorBtn = document.querySelector("#switchColor");
    var refreshRange = document.querySelector("#refreshRange");
    var fadeRange = document.querySelector("#fadeRange");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    userRad = 25;
    fadeOpacity = 0.1;
    userColor = getPastelColor();
    refreshRate = 100;

    setTimeout(fade, refreshRate);
    //setInterval(updateUserColor, 100);

    //canvas.addEventListener("mousedown", onMouseDown);
    //canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseOver);
    //canvas.addEventListener("mouseout", onMouseOut);
    canvas.addEventListener("click", switchColor);
    canvas.addEventListener("mousewheel", onMouseWheel);

    colorBtn.addEventListener("click", switchColor);
    fadeRange.addEventListener("change", changeFadeOpacity);
}

function onMouseDown(e) {

}

function onMouseUp(e) {

}

function onMouseOver(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    var circle = new Circle(x, y, userColor);

    socket.emit('addDraw', circle);
}

function onMouseOut(e) {

}

function changeFadeOpacity(e) {
    fadeOpacity = FADE_MIN + (e.target.value/100) * FADE_RANGE;
}

function onMouseWheel(e) {
    if(e.wheelDelta > 0) {
        userRad += 2;
    }

    if(e.wheelDelta < 0) {
        userRad -= 2;
        // should radius get to 0?
        if(userRad <= 1) {
            userRad = 1;
        }
    }
}

function setupSocket() {
    // recieve socket events
    socket.on('addDraw', function(circle) {
        drawCircle(circle);
    });
}

// adjust circle radius
function drawCircle(circle) {
    ctx.strokeStyle = circle.color;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI);
    ctx.stroke();
}

function updateUserColor() {
    // gradual user gradients..?
}

function switchColor() {
    userColor = getPastelColor();
}

/*
    fades elements
*/
function fade() {
    // set color configs
    ctx.fillStyle = "black";
    // filling over screen, only need to draw new elements
    ctx.globalAlpha = fadeOpacity;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    setTimeout(fade, refreshRate);
}

//http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
function getPastelColor() {
    var r = (Math.round(Math.random()* 127) + 127).toString(16);
    var g = (Math.round(Math.random()* 127) + 127).toString(16);
    var b = (Math.round(Math.random()* 127) + 127).toString(16);
    return '#' + r + g + b;
}

window.addEventListener("load", initDraw);
