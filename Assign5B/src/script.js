import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/MTLLoader.js';


// Setting up  
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 8);
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c') });
renderer.setSize(window.innerWidth, window.innerHeight);

//Skybox 
const loader = new THREE.TextureLoader();
const texture = loader.load("../resources/images/quid.jpeg", () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
});


// Grass
const grassBuild = new THREE.BoxGeometry(90, 2, 150);
const grassColor = new THREE.MeshBasicMaterial({ color: 0x005300  });
const grass = new THREE.Mesh(grassBuild, grassColor);
scene.add(grass);
grass.position.set(0, -2, 0)


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
box.position.set(7, 2.3, 20);
scene.add(box);

//bludgers
const bludger1Build = new THREE.SphereGeometry(2, 32, 32);
const bludger1Color = new THREE.MeshBasicMaterial({ color: 0x4A3739 }); 
const bludger1 = new THREE.Mesh(bludger1Build, bludger1Color);
bludger1.position.set(7, 9, 17);
scene.add(bludger1);

const bludger2Build = new THREE.SphereGeometry(2, 32, 32);
const bludger2Color = new THREE.MeshBasicMaterial({ color: 0x4A3739 }); 
const bludger2 = new THREE.Mesh(bludger2Build, bludger2Color);
bludger2.position.set(7, 9, 23);
scene.add(bludger2);

// quaffle
const quaffleBuild = new THREE.SphereGeometry(2.5, 32, 32);
const quaffleColor = new THREE.MeshBasicMaterial({ color: 0x3B0B0B }); 
const quaffle = new THREE.Mesh(quaffleBuild, quaffleColor);
quaffle.position.set(6, 12, 20);
scene.add(quaffle);


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
const objectsloader = new OBJLoader();

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
                const lightcat = new THREE.DirectionalLight(0xffffff, 1);
                lightcat.target = cat; 
                scene.add(lightcat);
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

const ballBox = textureLoader.load('../resources/images/ballBox.png');
box.material.map = ballBox; 

const leather = textureLoader.load('../resources/images/leather.png');
quaffle.material.map = leather; 


animate();