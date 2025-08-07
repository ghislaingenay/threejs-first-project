import * as THREE from "three";

const group = new THREE.Group();
group.scale.y = 2;
group.rotation.y = 0.2;

group.scale.y = 2;
group.rotation.y = 0.2;

const cubeOne = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
);
cubeOne.position.x = -1.5;
group.add(cubeOne);

const cubeTwo = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
);
cubeTwo.position.x = 0;
group.add(cubeTwo);

const cubeThree = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
);
cubeThree.position.x = 1.5;
group.add(cubeThree);

export { group as GroupObject };
