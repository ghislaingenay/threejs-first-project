import * as THREE from "three";
import { CANVAS_SIZES } from "../constants/canvas";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { cameraNear } from "three/tsl";

// const canvas = getCanvas();
const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
if (!canvas) {
  throw new Error("Canvas element not found");
}

// Sizes

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  CANVAS_SIZES.width / CANVAS_SIZES.height,
  0.1,
  1000
);

let cursor = {
  x: 0,
  y: 0,
};

// The formula (event.clientX / CANVAS_SIZES.width) * 2 - 1 is used to convert screen coordinates to normalized device coordinates (NDC) which range from -1 to +1.
// window.addEventListener("mousemove", (event) => {
//   cursor.x = (event.clientX / CANVAS_SIZES.width) * 2 - 1;
//   cursor.y = -(event.clientY / CANVAS_SIZES.height) * 2 + 1;
//   console.log(`Cursor position: (${cursor.x}, ${cursor.y})`);
// });

// const aspectRatio = CANVAS_SIZES.width / CANVAS_SIZES.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   1000
// );
// camera.position.x = 2;
// camera.position.y = 2;
// camera.position.z = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(CANVAS_SIZES.width, CANVAS_SIZES.height);

// Controls
const controls = new OrbitControls(camera, canvas);
// controls.target.y = 2;
controls.update();
controls.enableDamping = true;
camera.lookAt(mesh.position);
// damping = smooth the animation by adding some kind of acceleration and friction formulas

// Animate
const clock = new THREE.Clock();

window.addEventListener("resize", (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const animateCamera = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  mesh.rotation.y = elapsedTime;

  // camera.position.x = cursor.x; // mutliply to gte more rangenge
  // camera.position.y = cursor.y; // -3 to +3 range
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2; // oscillate camera position based on cursor x
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2; // oscillate camera position based on cursor x
  // camera.position.y = cursor.y * 3;
  camera.lookAt(mesh.position);

  // Render
  controls.update();
  renderer.render(scene, camera);

  // Call tick again on the next frame
  requestAnimationFrame(animateCamera);
};

animateCamera();

export { animateCamera };
