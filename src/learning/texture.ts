import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { color } from "three/tsl";

/**
 * Textures
 */

/** Handles and keeps track of loaded and pending data */
const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = () => {
  console.log("All resources have been loaded.");
};

loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(
    `Started loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`
  );
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(
    `Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`
  );
};

loadingManager.onError = (url) => {
  console.error(`There was an error loading ${url}`);
};
const textureLoader = new THREE.TextureLoader(loadingManager);
const onLoadTexture = () => {};
const onProgressTexture = () => {};
const onErrorTexture = () => {
  console.error("An error occurred while loading the texture.");
};
const colorTexture = textureLoader.load(
  // "/textures/door/color.jpg",
  "/textures/minecraft.png",
  onLoadTexture,
  onProgressTexture,
  onErrorTexture
);

// colorTexture.repeat.set(2, 3); // Repeat the texture 2 times on the x-axis and 3 times on the y-axis
// colorTexture.wrapS = THREE.MirroredRepeatWrapping; // Set the wrapping mode for the x-axis
// colorTexture.wrapT = THREE.RepeatWrapping; // Set the wrapping mode for the y-axis

// colorTexture.offset.x = 0.5; // Offset the texture on the x-axis by 0.5
// colorTexture.offset.y = 0.5; // Offset the texture on the y-axis by

// roatte in 2D space
// colorTexture.rotation = Math.PI * 0.25; // Rotate the texture by 45 degrees (in radians)
colorTexture.center.set(0.5, 0.5); // pivot point
// colorTexture.minFilter = THREE.NearestFilter; // Set the minification filter to nearest
colorTexture.magFilter = THREE.NearestFilter; // Set the magnification filter to nearest
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
// one texture loader can load p
colorTexture.colorSpace = THREE.SRGBColorSpace; // Use sRGB color space for the texture

const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
if (!canvas) {
  throw new Error("Canvas element not found");
}

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
