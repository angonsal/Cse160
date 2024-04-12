// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_size;
  void main() {
    gl_Position = a_Position;
    // gl_PointSize = 30.0;
    gl_PointSize = u_size;
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
let u_size;

function setupWebGL() {
    // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  
    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
    }
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

  u_size = gl.getUniformLocation(gl.program, 'u_size');
  if (!u_size) {
    console.log('Failed to get the storage location of u_size');
    return;
  }
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

function addActionsHTMLUI(){
  //Button
  document.getElementById("green").onclick = function() {g_selectedColor = [0.0, 1.0, 0.0, 1.0];};
  document.getElementById("red").onclick = function() {g_selectedColor = [1.0, 0.0, 0.0, 1.0];};
  document.getElementById("clear").onclick = function() {g_shapesList = []; renderAllShapes();};

  document.getElementById("point").onclick = function() {g_selectedType = POINT;};
  document.getElementById("triangle").onclick = function() {g_selectedType = TRIANGLE;};
  document.getElementById("circle").onclick = function() {g_selectedType = CIRCLE;};

  document.getElementById("drawing").onclick = function() {butterfly()};


  //Slider
  document.getElementById("redSlide").addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
  document.getElementById("greenSlide").addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
  document.getElementById("blueSlide").addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});
  document.getElementById("sizeSlide").addEventListener('mouseup', function() {g_SelectedSize = this.value;});
  document.getElementById("segmentSlide").addEventListener('mouseup', function() {g_selectedSegment = this.value;});

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
  gl.clear(gl.COLOR_BUFFER_BIT);
}

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = []; // The array to store the size of the point

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

  // let point = new Triangle(); 
  // g_points.push([x,y]);
  // g_colors.push(g_selectedColor.slice());
  // g_sizes.push(g_SelectedSize);

  point.position = [x,y]; 
  point.color = g_selectedColor.slice(); 
  point.size = g_SelectedSize; 
  g_shapesList.push(point); 
  
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  renderAllShapes(); 

}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
  
}

function renderAllShapes(){
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {

    g_shapesList[i].render(); 
    
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID); 
  if (!htmlID){
    console.log("Failed to get " + htmlID + "from HTML"); 
    return; 
  }
  htmlElm.innerHTML = text; 
}

function butterfly(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_shapesList=[];

    // LAVENDER
    tipWingTriangles = [-1,0.8, -0.7, 1, -0.4, 0.8];
    tipWingTriangles2 = [1, 0.8, 0.7, 1, 0.4, 0.8];
    g_shapesList.push(tipWingTriangles);
    g_shapesList.push(tipWingTriangles2);

    for(var i = 0; i < 2; i++){
        gl.uniform4f(u_FragColor, 0.714, 0.643, 0.882, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    // BABY BLUE
    TopsideA = [-1, 0.8, -0.8, 0.65, -1, 0.65];
    TopsideB = [1, 0.8, 0.8, 0.65, 1, 0.65];
    g_shapesList.push(TopsideA);
    g_shapesList.push(TopsideB);

    for(var i = 2; i < 4; i++){
        gl.uniform4f(u_FragColor, 0.537, 0.812, 0.941, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    // PASTEL GREEN
    TopA = [-0.22, 0.21, -0.4, 0.8, -1,0.8];
    TopB = [0.22, 0.21, 0.4, 0.8, 1, 0.8];
    g_shapesList.push(TopA);
    g_shapesList.push(TopB);

    for(var i = 4; i < 6; i++){
        gl.uniform4f(u_FragColor, 0.6, 0.8, 0.6, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    // PASTEL ORANGE
    TopMiniA = [-0.83, 0.46, -1, 0.65, -0.8, 0.65];
    TopMiniB = [0.83, 0.46, 1, 0.65, 0.8, 0.65];
    g_shapesList.push(TopMiniA);
    g_shapesList.push(TopMiniB);

    for(var i = 6; i < 8; i++){
        gl.uniform4f(u_FragColor, 1.0, 0.7, 0.5, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //PASTEL YELLOW
    longBoi1 = [-0.83, 0.46, -0.22, 0.21, -0.8, 0.65]; 
    longBoi2 = [0.83, 0.46, 0.22, 0.21, 0.8, 0.65]
    g_shapesList.push(longBoi1);
    g_shapesList.push(longBoi2);
    for(var i = 8; i < 10; i++){
        gl.uniform4f(u_FragColor, 1.0, 1.0, 0.8, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //ROYAL BLUE
    bottom1 = [-0.83, 0.46, -1, 0.4, -0.83, 0.18];
    bottom2 = [0.83, 0.46, 1, 0.4, 0.83, 0.18];
    g_shapesList.push(bottom1);
    g_shapesList.push(bottom2);
    for(var i = 10; i < 12; i++){
        gl.uniform4f(u_FragColor, 0.25, 0.41, 0.88, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    bottomLong = [-1, 0.4, -1, -0.2, -0.3, -0.5]; 
    g_shapesList.push(bottomLong);
    for(var i = 12; i < 14; i++){
        gl.uniform4f(u_FragColor, 1.0, 0.8, 0.6, 1.0);
        drawTriangle(g_shapesList[i]);
    }










}


 





  