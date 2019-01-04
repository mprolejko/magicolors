import { RGBColor } from "./RGBColor.js";
export class Frame extends Image {
    constructor(rgba, width, height, delay) {
        super(width, height);
        this.delay = 0;
        this.toPixels = (rgba) => {
            let type;
            for (let row = 0; row < this.height; row++) {
                this.data[row] = [];
                for (let col = 0; col < this.width; col++) {
                    let index = (col + (row * this.width)) * 4;
                    let rgb = new RGBColor(rgba[index], rgba[index + 1], rgba[index + 2]);
                    this.data[row][col] = rgb.transform(type);
                    this.data[row][col].alpha = rgba[index + 3] / 255;
                }
            }
        };
        this.fromPixels = () => {
            let type;
            let row = 0, col = 0;
            const arr = new Uint8ClampedArray(this.width * this.height * 4);
            for (let i = 0; i < arr.length; i += 4) {
                col = Math.floor((i % (4 * this.width)) / 4);
                row = Math.floor(i / (4 * this.width));
                let c = this.data[row][col].getRGB();
                arr[i] = c.R;
                arr[i + 1] = c.G;
                arr[i + 2] = c.B;
                arr[i + 3] = this.data[row][col].alpha * 255;
            }
            return new ImageData(arr, this.width, this.height);
        };
        this.delay = delay;
        let type;
        this.data = [];
        if (rgba instanceof Uint8ClampedArray) {
            this.toPixels(rgba);
        }
        else if (rgba !== null) {
            this.data = rgba;
        }
    }
}
