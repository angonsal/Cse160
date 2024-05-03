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

let u_whichTexture; 

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
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTexture(image); };
  image.src = '../resources/sky.jpeg';


  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }

  image2.onload = function(){ sendTexture1(image2); }
  image2.src = '../resources/grass.jpeg';



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
let g_animation1 = false; 
let g_animation2 = false; 


function addActionsHTMLUI(){
  //Joint sliders
  document.getElementById("jointASlide").addEventListener('mousemove', function() {g_joint_A = this.value; renderScene(); });
  document.getElementById("jointBSlide").addEventListener('mousemove', function() {g_joint_B = this.value; renderScene(); });

  // Angle Slider 
  document.getElementById("angleSlide").addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene(); });

  // On and off animation buttons 
  document.getElementById("off").onclick = function() {g_animation1 = false}; 
  document.getElementById("on").onclick = function() {g_animation1 = true};
  document.getElementById("off2").onclick = function() {g_animation2 = false}; 
  document.getElementById("on2").onclick = function() {g_animation2 = true};

}
  
function main() {

  setupWebGL();
  connectVariablesToGLSL(); 
  addActionsHTMLUI();
  initTextures(gl,0); 
  
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

function updateAnimationAngles(){
  if(g_animation1){
    g_joint_A = (45*Math.sin(g_seconds));
  }
  if(g_animation2){
    g_joint_B = (45*Math.sin(g_seconds));
  } 

}

function renderScene(){
  
  var startTime = performance.now();

  var viewMat = new Matrix4(); 
  viewMat.setLookAt(0,0,-1, 0,0,0, 0,1,0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var projMat = new Matrix4(); 
  projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0); 
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // drawTriangle3D([-1.0, 0.0, 0.0,  -0.5, -1.0, 1.0,   0.0, 0.0, 0.0]);

  // var grass = new Cube(); 
  // grass.color = [1.0, 0.0, 0.0, 1.0]; 
  // grass.textureNum = 1; 

  // grass.matrix.translate(-0.9, -1, -0.09); 
  // // grass.matrix.rotate(-5,1,0,0);
  // grass.matrix.scale(100, 0.2, 100); 
  // grass.render();


  //draw floor
  var grass = new Cube();
  grass.color = [1.0, 0.0, 0.0, 1.0]; 
  grass.textureNum=1;
  grass.matrix.translate(0, -.75, 0.0);  
  grass.matrix.scale(10, 0, 10); 
  grass.matrix.translate(-.5, 0, -.5);
  grass.render();
  //draw sky
  var skybox = new Cube();
  skybox.color = [1.0, 0.0, 0.0, 1.0]; 
  skybox.textureNum=0;  
  skybox.matrix.scale(50, 50, 50); 
  skybox.matrix.translate(-.5, -.5, -.5);
  skybox.render();

  // create skybox
  // var skybox = new Cube();
  // skybox.textureNum = 0; 
  // skybox.matrix.translate(-.5, -.5, -0.1);
  // skybox.matrix.scale(100, 100, 90); 
  // skybox.render();

  var box = new Cube(); 
  box.color = [1,0,1,1]; 
  box.textureNum = -2; 
  box.matrix.translate(0, .65, 0); 
  // box.matrix.rotate(0, 0, 0, 1); 
  box.matrix.scale(0.3, 0.3, 0.3); 
  box.matrix.translate(0.8, -4.85, -0.2); 
  box.render();


  // sky.matrix.rotate(-5, 1, 0, 0); 

  // sky.matrix.rotate(0,0,0,1);

  // if(g_animation1){
  //   sky.matrix.rotate(45*Math.sin(g_seconds), 0,0,1);
  // } else{
  //   sky.matrix.rotate(-g_joint_A,0,0,1);
  // }

  // sky.matrix.rotate(-g_joint_A,0,0,1);
  // sky.matrix.rotate(45*Math.sin(g_seconds), 0,0,1);

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID); 
  if (!htmlElm){
    console.log("Failed to get " + htmlID + "from HTML"); 
    return; 
  }
  htmlElm.innerHTML = text; 
}


  