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
let g_joint_C = 0; 
let g_joint_D = 0;
let g_joint_E = 0;
let g_joint_F = 0; 
let g_joint_G = 0; 
let g_animation1 = false; 


function addActionsHTMLUI(){
  //Joint sliders
  document.getElementById("jointASlide").addEventListener('mousemove', function() {g_joint_A = this.value; renderScene(); });
  document.getElementById("jointBSlide").addEventListener('mousemove', function() {g_joint_C = this.value; renderScene(); });

  // Angle Slider 
  document.getElementById("angleSlide").addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene(); });

  // On and off animation buttons 
  document.getElementById("off").onclick = function() {g_animation1 = false}; 
  document.getElementById("on").onclick = function() {g_animation1 = true};

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
    g_joint_A = (11.5*Math.sin(g_seconds));
    g_joint_B = (11.5*Math.sin(g_seconds));
    g_joint_C =  (10* Math.sin(g_seconds));
    g_joint_D =  (10* Math.sin(g_seconds));
    g_joint_E = (10* Math.sin(g_seconds));
    g_joint_F = (10* Math.sin(g_seconds));
    g_joint_G = (2* Math.sin(g_seconds));
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

  //made it too big and didn't want to change every dimension sorry
  var scaleFactor = 0.5;

  var body = new Cube();
  body.color = [0.58, 0.435, 0.31, 1.0];
  body.matrix.translate(-0.14 * scaleFactor, -0.4 * scaleFactor, 0.0);
  body.matrix.rotate(0, 0, 1, 0);
  body.matrix.scale(0.15 * scaleFactor, 0.15 * scaleFactor, 0.35 * scaleFactor);
  body.render();

  var body2 = new Cube();
  body2.color = [0.58, 0.435, 0.31, 1.0];
  body2.matrix.translate(0, -0.4 * scaleFactor, 0.0);
  body2.matrix.rotate(0, 0, 1, 0);
  body2.matrix.scale(0.15 * scaleFactor, 0.15 * scaleFactor, 0.35 * scaleFactor);
  body2.render();

  var body3 = new Cube();
  body3.color = [0.58, 0.435, 0.31, 1.0];
  body3.matrix.translate(-0.25 * scaleFactor, -0.3 * scaleFactor, 0.0);
  body3.matrix.rotate(0, 0, 1, 0);
  body3.matrix.scale(0.15 * scaleFactor, 0.21 * scaleFactor, 0.35 * scaleFactor);
  body3.render();

  var body4 = new Cube();
  body4.color = [0.58, 0.435, 0.31, 1.0];
  body4.matrix.translate(0.25 * scaleFactor, -0.3 * scaleFactor, 0.0);
  body4.matrix.scale(-0.15 * scaleFactor, 0.21 * scaleFactor, 0.35 * scaleFactor);
  body4.render();

  var body5 = new Cube();
  body5.color = [0.58, 0.435, 0.31, 1.0];
  body5.matrix.translate(0.3 * scaleFactor, -0.09 * scaleFactor, 0.0);
  body5.matrix.scale(-0.15 * scaleFactor, 0.19 * scaleFactor, 0.3 * scaleFactor);
  body5.render();

  var body6 = new Cube();
  body6.color = [0.58, 0.435, 0.31, 1.0];
  body6.matrix.translate(-0.15 * scaleFactor, -0.09 * scaleFactor, 0.0);
  body6.matrix.scale(-0.15 * scaleFactor, 0.19 * scaleFactor, 0.3 * scaleFactor);
  body6.render();

  var body7 = new Cube();
  body7.color = [0.58, 0.435, 0.31, 1.0];
  body7.matrix.translate(-0.1 * scaleFactor, 0.1 * scaleFactor, 0.0);
  body7.matrix.scale(-0.15 * scaleFactor, 0.2 * scaleFactor, 0.3 * scaleFactor);
  body7.render();

  var body8 = new Cube();
  body8.color = [0.58, 0.435, 0.31, 1.0];
  body8.matrix.translate(0.12 * scaleFactor, 0.1 * scaleFactor, 0.0);
  body8.matrix.scale(0.15 * scaleFactor, 0.2 * scaleFactor, 0.3 * scaleFactor);
  body8.render();

  var neck = new Cube();
  neck.color = [0.58, 0.435, 0.31, 1.0];
  neck.matrix.translate(0.2 * scaleFactor, 0.3 * scaleFactor, 0.0);
  neck.matrix.scale(-0.35 * scaleFactor, 0.2 * scaleFactor, 0.3 * scaleFactor);
  neck.render();

  var upperStomach = new Cube();
  upperStomach.color = [1, 1, 1, 1];
  upperStomach.matrix.translate(-0.1 * scaleFactor, 0.1 * scaleFactor, 0.0);
  upperStomach.matrix.scale(0.22 * scaleFactor, 0.2 * scaleFactor, 0.3 * scaleFactor);
  upperStomach.render();

  var stomach = new Cube();
  stomach.color = [1, 1, 1, 1];
  stomach.matrix.translate(-0.1 * scaleFactor, -0.25 * scaleFactor, 0);
  stomach.matrix.scale(0.2 * scaleFactor, 0.17 * scaleFactor, 0.3 * scaleFactor);
  stomach.render();

  var stomach2 = new Cube();
  stomach2.color = [1, 1, 1, 1];
  stomach2.matrix.translate(-0.15 * scaleFactor, -0.09 * scaleFactor, 0);
  stomach2.matrix.scale(0.3 * scaleFactor, 0.19 * scaleFactor, 0.3 * scaleFactor);
  stomach2.render();

  var leftLeg = new Cube();
  leftLeg.color = [0.58, 0.435, 0.31, 1.0];
  leftLeg.matrix.translate(-0.14 * scaleFactor, -0.99 * scaleFactor, 0.1 * scaleFactor);
  leftLeg.matrix.scale(0.12 * scaleFactor, 0.65 * scaleFactor, 0.1 * scaleFactor);
  leftLeg.render();

  var rightLeg = new Cube();
  rightLeg.color = [0.58, 0.435, 0.31, 1.0];
  rightLeg.matrix.translate(0.15 * scaleFactor, -0.99 * scaleFactor, 0.1 * scaleFactor);
  rightLeg.matrix.scale(-0.12 * scaleFactor, 0.65 * scaleFactor, 0.1 * scaleFactor);
  rightLeg.render();

  var leftFoot = new Cube();
  leftFoot.color = [1, 1, 1, 1];
  leftFoot.matrix.translate(-0.29 * scaleFactor, -0.99 * scaleFactor, 0.1 * scaleFactor);
  leftFoot.matrix.scale(0.15 * scaleFactor, 0.1 * scaleFactor, 0.1 * scaleFactor);
  leftFoot.render();

  var rightFoot = new Cube();
  rightFoot.color = [1, 1, 1, 1];
  rightFoot.matrix.translate(0.3 * scaleFactor, -0.99 * scaleFactor, 0.1 * scaleFactor);
  rightFoot.matrix.scale(-0.15 * scaleFactor, 0.1 * scaleFactor, 0.1 * scaleFactor);
  rightFoot.render();

  var leftCheek = new Cube();
  leftCheek.color = [0.714, 0.537, 0.376, 1.0]
  leftCheek.matrix.translate(-0.1 * scaleFactor, 0.25 * scaleFactor, -0.1 * scaleFactor);
  leftCheek.matrix.scale(-0.25 * scaleFactor, 0.15 * scaleFactor, 0.1 * scaleFactor);
  leftCheek.render();

  var leftUpperCheek = new Cube();
  leftUpperCheek.color = [0.714, 0.537, 0.376, 1.0]
  leftUpperCheek.matrix.translate(-0.1 * scaleFactor, 0.4 * scaleFactor, -0.1 * scaleFactor);
  leftUpperCheek.matrix.scale(-0.4 * scaleFactor, 0.14 * scaleFactor, 0.1 * scaleFactor);
  leftUpperCheek.render();

  var rightCheek = new Cube();
  rightCheek.color = [0.714, 0.537, 0.376, 1.0]
  rightCheek.matrix.translate(0.12 * scaleFactor, 0.25 * scaleFactor, -0.1 * scaleFactor);
  rightCheek.matrix.scale(0.25 * scaleFactor, 0.15 * scaleFactor, 0.1 * scaleFactor);
  rightCheek.render();

  var leftUpperRightCheek = new Cube();
  leftUpperRightCheek.color = [0.714, 0.537, 0.376, 1.0]
  leftUpperRightCheek.matrix.translate(0.12 * scaleFactor, 0.4 * scaleFactor, -0.1 * scaleFactor); 
  leftUpperRightCheek.matrix.scale(0.4 * scaleFactor, 0.14 * scaleFactor, 0.1 * scaleFactor); 
  leftUpperRightCheek.render();

  var chin = new Cube();
  chin.color = [0.714, 0.537, 0.376, 1.0]
  chin.matrix.translate(0.12 * scaleFactor, 0.25 * scaleFactor, -0.1 * scaleFactor);
  chin.matrix.scale(-0.22 * scaleFactor, 0.25 * scaleFactor, 0.1 * scaleFactor);
  chin.render();

  var nose = new Cube(); 
  nose.color = [0.4, 0.2, 0.1, 1.0]; 
  nose.matrix.translate(0.12 * scaleFactor, 0.5 * scaleFactor, -0.1 * scaleFactor);
  nose.matrix.scale(-0.22 * scaleFactor, 0.18 * scaleFactor, 0.1 * scaleFactor);
  nose.render();

  var upperface = new Cube(); 
  upperface.color = [0.714, 0.537, 0.376, 1.0]
  upperface.matrix.translate(-0.2 * scaleFactor, 0.54 * scaleFactor, -0.1 * scaleFactor);
  upperface.matrix.scale(-0.22 * scaleFactor, 0.35 * scaleFactor, 0.1 * scaleFactor);
  upperface.render();


  var upperface2 = new Cube(); 
  upperface2.color = [0.714, 0.537, 0.376, 1.0]
  upperface2.matrix.translate(0.22 * scaleFactor, 0.54 * scaleFactor, -0.1 * scaleFactor);
  upperface2.matrix.scale(0.22 * scaleFactor, 0.35 * scaleFactor, 0.1 * scaleFactor);
  upperface2.render();

  var eye1 = new Cube();
  eye1.color = [0.9, 0.8, 0.2, 1.0]; 
  eye1.matrix.translate(0.12 * scaleFactor, 0.54 * scaleFactor, -0.1 * scaleFactor);
  eye1.matrix.scale(0.1 * scaleFactor, 0.138 * scaleFactor, 0.1 * scaleFactor);
  eye1.render();

  var eye2 = new Cube();
  eye2.color = [0.9, 0.8, 0.2, 1.0]; 
  eye2.matrix.translate(-0.1 * scaleFactor, 0.54 * scaleFactor, -0.1 * scaleFactor);
  eye2.matrix.scale(-0.1 * scaleFactor, 0.138 * scaleFactor, 0.1 * scaleFactor);
  eye2.render();


  var forehead = new Cube(); 
  forehead.color = [0.714, 0.537, 0.376, 1.0]
  forehead.matrix.translate(-0.2 * scaleFactor, 0.68 * scaleFactor, -0.1 * scaleFactor);
  forehead.matrix.scale(0.44 * scaleFactor, 0.25 * scaleFactor, 0.1 * scaleFactor);
  forehead.render();

  var skull = new Cube(); 
  skull.color = [0.714, 0.537, 0.376, 1.0]
  skull.matrix.translate(-0.4 * scaleFactor, 0.45 * scaleFactor, 0 * scaleFactor);
  skull.matrix.scale(0.8 * scaleFactor, 0.45 * scaleFactor, 0.4 * scaleFactor);
  skull.render();

  var leftArm = new Cube();
  leftArm.color = [0.58, 0.435, 0.31, 1.0];
  leftArm.matrix.translate(-0.2 * scaleFactor, -0.08 * scaleFactor, 0.1 * scaleFactor);
  leftArm.matrix.rotate(-g_joint_A,0,0,1);
  var jointACoordinate = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(-0.4 * scaleFactor, 0.12 * scaleFactor, 0.1 * scaleFactor);
  leftArm.render();

  var leftForearm = new Cube();
  leftForearm.color = [0.58, 0.435, 0.31, 1.0];
  leftForearm.matrix = jointACoordinate;
  leftForearm.matrix.translate(-0.38 * scaleFactor, 0 * scaleFactor, 0 * scaleFactor);
  leftForearm.matrix.rotate(-g_joint_C,0,0,1);
  var jointCCoordinate = new Matrix4(leftForearm.matrix);
  leftForearm.matrix.scale(-0.3 * scaleFactor, 0.12 * scaleFactor, 0.1 * scaleFactor);
  leftForearm.render();

  var leftWrist = new Cube();
  leftWrist.color = [0.58, 0.435, 0.31, 1.0];
  leftWrist.matrix = jointCCoordinate; 
  leftWrist.matrix.translate(-0.28 * scaleFactor, 0 * scaleFactor, 0 * scaleFactor);
  leftWrist.matrix.rotate(-g_joint_F,0,0,1);
  var jointFCoordinate = new Matrix4(leftWrist.matrix);
  leftWrist.matrix.scale(-0.12 * scaleFactor, 0.12 * scaleFactor, 0.1 * scaleFactor);
  leftWrist.render();

  var leftHand = new Cube(); 
  leftHand.color = [1,1,1, 1.0];
  leftHand.matrix = jointFCoordinate; 
  leftHand.matrix.translate(-0.1215 * scaleFactor, 0 * scaleFactor, 0 * scaleFactor);
  leftHand.matrix.rotate(-g_joint_G,0,0,1);
  leftHand.matrix.scale(-0.12 * scaleFactor, 0.12 * scaleFactor, 0.1 * scaleFactor);
  leftHand.render();


  var rightArm = new Cube();
  rightArm.color = [0.58, 0.435, 0.31, 1.0];
  rightArm.matrix.translate(0.22 * scaleFactor, -0.08 * scaleFactor, 0.1 * scaleFactor);
  rightArm.matrix.rotate(g_joint_B,0,0,1); 
  var jointBCoordinate = new Matrix4(rightArm.matrix);
  rightArm.matrix.scale(0.4 * scaleFactor, 0.12 * scaleFactor, 0.1 * scaleFactor);
  rightArm.render();

  var rightForearm = new Cube();
  rightForearm.color = [0.58, 0.435, 0.31, 1.0];
  rightForearm.matrix = jointBCoordinate;
  rightForearm.matrix.translate(0.38 * scaleFactor, 0 * scaleFactor, 0 * scaleFactor); 
  rightForearm.matrix.rotate(g_joint_D, 0, 0, 1); 
  var jointDCoordinate = new Matrix4(rightForearm.matrix);
  rightForearm.matrix.scale(0.3 * scaleFactor, 0.12 * scaleFactor, 0.1 * scaleFactor); 
  rightForearm.render();

  var redWrist = new Cube();
  redWrist.color = [0.58, 0.435, 0.31, 1.0];
  redWrist.matrix = jointDCoordinate;
  redWrist.matrix.translate(0.35 * scaleFactor, 0 * scaleFactor, 0 * scaleFactor);
  redWrist.matrix.rotate(g_joint_E,0,0,1);
  var jointECoordinate = new Matrix4(redWrist.matrix);
  redWrist.matrix.scale(-0.12 * scaleFactor, 0.12 * scaleFactor, 0.1 * scaleFactor);
  redWrist.render();

  var rightHand = new Cube(); 
  rightHand.color = [1,1,1, 1.0];
  rightHand.matrix = jointECoordinate; 
  rightHand.matrix.translate(0.1215 * scaleFactor, 0 * scaleFactor, 0 * scaleFactor);
  rightHand.matrix.rotate(-g_joint_G,0,0,1);
  var jointE2Coordinate = new Matrix4(rightHand.matrix);
  rightHand.matrix.scale(-0.12 * scaleFactor, 0.12 * scaleFactor, 0.1 * scaleFactor);
  rightHand.render();

  var woodStick = new Cube(); 
  woodStick.color = [0.4, 0.2, 0.1, 1.0]; 
  woodStick.matrix = jointE2Coordinate; 
  woodStick.matrix.translate(-0.1 * scaleFactor, -0.2 * scaleFactor, -0.1 * scaleFactor);
  woodStick.matrix.rotate(-g_joint_G,0,0,1);
  var jointSurrenderCoordinate = new Matrix4(woodStick.matrix);
  woodStick.matrix.scale(-0.12 * scaleFactor, 1.4 * scaleFactor, 0.1 * scaleFactor);
  woodStick.render();

  var surrender = new TriangularPrism(); 
  surrender.matrix = jointSurrenderCoordinate; 
  surrender.matrix.translate(-0.12 * scaleFactor, 1.1 * scaleFactor, -0.01 * scaleFactor);
  surrender.matrix.rotate(-g_joint_G,0,0,1);
  surrender.matrix.scale(1 * scaleFactor, 0.5* scaleFactor, 0.1 * scaleFactor);
  surrender.matrix.rotate(45,0,0,1);
  surrender.render();



  var tail = new TriangularPrism();
  tail.color = [0.85, 0.85, 0.85, 1.0];
  tail.matrix.translate(0.06 * scaleFactor, -0.1 * scaleFactor, 0.35 * scaleFactor); 
  tail.matrix.rotate(90,45,0,1); 
  tail.matrix.scale(-0.1 * scaleFactor, 0.9 * scaleFactor, 0.5 * scaleFactor); 
  tail.render();

  var leftEar = new TriangularPrism();
  leftEar.color = [0.714, 0.537, 0.376, 1.0]
  leftEar.matrix.translate(-0.1 * scaleFactor, 0.9 * scaleFactor, 0.1 * scaleFactor); 
  leftEar.matrix.scale(-0.4 * scaleFactor, 1.7 * scaleFactor, 0.5 * scaleFactor); 
  leftEar.render();

  var rightEar = new TriangularPrism();
  rightEar.color = [0.714, 0.537, 0.376, 1.0]
  rightEar.matrix.translate(0.5 * scaleFactor, 0.9 * scaleFactor, 0.1 * scaleFactor);
  rightEar.matrix.scale(-0.4 * scaleFactor, 1.7 * scaleFactor, 0.5 * scaleFactor); 
  rightEar.render();

  var rightEarPink = new TriangularPrism();
  rightEarPink.color = [1.0, 0.8, 0.8, 1.0];
  rightEarPink.matrix.translate(0.4 * scaleFactor, 0.9 * scaleFactor, 0.09 * scaleFactor);
  rightEarPink.matrix.scale(-0.2 * scaleFactor, 1.4 * scaleFactor, 0.1 * scaleFactor); 
  rightEarPink.matrix.rotate(-10, 0.8, 0, 0); 
  rightEarPink.render();

  var leftEarPink = new TriangularPrism();
  leftEarPink.color = [1.0, 0.8, 0.8, 1.0];
  leftEarPink.matrix.translate(-0.2 * scaleFactor, 0.9 * scaleFactor, 0.092 * scaleFactor); 
  leftEarPink.matrix.scale(-0.2 * scaleFactor, 1.4 * scaleFactor, 0.1 * scaleFactor); 
  leftEarPink.matrix.rotate(-10, 0.8, 0, 0); 
  leftEarPink.render();

  






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


  