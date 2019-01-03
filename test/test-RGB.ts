import { expect } from "chai";
import { describe, it } from "mocha";

import { RGBColor } from "../src/RGBColor";


describe("Magicolors RGBColor", () => {



    it("can be initialized with 1 parameter", () => {
        const s = new RGBColor({R: 5, G: 6, B: 7});
        expect(s.getHEX().hex).to.equal("#050607");
        expect(s.getRGB().R).to.equal(5);
        expect(s.getRGB().G).to.equal(6);
        expect(s.getRGB().B).to.equal(7);
    });
    it("can be initialized with 1 number parameter", () => {
        const s = new RGBColor(5);
        expect(s.getHEX().hex).to.equal("#050000");
        expect(s.getRGB().R).to.equal(5);
        expect(s.getRGB().G).to.equal(0);
        expect(s.getRGB().B).to.equal(0);
    });
    it("can be initialized with 2 number parameter", () => {
        const s = new RGBColor(5, 6);
        expect(s.getHEX().hex).to.equal("#050600");
        expect(s.getRGB().R).to.equal(5);
        expect(s.getRGB().G).to.equal(6);
        expect(s.getRGB().B).to.equal(0);
    });
    it("can be initialized with 3 number parameter", () => {
        const s = new RGBColor(5, 6, 7);
        expect(s.getHEX().hex).to.equal("#050607");
        expect(s.getRGB().R).to.equal(5);
        expect(s.getRGB().G).to.equal(6);
        expect(s.getRGB().B).to.equal(7);
    });
    it("values crop at 255 and 0 (-10,300,150)=>(0,255,150) for integers", () => {
        const s = new RGBColor(-10, 300, 150);
        expect(s.getHEX().hex).to.equal("#00ff96");
        expect(s.getRGB().R).to.equal(0);
        expect(s.getRGB().G).to.equal(255);
        expect(s.getRGB().B).to.equal(150);
    });

    let transformTests: {
        args: [number | {R: number, G: number, B: number}, number?, number?],
        hex: string,
        hsv: [number, number, number],
        hsl: [number, number, number],
    }[]
    = [
        {args: [0, 0, 0],           hex: "#000000",    hsv: [0, 0, 0],              hsl: [0, 0, 0]},
        {args: [255, 255, 255],     hex: "#ffffff",    hsv: [0, 0, 100],            hsl: [0, 0, 100]},
        {args: [255, 0, 0],         hex: "#ff0000",    hsv: [0, 100, 100],          hsl: [0, 100, 50]},
        {args: [168, 142, 54],      hex: "#a88e36",    hsv: [46.32, 67.86, 65.88],  hsl: [46.32, 51.35, 43.53]  },
        {args: [241, 25, 176],      hex: "#f119b0",    hsv: [318.06, 89.63, 94.51], hsl: [318.06, 88.52, 52.16] },
        {args: [178, 99, 203],      hex: "#b263cb",    hsv: [285.58, 51.23, 79.61], hsl: [285.58, 50, 59.22]    },
        {args: [95, 231, 135],      hex: "#5fe787",    hsv: [137.65, 58.87, 90.59], hsl: [137.65, 73.91, 63.92] },
        {args: [128, 150, 24],      hex: "#809618",    hsv: [70.48, 84, 58.82],     hsl: [70.48, 72.41, 34.12] },
        {args: [69, 34, 72],        hex: "#452248",    hsv: [295.26, 52.78, 28.24], hsl: [295.26, 35.85, 20.78] },
        {args: [156, 242, 214],     hex: "#9cf2d6",    hsv: [160.47, 35.54, 94.9],  hsl: [160.47, 76.79, 78.04] },
    ];


    transformTests.forEach(function (test) {
        const s = new RGBColor(...(test.args));
        it("gives correct hex values for RGB(" + test.args.join(",") + ")", () => {
            expect(s.getHEX().hex).to.equal(test.hex);
        });
        it("gives correct HSV values for RGB(" + test.args.join(",") + ")", () => {
            expect(s.getHSV().H).to.equal(test.hsv[0]);
            expect(s.getHSV().S).to.equal(test.hsv[1]);
            expect(s.getHSV().V).to.equal(test.hsv[2]);
        });
        it("gives correct HSL values for RGB(" + test.args.join(",") + ")", () => {
            expect(s.getHSL().H).to.equal(test.hsl[0]);
            expect(s.getHSL().S).to.equal(test.hsl[1]);
            expect(s.getHSL().L).to.equal(test.hsl[2]);
        });
    });
});

