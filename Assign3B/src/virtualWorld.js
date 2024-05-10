// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV; 
varying vec2 v_UV; 
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
void main() {
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  v_UV = a_UV; 
}`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV; 
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2; 
  uniform sampler2D u_Sampler3; 

 
 
  uniform int u_whichTexture; 
  void main() {
    if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }
    else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1,1);
    }
    else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); 
    }
    else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); 
    }
    else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV); 
    }
    else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV); 
    }
    else{
      gl_FragColor = vec4(1,.2,.2,1); 
    }

  }`

// Global 
let canvas; 
let gl; 
let a_Position; 
let u_FragColor; 
let u_size; 
let a_UV; 
let u_ModelMatrix;
let u_GlobalRotateMatrix; 
let u_Sampler0; 
let u_Sampler1; 
let u_Sampler2; 
let u_Sampler3; 
let u_whichTexture; 


// WRITING SO I DONT FORGET: Game to find animal; when animal is found, user clikcs button and the animal will 
// move to a new random location in the maze.
function setupWebGL() {
    // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  
  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
    }
  gl.enable(gl.DEPTH_TEST); 
}

function initTextures(gl, n) {

  // Get the storage location of u_Sampler
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  var u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }
  var u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTexture(image); };
  image.src = '../resources/meme.jpeg';


  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }

  image2.onload = function(){ sendTexture1(image2); }
  image2.src = '../resources/grass.jpeg';

  var image3 = new Image();  // Create the image object
  if (!image3) {
    console.log('Failed to create the image object');
    return false;
  }

  image3.onload = function(){ sendTexture2(image3); }
  image3.src = '../resources/wee.png';

  var image4 = new Image();  // Create the image object
  if (!image4) {
    console.log('Failed to create the image object');
    return false;
  }

  image4.onload = function(){ sendTexture3(image4); }
  image4.src = '../resources/stars.png';




  return true;
}

function sendTexture(image) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  // // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  // console.log('finished loadTexture'); 
  // // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTexture1(image){
  var texture = gl.createTexture();   // create a texture object
  if(!texture){
      console.log('Failed to create the texture1 object');
      return false;
  }

  // flip the image's Y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // enable texture unit1
  gl.activeTexture(gl.TEXTURE1);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
}

function sendTexture2(image){
  var texture = gl.createTexture();   // create a texture object
  if(!texture){
      console.log('Failed to create the texture1 object');
      return false;
  }

  // flip the image's Y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // enable texture unit1
  gl.activeTexture(gl.TEXTURE2);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);
}

function sendTexture3(image){
  var texture = gl.createTexture();   // create a texture object
  if(!texture){
      console.log('Failed to create the texture1 object');
      return false;
  }

  // flip the image's Y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // enable texture unit1
  gl.activeTexture(gl.TEXTURE3);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler3, 3);
}



function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
}

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }


  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); 
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }


  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix'); 
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix'); 
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix'); 
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return false;
  }
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
      console.log('Failed to get the storage location of u_Sampler3');
      return false;
  }

  var identityM = new Matrix4(); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  var projectionMatrix = new Matrix4(); 
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);

  var viewMatrix = new Matrix4(); 
  gl.uniformMatrix4fv(u_ViewMatrix, false, projectionMatrix.elements);

}

//constants 
const POINT = 0;
const TRIANGLE = 1; 
const CIRCLE = 2; 


//more global variables 
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_SelectedSize = 5; 
let g_selectedType = POINT; 
let g_selectedSegment = 10;
let g_globalAngle = 0;
let g_joint_A = 0;
let g_joint_B = 0;
let g_joint_C = 0; 
let g_animation1 = false; 
let g_animation2 = false; 


function addActionsHTMLUI(){
  //Joint sliders
  // document.getElementById("jointASlide").addEventListener('mousemove', function() {g_joint_A = this.value; renderScene(); });
  // document.getElementById("jointBSlide").addEventListener('mousemove', function() {g_joint_B = this.value; renderScene(); });

  // Angle Slider 
  // document.getElementById("angleSlide").addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene(); });

  // On and off animation buttons 
  // document.getElementById("off").onclick = function() {g_animation1 = false}; 
  // document.getElementById("on").onclick = function() {g_animation1 = true};
  // document.getElementById("off2").onclick = function() {g_animation2 = false}; 
  // document.getElementById("on2").onclick = function() {g_animation2 = true};
  document.getElementById("reset").addEventListener('click', function() {
    // Reset camera position and orientation
    g_animation1 = true;
    
});


}
  
function main() {

  setupWebGL();
  connectVariablesToGLSL(); 
  addActionsHTMLUI();
  initTextures(gl,0); 
  call();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.85, 0.75, 1.0, 1.0);
  

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  renderScene();
  requestAnimationFrame(tick);


}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;



var g_shapesList = [];


function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
  
}

function tick(){

  g_seconds=performance.now()/1000.0-g_startTime;

  updateAnimationAngles();

  renderScene(); 

  requestAnimationFrame(tick);
}

let blockCount = 0; 
let spawns = []; 

function addBlocks(camera) {
  const d = camera.getForward(); 

  // gettign x and z values; no need for y because blocks only on floor  
  const [x, z] = [camera.eye.elements[0] + d.elements[0], camera.eye.elements[2] + d.elements[2]];
  
  const boundX = Math.floor(Math.abs(x + 16)); 
  const boundZ = Math.floor(Math.abs(z + 19)); 

  // return if not bounds 
  if (g_map[boundX][boundZ] !== 0) {
    return;
  }

    // else create the cube 
    g_map[boundX][boundZ] = 2; 
    const block = new Cube(); 
    block.textureNum = 3; 
    block.matrix.translate(boundX - 16.5, -0.85, boundZ + (-16.5)); 
    spawns.push(block);
    blockCount += 1; 
    console.log("Block Count", blockCount); 
    renderScene(); 


  }


  // TO DO: FIX 
function deleteBlocks(camera) {
  const d = camera.getForward(); 

  const [x, z] = [camera.eye.elements[0] + d.elements[0], camera.eye.elements[2] + d.elements[2]];

  const boundX = Math.floor(Math.abs(x - 16.5)); 
  const boundZ = Math.floor(Math.abs(z + 17)); 

  if (g_map[boundX][boundZ] !== 1) {
    return;
  }
  
  // console.log("Original x:", x);
  // console.log("Original z:", z);
  // console.log("BoundX:", boundX);
  // console.log("BoundZ:", boundZ);
  
  // console.log(x);
  // console.log(z);

  // console.log(boundX);
  // console.log(boundZ);
  g_map[boundX][boundZ] = 0; 

  renderScene(); 
}





function updateAnimationAngles(){
  if(g_animation1){
    g_joint_A = (8*Math.sin(g_seconds));
    g_joint_B = (-2*Math.sin(g_seconds));
    g_joint_C = (4*Math.sin(g_seconds));

  }
  // if(g_animation2){
  //   g_joint_B = (-8*Math.sin(g_seconds));
  // } 

}

var lastX = null; 
var lastY = null; 
var camera = true; 
var mouseDown = false;
var holdX = 0;
var holdY = 0;


// let cameraX = 0;
// let cameraZ = 0;
//viewMat.setLookAt(0,1,-6, 0,0,0, 0,1,0);
var g_camera = new Camera(); 
function keydown(ev) {
  // Move the camera based on the pressed key
  switch (ev.key.toLowerCase()) {
      case "w":
          g_camera.moveForward();
          break;
      case "a":
          g_camera.moveLeft();
          break;
      case "s":
          g_camera.moveBackwards();
          break;
      case "d":
          g_camera.moveRight();
          break;
      case "q":
          g_camera.panLeft();
          break;
      case "e":
          g_camera.panRight();
          break;
      case "arrowup":
        g_camera.turnUp();
        // prevent webpage from moving
        ev.preventDefault();
        break;
      case "arrowdown":
        g_camera.turnDown();
        // prevent webpage from moving
        ev.preventDefault();
        break;
      case "l":
        addBlocks(g_camera); 
        break;
      case "p":
        // spawns = [];  
        deleteBlocks(g_camera);   
        break;
      case "x":
        spawns = [];  
        break;
  }
  renderScene();
}



function handleMouseDown(event) {
  mouseDown = true;
  lastX = event.clientX;
  lastY = event.clientY;
}

function handleMouseUp(event) {
  mouseDown = false;
}

function onMove(event) {
  if (!mouseDown){
    return;
  }
  var newX = event.clientX;
  var newY = event.clientY;

  // Store 
  var x = event.clientX;
  var y = event.clientY;

  var dx =  (newX - lastX);
  var dy =  (newY - lastY);

  

  if (dx > 0) {
    g_camera.panRight();
  }
  else if (dx < 0) {
    g_camera.panLeft();
  }
  if (dy < 0) {
    g_camera.turnUp();
  } 
  else if (dy > 0){
    g_camera.turnDown();
  }

  lastX = x;
  lastY = y;

  renderScene(); 
}



function call() {
  canvas.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mousemove', onMove);
  document.addEventListener('keydown', keydown);   
}

// var g_map = [
//   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
//   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
//   [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
//   [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
//   [1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
//   [1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1],
//   [1,0,0,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1],
//   [1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1],
//   [1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1],
//   [1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
//   [1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
//   [1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
//   [1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
//   [1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,1,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// ];

var g_map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];



function drawMap(){
  for (var x = 0; x < 32; x++){
    for (var y = 0; y < 32; y++){
      if (g_map[x][y] == 1){
        var body = new Cube(); 
        body.textureNum = 2; 
        body.matrix.translate(15.5 - x, -0.73, -15.5+ y); 
        body.matrix.scale(1, 0.9, 1); 
        body.render(); 
      }
    }
  }
}


var g_camera = new Camera(); 
var eye = g_camera.eye;
var at = g_camera.at;
var up = g_camera.up;

let poorJosh = false;
let oops = false;

function renderScene() {
  var startTime = performance.now();

  // Retrieve camera properties

  // Set up view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(eye.elements[0], eye.elements[1], eye.elements[2], at.elements[0], at.elements[1], at.elements[2], up.elements[0], up.elements[1], up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Update other matrices as needed
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0); 
  // globalRotMat.rotate(holdY, 1, 0, 0); 
  // globalRotMat.rotate(holdX, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawMap();
  //draw floor
  var grass = new Cube();
  grass.color = [1.0, 0.0, 0.0, 1.0]; 
  grass.textureNum=1;
  grass.matrix.translate(0, -.75, 0.0);  
  grass.matrix.scale(32, 0.1, 32); 
  grass.matrix.translate(-.5, 0, -.5);
  grass.render();
  //draw sky
  var skybox = new Cube();
  skybox.color = [1.0, 0.0, 0.0, 1.0]; 
  skybox.textureNum=3;  
  skybox.matrix.scale(50, 50, 50); 
  skybox.matrix.translate(-.5, -.5, -.5);
  skybox.render();

  var meme = new Cube();
  meme.color = [1.0, 0.0, 0.0, 1.0]; 
  meme.textureNum=0;  
  meme.matrix.scale(5, 5, 0.1); 
  meme.matrix.translate(-1, 0.35, 5);
  meme.matrix.rotate(-g_joint_A,0,0,1);
  meme.matrix.translate(-g_joint_A, -.5, -0.5);
  // console.log(Math.round(g_camera.eye.elements[2])); 
  // console.log( Math.round(meme.matrix.elements[14]));
  // console.log(Math.round(g_camera.eye.elements[0])); 
  // console.log( Math.round(meme.matrix.elements[12]));
  meme.render();

  var meme1 = new Cube();
  meme1.color = [1.0, 0.0, 0.0, 1.0]; 
  meme1.textureNum=0;  
  meme1.matrix.scale(5, 5, 0.1); 
  meme1.matrix.translate(-2.5, 0.35, 28);
  meme1.matrix.rotate(-g_joint_B,0,0,1);
  meme1.matrix.translate(-g_joint_B, -.5, 5);
  meme1.render();

  var meme2 = new Cube();
  meme2.color = [1.0, 0.0, 0.0, 1.0]; 
  meme2.textureNum=0;  
  meme2.matrix.scale(5, 5, 0.1); 
  meme2.matrix.translate(-1.75, 0.35, 40);
  meme2.matrix.rotate(-g_joint_C,0,0,1);
  meme2.matrix.translate(-g_joint_C, -.5, 5);
  meme2.render();


  for (let i = 0; i < spawns.length; i++) {
    spawns[i].render();
  }

  // console.log(meme.matrix.elements, ":CHECK"); 
  if (!poorJosh) {
    var threshholdZ = 0.1;
    var threshholdX = 0.8;
    var cameraZpos =  Math.round(g_camera.eye.elements[2]); 
    var cameraXpos = Math.round(g_camera.eye.elements[0]); 
    var meme1Z = Math.round(meme.matrix.elements[14]); 
    var meme1X = Math.round(meme.matrix.elements[12]); 
    var meme2Z = Math.round(meme1.matrix.elements[14]); 
    var meme2X = Math.round(meme1.matrix.elements[12]); 
    var meme3Z = Math.round(meme2.matrix.elements[14]); 
    var meme3X = Math.round(meme2.matrix.elements[12]); 

    // console.log(cameraZpos, meme1Z, cameraXpos, meme1X); 
     if (Math.abs(cameraZpos) - Math.abs(meme1Z) <= Math.abs(threshholdZ) && Math.abs(cameraXpos) - Math.abs(meme1X) <= Math.abs(threshholdX)){
        console.log("YIPPEE"); 
        //alert("You died and built: ", blockCount, "blocks.");
        oops = true;   
    
    }
    if (Math.abs(cameraZpos) - Math.abs(meme2Z) <= Math.abs(threshholdZ) && Math.abs(cameraXpos) - Math.abs(meme2X) <= Math.abs(threshholdX)){
      console.log("YIPPEE");  
      oops = true;    
      // alert("You died and built: ", blockCount, "blocks.");
    }
    if (Math.abs(cameraZpos) - Math.abs(meme3Z) <= Math.abs(threshholdZ) && Math.abs(cameraXpos) - Math.abs(meme3X) <= Math.abs(threshholdX)){
      console.log("YIPPEE"); 
      oops = true;     
      // alert("You died and built: ", blockCount, "blocks.");
    }
}


  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}



// function startTimer() {
//     g_timerRunning = true;
//     g_startTime = performance.now();
// }

// function stopTimer() {
//     g_timerRunning = false;
//     g_elapsedTime = performance.now() - g_startTime;
// }

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID); 
  if (!htmlElm){
    console.log("Failed to get " + htmlID + "from HTML"); 
    return; 
  }
  htmlElm.innerHTML = text; 
}


  