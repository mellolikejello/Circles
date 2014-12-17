"use strict";

var socket;
var ctx, canvas;
var userColor, userRad;
var refreshRate;
var fadeOpacity;

var strokeWidth;

var FADE_MIN = 0.01;
var FADE_RANGE = 0.10;

function Circle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.r = userRad;
    this.strokeWidth = strokeWidth;
}

function initDraw() {
    socket = io.connect();
    setupSocket();

    var colorBtn = document.querySelector("#switchColor");
    var refreshRange = document.querySelector("#refreshRange");
    var fadeRange = document.querySelector("#fadeRange");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    onResize();

    userRad = 100;
    fadeOpacity = 0.1;
    userColor = 0;
    refreshRate = 50;
    strokeWidth = 1;

    setTimeout(fade, refreshRate);
    setInterval(updateUserColor, 100);

    canvas.addEventListener("mousemove", onMouseOver);
    canvas.addEventListener("click", switchColor);
    canvas.addEventListener("mousewheel", onMouseWheel);

    colorBtn.addEventListener("click", switchColor);
    fadeRange.addEventListener("change", changeFadeOpacity);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function onKeyDown(e) {
    if(e.keyCode == 32) {
        // toggle header
        var header = document.querySelector("header");
        if(header.className != "") {
            header.className = "";
        } else {
            header.className = "hide";
        }
    }
}

function onResize(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


function onMouseOver(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    var circle = new Circle(x, y, userColor);

    socket.emit('addDraw', circle);
}

function changeFadeOpacity(e) {
    fadeOpacity = FADE_MIN + (e.target.value/100) * FADE_RANGE;
}

function changeStrokeWidth(e) {
    fadeOpacity = e.target.value;
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

function drawCircle(circle) {
    ctx.strokeStyle = "hsl(" + circle.color + ", 80%, 50%)";
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI);
    ctx.stroke();
}

function updateUserColor() {
    userColor+=1;
    if(userColor >= 360) userColor = 0;
}

function switchColor() {
    userColor += 100;
}

// fades elements on canvas
function fade() {
    ctx.fillStyle = "black";
    // filling over screen, only need to draw new elements
    ctx.globalAlpha = fadeOpacity;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    setTimeout(fade, refreshRate);
}

window.addEventListener("load", initDraw);
