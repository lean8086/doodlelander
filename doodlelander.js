/**
 * Doodle Lander
 * A simple experiment with some physics laws like gravity.
 * by Leandro Linares @lean8086
 */
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
		x = (900 - width) / 2,
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
			i.src = 'http://leanlinares.s3-website-us-east-1.amazonaws.com/doodles/doodlelander.png';
			return i;
		}());

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
		ctx.clearRect(0, 0, 900, 400);
		// Update Horizontal speed based on used control plus a pre-determined step
		x += speedX += direction * stepX;
		// Render the crane with the updated position
		ctx.drawImage(image, 0, spriteY, width, height, x, y, width, height);
		// Restart the rAF cicle
		window.requestAnimationFrame(draw);
	}

	function checkFire() {
		switch (direction) {
		case 1:
			spriteY = (igniting) ? 204 : 102;
			break;
		case -1:
			spriteY = (igniting) ? 255 : 153;
			break;
		default:
			spriteY = (igniting) ? 51 : 0;
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