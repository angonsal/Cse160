import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';

// Not working from local import????
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
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
    // texture.generateMipmaps = true;
    // texture.minFilter = THREE.LinearMipmapLinearFilter;
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
});

// Grass
const grassBuild = new THREE.BoxGeometry(70, 2, 50);
const grassColor = new THREE.MeshBasicMaterial({ color: 0x005300  });
const grass = new THREE.Mesh(grassBuild, grassColor);
scene.add(grass);
grass.position.set(0, -2, 0)

// quaffle
const quaffleBuild = new THREE.SphereGeometry(1, 32, 32);
const quaffleColor = new THREE.MeshBasicMaterial({ color: 0x3B0B0B }); 
const quaffle = new THREE.Mesh(quaffleBuild, quaffleColor);
quaffle.position.set(27, 0, 0);
scene.add(quaffle);

// wood
const woodBuild = new THREE.CylinderGeometry(0.5, 0.5, 14);
const woodColor = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const wood = new THREE.Mesh(woodBuild, woodColor);
wood.position.set(-10, 5, 0);
scene.add(wood);

const leftWoodBuild = new THREE.CylinderGeometry(0.5, 0.5, 8);
const leftWoodColor = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const leftWood = new THREE.Mesh(leftWoodBuild, leftWoodColor);
leftWood.position.set(-10, 3, 10);
scene.add(leftWood);

const rightWoodBuild = new THREE.CylinderGeometry(0.5, 0.5, 6);
const rightWoodColor = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); 
const rightWood = new THREE.Mesh(rightWoodBuild, rightWoodColor);
rightWood.position.set(-10, 1, -10);
scene.add(rightWood);

// rings
const middleRing = new THREE.TorusGeometry(2, 0.2, 16, 32);
const middleRingColor = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const middle = new THREE.Mesh(middleRing, middleRingColor);
middle.position.set(-10, 14, 0);
// middle.rotation.y = Math.PI / 2;


scene.add(middle);

const leftRing = new THREE.TorusGeometry(2, 0.2, 16, 32);
const leftRingColor = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const left = new THREE.Mesh(leftRing, leftRingColor);
left.position.set(-10, 9, 10);
left.rotation.y = Math.PI / 2;
scene.add(left);

const rightRing = new THREE.TorusGeometry(2, 0.2, 16, 32);
const rightRingColor = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const right = new THREE.Mesh(rightRing, rightRingColor);
right.position.set(-10, 6, -10);
right.rotation.y = Math.PI / 2;
scene.add(right);

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

animate();