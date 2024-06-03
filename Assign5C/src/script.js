import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/MTLLoader.js';


// Setting up  
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 8);
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c') });
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('keydown', keydown, false);


//Skybox 
const loader = new THREE.TextureLoader();
const texture = loader.load("../resources/images/quid.jpeg", () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
});


// Grass
const grassBuild = new THREE.BoxGeometry(100, 2, 200);
const grassColor = new THREE.MeshBasicMaterial({ color: 0x005300  });
const grass = new THREE.Mesh(grassBuild, grassColor);
scene.add(grass);
grass.position.set(0, -2, 0)

//0X5F725D
const grassBuild1 = new THREE.BoxGeometry(400, 15, 200);
const grassColor1 = new THREE.MeshBasicMaterial({ color: 0X5F725D  });
const grass1 = new THREE.Mesh(grassBuild1, grassColor1);
scene.add(grass1);
grass1.position.set(-60, -8, 220)


const grassBuild2 = new THREE.BoxGeometry(200, 2, 200);
const grassColor2 = new THREE.MeshBasicMaterial({ color: 0x005300  });
const grass2 = new THREE.Mesh(grassBuild2, grassColor2);
scene.add(grass2);
grass2.position.set(-50, -1, -220)

const grassBuild3 = new THREE.BoxGeometry(200, 15, 200);
const grassColor3 = new THREE.MeshBasicMaterial({ color: 0X5F725D  });
const grass3 = new THREE.Mesh(grassBuild3, grassColor3);
scene.add(grass3);
grass3.position.set(-200, -8, 0)

const grassBuild4 = new THREE.BoxGeometry(200, 2, 200);
const grassColor4 = new THREE.MeshBasicMaterial({ color: 0xF0F8FF  });
const grass4 = new THREE.Mesh(grassBuild4, grassColor4);
scene.add(grass4);
grass4.position.set(200, -2, 0)

const londonBuild = new THREE.BoxGeometry(200, 2, 200);
const londonColor = new THREE.MeshBasicMaterial({ color: 0xF0F8FF  });
const london = new THREE.Mesh(londonBuild, londonColor);
scene.add(london);
london.position.set(200, -2, -200)


// wood
const woodBuild = new THREE.CylinderGeometry(0.5, 0.5, 22);
const woodColor = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const wood = new THREE.Mesh(woodBuild, woodColor);
wood.position.set(-20, 10, 0);
scene.add(wood);

const leftWoodBuild = new THREE.CylinderGeometry(0.5, 0.5, 12);
const leftWoodColor = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const leftWood = new THREE.Mesh(leftWoodBuild, leftWoodColor);
leftWood.position.set(-20, 3.3, 10);
scene.add(leftWood);

const rightWoodBuild = new THREE.CylinderGeometry(0.5, 0.5, 10);
const rightWoodColor = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const rightWood = new THREE.Mesh(rightWoodBuild, rightWoodColor);
rightWood.position.set(-20, 2.2, -10);
scene.add(rightWood);

// rings
const middleRing = new THREE.TorusGeometry(4, 0.2, 16, 32);
const middleRingColor = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const middle = new THREE.Mesh(middleRing, middleRingColor);
middle.position.set(-20, 24.75, 0);
// middle.rotation.y = Math.PI / 2;
scene.add(middle);

const leftRing = new THREE.TorusGeometry(3, 0.2, 16, 32);
const leftRingColor = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const left = new THREE.Mesh(leftRing, leftRingColor);
left.position.set(-20, 12, 10);
left.rotation.y = Math.PI / 2;
scene.add(left);

const rightRing = new THREE.TorusGeometry(2, 0.2, 16, 32);
const rightRingColor = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const right = new THREE.Mesh(rightRing, rightRingColor);
right.position.set(-20, 9, -10);
right.rotation.y = Math.PI / 2;
scene.add(right);


//ball box
const boxBuild = new THREE.BoxGeometry(8, 10, 15);
const boxColor = new THREE.MeshBasicMaterial({ color: 0xD2B48C  });
const box = new THREE.Mesh(boxBuild, boxColor);
box.position.set(-20, 2.3, 30);
scene.add(box);

const boxBuild1 = new THREE.BoxGeometry(8, 10, 15);
const boxColor1 = new THREE.MeshBasicMaterial({ color: 0xD2B48C  });
const box1 = new THREE.Mesh(boxBuild, boxColor);
box1.position.set(-20, 2.3, -30);
scene.add(box1);

//bludgers
const bludger1Build = new THREE.SphereGeometry(2, 32, 32);
const bludger1Color = new THREE.MeshBasicMaterial({ color: 0x4A3739 }); 
const bludger1 = new THREE.Mesh(bludger1Build, bludger1Color);
bludger1.position.set(-20, 9, 27);
scene.add(bludger1);

const bludger2Build = new THREE.SphereGeometry(2, 32, 32);
const bludger2Color = new THREE.MeshBasicMaterial({ color: 0x4A3739 }); 
const bludger2 = new THREE.Mesh(bludger2Build, bludger2Color);
bludger2.position.set(-20, 9, 33);
scene.add(bludger2);

const bludger3Build = new THREE.SphereGeometry(2, 32, 32);
const bludger3Color = new THREE.MeshBasicMaterial({ color: 0x4A3739 }); 
const bludger3 = new THREE.Mesh(bludger3Build, bludger3Color);
bludger3.position.set(-20, 9, -27);
scene.add(bludger3);

const bludger4Build = new THREE.SphereGeometry(2, 32, 32);
const bludger4Color = new THREE.MeshBasicMaterial({ color: 0x4A3739 }); 
const bludger4 = new THREE.Mesh(bludger4Build, bludger4Color);
bludger4.position.set(-20, 9, -33);
scene.add(bludger4);

// quaffle
const quaffleBuild = new THREE.SphereGeometry(2.5, 32, 32);
const quaffleColor = new THREE.MeshBasicMaterial({ color: 0x3B0B0B }); 
const quaffle = new THREE.Mesh(quaffleBuild, quaffleColor);
quaffle.position.set(-19, 12, 30);
scene.add(quaffle);

// quaffle
const quaffleBuild1 = new THREE.SphereGeometry(2.5, 32, 32);
const quaffleColor1 = new THREE.MeshBasicMaterial({ color: 0x3B0B0B }); 
const quaffle1 = new THREE.Mesh(quaffleBuild1, quaffleColor1);
quaffle1.position.set(-19, 12, -30);
scene.add(quaffle1);

// Sorcerers stone
const stoneBuild = new THREE.DodecahedronGeometry(2);
const stoneColor = new THREE.MeshBasicMaterial({ color: 0x770B0B }); 
const stone = new THREE.Mesh(stoneBuild, stoneColor);
stone.position.set(-25, 9, -53);
scene.add(stone);

// Right table
const table1Build = new THREE.CylinderGeometry(0.5, 0.5, 8);
const table1Color = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const table1 = new THREE.Mesh(table1Build, table1Color);
table1.position.set(-23, 3.3, -50);
scene.add(table1);

const table2Build = new THREE.CylinderGeometry(0.5, 0.5, 8);
const table2Color = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const table2 = new THREE.Mesh(table2Build, table2Color);
table2.position.set(-23, 3.3, -60);
scene.add(table2);

const table3Build = new THREE.CylinderGeometry(0.5, 0.5, 8);
const table3Color = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const table3 = new THREE.Mesh(table3Build, table3Color);
table3.position.set(-35, 3.3, -50);
scene.add(table3);

const table4Build = new THREE.CylinderGeometry(0.5, 0.5, 8);
const table4Color = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const table4 = new THREE.Mesh(table4Build, table4Color);
table4.position.set(-35, 3.3, -60);
scene.add(table4);

const tableTopBuild = new THREE.BoxGeometry(15, 1.5, 15);
const tableTopColor = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const tableTop = new THREE.Mesh(tableTopBuild, tableTopColor);
tableTop.position.set(-28, 7, -53);
scene.add(tableTop);

// Left Table 

const table1Build1 = new THREE.CylinderGeometry(0.5, 0.5, 8);
const table1Color1 = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const table11 = new THREE.Mesh(table1Build1, table1Color1);
table11.position.set(-23, 3.3, 50);
scene.add(table11);

const table2Build1 = new THREE.CylinderGeometry(0.5, 0.5, 8);
const table2Color1 = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const table21 = new THREE.Mesh(table2Build1, table2Color1);
table21.position.set(-23, 3.3, 60);
scene.add(table21);

const table3Build1 = new THREE.CylinderGeometry(0.5, 0.5, 8);
const table3Color1 = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const table31 = new THREE.Mesh(table3Build1, table3Color1);
table31.position.set(-35, 3.3, 50);
scene.add(table31);

const table4Build1 = new THREE.CylinderGeometry(0.5, 0.5, 8);
const table4Color1 = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const table41 = new THREE.Mesh(table4Build1, table4Color1);
table41.position.set(-35, 3.3, 60);
scene.add(table41);

const tableTopBuild1 = new THREE.BoxGeometry(15, 1.5, 15);
const tableTopColor1 = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const tableTop1 = new THREE.Mesh(tableTopBuild1, tableTopColor1);
tableTop1.position.set(-28, 7, 53);
scene.add(tableTop1);


//Orbit controls 
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

// Render loop
function animate(time) {

    // add spinning quidditch balls animation here later 
    // add spinning broom 
    time *= 0.001; 
    middle.rotation.y = time;


    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Objects setup
const mtlLoader = new MTLLoader();
const mtlLoader1 = new MTLLoader();
const mtlLoader2 = new MTLLoader();
const mtlLoaderTree = new MTLLoader();
const mtlLoaderTree2 = new MTLLoader();
const mtlLoaderTree3 = new MTLLoader();
const mtlLoaderTree4 = new MTLLoader();
const mtlLoaderTree5 = new MTLLoader();
const mtlLoaderTree6 = new MTLLoader();
const mtlLoaderTree7 = new MTLLoader();
const mtlLoaderTree8 = new MTLLoader();
const mtlLoaderTree9 = new MTLLoader();
const mtlLoaderTree10 = new MTLLoader();

const mtlLoaderWaterFall = new MTLLoader();
const mtlLoaderHagrid = new MTLLoader();
const mtlLoaderDragon = new MTLLoader();

const mtlLoaderForest = new MTLLoader();
const mtlLoaderForest2 = new MTLLoader();
const mtlLoaderHouses = new MTLLoader();


const mtlLoaderHogsmede = new MTLLoader();
const mtlLoaderCloud = new MTLLoader();

const mtlLoaderUnicorn = new MTLLoader();
const mtlLoaderUnicorn1 = new MTLLoader();
const mtlLoaderUnicorn2 = new MTLLoader();

const mtlLoaderBroom = new MTLLoader();




const objectsloader = new OBJLoader();
const objectsloader1 = new OBJLoader();
const objectsloader2 = new OBJLoader();
const objectsloaderTree = new OBJLoader();
const objectsloaderWaterFall = new OBJLoader();
const objectsloaderHagrid = new OBJLoader();
const objectsloaderDragon = new OBJLoader();
const objectsloaderForest = new OBJLoader();
const objectsloaderHogsmede = new OBJLoader();
const objectsloaderHouses = new OBJLoader();
const objectsloaderCloud = new OBJLoader();
const objectsloaderUnicorn = new OBJLoader();
const objectsloaderBroom = new OBJLoader();














mtlLoader.load('../resources/models/Orange cat/12221_Cat_v1_l3.mtl',
    function (materials) {
        objectsloader.setMaterials(materials);
        objectsloader.load('../resources/models/Orange cat/12221_Cat_v1_l3.obj',
            function (cat) {
                cat.position.set(-20, -1, 5); 
                cat.scale.set(0.1, 0.1, 0.1);
                cat.rotation.set(11, 0, 8);
                scene.add(cat);

                //SOURCE OF DIRECTIONAL LIGHT 
                const lightcat = new THREE.DirectionalLight(0xffffff, 0.5);
                lightcat.position.set(20, 10, 5); 
                lightcat.target = cat; 
                scene.add(lightcat);
            }
        );
    }

);


mtlLoader1.load('../resources/models/Winner/WinnerCup.mtl', function (materials) {
    objectsloader1.setMaterials(materials);
    objectsloader1.load('../resources/models/Winner/WinnerCup.obj', function (trophy) {
        trophy.position.set(-28, 12, 50); 
        trophy.scale.set(0.02, 0.02, 0.02);
        trophy.rotation.set(11, 14, 7.85);
        scene.add(trophy);

        // SOURCE OF SPOT LIGHT 
        const trophyLight = new THREE.SpotLight(0xffff00, 0.0001);
        trophyLight.target = trophy; 
        scene.add(trophyLight);
    });
});

mtlLoader2.load('../resources/models/Frog/12268_banjofrog_v1_L3.mtl',
    function (materials) {
        objectsloader2.setMaterials(materials);
        objectsloader2.load('../resources/models/Frog/12268_banjofrog_v1_L3.obj',
            function (frog) {
                frog.position.set(-20, -1, -7); 
                frog.scale.set(0.5, 0.5, 0.5);
                frog.rotation.set(11, 0, 8);
                scene.add(frog);

                //SOURCE OF AMBIENT LIGHT 
                const lightfrog = new THREE.AmbientLight(0xffffff, 0.1);
                lightfrog.position.set(-10, 20, -10); 
                lightfrog.target = frog; 
                scene.add(lightfrog);

                //SOURCE OF HEMISPHERE LIGHT 
                // const skyLight = new THREE.HemisphereLight(0xffff00, 0.1);
                // scene.add(skyLight);
                

            }
        );
    }

);

mtlLoaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (tree) {
                
                tree.position.set(-30, 2, 200); 
                tree.scale.set(3, 3, 3);
                tree.rotation.set(22, 0, 9.5);

                const lighttree = new THREE.DirectionalLight(0xffffff, 1);
                lighttree.position.set(-20, 10, 200); 
                lighttree.target = tree; 
                scene.add(lighttree);

                scene.add(tree);


                

            }
    
        );
    }

);

mtlLoaderTree2.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (tree1) {
                
                tree1.position.set(0, 2, 200); 
                tree1.scale.set(4, 4, 4);
                tree1.rotation.set(22, 0, 9.5);

                const lighttree1 = new THREE.DirectionalLight(0xffffff, 1);
                lighttree1.position.set(-20, 10, 200); 
                lighttree1.target = tree1; 
                scene.add(lighttree1);

                scene.add(tree1);


                

            }
    
        );
    }

);

mtlLoaderTree3.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (tree2) {
                
                tree2.position.set(50, 2, 200); 
                tree2.scale.set(7, 7, 7);
                tree2.rotation.set(22, 0, 9.5);

                const lighttree2 = new THREE.DirectionalLight(0xffffff, 1);
                lighttree2.position.set(-20, 10, 200); 
                lighttree2.target = tree2; 
                scene.add(lighttree2);

                scene.add(tree2);


                

            }
    
        );
    }

);

mtlLoaderTree4.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (tree4) {
                
                tree4.position.set(100, 2, 200); 
                tree4.scale.set(4, 4, 4);
                tree4.rotation.set(22, 0, 9.5);

                

                scene.add(tree4);


                

            }
    
        );
    }

);

mtlLoaderTree5.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (tree5) {
                
                tree5.position.set(100, 2, 300); 
                tree5.scale.set(4, 4, 4);
                tree5.rotation.set(22, 0, 9.5);

                const lighttree5 = new THREE.DirectionalLight(0xffffff, 1);
                lighttree5.position.set(-20, 10, 300); 
                lighttree5.target = tree5; 
                scene.add(lighttree5);

                scene.add(tree5);


                

            }
    
        );
    }

);

mtlLoaderTree6.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (hagrid) {
                
                hagrid.position.set(125, 2, 250); 
                hagrid.scale.set(10, 10, 10);
                hagrid.rotation.set(22, 0, 9.5);

                

                scene.add(hagrid);


                

            }
    
        );
    }

);


//mtlLoaderCastle
//objectsloaderCastle

mtlLoaderWaterFall.load('../resources/models/Waterfall/Waterfall_1228.mtl',

    function (materials) {
        materials.preload();
        objectsloaderWaterFall.setMaterials(materials);
        objectsloaderWaterFall.load('../resources/models/Waterfall/Waterfall_1228.obj',
            function (hagrid) {
                
                hagrid.position.set(-40, -11, -180); 
                hagrid.scale.set(1, 1, 1);
                hagrid.rotation.set(22, Math.PI, 9.45);

                

                scene.add(hagrid);


                

            }
    
        );
    }

);


mtlLoaderTree7.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (hagrid) {
                
                hagrid.position.set(-125, 2, -300); 
                hagrid.scale.set(5, 5, 5);
                hagrid.rotation.set(22, 0, 9.5);

                

                scene.add(hagrid);


                

            }
    
        );
    }

);

mtlLoaderTree8.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (hagrid) {
                
                hagrid.position.set(-75, 2, -300); 
                hagrid.scale.set(3, 3, 3);
                hagrid.rotation.set(22, 0, 9.5);

               

                scene.add(hagrid);


                

            }
    
        );
    }

);

mtlLoaderTree9.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (hagrid) {
                
                hagrid.position.set(-25, 2, -300); 
                hagrid.scale.set(3, 3, 3);
                hagrid.rotation.set(22, 0, 9.5);

        

                scene.add(hagrid);


                

            }
    
        );
    }

);

mtlLoaderTree10.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.mtl',

    function (materials) {
        materials.preload();
        objectsloaderTree.setMaterials(materials);
        objectsloaderTree.load('../resources/models/low_poly_tree/Lowpoly_tree_sample.obj',
            function (hagrid) {
                
                hagrid.position.set(25, 2, -250); 
                hagrid.scale.set(5, 5, 5);
                hagrid.rotation.set(22, 0, 9.5);


                scene.add(hagrid);


                

            }
    
        );
    }

);

mtlLoaderHagrid.load('../resources/models/Forest Hut/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderHagrid.setMaterials(materials);
        objectsloaderHagrid.load('../resources/models/Forest Hut/model.obj',
            function (hagrid) {
                
                hagrid.position.set(-170, 35, 200); 
                hagrid.scale.set(20, 20, 20);
                hagrid.rotation.set(22, 0, 9.42);

                const lighthagrid = new THREE.DirectionalLight(0xffffff, 1);
                lighthagrid.position.set(-20, 10, 200); 
                lighthagrid.target = hagrid; 
                scene.add(lighthagrid);

                scene.add(hagrid);


                

            }
    
        );
    }

);

mtlLoaderDragon.load('../resources/models/Dragon/Mesh_Dragon.mtl',

    function (materials) {
        materials.preload();
        objectsloaderDragon.setMaterials(materials);
        objectsloaderDragon.load('../resources/models/Dragon/Mesh_Dragon.obj',
            function (hagrid) {
                
                hagrid.position.set(-150, 25, 0); 
                hagrid.scale.set(0.2, 0.2, 0.2);
                hagrid.rotation.set(22, 0, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);

mtlLoaderForest.load('../resources/models/Forest/PUSHILIN_forest.mtl',

    function (materials) {
        materials.preload();
        objectsloaderForest.setMaterials(materials);
        objectsloaderForest.load('../resources/models/Forest/PUSHILIN_forest.obj',
            function (hagrid) {
                
                hagrid.position.set(-200, 15.5, 0); 
                hagrid.scale.set(75, 75, 75);
                hagrid.rotation.set(22, 0, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);


mtlLoaderForest2.load('../resources/models/Forest/PUSHILIN_forest.mtl',

    function (materials) {
        materials.preload();
        objectsloaderForest.setMaterials(materials);
        objectsloaderForest.load('../resources/models/Forest/PUSHILIN_forest.obj',
            function (hagrid) {
                
                hagrid.position.set(20, 15.5, 250); 
                hagrid.scale.set(80, 80, 80);
                hagrid.rotation.set(22, 0, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);


mtlLoaderHogsmede.load('../resources/models/Winter in the Hinterland/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderHogsmede.setMaterials(materials);
        objectsloaderHogsmede.load('../resources/models/Winter in the Hinterland/model.obj',
            function (hagrid) {
                
                hagrid.position.set(250, 50, 0); 
                hagrid.scale.set(70, 70, 70);
                hagrid.rotation.set(22, Math.PI/2, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);


mtlLoaderCloud.load('../resources/models/Cumulus Clouds 2/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderCloud.setMaterials(materials);
        objectsloaderCloud.load('../resources/models/Cumulus Clouds 2/model.obj',
            function (hagrid) {
                
                hagrid.position.set(0,200, -100); 
                hagrid.scale.set(100, 100, 100);
                hagrid.rotation.set(22, Math.PI/2, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);

mtlLoaderUnicorn.load('../resources/models/Unicorn/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderUnicorn.setMaterials(materials);
        objectsloaderUnicorn.load('../resources/models/Unicorn/model.obj',
            function (hagrid) {
                
                hagrid.position.set(-160,5, 210); 
                hagrid.scale.set(8, 8, 8);
                hagrid.rotation.set(22, Math.PI/2, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);


mtlLoaderUnicorn.load('../resources/models/Unicorn/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderUnicorn.setMaterials(materials);
        objectsloaderUnicorn.load('../resources/models/Unicorn/model.obj',
            function (hagrid) {
                
                hagrid.position.set(30,5, -200); 
                hagrid.scale.set(8, 8, 8);
                hagrid.rotation.set(22, Math.PI/2, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);

mtlLoaderUnicorn.load('../resources/models/Unicorn/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderUnicorn.setMaterials(materials);
        objectsloaderUnicorn.load('../resources/models/Unicorn/model.obj',
            function (hagrid) {
                
                hagrid.position.set(-180,5, 32); 
                hagrid.scale.set(8, 8, 8);
                hagrid.rotation.set(22, Math.PI/2, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);


mtlLoaderHouses.load('../resources/models/Snowy Houses/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderHouses.setMaterials(materials);
        objectsloaderHouses.load('../resources/models/Snowy Houses/model.obj',
            function (hagrid) {
                
                hagrid.position.set(250,15, -205); 
                hagrid.scale.set(40, 40, 40);
                hagrid.rotation.set(22, 0, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);

mtlLoaderHouses.load('../resources/models/Snowy Houses/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderHouses.setMaterials(materials);
        objectsloaderHouses.load('../resources/models/Snowy Houses/model.obj',
            function (hagrid) {
                
                hagrid.position.set(150,15, -205); 
                hagrid.scale.set(40, 40, 40);
                hagrid.rotation.set(22, 0, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);


mtlLoaderBroom.load('../resources/models/Simple Broom/materials.mtl',

    function (materials) {
        materials.preload();
        objectsloaderHouses.setMaterials(materials);
        objectsloaderHouses.load('../resources/models/Simple Broom/model.obj',
            function (hagrid) {
                
                hagrid.position.set(10,-0.5, 20); 
                hagrid.scale.set(8, 8, 8);
                hagrid.rotation.set(22, 0, 9.5);

                scene.add(hagrid);
                

            }
    
        );
    }

);




// Texture setup
const textureLoader = new THREE.TextureLoader();
const grassy = textureLoader.load('../resources/images/grass.jpeg');
grass.material.map = grassy;

const woody = textureLoader.load('../resources/images/wood.jpeg');
wood.material.map = woody;
leftWood.material.map = woody; 
rightWood.material.map = woody; 
table1.material.map = woody; 
table2.material.map = woody; 
table3.material.map = woody; 
table4.material.map = woody; 
tableTop.material.map = woody; 
table11.material.map = woody; 
table21.material.map = woody; 
table31.material.map = woody; 
table41.material.map = woody; 
tableTop1.material.map = woody; 

const ballBox = textureLoader.load('../resources/images/ballBox.png');
box.material.map = ballBox; 

const leather = textureLoader.load('../resources/images/leather.png');
quaffle.material.map = leather; 
quaffle1.material.map = leather; 

const shineyStone = textureLoader.load('../resources/images/stone.jpeg');
stone.material.map = shineyStone;

const hagrid = textureLoader.load('../resources/images/hagrid.jpeg'); 
grass1.material.map = hagrid; 
grass3.material.map = hagrid; 


// Navigation
function keydown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            camera.position.z += 3;
            event.preventDefault();
            break;
        case 'ArrowRight':
            camera.position.z -= 3;
            event.preventDefault();
            break;
        case 'ArrowUp':
            camera.position.x -= 3;
            event.preventDefault();
            break;
        case 'ArrowDown':
            camera.position.x += 3;
            event.preventDefault();
            break;
    }
}

animate();
// var audio = document.getElementById("pottah");
// audio.play();