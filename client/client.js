"use strict";

$(document).ready(function() {

    function handleError(message) {
        $("#errorMessage").text(message);
        $("#errorMessage").show(500, hideError);
    }

    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
                handleError(messageObj.error);
            }
        });
    }

    $("#signupSubmit").on("click", function(e) {
        e.preventDefault();

        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("All fields are required");
            return false;
        }

        if($("#pass").val() !== $("#pass2").val()) {
            handleError("Passwords do not match");
            return false;
        }


        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

        return false;
    });

    $("#loginSubmit").on("click", function(e) {
        e.preventDefault();

        if($("#user").val() == '' || $("#pass").val() == '') {
            handleError("Username or password is empty");
            return false;
        }

        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });

    $("#generate").on("click", function(e) {
        e.preventDefault();

        sendAjax("/", getRandomBox());

        return false;
    });
});

function getRandomBox() {
    var box;

    // add in later
    var canvas = document.querySelector("canvas") || {width: 500, height: 500};
    var w = canvas.width;
    var h = canvas.height;

    var width = Math.ceil(Math.random() * 10);
    var x = Math.floor(Math.random() * w);
    var y = Math.floor(Math.random() * h);
    //var color = getRandomColor();
    var color = getPastelColor();

    box = "width=" + width + "&x=" + x + "&y=" + y + "&color=" + color;

    return box;
}

//http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
function getPastelColor() {
    var r = (Math.round(Math.random()* 127) + 127).toString(16);
    var g = (Math.round(Math.random()* 127) + 127).toString(16);
    var b = (Math.round(Math.random()* 127) + 127).toString(16);
    return '#' + r + g + b;
}

function hideError() {
    setTimeout(function() {
        $("#errorMessage").hide(500);
    }, 3000);
}
