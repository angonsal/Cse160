// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV; 
attribute vec3 a_normal; 
varying vec2 v_UV; 
varying vec3 v_Normal; 
varying vec4 v_VertPos; 
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
void main() {
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  v_UV = a_UV; 
  v_Normal = a_normal; 
  v_VertPos = u_ModelMatrix * a_Position; 
}`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV; 
  varying vec3 v_Normal; 
  varying vec4 v_VertPos; 
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2; 
  uniform sampler2D u_Sampler3; 
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;

  uniform int u_whichTexture; 


  
  void main() {
    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }
    else if (u_whichTexture == -2){
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

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

      // Red and Green visual
      // if (r <1.0){
      //    gl_FragColor = vec4(1,0,0,1);
      // } else if (r<2.0){
      //    gl_FragColor = vec4(0,1,0,1);
      // }

      // Light falloff 1/r^2
      // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

      //N dot L
      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N,L), 0.0);

      // Reflection
      vec3 R = reflect(-L,N);

      // eye
      vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

      float specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8;
      vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * 0.7; 
      vec3 ambient = vec3(gl_FragColor) * 0.2;
      if(u_lightOn){
            gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      }
    }`
  

    // Red and Green visual 
    // if (r <1.0){
    //   gl_FragColor = vec4(1,0,0,1); 
    // }
    // else if (r<2.0){
    //   gl_FragColor = vec4(0,1,0,1); 
    // }

    // Light falloff 1/r*2
    // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1); 

  

    // // gl_FragColor = gl_FragColor * nDotL; 
    // // gl_FragColor.a = 1.0; 


  // }`

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
let u_lightPos; 
let u_cameraPos; 
let u_lightOn; 

let g_lightPos = [0,1,-2]; 
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
  image.src = '../resources/sky.jpeg';


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

  a_normal = gl.getAttribLocation(gl.program, 'a_normal');
  if (!a_normal) {
    console.log('Failed to get the storage location of a_normal');
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

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
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
let g_joint_D = 0;
let g_joint_E = 0;
let g_joint_F = 0; 
let g_joint_G = 0; 

let g_animation1 = false; 
let g_animation2 = false; 
let g_animation3 = false; 

let g_normals = false; 
let g_lightOn = true; 


function addActionsHTMLUI(){
  //Joint sliders
  // document.getElementById("jointASlide").addEventListener('mousemove', function() {g_joint_A = this.value; renderScene(); });
  // document.getElementById("jointBSlide").addEventListener('mousemove', function() {g_joint_B = this.value; renderScene(); });

  // Angle Slider 
  document.getElementById("angleSlide").addEventListener('mousemove', function(ev) {g_globalAngle = this.value; renderScene(); });
  document.getElementById("lightSlideX").addEventListener('mousemove', function(ev) {g_lightPos[0]= this.value/100; renderScene(); });
  document.getElementById("lightSlideY").addEventListener('mousemove', function(ev) {g_lightPos[1] = this.value/100; renderScene(); });
  document.getElementById("lightSlideZ").addEventListener('mousemove', function(ev) {g_lightPos[2] = this.value/100; renderScene(); });


   // On and off animation buttons 
  document.getElementById("On").onclick = function() {g_normals = true}; 
  document.getElementById("Off").onclick = function() {g_normals = false};
  document.getElementById("off2").onclick = function() {g_animation3 = false}; 
  document.getElementById("on2").onclick = function() {g_animation3 = true};
  document.getElementById("off3").onclick = function() {g_lightOn = false}; 
  document.getElementById("on3").onclick = function() {g_lightOn = true};

}
  
function main() {

  setupWebGL();
  connectVariablesToGLSL(); 
  addActionsHTMLUI();
  document.onkeydown = keydown; 
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
  if(g_animation2){
    g_joint_B = (45*Math.sin(g_seconds));
  }
  if(g_animation3){
    g_lightPos[0]=2.3*Math.cos(g_seconds); 
  }
}

var lastX = null; 
var lastY = null; 
var camera = true; 
var mouseDown = false;
var camcoordX = 0;
var camcoordY = 0;


// let cameraX = 0;
// let cameraZ = 0;
//viewMat.setLookAt(0,1,-6, 0,0,0, 0,1,0);
var g_eye =[0,1,-6]; 
var g_at = [0,0,-100]; 
var g_up = [0,1,0]; 

function keydown(ev){
  if(ev.key === "ArrowRight") { 
    g_eye[0] += 0.1; 
  } else if(ev.key === "ArrowLeft"){
    g_eye[0] -= 0.1; 
  }
  renderScene(); 
  console.log(ev.key); 
}


function handleMouseDown(event) {
  if (!camera){
    return;
  }
  
  mouseDown = true;
  lastX = event.clientX;
  lastY = event.clientY;
}

function handleMouseUp(event) {
  mouseDown = false;
}

function handleMouseMove(event) {

// edit: fixed logic ; next time i have to remmeber to be clearer with var names lol
  if (!mouseDown) {

    return;   
  }
  var x = event.clientX;
  var y = event.clientY;

  var x1 = x - lastX;
  var y1 = y - lastY;

  // 3 or 4 is best ? 
  camcoordX -= x1 / 3; 
  camcoordY -= y1 / 3; 

  lastX = x;
  lastY = y;

  renderScene(); 
}

function call() {
  canvas.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mousemove', handleMouseMove);
}

var g_camera = new Camera(); 
var eye = g_camera.eye;
var at = g_camera.at;
var up = g_camera.up;

function renderScene(){
  
  var startTime = performance.now();

  var viewMat = new Matrix4();
  viewMat.setLookAt(eye.elements[0], eye.elements[1], eye.elements[2], at.elements[0], at.elements[1], at.elements[2], up.elements[0], up.elements[1], up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var projMat = new Matrix4(); 
  projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0); 
  globalRotMat.rotate(camcoordY, 1, 0, 0); 
  globalRotMat.rotate(camcoordX, 0, 1, 0);
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
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]); 
  gl.uniform3f(u_cameraPos, eye[0], eye[1], eye[2]); 
  gl.uniform1i(u_lightOn, g_lightOn); 

  var light = new Cube(); 
  light.color = [2,2,0,1]; 
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]); 
  light.matrix.scale(-.1, -.1, -.1); 
  light.matrix.translate(-0.5, -0.5, -0.5); 
  light.render(); 
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
  skybox.color = [0.4, 0.4, 0.4, 1.0]; 
  skybox.textureNum=1;  
  if (g_normals){
    skybox.textureNum = -3; 
  }
  skybox.matrix.scale(-10, -10, -10); 
  skybox.matrix.translate(-.5, -.5, -.5);
  skybox.render();

  var box = new Cube(); 
  box.color = [1,0,1,1]; 
  box.textureNum = 2; 
  if (g_normals){
    box.textureNum = -3; 
  }
  box.matrix.translate(3.75, .65, 4); 
  // box.matrix.rotate(0, 0, 0, 1); 
  box.matrix.scale(0.3, 0.3, 0.3); 
  box.matrix.translate(0.6, -4.65, -0.2); 
  box.render();

  var box1 = new Cube(); 
  box1.color = [1,0,1,1];
  box1.textureNum = 2; 
  if (g_normals){
    box1.textureNum = -3; 
  }
  box1.matrix.translate(3, .65, 3);  
  // box.matrix.rotate(0, 0, 0, 1); 
  box1.matrix.scale(0.3, 0.2, 0.3); 
  box1.matrix.translate(1.4, -4.65, 3); 
  box1.render();

  var box2 = new Cube(); 
  box2.color = [0.8,0.7,0.6,1]; 
  box2.textureNum = 2; 
  if (g_normals){
    box2.textureNum = -3; 
  }
  box2.matrix.translate(0, .65, 0); 
  // box.matrix.rotate(0, 0, 0, 1); 
  box2.matrix.scale(0.3, 0.2, 0.3); 
  box2.matrix.translate(-0.5, -6.9, -0.2); 
  box2.render();
  
  var sun = new Sphere(); 
  sun.textureNum = 3;
  if (g_normals){
    sun.textureNum = -3; 
  }
  // console.log("Light: ", g_lightOn);
  sun.matrix.translate(-2, 1.5, 3); 
  sun.render();

  var box3 = new Cube(); 
  box3.color = [0.8,0.7,0.6,1]; 
  box3.textureNum = 2; 
  if (g_normals){
    box3.textureNum = -3; 
  }
  box3.matrix.translate(0, .65, 0); 
  // box.matrix.rotate(0, 0, 0, 1); 
  box3.matrix.scale(0.3, 0.2, 0.3); 
  box3.matrix.translate(-1.55, -6.9, -0.2); 
  box3.render();

  var box4 = new Cube(); 
  box4.color = [0.8,0.7,0.6,1]; 
  box4.textureNum = 2; 
  if (g_normals){
    box4.textureNum = -3; 
  }
  box4.matrix.translate(0, .65, 0); 
  // box.matrix.rotate(0, 0, 0, 1); 
  box4.matrix.scale(0.3, 0.2, 0.3); 
  box4.matrix.translate(-2.6, -6.9, -0.2); 
  box4.render();


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

  var surrender = new Pyramid(); 
  surrender.matrix = jointSurrenderCoordinate; 
  surrender.matrix.translate(-0.12 * scaleFactor, 1.1 * scaleFactor, -0.01 * scaleFactor);
  surrender.matrix.rotate(-g_joint_G,0,0,1);
  surrender.matrix.scale(1 * scaleFactor, 0.5* scaleFactor, 0.1 * scaleFactor);
  surrender.matrix.rotate(45,0,0,1);
  surrender.render();


  var tail = new Pyramid();
  tail.color = [0.85, 0.85, 0.85, 1.0];
  tail.matrix.translate(0.06 * scaleFactor, -0.1 * scaleFactor, 0.35 * scaleFactor); 
  tail.matrix.rotate(90,45,0,1); 
  tail.matrix.scale(-0.1 * scaleFactor, 0.9 * scaleFactor, 0.5 * scaleFactor); 
  tail.render();

  var leftEar = new Pyramid();
 
  leftEar.color = [0.714, 0.537, 0.376, 1.0]
  leftEar.matrix.translate(-0.1 * scaleFactor, 0.90 * scaleFactor, 0.1 * scaleFactor); 
  leftEar.matrix.scale(-0.4 * scaleFactor, 1.7 * scaleFactor, 0.5 * scaleFactor); 
  leftEar.render();

  var rightEar = new Pyramid();
 
  rightEar.color = [0.714, 0.537, 0.376, 1.0]
  rightEar.matrix.translate(0.5 * scaleFactor, 0.90 * scaleFactor, 0.1 * scaleFactor);
  rightEar.matrix.scale(-0.4 * scaleFactor, 1.7 * scaleFactor, 0.5 * scaleFactor); 
  rightEar.render();

  var rightEarPink = new Pyramid();
  
  rightEarPink.color = [1.0, 0.8, 0.8, 1.0];
  rightEarPink.matrix.translate(0.4 * scaleFactor, 0.90 * scaleFactor, 0.09 * scaleFactor);
  rightEarPink.matrix.scale(-0.2 * scaleFactor, 1.4 * scaleFactor, 0.1 * scaleFactor); 
  rightEarPink.matrix.rotate(-10, 0.8, 0, 0); 
  rightEarPink.render();

  var leftEarPink = new Pyramid();
  
  leftEarPink.color = [1.0, 0.8, 0.8, 1.0];
  leftEarPink.matrix.translate(-0.2 * scaleFactor, 0.90 * scaleFactor, 0.092 * scaleFactor); 
  leftEarPink.matrix.scale(-0.2 * scaleFactor, 1.4 * scaleFactor, 0.1 * scaleFactor); 
  leftEarPink.matrix.rotate(-10, 0.8, 0, 0); 
  leftEarPink.render();


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


  