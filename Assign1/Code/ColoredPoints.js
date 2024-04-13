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
  // document.getElementById("green").onclick = function() {g_selectedColor = [0.0, 1.0, 0.0, 1.0];};
  // document.getElementById("red").onclick = function() {g_selectedColor = [1.0, 0.0, 0.0, 1.0];};
  document.getElementById("clear").onclick = function() {g_shapesList = []; renderAllShapes();};

  document.getElementById("point").onclick = function() {g_selectedType = POINT;};
  document.getElementById("triangle").onclick = function() {g_selectedType = TRIANGLE;};
  document.getElementById("circle").onclick = function() {g_selectedType = CIRCLE;};

  //FOR DRAWING
  document.getElementById("drawing").onclick = function() {butterfly()};
  // document.getElementById("start").onclick = function() {dino()};

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
  // sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
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

    //WINGS
    // LAVENDER
    wingA = [-1,0.8, -0.7, 1, -0.4, 0.8];
    wingB = [1, 0.8, 0.7, 1, 0.4, 0.8];
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);

    for(var i = 0; i < 2; i++){
        gl.uniform4f(u_FragColor, 0.714, 0.643, 0.882, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    // PASTEL ORANGE
    wingA = [-1, 0.8, -0.8, 0.65, -1, 0.65];
    wingB = [1, 0.8, 0.8, 0.65, 1, 0.65];
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);

    for(var i = 2; i < 4; i++){
        gl.uniform4f(u_FragColor, 1.0, 0.7, 0.5, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    // PASTEL GREEN
    wingA = [-0.22, 0.21, -0.4, 0.8, -1,0.8];
    wingB = [0.22, 0.21, 0.4, 0.8, 1, 0.8];
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);

    for(var i = 4; i < 6; i++){
        gl.uniform4f(u_FragColor, 0.6, 0.8, 0.6, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    // BABY BLUE
    wingA = [-0.83, 0.46, -1, 0.65, -0.8, 0.65];
    wingB = [0.83, 0.46, 1, 0.65, 0.8, 0.65];
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);

    for(var i = 6; i < 8; i++){
        gl.uniform4f(u_FragColor, 0.537, 0.812, 0.941, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //PASTEL YELLOW
    wingA = [-0.83, 0.46, -0.22, 0.21, -0.8, 0.65]; 
    wingB = [0.83, 0.46, 0.22, 0.21, 0.8, 0.65]
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);
    for(var i = 8; i < 10; i++){
        gl.uniform4f(u_FragColor, 1.0, 1.0, 0.8, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //ROYAL BLUE
    wingA = [-0.83, 0.46, -1, 0.4, -0.83, 0.18];
    wingB = [0.83, 0.46, 1, 0.4, 0.83, 0.18];
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);
    for(var i = 10; i < 12; i++){
        gl.uniform4f(u_FragColor, 0.25, 0.41, 0.88, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //PEACH
    wingA = [-1, 0.4, -1, -0.2, -0.3, -0.5]; 
    wingB = [1, 0.4, 1, -0.2, 0.3, -0.5];
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);

    for(var i = 12; i < 14; i++){
        gl.uniform4f(u_FragColor, 1.0, 0.8, 0.6, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //STRAWBERRY 
    wingA = [-0.83, 0.46, -0.83, 0.18, -0.22, 0.21];
    wingB = [0.83, 0.46, 0.83, 0.18, 0.22, 0.21];
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);
    for(var i = 14; i < 16; i++){
        gl.uniform4f(u_FragColor, 1.0, 0.4, 0.4, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //VIOLET 
    wingA = [-0.83, 0.18, -0.22, 0.21, -0.3, -0.5];
    wingB = [0.83, 0.18, 0.22, 0.21, 0.3, -0.5];
    g_shapesList.push(wingA);
    g_shapesList.push(wingB);
    for(var i = 16; i < 18; i++){
        gl.uniform4f(u_FragColor, 0.6, 0.4, 0.8, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //BODY
    // SHADES OF BROWN BROWN
    bottom = [-0.22, 0.21, 0.22, 0.21, 0, -0.1];
    g_shapesList.push(bottom);
    for(var i = 18; i < 19; i++){
        gl.uniform4f(u_FragColor, 0.7, 0.5, 0.3, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    face = [-0.22, 0.45, 0.22, 0.45, 0, 0.8];
    g_shapesList.push(face);
    for(var i = 19; i < 20; i++){
        gl.uniform4f(u_FragColor, 0.4, 0.2, 0.1, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    lefHalf = [-0.22, 0.45, -0.22, 0.21, 0.22, 0.21]; 
    g_shapesList.push(lefHalf);
    for(var i = 20; i < 21; i++){
        gl.uniform4f(u_FragColor, 0.545, 0.271, 0.075, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    rightHald = [-0.22, 0.45, 0.22, 0.45, 0.22, 0.21]; 
    g_shapesList.push(rightHald);
    for(var i = 21; i < 22; i++){
        gl.uniform4f(u_FragColor, 0.6, 0.4, 0.2, 1.0);
        drawTriangle(g_shapesList[i]);
    }

    //WING TAIL 
    // GRAPE COLOR

    wingTipA = [-0.3, -0.5, -0.5, -0.41, -0.5, -0.8 ]; 
    wingTipB = [0.3, -0.5, 0.5, -0.41, 0.5, -0.8];
    g_shapesList.push(wingTipA);
    g_shapesList.push(wingTipB);
    for(var i = 22; i < 24; i++){
       gl.uniform4f(u_FragColor, 0.31, 0.18, 0.31, 1.0);
        drawTriangle(g_shapesList[i]);
    }



}


 





  