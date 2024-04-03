
var canvas 
var ctx

// DrawRectangle.js 
function main() {
// Retrieve <canvas> element
	canvas = document.getElementById('example'); 
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element'); 
		return;
	}
	// Get the rendering context for 2DCG 11 
	ctx = canvas.getContext('2d');

	// // Draw a blue rectangle 
	// ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color 
	// ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color

	// Black Canvas 
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var v1 = new Vector3([2.25, 2.25, 0]); 
	drawVector(v1, "red"); 
}

function drawVector(v, color) {

	// Scaling Vector coordinate

	// console.log(v.element[0]); 
	var scaledXVal = v.elements[0] * 20;  
	var scaledYVal = v.elements[1] * 20;

	ctx.strokeStyle = color; 

	// "The origin of the vector should be the center of the canvas"
	var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

	ctx.beginPath(); 
	ctx.moveTo(centerX, centerY);
	ctx.lineTo(centerX + scaledXVal, centerY - scaledYVal); 
	ctx.stroke(); 
}


function handleDrawEvent(){

	// Clear canvas 
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Read Values
	x = document.getElementById("xvalue").value;
	y = document.getElementById("yvalue").value;

	//New lines 
	
}







