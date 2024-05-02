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
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor = vec4(v_UV, 1,1);
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


function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
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
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

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

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0); 
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // drawTriangle3D([-1.0, 0.0, 0.0,  -0.5, -1.0, 1.0,   0.0, 0.0, 0.0]);

  var body = new Cube(); 
  body.color = [1.0, 0.0, 0.0, 1.0]; 
  body.matrix.translate(-.25, -.75, 0.0); 
  body.matrix.rotate(-5,1,0,0); 
  body.matrix.scale(0.5, 0.3, .5); 
  body.render();

  var leftArm = new Cube(); 
  leftArm.color = [1,1,0,1]; 
  leftArm.matrix.setTranslate(0, -0.5, 0.0); 
  leftArm.matrix.rotate(-5, 1, 0, 0); 

  leftArm.matrix.rotate(-g_joint_A,0,0,1);

  // if(g_animation1){
  //   leftArm.matrix.rotate(45*Math.sin(g_seconds), 0,0,1);
  // } else{
  //   leftArm.matrix.rotate(-g_joint_A,0,0,1);
  // }

  // leftArm.matrix.rotate(-g_joint_A,0,0,1);
  // leftArm.matrix.rotate(45*Math.sin(g_seconds), 0,0,1);

  var jointACoordinate = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, .7, .5); 
  leftArm.matrix.translate(-0.5,0,0); 
  leftArm.render(); 

  var box = new Cube(); 
  box.color = [1,0,1,1];
  box.matrix = jointACoordinate;
  box.matrix.translate(0, .65, 0); 
  box.matrix.rotate(g_joint_B, 0, 0, 1); 
  box.matrix.scale(0.3, 0.3, 0.3); 
  box.matrix.translate(-0.5, 0, -0.001); 
  box.render();




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


  