import { Color } from "./Color";
import { Frame } from "./Frame";

const canvas = require("canvas");
const ImageData = canvas.ImageData;

function decodeBase64Image(dataString) {
  let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }
  return new Buffer(matches[2], "base64");
}

export function getBase64Image(img: {imageData: Uint8ClampedArray, width: number, height: number}) {
  return decodeBase64Image(getDataURL(img));
}

export function getImageData(img: {imageData: Uint8ClampedArray, width: number, height: number}): ImageData {
  const ca = canvas.createCanvas(img.width, img.height);
  const ctx = ca.getContext("2d");
  return new ImageData(img.imageData, img.width, img.height);
}

export function getDataURL(img: {imageData: Uint8ClampedArray, width: number, height: number}): string {
  const ca = canvas.createCanvas(img.width, img.height);
  const ctx = ca.getContext("2d");
  let imageData = new ImageData(img.imageData, img.width, img.height);
  ctx.putImageData(imageData, 0, 0);
  return ca.toDataURL();
}

export function loadImage<T extends Color>(fileName: string, type: any, after: (err: Error, image?: Frame<T>) => any): void {
  canvas.loadImage(fileName).then((image) => {

    const ca = canvas.createCanvas(image.width, image.height);
    const ctx = ca.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);


    let colorImage = new Frame<T>(imageData.data, image.width, image.height, type);
    return after(null, colorImage);
  }).catch((error: Error) => {
    console.log("bad thing", error.message, error.stack);
  });
}

