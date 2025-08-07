export default function getCanvas(): HTMLCanvasElement {
  const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
  if (!canvas) {
    throw new Error("Canvas element with id 'webgl' not found.");
  }
  return canvas;
}
