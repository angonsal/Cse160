class TriangularPrism {
  constructor() {
    this.type = 'triangular_prism';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    // this.size = 5;
    this.matrix = new Matrix4();
  }

  render() {
    var rgba = this.color;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3D([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]); 
    drawTriangle3D([0.0, 0.0, 0.0, 0.1, 1.0, 0.0, 1.0, 0.0, 0.0]); 
    drawTriangle3D([1.0, 0.0, 0.0, 0.1, 1.0, 0.0, 1.0, 0.0, 0.0]); 
    drawTriangle3D([1.0, 0.0, 0.0, 0.1, 1.0, 0.0, 1.0, 0.0, 1.0]); 
    drawTriangle3D([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]); 
    drawTriangle3D([0.0, 0.0, 0.0, 0.1, 1.0, 0.0, 0.1, 1.0, 1.0]); 
    drawTriangle3D([1.0, 0.0, 0.0, 0.1, 1.0, 1.0, 0.1, 1.0, 0.0]); 

  }
}
