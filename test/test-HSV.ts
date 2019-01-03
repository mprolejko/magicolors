import { expect } from "chai";
import { describe, it } from "mocha";

import { HSVColor } from "../src/HSVColor";


describe("Magicolors init tests for HSVColor", () => {
    let initTests: {
        args: [number | {H: number, S: number, V: number}, number?, number?],
        expected: [number, number, number],
        message: string,
    }[]
    = [
        {args: [{H: 5, S: 6, V: 7}],  expected: [5, 6, 7],              message: "can be initialized with 1 parameter"},
        {args: [{H: 0.5, S: 0.5, V: 0.5}],  expected: [180, 50, 50],    message: "can be initialized with 1 parameter"},
        {args: [5],                   expected: [5, 100, 100],           message: "can be initialized with 1 number parameter" },
        {args: [0.5],                 expected: [180, 100, 100],         message: "can be initialized with 1 number parameter" },
        {args: [5, 6],                expected: [5, 6, 100],             message: "can be initialized with 2 number parameter"},
        {args: [0.5, 0.6],            expected: [180, 60, 100],          message: "can be initialized with 2 number parameter"},
        {args: [5, 6, 7],             expected: [5, 6, 7],              message: "can be initialized with 3 number parameter"},
        {args: [0.5, 0.6, 0.7],       expected: [180, 60, 70],          message: "can be initialized with 3 number parameter"},
        {args: [380, 5, 10],          expected: [20, 5, 10],            message: "value H wrapd around 360"},
        {args: [-20, 5, 20],          expected: [340, 5, 20],           message: "value H wrapd around 360"},
        {args: [20, 30, 110],         expected: [20, 30, 100],          message: "value L crop at 100"},
        {args: [20, 30, -10],         expected: [0, 0, 0],              message: "value L crop to 0, and zeros to S and H"},
        {args: [40, 110, 50],         expected: [40, 100, 50],          message: "value S crop at 100"},
        {args: [40, -10, 50],         expected: [0, 0, 50],             message: "value S crop to 0 and zero to H"},
        {args: [80, 20, 0],           expected: [0, 0, 0],              message: "L=0 make H=0 ans S =0"},
        {args: [80, 0, 70],           expected: [0, 0, 70],             message: "for Saturation 0, Hue is 0"},
    ];

    initTests.forEach(function (test) {
        it(test.message, () => {
            const s = new HSVColor(...(test.args));
            expect(s.getHSV().H).to.equal(test.expected[0]);
            expect(s.getHSV().S).to.equal(test.expected[1]);
            expect(s.getHSV().V).to.equal(test.expected[2]);
        });
    });
});


describe("Magicolors transform tests for HSVColor", () => {
    let transformTests: {
        args: [number | {H: number, S: number, V: number}, number?, number?],
        rgb: [number, number, number],
        hsl: [number, number, number],
    }[]
    = [
        {args: [0, 0, 0],         rgb: [0, 0, 0],           hsl: [0, 0, 0]},
        {args: [0, 0, 100],       rgb: [255, 255, 255],     hsl: [0, 0, 100]},
        {args: [0, 100, 100],     rgb: [255, 0, 0],         hsl: [0, 100, 50]},
        {args: [0, 100, 50],      rgb: [128, 0, 0],         hsl: [0, 100, 25]},
        {args: [46, 68, 66],      rgb: [168, 142, 54],      hsl: [46, 51.52, 43.56]},
        {args: [206, 63, 46],     rgb: [43, 85, 117],     hsl: [206, 45.99, 31.51]},
        {args: [338, 73, 20],     rgb: [51, 14, 27],       hsl: [338, 57.48, 12.7]},
        {args: [67, 30, 70],      rgb: [172, 179, 125],     hsl: [67, 25.93, 59.5]},
    ];

    transformTests.forEach(function (test) {
        const s = new HSVColor(...(test.args));
        it("gives correct RGB values for HSV(" + test.args.join(",") + ")", () => {
            expect(s.getRGB().R).to.equal(test.rgb[0]);
            expect(s.getRGB().G).to.equal(test.rgb[1]);
            expect(s.getRGB().B).to.equal(test.rgb[2]);
        });
        it("gives correct HSL values for HSV(" + test.args.join(",") + ")", () => {
            expect(s.getHSL().H).to.equal(test.hsl[0]);
            expect(s.getHSL().S).to.equal(test.hsl[1]);
            expect(s.getHSL().L).to.equal(test.hsl[2]);
        });
    });
});


