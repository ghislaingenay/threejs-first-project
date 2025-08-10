import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

const gui = new GUI();
const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
if (!canvas) {
  throw new Error("Canvas element not found");
}

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const doorColorTexture = textureLoader.load("/materials/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/materials/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/materials/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/materials/door/height.jpg");
const doorNormalTexture = textureLoader.load("/materials/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "/materials/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/materials/door/roughness.jpg"
);

//  map and matcap are supposed to be encoded in sRGB
const matcapTexture = textureLoader.load("/materials/matcaps/5.png");
const gradientTexture = textureLoader.load("/materials/gradients/3.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;
// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Meshes
 
 */

const materials = {
  basic: () => {
    // Mesh Basic Material
    const material = new THREE.MeshBasicMaterial();
    material.map = doorColorTexture;
    material.color = new THREE.Color(0x00ff00);
    material.color = new THREE.Color("red");

    material.transparent = true; // Enable transparency
    material.opacity = 0.6;
    material.alphaMap = doorAlphaTexture; // Use alpha map for transparency
    material.side = THREE.DoubleSide; // Render both sides of the geometry
    return material;
  },
  // MeshNormalMaterial
  // Red = X-axis normal direction
  // Green = Y-axis normal direction
  // Blue = Z-axis normal direction
  // Mixed colors = Combined normal directions
  normal: () => {
    // Mesh Normal Material
    const material = new THREE.MeshNormalMaterial();
    material.flatShading = true; // Enable flat shading
    return material;
  },
  // Provides realistic lighting effects without needing lights
  // Mesh will appear as if it is made of a material with a specific appearance
  matcap: () => {
    // Mesh Matcap Material

    const material = new THREE.MeshMatcapMaterial();
    material.matcap = matcapTexture; // Use matcap texture
    return material;
  },
  // Mesh Depth Material
  // Color the geometry in white if it is in front of the camera and black if it is behind
  depth: () => {
    const material = new THREE.MeshDepthMaterial();
    return material;
  },
  // MeshLambertMaterial
  // requires lights to work
  // Simulates diffuse reflection, making surfaces appear lit by a light source
  lambert: () => {
    const material = new THREE.MeshLambertMaterial();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 30);
    pointLight.position.set(2, 3, 4); // Position the light
    scene.add(pointLight);
    return material;
  },
  // MeshPhongMaterial
  // similar to MeshLambertMaterial but with specular highlights => can see light reflection on the surface of the geometrys
  // Les perfomant than MeshLambertMaterial
  phong: () => {
    const material = new THREE.MeshPhongMaterial();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 60);
    pointLight.position.set(2, 3, 4); // Position the light
    scene.add(pointLight);

    material.shininess = 100; // Set shininess for specular highlights
    material.specular = new THREE.Color(0x111111); // Set specular color

    return material;
  },
  toon: () => {
    // Mesh Toon Material
    const material = new THREE.MeshToonMaterial();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 60);
    pointLight.position.set(2, 3, 4); // Position the light
    scene.add(pointLight);

    // we can control how the CPU handles such texture
    gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.generateMipmaps = false; // Disable mipmaps for toon shading
    // Toon shading requires sharp, distinct color bands - not smooth gradients.

    material.gradientMap = gradientTexture; // Use gradient texture for toon shading
    return material;
  },
  // Use Physical Based Rendering (PBR) materials
  // MeshStandardMaterial
  // simulates realistic materials with properties like metalness and roughness
  // Requires lights to work
  standard: () => {
    const material = new THREE.MeshStandardMaterial();

    // lights
    // const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft ambient light
    // scene.add(ambientLight);

    // const pointLight = new THREE.PointLight(0xffffff, 60);
    // pointLight.position.set(2, 3, 4); // Position the light
    // scene.add(pointLight);

    material.metalness = 0.7;
    material.roughness = 0.2; // Set roughness for a shiny surface

    gui.add(material, "metalness").min(0).max(1).step(0.01).name("Metalness");
    gui.add(material, "roughness").min(0).max(1).step(0.01).name("Roughness");

    const rgbeLoader = new RGBELoader(loadingManager);
    rgbeLoader.load("/materials/environmentMap/2k.hdr", (environmentMap) => {
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = environmentMap; // Set the scene's environment map
      scene.background = environmentMap; // Set the scene's background
    });

    material.map = doorColorTexture;
    // aoMap (ambient oclcusion map) will add shadows where the texture is dark
    material.aoMap = doorAmbientOcclusionTexture;
    material.aoMapIntensity = 1;
    material.displacementMap = doorHeightTexture; // Use height map for displacement
    material.displacementScale = 0.1;
    // instead of using metalness or roughness attributes, can use maps
    material.metalnessMap = doorMetalnessTexture; // Use metalness map
    material.roughnessMap = doorRoughnessTexture; // Use roughness map
    // need to reset rough and metalness to 1 to work
    material.metalness = material.roughness = 1;
    // normal map will fake the normal orientation and add details regardless the subdivision of the geometry
    material.normalMap = doorNormalTexture; // Use normal map for surface details
    // chnage normal intensity
    material.normalScale.set(0.5, 0.5); // Adjust normal map
    material.transparent = true; // Enable transparency
    material.alphaMap = doorAlphaTexture; // Use alpha map for transparency

    return material;
  },
  // MeshPhysicalMaterial
  // extends MeshStandardMaterial with additional properties for more realistic rendering
  // simulates materials with properties like clearcoat, sheen, and transmission
  physical: () => {
    const material = new THREE.MeshPhysicalMaterial();
    // gui.add(material, "metalness").min(0).max(1).step(0.01).name("Metalness");
    // gui.add(material, "roughness").min(0).max(1).step(0.01).name("Roughness");

    const rgbeLoader = new RGBELoader(loadingManager);
    rgbeLoader.load("/materials/environmentMap/2k.hdr", (environmentMap) => {
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = environmentMap; // Set the scene's environment map
      scene.background = environmentMap; // Set the scene's background
    });

    material.map = doorColorTexture;
    // aoMap (ambient oclcusion map) will add shadows where the texture is dark
    material.aoMap = doorAmbientOcclusionTexture;
    material.aoMapIntensity = 1;
    material.displacementMap = doorHeightTexture; // Use height map for displacement
    material.displacementScale = 0.1;
    // instead of using metalness or roughness attributes, can use maps
    material.metalnessMap = doorMetalnessTexture; // Use metalness map
    material.roughnessMap = doorRoughnessTexture; // Use roughness map
    // need to reset rough and metalness to 1 to work
    material.metalness = material.roughness = 1;
    // normal map will fake the normal orientation and add details regardless the subdivision of the geometry
    material.normalMap = doorNormalTexture; // Use normal map for surface details
    // chnage normal intensity
    material.normalScale.set(0.5, 0.5); // Adjust normal map
    material.transparent = true; // Enable transparency
    material.alphaMap = doorAlphaTexture; // Use alpha map for transparency

    // Additional properties for MeshPhysicalMaterial
    // clearcoat simulates a glossy layer on top of the material
    // material.clearcoat = 0.5; // Set clearcoat level
    // gui.add(material, "clearcoat").min(0).max(1).step(0.01).name("Clearcoat");
    // material.clearcoatRoughness = 0.1; // Set clearcoat roughness

    // sheen simulates a soft, diffuse reflection => usually used for fabrics
    // It adds a subtle sheen effect to the material, enhancing its appearance
    // material.sheen = 0.5; // Set sheen level
    // gui.add(material, "sheen").min(0).max(1).step(0.01).name("Sheen");
    // gui
    //   .add(material, "sheenRoughness")
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .name("Sheen Roughness");
    // material.sheenColor = new THREE.Color(0xffffff); // Set sheen color
    // gui.addColor(material, "sheenColor").name("Sheen Color");

    // transmission simulates light passing through the material
    material.transmission = 0.8; // Set transmission level
    gui
      .add(material, "transmission")
      .min(0)
      .max(1)
      .step(0.01)
      .name("Transmission");
    material.thickness = 10; // Set thickness for transmission
    gui.add(material, "thickness").min(0).max(100).step(0.1).name("Thickness");
    material.ior = 1.5; // Index of refraction for transmission
    gui.add(material, "ior").min(1).max(2.5).step(0.01).name("IOR");

    // The objects feel translucent
    // Diamond ior: 2.42
    // Water ior: 1.33
    // Air ior: 1.0003

    // Iridescence simulates a color shift based on viewing angle
    // Create color artifacts like a fuel puddle, soap bubble, or butterfly wings
    // material.iridescence = 0.5; // Set iridescence level
    // material.iridescenceIOR = 1.5; // Index of refraction for iridescence
    // material.iridescenceThicknessRange = [100, 400]; // Thickness range for iridescence
    // gui
    //   .add(material, "iridescence")
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .name("Iridescence");
    // gui
    //   .add(material, "iridescenceIOR")
    //   .min(1)
    //   .max(2.333)
    //   .step(0.0001)
    //   .name("Iridescence IOR");
    // gui
    //   .add(material.iridescenceThicknessRange, "0")
    //   .min(0)
    //   .max(1000)
    //   .step(1)
    //   .name("Iridescence Thickness Range");
    // gui
    //   .add(material.iridescenceThicknessRange, "1")
    //   .min(0)
    //   .max(1000)
    //   .step(1)
    //   .name("Iridescence Thickness Range");

    return material;
  },
};

const material = materials.physical();

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

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

  [sphere, plane, torus].forEach((mesh) => {
    mesh.rotation.y = elapsedTime * 0.1;
    mesh.rotation.x = -elapsedTime * 0.15;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
