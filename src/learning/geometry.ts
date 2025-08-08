import * as THREE from "three";
import { CANVAS_SIZES } from "../constants/canvas";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// const canvas = getCanvas();
const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
if (!canvas) {
  throw new Error("Canvas element not found");
}

// Sizes

// Scene
const scene = new THREE.Scene();

type GeometryType = "box" | "sphere" | "box-buffer";
const chosenGeometry: GeometryType = "box-buffer";

function generateBaseGeometry(geometry: GeometryType) {
  switch (geometry) {
    case "box": {
      return new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    }
    case "sphere": {
      return new THREE.SphereGeometry(1, 64, 64);
    }
    case "box-buffer": {
      const baseGeometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        ...[0, 0, 0], // vertice 1
        ...[0, 1, 0], // vertice 2
        ...[1, 0, 0], // vertice 3
      ]);
      // itemSize = 3 because there are 3 values (components) per vertex
      baseGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
      );
      return baseGeometry;
    }
    default: {
      return new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    }
  }
}
// Object
const geometry = generateBaseGeometry(chosenGeometry);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  /** Handles pixel ratio
   * Eyes see almost no difference between 2 and 3
   */
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  CANVAS_SIZES.width / CANVAS_SIZES.height,
  0.1,
  1000
);

camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  requestAnimationFrame(tick);
};

tick();
