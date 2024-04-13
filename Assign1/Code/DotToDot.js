
// Drawings
const dotPatterns = [
  [
    // Square
    [-0.5, 0.5],
    [0.5, 0.5],
    [0.5, -0.5],
    [-0.5, -0.5]
  ],


  [
    // House
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5],


    [-0.5, 0.5],
    [0, 0.9],
    [0.5, 0.5],


    [-0.2, -0.5],
    [-0.2, 0],
    [0.2, 0],
    [0.2, -0.5]
  ],

  // 4 Pointed Star
  [
    [0, 0.9],       
    [0.3, 0.3],   
    [0.9, 0],       
    [0.3, -0.3],  
    [0, -0.9],      
    [-0.3, -0.3], 
    [-0.9, 0],      
    [-0.3, 0.3],  
    [0, 0.9]        
  ],

  //Heart
  [  
    [0.3, 0.6],
    [0.6, 0.9],
    [0.9, 0.6],
    [0.9, 0.3],
    [0.6, 0],
    [0.3, -0.3],
    [0, -0.6],
    [-0.3, -0.3],
    [-0.6, 0],
    [-0.9, 0.3],
    [-0.9, 0.6],
    [-0.6, 0.9],
    [-0.3, 0.6],
    [0, 0.3]
  ],

  //Diamond
  [  
    [0, 0.5],
    [0.5, 0],
    [0, -0.5],
    [-0.5, 0],
    [0, 0.5]
  ],
  //Triangle 
  [
    [-0.5, -0.5], 
    [0.5, -0.5],  
    [0, 0.5]    
  ],

  //Face
  [  
    [0, 0.9],
    [0.5, 0.7],
    [0.7, 0.5],
    [0.9, 0],
    [0.7, -0.5],
    [0.5, -0.7],
    [0, -0.9],
    [-0.5, -0.7],
    [-0.7, -0.5],
    [-0.9, 0],
    [-0.7, 0.5],
    [-0.5, 0.7],

    [0,0],
    [0.5, 0.3],
    [-0.5, 0.3],
  ], 

  // Raindrop
  [
    [-0.5, -0.4],
    [0.5, -0.4],
    [0, 0.8],
    [0, -0.8],
  ]

];

let index = 0;

function pattern() {
  const currentPattern = dotPatterns[index];
  g_shapesList = [];
  for (let i = 0; i < currentPattern.length; i++) {
    const point = new Point();
    point.position = currentPattern[i];
    point.color = [1.0, 1.0, 1.0, 1.0]; 
    point.size = 10; 
    g_shapesList.push(point);
  }
  renderAllShapes();

  index++;
  if (index >= dotPatterns.length) {
    index = 0;
  }
}

document.getElementById("dot").addEventListener("click", pattern);












