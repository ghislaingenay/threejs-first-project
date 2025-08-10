import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
const gui = new GUI();
const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
if (!canvas) {
  throw new Error("Canvas element not found");
}

// Scene
const scene = new THREE.Scene();

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",

  (font) => {
    const textGeometry = new TextGeometry("Hello Three.js", {
      font: font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 24,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.computeBoundingBox(); // Compute the bounding box of the text geometry
    console.log(textGeometry.boundingBox);
    // Center the text geometry
    // textGeometry.translate(
    //   -(textGeometry.boundingBox as THREE.Box3).max.x * 0.5,
    //   -(textGeometry.boundingBox as THREE.Box3).max.y * 0.5,
    //   -(textGeometry.boundingBox as THREE.Box3).max.z * 0.5
    // );
    // OR
    textGeometry.center();
    const material = new THREE.MeshMatcapMaterial();
    const text = new THREE.Mesh(textGeometry, material);

    const matcapTexture = textureLoader.load("/3dtext/matcaps/1.png");
    matcapTexture.colorSpace = THREE.SRGBColorSpace; // Ensure the texture is in sRGB color space
    material.matcap = matcapTexture;

    scene.add(text);

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(donutGeometry, material);

      const randomX = (Math.random() - 0.5) * 10;
      const randomY = (Math.random() - 0.5) * 10;
      const randomZ = (Math.random() - 0.5) * 10;
      donut.position.set(randomX, randomY, randomZ);

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;

      const randomScale = Math.random();
      donut.scale.set(randomScale, randomScale, randomScale);
      scene.add(donut);
    }
  },
  undefined,
  (error) => {
    console.error("An error occurred while loading the font:", error);
  }
);
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

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
