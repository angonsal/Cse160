
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

  //Peace sign
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
    [0,0.4],
    [0.5, -0.3],
    [-0.5, -0.3],
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
const dotSound = document.getElementById("dotSound");

function pattern() {
  dotSound.play();
  
  const currentPattern = dotPatterns[index];

  //  Clear the list 
  g_shapesList = [];

  // Loop and get each point 
  for (let i = 0; i < currentPattern.length; i++) {
    const point = new Point();
    point.position = currentPattern[i];
    point.color = [1.0, 1.0, 1.0, 1.0]; 
    point.size = 10; 
    g_shapesList.push(point);
  }
  renderAllShapes();

  // Increment and go to next pattern
  index++;

  // Reset to 0 after last pattern
  if (index >= dotPatterns.length) {
    index = 0;
  }
}

document.getElementById("dot").addEventListener("click", pattern);












