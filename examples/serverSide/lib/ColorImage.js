"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Frame_1 = require("./Frame");
const Image = require("canvas").Image;
const ImageData = require("canvas").ImageData;
const canvas = require("canvas");
// import * as fs from "fs";
// import { RGBColor } from "./RGBColor";
// let jpeg = require("jpeg-js");
// let png = require("pngparse");
// let gif = require("omggif");
function decodeBase64Image(dataString) {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
    if (matches.length !== 3) {
        return new Error("Invalid input string");
    }
    // response = {type : matches[1], data : new Buffer(matches[2], "base64")};
    return new Buffer(matches[2], "base64");
}
function getBinary(img) {
    const ca = canvas.createCanvas(img.width, img.height);
    const ctx = ca.getContext("2d");
    let imageData = new ImageData(img.imageData, img.width, img.height);
    ctx.putImageData(imageData, 0, 0);
    // let imgage = new Image();
    // img.src = ca.toDataURL();
    return ca.toDataURL();
    // return decodeBase64Image(ca.toDataURL());
}
exports.getBinary = getBinary;
function loadImage(fileName, type, after) {
    canvas.loadImage(fileName).then((image) => {
        const ca = canvas.createCanvas(image.width, image.height);
        const ctx = ca.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        let colorImage = new Frame_1.Frame(imageData.data, image.width, image.height, type);
        return after(null, colorImage);
    }).catch((error) => {
        console.log("bad thing", error.message, error.stack);
    });
    canvas.createImageData(12, 12);
    // let filedata = fs.readFileSync(fileName);
    // let ext = fileName.split(".").pop();
    // let callback = (err: any, image: Frame<T>[]): any => {
    //   if (err) {
    //     return after(err);
    //   }
    //   let colorImage = new ColorImage<T>({width: image[0].width, height: image[0].height}, type);
    //   colorImage.frames = image;
    //   return after(null, colorImage);
    // };
    // switch (ext) {
    //     case "jpg":
    //     case "jpeg":
    //         parseJpg(filedata, callback);
    //         break;
    //     case "png":
    //         parsePng(filedata, callback);
    //         break;
    //     case "gif":
    //         parseGif(filedata, callback);
    // }
}
exports.loadImage = loadImage;
// // refactored code from 'readimage' package https://github.com/revisitors/readimage
// function parseGif<T extends Color>( buffer: Buffer, callback: (err: Error, frames?: Frame<T>[]) =>  Frame<T>[]):  Frame<T>[] {
//   let image;
//   try {
//     image = new gif.GifReader(buffer);
//   } catch (e) {
//     return callback(e);
//   }
//   let frameCount = image.numFrames();
//   let frames: Frame<T>[]; // = new Buffer [frameCount];
//   for (let i = 0; i < frameCount; i++) {
//     let frameInfo = image.frameInfo(i);
//     let rgba = new Array(frameInfo.width * frameInfo.height * 4);
//     image.decodeAndBlitFrameRGBA(i, rgba);
//     frames[i] = new Frame<T>(rgba, image.width, image.height, frameInfo.delay * 10);
//   }
//   return callback(null, frames);
// }
// function parsePng<T extends Color>( buffer: Buffer, callback: (err: Error, frames?: Frame<T>[]) =>  Frame<T>[]):  void {
//   png.parse(buffer, function (err, image) {
//     if (err) {
//       return callback(err);
//     }
//     let rgba = image.data;
//     if (image.channels === 1) {
//       rgba = new Buffer(image.height * image.width * 4);
//       for (let i = 0; i < image.data.length; i++) {
//         let idx = i * 4;
//         rgba[idx] = rgba[idx + 1] = rgba[idx + 2] = image.data[i];
//         rgba[idx + 3] = 0xff;
//       }
//     }
//     if (image.channels === 2) {
//       rgba = new Buffer(image.height * image.width * 4);
//       for (let i = 0; i < image.data.length; i += 2) {
//         let idx = (i / 2) * 4;
//         rgba[idx] = rgba[idx + 1] = rgba[idx + 2] = image.data[i];
//         rgba[idx + 3] = image.data[i + 1];
//       }
//     }
//     if (image.channels === 3) {
//       rgba = new Buffer(image.height * image.width * 4);
//       for (let i = 0; i < image.data.length; i += 3) {
//         let idx = (i / 3) * 4;
//         rgba[idx] = image.data[i];
//         rgba[idx + 1] = image.data[i + 1];
//         rgba[idx + 2] = image.data[i + 2];
//         rgba[idx + 3] = 0xff;
//       }
//     }
//     let img = new Frame<T>(rgba, image.height, image.width);
//     return callback(null, [img]);
//   });
// }
// function parseJpg<T extends Color>( buffer: Buffer, callback: (err: Error, frames?: Frame<T>[]) =>  Frame<T>[]):  Frame<T>[] {
//   let image;
//   try {
//     image = jpeg.decode(buffer);
//   } catch (e) {
//     return callback(e);
//   }
//   let img = new Frame<T>(image.data, image.height, image.width);
//   return callback(null, [img]);
// }
// export class ColorImage<T extends Color> {
//     public width: number;
//     public height: number;
//     public frames: Frame<T>[];
//     constructor( data: {width: number, height: number}, type?: any) {
//       this.frames = [];
//       if (arguments.length === 1) {
//         type = RGBColor;
//       }
//         // if (typeof data === "string" ) {
//         //     this.readFile(data);
//         // } else
//         // if (typeof data === "object" && data instanceof ImageData) {
//         //     // read from imageData
//         // } else {
//             // create black image
//             this.width = data.width;
//             this.height = data.height;
//             let pixelArray = [];
//             for (let row = 0; row < this.height; row++) {
//                 pixelArray[row] = [];
//                 for (let col = 0; col < this.width; col++) {
//                     pixelArray[row][col] = Color.getColorByName<T>("black", type);
//                 }
//             }
//             this.frames[0] = new Frame<T>(pixelArray, 0, data.width, data.height, type);
//         // }
//     }
// }
