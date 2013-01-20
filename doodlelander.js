(function (window) {
    'use strict';

    // Fast reference to document
    var document = window.document,
        // Canvas HTML Element
        canvas = document.querySelector('canvas'),
        // Context to draw into the canvas
        ctx = canvas.getContext('2d'),
        // Size
        width = 47,
        height = 51,
        // Vertical limit taking care of the spacecraft height
        floor = 368,
        // Position on space
        x = (960 - width) / 2,
        y = (400 - height) / 2,
        // Velocities by axis
        speedX = 0,
        speedY = 0,
        // Coordinates on Y-axis of cropped image
        spriteY = 0,
        // How much the speed increase or decrease
        stepX = 0.05,
        stepY = 0.08,
        // Flags to know user's control usage
        direction = 0,
        igniting = false,
        // Reference to renderable resource
        image = (function () {
            var i = new window.Image();
            i.src = 'lander.png';
            return i;
        }()),
        lastTime = 0;

    /**
     * RequestAnimationFrame polyfill
     * Based on pollyfill by Erik MÃ¶ller with fixes from Paul Irish and Tino Zijdel
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
     */
    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
            var currTime = new window.Date().getTime(),
                timeToCall = window.Math.max(0, 16 - (currTime - lastTime));

            lastTime = currTime + timeToCall;

            return window.setTimeout(function () { callback(lastTime); }, timeToCall);
        };

    function draw() {
        // Update Vertical speed:
        // - When control are used, then apply negative force
        // - On default situation, apply a positive force (gravity)
        y += speedY += igniting ? -stepY : stepY;
        // Check for landing
        if (y >= floor) {
            // Force to be in the ground
            y = floor;
            // Neutralize velocities
            speedX = speedY = 0;
        }
        // Clear the canvas with the DOM element size
        ctx.clearRect(0, 0, 960, 400);
        // Update Horizontal speed based on used control plus a pre-determined step
        x += speedX += direction * stepX;
        // Check for right to left transportation
        if (x > 960 + width) {
            x = -width;
        // Check for left to right transportation
        } else if (x < -width) {
            x = 960 + width;
        }
        // Render the crane with the updated position
        ctx.drawImage(image, 0, spriteY, width, height, x, y, width, height);
        // Restart the rAF cicle
        window.requestAnimationFrame(draw);
    }

    function checkFire() {
        switch (direction) {
        case 1:
            spriteY = igniting ? 204 : 102;
            break;
        case -1:
            spriteY = igniting ? 255 : 153;
            break;
        default:
            spriteY = igniting ? 51 : 0;
            break;
        }
    }

    // Which key was pressed
    document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
        // Throttle
        case 38:
        case 87:
            igniting = true;
            event.preventDefault();
            break;
        // Turn left
        case 37:
        case 65:
            direction = -1;
            event.preventDefault();
            break;
        // Turn right
        case 39:
        case 68:
            direction = 1;
            event.preventDefault();
            break;
        }

        checkFire();
    });

    // Which key was releaed
    document.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
        // Throttle
        case 38:
        case 87:
            igniting = false;
            break;
        // Turn left and turn right
        case 37:
        case 65:
        case 39:
        case 68:
            direction = 0;
            break;
        }

        checkFire();
    });

    /**
     * Initialize
     */
    window.onload = draw;

}(this));