//CAPNGANJ Shatter Hash fxhash generative token
//March, 2022

//imports
import { StonerSculpturesFeatures } from './StonerSculpturesFeatures';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';



//1) - generate fxhash features - global driving parameters
//new featuresClass
let feet = new StonerSculpturesFeatures();
window.$fxhashData = feet;

// FX Features
window.$fxhashFeatures = {
  "Temperature" : feet.color.tag,
  "Zone" : feet.env.tag,
  "Density": feet.density.tag
};
console.log(window.$fxhashFeatures);

//vars related to fxhash preview call
//loaded tracks whether texture has loaded;
//previewed tracks whether preview has been called
let loaded = false;
let previewed = false;

//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
//console.log("fxhash features", window.$fxhashFeatures);


//2) Initialize three.js scene and start the render loop
//all data driving geometry and materials and whatever else should be generated in step 2

//scene & camera
let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer( { 
  antialias: true,
  alpha: true
} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set( 4.5, 0, 4.5 );

//lights
const amb = new THREE.AmbientLight(0xffffff);
scene.add(amb);

// controls
let controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping=true;
controls.dampingFactor = 0.2;
//controls.autoRotate= true;
controls.maxDistance = 10;
controls.minDistance = 1;


//equirectangular map for backgrounds, reflection / refraction
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load(feet.env.img, () => {loaded = true});
backgroundTexture.mapping = THREE.EquirectangularReflectionMapping;
backgroundTexture.encoding = THREE.sRGBEncoding;


//convex hull geometry
const vertices = [];
for (let i = 0; i < feet.density.value; i++) {
  const v = new THREE.Vector3(
    feet.map(fxrand(), 0, 1, -2, 2),
    feet.map(fxrand(), 0, 1, -2, 2),
    feet.map(fxrand(), 0, 1, -2, 2)
  )
  vertices.push(v);
}
const geometry = new ConvexGeometry(vertices);

//placeholder material for testing
//const material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

//reflect
const lambert = new THREE.MeshLambertMaterial({
  envMap: backgroundTexture,
  transparent: true,
  side: THREE.DoubleSide,
  opacity: 0.5
});

//add mesh to scene <3
const mesh = new THREE.Mesh(geometry, lambert);
scene.add(mesh);


//set the background color 
let bod = document.body;
bod.style.backgroundColor = feet.color.value;


//set up resize listener and let it rip!
window.addEventListener( 'resize', onWindowResize );
animate();




// threejs animation stuff
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();

}



function render() {

  renderer.render( scene, camera );

  if(previewed == false && loaded == true){
    fxpreview();
    previewed = true;
  } 

  mesh.rotation.y += 0.001;

}
