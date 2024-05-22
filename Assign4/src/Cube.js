class Cube{
  constructor(){
    this.type = 'cube'; 
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0]; 
    // this.size = 5; 
    this.matrix = new Matrix4();
	
	//Default
	this.textureNum = 1; 
  }
  render(){
   	var rgba = this.color; 

		gl.uniform1i(u_whichTexture, this.textureNum);

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


		gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
		drawTriangle3DUVNormal([0,0,0,  1,1,0,  1,0,0,  0,0,0,  0,1,0,  1,1,0], [0,0, 1,1, 1,0,  0,0, 0,1, 1,1],[0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,-1]);
		drawTriangle3DUVNormal([0,0,1,  1,1,1,  1,0,1,  0,0,1,  0,1,1,  1,1,1], [1,0, 0,1, 0,0,  1,0, 1,1, 0,1], [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]); 

		drawTriangle3DUVNormal([0,1,0,  1,1,1,  1,1,0,  0,1,0,  0,1,1,  1,1,1], [0,0, 1,1, 1,0,  0,0, 0,1, 1,1], [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		drawTriangle3DUVNormal([0,0,0,  1,0,1,  1,0,0,  0,0,0,  0,0,1,  1,0,1], [0,1, 1,0, 1,1,  0,1, 0,0, 1,0], [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,0]);

		gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
		drawTriangle3DUVNormal([1,0,0,  1,1,1,  1,0,1,  1,0,0,  1,1,0,  1,1,1], [0,0, 1,1, 1,0,  0,0, 0,1, 1,1], [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]);
		drawTriangle3DUVNormal([0,0,0,  0,1,1,  0,0,1,  0,0,0,  0,1,0,  0,1,1], [0,0, 1,1, 1,0,  0,0, 0,1, 1,1], [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,0]);
		

    }

  }