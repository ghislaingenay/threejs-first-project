import * as THREE from "three";
import { GroupObject } from "./group_object";
import gsap from "gsap";

const canvas = document.querySelector<HTMLCanvasElement>("#webgl")!;

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

mesh.position.y = -0.8;
mesh.position.x = 0.6;
mesh.position.z = 0.7;

/** set all position in one line
 */
mesh.scale.set(1.5, 0.5, 0.5); // scale the mesh to half its size

mesh.rotation.reorder("XYZ");
mesh.rotation.z = Math.PI * 0.25; // rotate the
mesh.rotation.y = Math.PI * 0.25; // rotate the mesh 45 degrees around the y-axis
mesh.rotation.x = Math.PI * 0.25; // rotate the mesh 45 degrees around the x-axis

const meshVectorLength = mesh.position.length();
const meshDistanceToCamera = mesh.position.distanceTo(camera.position);
const normalizeValue = mesh.position.normalize(); // reduce length of the vector to 1 unit but keep direction

/** Axes helpers
 * Used for visualizing the axes in the 3D space.
 */
const axesHelper = new THREE.AxesHelper(1);
axesHelper.position.y = 0.6;
axesHelper.position.x = 0.6;
scene.add(axesHelper);

console.log({ meshDistanceToCamera, meshVectorLength, normalizeValue });
camera.lookAt(axesHelper.position); // make the camera look at the mesh

scene.add(GroupObject);

renderer.render(scene, camera);

const frameInternal = 0.1; // 100ms = 10fps instead of 500 seconds!
let time = new Date().getTime(); // get current time in milliseconds
// or
const clock = new THREE.Clock();

gsap.to(mesh.position, {
  delay: 1, // delay the animation by 1 second
  ease: "power1.out",
  x: 2, // move the mesh to the right by 2 units
});

// call requestAnimationFrame first for Browser optimization / Consistent Frame Rate / Memory Management
function animate() {
  // delta in ms
  const currentTime = new Date().getTime();
  const deltaTimeS = currentTime - time; // time since last frame in milliseconds
  const deltaTimeMs = deltaTimeS / 1000; // convert to seconds
  time = currentTime; // update time to current time

  requestAnimationFrame(animate);
  // const elapsedTime = clock.getElapsedTime(); // get elapsed time since the start of the animation
  // time = 0;

  mesh.rotation.x += 1.0 * deltaTimeMs; // rotate the mesh around the x-axis
  mesh.rotation.y += 0.5 * deltaTimeMs;

  camera.lookAt(mesh.position); // make the camera look at the mesh
  renderer.render(scene, camera);

  // if use frame limiting
  // if (time > frameInternal) {
  //   const rotationSpeed = 1.0; // radians per second
  //   mesh.rotation.x += rotationSpeed * time; // Use accumulated time
  //   time = 0; // Reset timer
  //   renderer.render(scene, camera);
  // }
}

animate(); // start the animation loop

export { animate as baseAnimation };
