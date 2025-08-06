import * as THREE from "three";
const canvas = document.querySelector<HTMLCanvasElement>("#webgl")!;

// const canvas = document.querySelector<HTMLCanvasElement>("#webgl")!;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(
  75, // easily adjustable field of view
  sizes.width / sizes.height // aspect ratio
);

scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
camera.position.z = 3; // position the camera away from the mesh (backwards)  > x go to right
camera.position.y = 1; // position the camera upwards
renderer.render(scene, camera);
