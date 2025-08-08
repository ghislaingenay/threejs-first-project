import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

// Debug
const gui = new GUI();

const debugObject = {
  color: "#ff0000",
  spin: () => {},
};

const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
if (!canvas) {
  throw new Error("Canvas element not found");
}

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("Position X");
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Position Y");
gui.add(mesh.position, "z").min(-3).max(3).step(0.01).name("Position Z");
gui
  .add(mesh.rotation, "x")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Rotation X");
gui
  .add(mesh.rotation, "y")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Rotation Y");
gui
  .add(mesh.rotation, "z")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Rotation Z");
gui.add(mesh.scale, "x").min(0.1).max(3).step(0.01).name("Scale X");
gui.add(mesh.scale, "y").min(0.1).max(3).step(0.01).name("Scale Y");
gui.add(mesh.scale, "z").min(0.1).max(3).step(0.01).name("Scale Z");

// cannot use addColor on MeshBasicMaterial directly
// as it does not have a color property, so we need to use the material
gui
  .addColor(debugObject, "color")
  .onChange(() => {
    material.color.set(debugObject.color);
  })
  .name("Color");
gui.add(mesh, "visible").name("Mesh Visible");
gui.add(material, "wireframe").name("Wireframe");

debugObject.spin = () => {
  gsap.to(mesh.rotation, {
    duration: 1,
    x: mesh.rotation.x + Math.PI * 2,
    y: mesh.rotation.y + Math.PI * 2,
    // z: mesh.rotation.z + Math.PI * 2,
    ease: "power1.inOut",
    onUpdate: () => {
      // Update the mesh rotation to reflect the changes
      mesh.rotation.x = mesh.rotation.x;
      mesh.rotation.y = mesh.rotation.y;
      mesh.rotation.z = mesh.rotation.z;
    },
  });
};

gui.add(debugObject, "spin").name("Spin Mesh");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
