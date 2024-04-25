// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix; 
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global 
let canvas; 
let gl; 
let a_Position; 
let u_FragColor; 
let u_ModelMatrix;

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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }


  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); 
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix'); 
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  var identityM = new Matrix4(); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
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

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons ==1) {click(ev)}};

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

function click(ev) {
  [x,y] = convertCoordinatesEventToGL(ev);
  // Store the coordinates to g_points array
  let point; 
  if (g_selectedType == POINT){
    point = new Point(); 
  }
  else if (g_selectedType == TRIANGLE) {
    point = new Triangle(); 
  }
  else{
    point = new Circle();
    point.segments = g_selectedSegment; 
  }


  point.position = [x,y]; 
  point.color = g_selectedColor.slice(); 
  point.size = g_SelectedSize; 
  g_shapesList.push(point); 
  

  renderScene(); 

}

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
  gl.clear(gl.COLOR_BUFFER_BIT); 

  // drawTriangle3D([-1.0, 0.0, 0.0,  -0.5, -1.0, 1.0,   0.0, 0.0, 0.0]);

  //made it too big and didn't know what to do 
  var body = new Cube();
  body.color = [0.63, 0.63, 0.63, 1.0];
  body.matrix.translate(-0.14, -0.4, 0.0); 
  body.matrix.rotate(0, 0, 1, 0);
  body.matrix.scale(0.15, 0.15, 0.3);
  body.render();

  var body2 = new Cube();
  body2.color = [0.63, 0.63, 0.63, 1.0];
  body2.matrix.translate(0, -0.4, 0.0);
  body2.matrix.rotate(0, 0, 1, 0);
  body2.matrix.scale(0.15, 0.15, 0.3);
  body2.render();

  var body3 = new Cube();
  body3.color = [0.63, 0.63, 0.63, 1.0];
  body3.matrix.translate(-0.25, -0.3, 0.0); 
  body3.matrix.rotate(0, 0, 1, 0);
  body3.matrix.scale(0.15, 0.21, 0.3);
  body3.render();

  var body4 = new Cube();
  body4.color = [0.63, 0.63, 0.63, 1.0];
  body4.matrix.translate(0.25, -0.3, 0.0); 
  body4.matrix.scale(-0.15, 0.21, 0.3);
  body4.render();

  var body5 = new Cube();
  body5.color = [0.63, 0.63, 0.63, 1.0];
  body5.matrix.translate(0.3, -0.09, 0.0); 
  body5.matrix.scale(-0.15, 0.19, 0.3);
  body5.render();

  var body6 = new Cube();
  body6.color = [0.63, 0.63, 0.63, 1.0];
  body6.matrix.translate(-0.15, -0.09, 0.0); 
  body6.matrix.scale(-0.15, 0.19, 0.3);
  body6.render();

  var body7 = new Cube();
  body7.color = [0.63, 0.63, 0.63, 1.0];
  body7.matrix.translate(-0.1, 0.1, 0.0); 
  body7.matrix.scale(-0.15, 0.2, 0.3);
  body7.render();

  var body8 = new Cube();
  body8.color = [0.63, 0.63, 0.63, 1.0];
  body8.matrix.translate(0.12, 0.1, 0.0); 
  body8.matrix.scale(0.15, 0.2, 0.3); 
  body8.render();

  var whiteBlock = new Cube();
  whiteBlock.color = [1, 1, 1, 1];
  whiteBlock.matrix.translate(-0.1, 0.1, 0.0); 
  whiteBlock.matrix.scale(0.22, 0.2, 0.3); 
  whiteBlock.render();

  var stomach = new Cube();
  stomach.color = [1, 1, 1, 1];
  stomach.matrix.translate(-0.1, -0.25, 0); 
  stomach.matrix.scale(0.2, 0.17, 0.3);
  stomach.render();

  var stomach2 = new Cube();
  stomach2.color = [1, 1, 1, 1];
  stomach2.matrix.translate(-0.15, -0.09, 0); 
  stomach2.matrix.scale(0.3, 0.19, 0.3);
  stomach2.render();


  var leftLeg = new Cube();
  leftLeg.color = [0.63, 0.63, 0.63, 1.0];
  leftLeg.matrix.translate(-0.14, -0.9, 0.1);
  // leftLeg.matrix.rotate(-38,0,0,1);
  leftLeg.matrix.scale(0.12, 0.5, 0.1);
  leftLeg.render();

  var rightLeg = new Cube();
  rightLeg.color = [0.63, 0.63, 0.63, 1.0];
  rightLeg.matrix.translate(0.15, -0.9, 0.1); 
  rightLeg.matrix.scale(-0.12, 0.5, 0.1); 
  rightLeg.render();

  var leftFoot = new Cube(); 
  leftFoot.color = [1, 1, 1, 1];
  leftFoot.matrix.translate(-0.29, -0.9, 0.1);
  leftFoot.matrix.scale(0.15, 0.1, 0.1);
  leftFoot.render();


  var rightFoot = new Cube(); 
  rightFoot.color = [1, 1, 1, 1];
  rightFoot.matrix.translate(0.3, -0.9, 0.1); 
  rightFoot.matrix.scale(-0.15, 0.1, 0.1); 
  rightFoot.render();







  // var leftArm = new Cube(); 
  // leftArm.color = [1,1,0,1]; 
  // leftArm.matrix.setTranslate(0, -0.5, 0.0); 
  // leftArm.matrix.rotate(-5, 1, 0, 0); 
  // leftArm.matrix.rotate(-g_joint_A,0,0,1);
  // var jointACoordinate = new Matrix4(leftArm.matrix);
  // leftArm.matrix.scale(0.25, .7, .5); 
  // leftArm.matrix.translate(-0.5,0,0); 
  // leftArm.render(); 

  // var box = new Cube(); 
  // box.color = [1,0,1,1];
  // box.matrix = jointACoordinate;
  // box.matrix.translate(0, .65, 0); 
  // box.matrix.rotate(g_joint_B, 0, 0, 1); 
  // box.matrix.scale(0.3, 0.3, 0.3); 
  // box.matrix.translate(-0.5, 0, -0.001); 
  // box.render();




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


  