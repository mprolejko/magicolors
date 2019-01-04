import { Color } from "./Color";
import { Frame } from "./Frame";

import * as fs from "fs";

let jpeg = require("jpeg-js");
let png = require("pngparse");
let gif = require("omggif");

// refactored code from 'readimage' package https://github.com/revisitors/readimage
function parseGif<T extends Color>( buffer: Buffer, callback: (err: Error, frames?: Frame<T>[]) =>  Frame<T>[]):  Frame<T>[] {
  let image;
  try {
    image = new gif.GifReader(buffer);
  } catch (e) {
    return callback(e);
  }

  let frameCount = image.numFrames();
  let frames: Frame<T>[]; // = new Buffer [frameCount];

  for (let i = 0; i < frameCount; i++) {
    let frameInfo = image.frameInfo(i);
    let rgba = new Array(frameInfo.width * frameInfo.height * 4);
    image.decodeAndBlitFrameRGBA(i, rgba);
    frames[i] = new Frame<T>(rgba, image.width, image.height, frameInfo.delay * 10);
  }
  return callback(null, frames);
}

function parsePng<T extends Color>( buffer: Buffer, callback: (err: Error, frames?: Frame<T>[]) =>  Frame<T>[]):  Frame<T>[] {
  return png.parse(buffer, function (err, image) {
    if (err) {
      return callback(err);
    }
    let rgba = image.data;
    if (image.channels === 1) {
      rgba = new Buffer(image.height * image.width * 4);
      for (let i = 0; i < image.data.length; i++) {
        let idx = i * 4;
        rgba[idx] = rgba[idx + 1] = rgba[idx + 2] = image.data[i];
        rgba[idx + 3] = 0xff;
      }
    }
    if (image.channels === 2) {
      rgba = new Buffer(image.height * image.width * 4);
      for (let i = 0; i < image.data.length; i += 2) {
        let idx = (i / 2) * 4;
        rgba[idx] = rgba[idx + 1] = rgba[idx + 2] = image.data[i];
        rgba[idx + 3] = image.data[i + 1];
      }
    }
    if (image.channels === 3) {
      rgba = new Buffer(image.height * image.width * 4);
      for (let i = 0; i < image.data.length; i += 3) {
        let idx = (i / 3) * 4;
        rgba[idx] = image.data[i];
        rgba[idx + 1] = image.data[i + 1];
        rgba[idx + 2] = image.data[i + 2];
        rgba[idx + 3] = 0xff;
      }
    }
    let img = new Frame<T>(rgba, image.height, image.width);
    return callback(null, [img]);
  });
}

function parseJpg<T extends Color>( buffer: Buffer, callback: (err: Error, frames?: Frame<T>[]) =>  Frame<T>[]):  Frame<T>[] {
  let image;
  try {
    image = jpeg.decode(buffer);
  } catch (e) {
    return callback(e);
  }
  let img = new Frame<T>(image.data, image.height, image.width);
  return callback(null, [img]);
}

export class ColorImage<T extends Color> {
     public width: number;
     public height: number;
    public frames: Frame<T>[];

    constructor(data: string | ImageData | {width: number, height: number}) {
        if (typeof data === "string" ) {
            this.readFile(data);
        } else if (typeof data === "object" && data instanceof ImageData) {
            // read from imageData
        } else {
            // create black image
            this.width = data.width;
            this.height = data.height;
            let pixelArray: T[][];
            for (let row = 0; row < this.height; row++) {
                pixelArray[row] = [];
                for (let col = 0; col < this.width; col++) {
                    pixelArray[row][col] = Color.getColorByName<T>("black");
                }
            }
            this.frames[0] = new Frame<T>(pixelArray, 0, data.width, data.height);
        }
    }

    private readFile = (filename: string): void => {
        let filedata = fs.readFileSync(filename);
        let ext = filename.split(".").pop();

        let callback = (err: any, image: any): any => {
            return image;
        };
        switch (ext) {
            case "jpg":
            case "jpeg":
                this.frames = parseJpg(filedata, callback);
                break;
            case "png":
                this.frames = parsePng(filedata, callback);
                break;
            case "gif":
                this.frames = parseGif(filedata, callback);
        }
    }

}


