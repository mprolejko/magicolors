import { RGBColor } from "./lib/RGBColor.js";
import { Frame } from "./lib/Frame.js";
let compose = (operation, imgA, imgB) => {
    let width = Math.max(imgA.width, imgB.width);
    let height = Math.max(imgA.height, imgB.height);
    let tableA = new Frame(imgA.data, imgA.width, imgA.height); // ImageHelpers.imageData2pixels(imgA);
    let tableB = new Frame(imgB.data, imgB.width, imgB.height); // ImageHelpers.imageData2pixels(imgB);
    let result = new Frame(null, width, height);
    for (let row = 0; row < height; row++) {
        result.data[row] = [];
        for (let col = 0; col < width; col++) {
            if (row < imgA.height && row < imgB.height && col < imgA.width && col < imgB.width) {
                let color = operation(tableA.data[row][col], tableB.data[row][col]);
                let rgb = new RGBColor(color.getRGB());
                rgb.alpha = color.alpha;
                result.data[row][col] = rgb;
            }
            else if (row < imgA.height && col < imgA.width) {
                result.data[row][col] = tableA.data[row][col];
            }
            else if (row < imgB.height && col < imgB.width) {
                result.data[row][col] = tableB.data[row][col];
            }
            else {
                result.data[row][col] = new RGBColor(0, 0, 0);
                result.data[row][col].alpha = 0; // transparent pixel
            }
        }
    }
    return result.fromPixels();
};
export let blending = {
    "multiply": function (imgA, imgB) {
        return compose(function (pixBack, pixFront) {
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
        return compose(function (pixBack, pixFront) {
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
