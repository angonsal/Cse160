//https://rodger.global-linguist.com/webgl/ch10/OBJViewer.html

//------------------------------------------------------------------------------
// OBJParser
//------------------------------------------------------------------------------

// OBJDoc object
// Constructor
var OBJDoc = function(fileName) {
    this.fileName = fileName;
    this.mtls = new Array(0);      // Initialize the property for MTL
    this.objects = new Array(0);   // Initialize the property for Object
    this.vertices = new Array(0);  // Initialize the property for Vertex
    this.normals = new Array(0);   // Initialize the property for Normal
  }
  
  // Parsing the OBJ file
  OBJDoc.prototype.parse = function(fileString, scale, reverse) {
    var lines = fileString.split('\n');  // Break up into lines and store them as array
    lines.push(null); // Append null
    var index = 0;    // Initialize index of line
  
    var currentObject = null;
    var currentMaterialName = "";
    
    // Parse line by line
    var line;         // A string in the line to be parsed
    var sp = new StringParser();  // Create StringParser
    while ((line = lines[index++]) != null) {
      sp.init(line);                  // init StringParser
      var command = sp.getWord();     // Get command
      if(command == null)	 continue;  // check null command
  
      switch(command){
      case '#':
        continue;  // Skip comments
      case 'mtllib':     // Read Material chunk
        var path = this.parseMtllib(sp, this.fileName);
        var mtl = new MTLDoc();   // Create MTL instance
        this.mtls.push(mtl);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
          if (request.readyState == 4) {
            if (request.status != 404) {
              onReadMTLFile(request.responseText, mtl);
            }else{
              mtl.complete = true;
            }
          }
        }
        request.open('GET', path, true);  // Create a request to acquire the file
        request.send();                   // Send the request
        continue; // Go to the next line
      case 'o':
      case 'g':   // Read Object name
        var object = this.parseObjectName(sp);
        this.objects.push(object);
        currentObject = object;
        continue; // Go to the next line
      case 'v':   // Read vertex
        var vertex = this.parseVertex(sp, scale);
        this.vertices.push(vertex); 
        continue; // Go to the next line
      case 'vn':   // Read normal
        var normal = this.parseNormal(sp);
        this.normals.push(normal); 
        continue; // Go to the next line
      case 'usemtl': // Read Material name
        currentMaterialName = this.parseUsemtl(sp);
        continue; // Go to the next line
      case 'f': // Read face
        var face = this.parseFace(sp, currentMaterialName, this.vertices, reverse);
        currentObject.addFace(face);
        continue; // Go to the next line
      }
    }
  
    return true;
  }
  
  OBJDoc.prototype.parseMtllib = function(sp, fileName) {
    // Get directory path
    var i = fileName.lastIndexOf("/");
    var dirPath = "";
    if(i > 0) dirPath = fileName.substr(0, i+1);
  
    return dirPath + sp.getWord();   // Get path
  }
  
  OBJDoc.prototype.parseObjectName = function(sp) {
    var name = sp.getWord();
    return (new OBJObject(name));
  }
  
  OBJDoc.prototype.parseVertex = function(sp, scale) {
    var x = sp.getFloat() * scale;
    var y = sp.getFloat() * scale;
    var z = sp.getFloat() * scale;
    return (new Vertex(x, y, z));
  }
  
  OBJDoc.prototype.parseNormal = function(sp) {
    var x = sp.getFloat();
    var y = sp.getFloat();
    var z = sp.getFloat();
    return (new Normal(x, y, z));
  }
  
  OBJDoc.prototype.parseUsemtl = function(sp) {
    return sp.getWord();
  }
  
  OBJDoc.prototype.parseFace = function(sp, materialName, vertices, reverse) {  
    var face = new Face(materialName);
    // get indices
    for(;;){
      var word = sp.getWord();
      if(word == null) break;
      var subWords = word.split('/');
      if(subWords.length >= 1){
        var vi = parseInt(subWords[0]) - 1;
        face.vIndices.push(vi);
      }
      if(subWords.length >= 3){
        var ni = parseInt(subWords[2]) - 1;
        face.nIndices.push(ni);
      }else{
        face.nIndices.push(-1);
      }
    }
  
    // calc normal
    var v0 = [
      vertices[face.vIndices[0]].x,
      vertices[face.vIndices[0]].y,
      vertices[face.vIndices[0]].z];
    var v1 = [
      vertices[face.vIndices[1]].x,
      vertices[face.vIndices[1]].y,
      vertices[face.vIndices[1]].z];
    var v2 = [
      vertices[face.vIndices[2]].x,
      vertices[face.vIndices[2]].y,
      vertices[face.vIndices[2]].z];
  
    // 面の法線を計算してnormalに設定
    var normal = calcNormal(v0, v1, v2);
    // 法線が正しく求められたか調べる
    if (normal == null) {
      if (face.vIndices.length >= 4) { // 面が四角形なら別の3点の組み合わせで法線計算
        var v3 = [
          vertices[face.vIndices[3]].x,
          vertices[face.vIndices[3]].y,
          vertices[face.vIndices[3]].z];
        normal = calcNormal(v1, v2, v3);
      }
      if(normal == null){         // 法線が求められなかったのでY軸方向の法線とする
        normal = [0.0, 1.0, 0.0];
      }
    }
    if(reverse){
      normal[0] = -normal[0];
      normal[1] = -normal[1];
      normal[2] = -normal[2];
    }
    face.normal = new Normal(normal[0], normal[1], normal[2]);
  
    // Devide to triangles if face contains over 3 points.
    if(face.vIndices.length > 3){
      var n = face.vIndices.length - 2;
      var newVIndices = new Array(n * 3);
      var newNIndices = new Array(n * 3);
      for(var i=0; i<n; i++){
        newVIndices[i * 3 + 0] = face.vIndices[0];
        newVIndices[i * 3 + 1] = face.vIndices[i + 1];
        newVIndices[i * 3 + 2] = face.vIndices[i + 2];
        newNIndices[i * 3 + 0] = face.nIndices[0];
        newNIndices[i * 3 + 1] = face.nIndices[i + 1];
        newNIndices[i * 3 + 2] = face.nIndices[i + 2];
      }
      face.vIndices = newVIndices;
      face.nIndices = newNIndices;
    }
    face.numIndices = face.vIndices.length;
  
    return face;
  }
  
  // Analyze the material file
  function onReadMTLFile(fileString, mtl) {
    var lines = fileString.split('\n');  // Break up into lines and store them as array
    lines.push(null);           // Append null
    var index = 0;              // Initialize index of line
  
    // Parse line by line
    var line;      // A string in the line to be parsed
    var name = ""; // Material name
    var sp = new StringParser();  // Create StringParser
    while ((line = lines[index++]) != null) {
      sp.init(line);                  // init StringParser
      var command = sp.getWord();     // Get command
      if(command == null)	 continue;  // check null command
  
      switch(command){
      case '#':
        continue;    // Skip comments
      case 'newmtl': // Read Material chunk
        name = mtl.parseNewmtl(sp);    // Get name
        continue; // Go to the next line
      case 'Kd':   // Read normal
        if(name == "") continue; // Go to the next line because of Error
        var material = mtl.parseRGB(sp, name);
        mtl.materials.push(material);
        name = "";
        continue; // Go to the next line
      }
    }
    mtl.complete = true;
  }
  
  // Check Materials
  OBJDoc.prototype.isMTLComplete = function() {
    if(this.mtls.length == 0) return true;
    for(var i = 0; i < this.mtls.length; i++){
      if(!this.mtls[i].complete) return false;
    }
    return true;
  }
  
  // Find color by material name
  OBJDoc.prototype.findColor = function(name){
    for(var i = 0; i < this.mtls.length; i++){
      for(var j = 0; j < this.mtls[i].materials.length; j++){
        if(this.mtls[i].materials[j].name == name){
          return(this.mtls[i].materials[j].color)
        }
      }
    }
    return(new Color(0.8, 0.8, 0.8, 1));
  }
  
  //------------------------------------------------------------------------------
  // Retrieve the information for drawing 3D model
  OBJDoc.prototype.getDrawingInfo = function() {
    // Create an arrays for vertex coordinates, normals, colors, and indices
    var numIndices = 0;
    for(var i = 0; i < this.objects.length; i++){
      numIndices += this.objects[i].numIndices;
    }
    var numVertices = numIndices;
    var vertices = new Float32Array(numVertices * 3);
    var normals = new Float32Array(numVertices * 3);
    var colors = new Float32Array(numVertices * 4);
    var indices = new Uint16Array(numIndices);
  
    // Set vertex, normal and color
    var index_indices = 0;
    for(var i = 0; i < this.objects.length; i++){
      var object = this.objects[i];
      for(var j = 0; j < object.faces.length; j++){
        var face = object.faces[j];
        var color = this.findColor(face.materialName);
        var faceNormal = face.normal;
        for(var k = 0; k < face.vIndices.length; k++){
          // Set index
          indices[index_indices] = index_indices;
          // Copy vertex
          var vIdx = face.vIndices[k];
          var vertex = this.vertices[vIdx];
          vertices[index_indices * 3 + 0] = vertex.x;
          vertices[index_indices * 3 + 1] = vertex.y;
          vertices[index_indices * 3 + 2] = vertex.z;
          // Copy color
          colors[index_indices * 4 + 0] = color.r;
          colors[index_indices * 4 + 1] = color.g;
          colors[index_indices * 4 + 2] = color.b;
          colors[index_indices * 4 + 3] = color.a;
          // Copy normal
          var nIdx = face.nIndices[k];
          if(nIdx >= 0){
            var normal = this.normals[nIdx];
            normals[index_indices * 3 + 0] = normal.x;
            normals[index_indices * 3 + 1] = normal.y;
            normals[index_indices * 3 + 2] = normal.z;
          }else{
            normals[index_indices * 3 + 0] = faceNormal.x;
            normals[index_indices * 3 + 1] = faceNormal.y;
            normals[index_indices * 3 + 2] = faceNormal.z;
          }
          index_indices ++;
        }
      }
    }
  
    return new DrawingInfo(vertices, normals, colors, indices);
  }
  
  //------------------------------------------------------------------------------
  // MTLDoc Object
  //------------------------------------------------------------------------------
  var MTLDoc = function() {
    this.complete = false; // MTL is configured correctly
    this.materials = new Array(0);
  }
  
  MTLDoc.prototype.parseNewmtl = function(sp) {
    return sp.getWord();         // Get name
  }
  
  MTLDoc.prototype.parseRGB = function(sp, name) {
    var r = sp.getFloat();
    var g = sp.getFloat();
    var b = sp.getFloat();
    return (new Material(name, r, g, b, 1));
  }
  
  //------------------------------------------------------------------------------
  // Material Object
  //------------------------------------------------------------------------------
  var Material = function(name, r, g, b, a) {
    this.name = name;
    this.color = new Color(r, g, b, a);
  }
  
  //------------------------------------------------------------------------------
  // Vertex Object
  //------------------------------------------------------------------------------
  var Vertex = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  //------------------------------------------------------------------------------
  // Normal Object
  //------------------------------------------------------------------------------
  var Normal = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  //------------------------------------------------------------------------------
  // Color Object
  //------------------------------------------------------------------------------
  var Color = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  
  //------------------------------------------------------------------------------
  // OBJObject Object
  //------------------------------------------------------------------------------
  var OBJObject = function(name) {
    this.name = name;
    this.faces = new Array(0);
    this.numIndices = 0;
  }
  
  OBJObject.prototype.addFace = function(face) {
    this.faces.push(face);
    this.numIndices += face.numIndices;
  }
  
  //------------------------------------------------------------------------------
  // Face Object
  //------------------------------------------------------------------------------
  var Face = function(materialName) {
    this.materialName = materialName;
    if(materialName == null)  this.materialName = "";
    this.vIndices = new Array(0);
    this.nIndices = new Array(0);
  }
  
  //------------------------------------------------------------------------------
  // DrawInfo Object
  //------------------------------------------------------------------------------
  var DrawingInfo = function(vertices, normals, colors, indices) {
    this.vertices = vertices;
    this.normals = normals;
    this.colors = colors;
    this.indices = indices;
  }
  
  //------------------------------------------------------------------------------
  // Constructor
  var StringParser = function(str) {
    this.str;   // Store the string specified by the argument
    this.index; // Position in the string to be processed
    this.init(str);
  }
  // Initialize StringParser object
  StringParser.prototype.init = function(str){
    this.str = str;
    this.index = 0;
  }
  
  // Skip delimiters
  StringParser.prototype.skipDelimiters = function()  {
    for(var i = this.index, len = this.str.length; i < len; i++){
      var c = this.str.charAt(i);
      // Skip TAB, Space, '(', ')
      if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"') continue;
      break;
    }
    this.index = i;
  }
  
  // Skip to the next word
  StringParser.prototype.skipToNextWord = function() {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    this.index += (n + 1);
  }
  
  // Get word
  StringParser.prototype.getWord = function() {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    if (n == 0) return null;
    var word = this.str.substr(this.index, n);
    this.index += (n + 1);
  
    return word;
  }
  
  // Get integer
  StringParser.prototype.getInt = function() {
    return parseInt(this.getWord());
  }
  
  // Get floating number
  StringParser.prototype.getFloat = function() {
    return parseFloat(this.getWord());
  }
  
  // Get the length of word
  function getWordLength(str, start) {
    var n = 0;
    for(var i = start, len = str.length; i < len; i++){
      var c = str.charAt(i);
      if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"') 
      break;
    }
    return i - start;
  }
  
  //------------------------------------------------------------------------------
  // Common function
  //------------------------------------------------------------------------------
  function calcNormal(p0, p1, p2) {
    // v0: a vector from p1 to p0, v1; a vector from p1 to p2
    var v0 = new Float32Array(3);
    var v1 = new Float32Array(3);
    for (var i = 0; i < 3; i++){
      v0[i] = p0[i] - p1[i];
      v1[i] = p2[i] - p1[i];
    }
  
    // The cross product of v0 and v1
    var c = new Float32Array(3);
    c[0] = v0[1] * v1[2] - v0[2] * v1[1];
    c[1] = v0[2] * v1[0] - v0[0] * v1[2];
    c[2] = v0[0] * v1[1] - v0[1] * v1[0];
  
    // Normalize the result
    var v = new Vector3(c);
    v.normalize();
    return v.elements;
  }
  

//   class Mesh{
//     constructor(){
//       this.type = "Mesh"
//       this.matName = ""
//       this.color = [1.0,0.0,0.0,1.0];
//       this.matrix = new Matrix4();
  
  
//       this.verts = [];
//       this.buffer = null;
  
//     }
  
//     render(){
//       //how was the fall??????
//       var rgba = this.color;
  
//       gl.uniform4f(u_FragColor, rgba[0]*4, rgba[1]*4, rgba[2]*4, rgba[3]);
  
//       if (this.buffer === null) {
//         this.buffer = gl.createBuffer();
//         if (!this.buffer) {
//           console.log("Failed to create the buffer object");
//           return -1;
//         }
//       }
  
//       //the following method is from lab2 but to work with the full mesh
//       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)
  
//       gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  
//       let vert_to_buffer = new Float32Array(this.verts)
  
//       gl.bufferData(gl.ARRAY_BUFFER, vert_to_buffer, gl.DYNAMIC_DRAW);
  
//       gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
//       gl.enableVertexAttribArray(a_Position);
  
//       gl.drawArrays(gl.TRIANGLES, 0, vert_to_buffer.length/3);
  
  
//     }
  
//   }
  
// let tail1 =  new Custom("./Objs/low_poly_raccoon_tail_1.obj", "./Objs/low_poly_raccoon_tail_1.mtl");

  
//   class Custom{
//       constructor(OBJ_file_path, MTL_file_path){
//         this.type = "Custom";
//         //this.color = [1.0,0.0,0.0,1.0];
//         this.matrix = new Matrix4();
  
//         this.finished_parsing_obj = false;
//         this.finished_parsing_mtl = false;
//         this.finished_making_objs = false;
  
//         this.verts = [];
//         this.mats = {};
//         this.faces = {};
  
//         this.meshs = [];
  
//         this.vertexBuffer;
//         this.elemntBuffer;
  
//         //this.objFile = getFile(OBJ_file_path);
//         //this.mFile = getFile(MTL_file_path);
  
//         //[each_material [each_vert[x,y,z]]]
//         //let mesh = []
  
//         //[mat[r,g,b]]
//         //let mats = []
          
//         //push this to mesh after hitting a new material
//         // [vert[x,y,z]]
//         //let verts = []
  
//         //make file reader object
//         //var file_reader = new FileReader();
  
//         //read files
  
//         fetch(OBJ_file_path)//grab file
//         .then(file => file.text())//convert to text
//         .then(content => { this.generate_mesh(content.split('\n')) })//split it by lines and generate mesh
//         .catch(error => {console.log("Could not retrieve obj due to: " + error)})//something really failed
  
//         //same thing for this bit but with the mtl file and generat
//         fetch(MTL_file_path)
//         .then(file => file.text())
//         .then(content => { this.generate_mats(content.split('\n')) })
//         .catch(error => {console.log("Could not retrieve obj due to: " + error)})
  
//         //console.log("is this waiting for the above to finish??") // it was not
  
  
  
//       }
  
//       generate_mesh(lines) { //parse the obj file into usable data
//         //console.log(lines);
//         let current_mat = null;
  
//         for (let i = 0; i < lines.length; i++) {
//           let element = lines[i];
//           element = element.split(' ');
//           //console.log(element)
          
//           switch (element[0]) {
//             case "v":
//               this.verts.push(parseFloat(element[1]));
//               this.verts.push(parseFloat(element[2]));
//               this.verts.push(parseFloat(element[3]));
//               break;
//             case "usemtl":
//               current_mat = element[1];
//               this.faces[current_mat] = [];
//               break;
//             case "f": //push faces to 
//               this.faces[current_mat].push(parseFloat(element[1])-1);
//               this.faces[current_mat].push(parseFloat(element[2])-1);
//               this.faces[current_mat].push(parseFloat(element[3])-1);
//               break;
  
//             default://if something else just ignore it we dont need it
//               break;
//           }
//         }
//         if (this.finished_parsing_mtl) {
//           this.makeObjs();
//         }
//         this.finished_parsing_obj = true;
//         //console.log(this.verts)
//         //console.log(this.faces) 
//       }
  
//       generate_mats(lines) {// parse the mtl file into usable data
//         //console.log(lines);
//         let current_mat = null;
  
//         for (let i = 0; i < lines.length; i++) {
//           let element = lines[i];
//           element = element.split(' ');
//           //console.log(element)
          
//           switch (element[0]) {
//             case "newmtl":// check for new material line
//               current_mat = element[1];
//               break;
//             case "Kd": //get color values and pass into dictionary
//               this.mats[current_mat] = [parseFloat(element[1]),parseFloat(element[2]),parseFloat(element[3])] //get rgb values
//               break;
//             default:
//               break;
//           }
//         }
//         if (this.finished_parsing_obj) {
//           this.makeObjs();
//         }
//         this.finished_parsing_mtl = true;
//         //console.log(this.mats)
//       }
  
//       makeObjs(){
//         for(const [mat, indexs] of Object.entries(this.faces)){
  
//           //console.log("indexes : "+indexs)
  
//           let mesh = new Mesh();
//           mesh.matName = mat;
//           mesh.color = [this.mats[mat][0], this.mats[mat][1], this.mats[mat][2], 1]
  
//           for (let i = 0; i < indexs.length; i++) {
//             const element = indexs[i];
//             //console.log();
//             mesh.verts.push(this.verts[element*3])
//             mesh.verts.push(this.verts[element*3+1])
//             mesh.verts.push(this.verts[element*3+2])
//           }
  
//           this.meshs.push(mesh)
  
//         }
//         this.finished_making_objs = true;
//         //console.log(this)
//       }
    
//       render(){
  
//         //make sure the objs has fully loaded
//         if (!this.finished_parsing_mtl || !this.finished_parsing_obj) {
//           console.log("called render function before finishing loading obj: " + this.finished_parsing_obj + " or possible the mtl: " + this.finished_parsing_mtl)
//           return;
//         }
  
//         var xy = this.position
//         var rgba = this.color
  
//         //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
//         // pass the model matrix
//         //gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)
  
  
        
//         for (let i = 0; i < this.meshs.length; i++) {
//           var element = this.meshs[i];
//           //console.log(element);
//           element.matrix = new Matrix4(this.matrix)
//           element.render();
//         }
        
        
    
  
//       }
//   }