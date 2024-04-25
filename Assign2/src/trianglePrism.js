class TriangularPrism 
{
    constructor() 
    {
        this.type = 'triangularPrism';
        this.color = [1.0, 1.0, 1.0, 1.0]; // RGBA color
        this.matrix = new Matrix4(); // Transformation matrix
    }

    render() 
    {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        drawTriangle3D( [0.0,0.0,0.0,   1.0,0.0,0.0,   0.5,0.5,0.0]);
        drawTriangle3D( [0.0,0.0,0.0,   0.5,0.0,0.5,   0.5,0.5,0.0]);
        drawTriangle3D( [0.5,0.0,0.5,   1.0,0.0,0.0,   0.5,0.5,0.0]);

        gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
        drawTriangle3D( [0.0,0.0,0.0,   0.5,0.0,0.5,   1.0,0.0,0.0]);
    }
}