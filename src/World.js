import R from 'ramda';
import THREE, { Scene, PerspectiveCamera, WebGLRenderer, Raycaster } from 'three';

const scene = new Scene();
const renderer = new WebGLRenderer();
const satellites = [];
const raycaster = new Raycaster();
const mouseCastVector = new THREE.Vector2(0, 0);

let camera;
let camHolder;

export const spinCamera = (x, y, z) => {
  camHolder.rotation.x += x;
  camHolder.rotation.y += y;
  camHolder.rotation.z += z;
};

export const getIntersects = ({ x, y }) => {
  mouseCastVector.set(x, y);
  raycaster.setFromCamera(mouseCastVector, camera);
  return raycaster
    .intersectObjects(R.map((s) => s.selector, satellites));
};

const makeCamera = () =>
  new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

export const addSatellite = sat => {
  scene.add(sat);
  satellites.push(sat);
};

const setupStaticObjs = () => {
  const geometry = new THREE.SphereGeometry(5, 20, 20);
  const material = new THREE.MeshPhongMaterial({ color: 0xaa4444 });
  material.shading = 1;

  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  scene.add(new THREE.AmbientLight(0x444444));
};

export const init = () => {
  const target = document.getElementById('render_target');

  camera = makeCamera();
  camera.lookAt(new THREE.Vector3());
  camHolder = new THREE.Object3D();
  camHolder.add(camera);
  camera.position.z = 20;
  scene.add(camHolder);

  setupStaticObjs();

  // Set render options
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  target.appendChild(renderer.domElement);
};

export const render = () => renderer.render(scene, camera);

export default {
  init,
  render,
  satellites,
  spinCamera,
  addSatellite,
  getIntersects,
};
