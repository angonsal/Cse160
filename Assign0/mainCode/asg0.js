
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
	// var v1 = new Vector3([2.25, 2.25, 0]); 
	// drawVector(v1, "red");
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
 
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
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//Read Values
	var x = document.getElementById("xvalue").value;
	var y = document.getElementById("yvalue").value;

	var x1 = document.getElementById("xvalue1").value;
	var y1 = document.getElementById("yvalue1").value;


	//New lines 
	var v1 = new Vector3([x,y,0]); 
	drawVector(v1, "red");

	var v2 = new Vector3([x1,y1,0]); 
	drawVector(v2, "blue");
	
}

function handleDrawOperationEvent(){
	
	// Clear canvas 
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//Read Values
	var x = document.getElementById("xvalue").value;
	var y = document.getElementById("yvalue").value;

	var x1 = document.getElementById("xvalue1").value;
	var y1 = document.getElementById("yvalue1").value;

	//New lines 
	var v1 = new Vector3([x,y,0]); 
	drawVector(v1, "red");

	var v2 = new Vector3([x1,y1,0]); 
	drawVector(v2, "blue");


	var operation = document.getElementById("operation").value;
	var scale = document.getElementById("scalar").value;

	if (operation == "add") {
		var v3 = v1.add(v2)
		drawVector(v3, "green");
	}

	if (operation == "sub") {
		var v3 = v1.sub(v2)
		drawVector(v3, "green");
	}

	if (operation == "mul") {
		var v3 = v1.mul(scale)
		var v4 = v2.mul(scale)
		drawVector(v3, "green");
		drawVector(v4, "green");
	}

	if (operation == "div") {
		var v3 = v1.div(scale)
		var v4 = v2.div(scale)
		drawVector(v3, "green");
		drawVector(v4, "green");
	}

	if (operation == "mag") {
		var v3 = v1.magnitude()
		var v4 = v2.magnitude()
		console.log("Magnitude:", v3); 
		console.log("Magnitude:", v4);
	}

	if (operation == "norm") {
		var v3 = v1.normalize()
		var v4 = v2.normalize()
		drawVector(v3, "green");
		drawVector(v4, "green");
	}

	if (operation == "dot") {
		let ans = angleBetween(v1, v2); 
		console.log("Angle: ", ans); 
	}

	if (operation == "area") {
		let ans = areaTriangle(v1, v2); 
		console.log("Area: ", ans); 
	}

}

//dot(v1, v2) = ||v1|| * ||v2|| * cos(alpha)
function angleBetween(v1, v2) {
	let dot = Vector3.dot(v1, v2); 

	// get magnitudes of v1 and v2
	let magv1 = v1.magnitude(); 
	let magv2 = v2.magnitude(); 

	// multiply the magnitudes 
	let magnitudes = magv1 * magv2; 

	//dot/multiplied magnitudes = cos(alpha)
	let cosangle = dot / magnitudes;

	//get the radiens, then convert to degrees
	// radiens * (180/pi) 
	let radiens = Math.acos(cosangle); 
	let degree = radiens * (180/Math.PI); 

	return degree; 

}

//||v1 x v2]]  equals to the area of the parallelogram(bh)
function areaTriangle(v1, v2) {
	let area = Vector3.cross(v1,v2);

	//get the magnitude
	let mag = area.magnitude();

	//get area of triangle (bh * 1/2)
	let triangleArea = mag/2; 

	return triangleArea; 

}







