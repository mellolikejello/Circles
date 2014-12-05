"use strict";

var socket;
var ctx, canvas;
// save somewhere else?
// allow user to select different color/generate new color
// shift color over time
var userColor;

// make this another shape?
function Circle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.r = 10;
}

function initDraw() {
    socket = io.connect();
    setupSocket();

    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    userColor = getPastelColor();

    setInterval(fade, 100);
    //setInterval(updateUserColor, 100);

    //canvas.addEventListener("mousedown", onMouseDown);
    //canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseOver);
    //canvas.addEventListener("mouseout", onMouseOut);
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

/*
    fades elements
*/
function fade() {
    // set color configs
    ctx.fillStyle = "black";
    // filling over screen, only need to draw new elements
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
}

//http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
function getPastelColor() {
    var r = (Math.round(Math.random()* 127) + 127).toString(16);
    var g = (Math.round(Math.random()* 127) + 127).toString(16);
    var b = (Math.round(Math.random()* 127) + 127).toString(16);
    return '#' + r + g + b;
}

window.addEventListener("load", initDraw);
