import { RGBColor } from "./lib/RGBColor.js";
class ImageHelpers {
}
ImageHelpers.imageData2pixels = (img) => {
    let width = img.width;
    let height = img.height;
    let table = [];
    for (let row = 0; row < height; row++) {
        table[row] = [];
        for (let col = 0; col < width; col++) {
            let index = (col + (row * img.width)) * 4;
            table[row][col] = new RGBColor(img.data[index], img.data[index + 1], img.data[index + 2]);
            table[row][col].alpha = img.data[index + 3] / 255;
        }
    }
    return table;
};
ImageHelpers.pixels2imageData2 = (img) => {
    let height = img.length;
    let width = img[0].length;
    let row = 0, col = 0;
    const arr = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < arr.length; i += 4) {
        col = Math.floor((i % (4 * width)) / 4);
        row = Math.floor(i / (4 * width));
        let c = img[row][col].getRGB();
        arr[i] = c.R;
        arr[i + 1] = c.G;
        arr[i + 2] = c.B;
        arr[i + 3] = img[row][col].alpha * 255;
    }
    return new ImageData(arr, width, height);
};
ImageHelpers.compose = (operation, imgA, imgB) => {
    let width = Math.max(imgA.width, imgB.width);
    let height = Math.max(imgA.height, imgB.height);
    let tableA = ImageHelpers.imageData2pixels(imgA);
    let tableB = ImageHelpers.imageData2pixels(imgB);
    let result = [];
    for (let row = 0; row < height; row++) {
        result[row] = [];
        for (let col = 0; col < width; col++) {
            if (row < imgA.height && row < imgB.height && col < imgA.width && col < imgB.width) {
                result[row][col] = operation(tableA[row][col], tableB[row][col]);
            }
            else if (row < imgA.height && col < imgA.width) {
                result[row][col] = tableA[row][col];
            }
            else if (row < imgB.height && col < imgB.width) {
                result[row][col] = tableB[row][col];
            }
            else {
                result[row][col] = new RGBColor(0, 0, 0);
                result[row][col].alpha = 0; // transparent pixel
            }
        }
    }
    return ImageHelpers.pixels2imageData2(result);
};
export let blending = {
    "multiply": function (imgA, imgB) {
        return ImageHelpers.compose(function (pixBack, pixFront) {
            let c;
            if (typeof pixBack !== "undefined") {
                c = pixBack;
            }
            if (typeof pixFront !== "undefined") {
                if (pixFront.alpha === 1) {
                    c = c.mul(pixFront);
                    c.alpha = 1;
                }
                else if (pixFront.alpha > 0) {
                    if (pixBack.alpha === 1) {
                        c = pixBack.mul(pixFront);
                        let cc = pixBack.sub(c).mul(pixFront.alpha);
                        c = pixBack.sub(cc);
                        c.alpha = 1;
                    }
                    else {
                        // @todo backlayer layer transparency
                        let alpha = pixFront.alpha + (1 - pixFront.alpha) * pixBack.alpha;
                        c.alpha = alpha;
                    }
                }
            }
            return c;
        }, imgA, imgB);
    },
    "normal": function (imgA, imgB) {
        return ImageHelpers.compose(function (pixBack, pixFront) {
            let c;
            if (typeof pixBack !== "undefined") {
                c = pixBack;
            }
            if (typeof pixFront !== "undefined") {
                c = pixFront;
            }
            if (pixFront.alpha < 1) { // semitransparent pixel
                let alpha = pixFront.alpha + (1 - pixFront.alpha) * pixBack.alpha;
                let back = pixBack.mul(pixBack.alpha);
                let front = pixFront.mul(pixFront.alpha);
                let cc = back.mul(1 - pixFront.alpha);
                c = front.add(cc);
                c.alpha = alpha;
            }
            return c;
        }, imgA, imgB);
    },
};
// export namespace Magicolors {
//     export const Color = mColor;
//     export type Color = mColor;
// }
// export { Color } from "./lib/Color";
// export { RGBColor } from "./lib/RGBColor";
// export { HSVColor } from "./lib/HSVColor";
// export { HSLColor } from "./lib/HSLColor";
