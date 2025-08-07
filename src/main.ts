// import * as THREE from "three";
// import gsap from "gsap";

import { baseAnimation } from "./learning/animation";

// import { GroupObject } from "./group_object";
const canvas = document.querySelector<HTMLCanvasElement>("#webgl")!;

// const canvas = document.querySelector<HTMLCanvasElement>("#webgl")!;

const learning = {
  animation: baseAnimation,
};

// type Mode = keyof typeof learning;
learning.animation();
