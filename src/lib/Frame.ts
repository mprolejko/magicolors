import { Color } from "./Color";
import { RGBColor } from "./RGBColor";

export class Frame<T extends Color> extends Image {
    public data: T[][];
    public delay = 0;
    constructor(rgba: T[][] | Uint8ClampedArray, width: number, height: number, delay?: number) {
        super(width, height);
        this.delay = delay;
        let type: new () => T;
        this.data = [];
        if (rgba instanceof Uint8ClampedArray) {
          this.toPixels(rgba);
        } else if (rgba !== null) {
          this.data = rgba;
        }
    }

    private toPixels = (rgba: Buffer | Uint8ClampedArray): void => {
      let type: new () => T;
      for (let row = 0; row < this.height; row++) {
        this.data[row] = [];
        for (let col = 0; col < this.width; col++) {
            let index = (col + (row * this.width)) * 4;
            let rgb = new RGBColor(rgba[index], rgba[index + 1], rgba[index + 2]);
            this.data[row][col] = rgb.transform(type) as T;
            this.data[row][col].alpha = rgba[index + 3] / 255;
        }
      }
    }

    public fromPixels = (): ImageData => {
      let type: new () => T;
      let  row = 0, col = 0;

      const arr = new Uint8ClampedArray(this.width * this.height * 4);
      for (let i = 0; i < arr.length; i += 4) {
          col = Math.floor((i % (4 * this.width) ) / 4);
          row = Math.floor(i / (4 * this.width));
          let c = this.data[row][col].getRGB();
          arr[i] = c.R;
          arr[i + 1] = c.G;
          arr[i + 2] = c.B;
          arr[i + 3] = this.data[row][col].alpha * 255;
      }

      return new ImageData(arr, this.width, this.height);
    }
}
