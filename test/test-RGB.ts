import { expect } from "chai";
import { describe, it } from "mocha";

import { RGBColor } from "../src/magicolors";


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
    it("gives correct HSV values", () => {
        const s1 = new RGBColor(0, 0, 0);
        expect(s1.getHSV().H).to.equal(0);
        expect(s1.getHSV().S).to.equal(0);
        expect(s1.getHSV().V).to.equal(0);
        const s2 = new RGBColor(255, 255, 255);
        expect(s2.getHSV().H).to.equal(0);
        expect(s2.getHSV().S).to.equal(0);
        expect(s2.getHSV().V).to.equal(100);
        const s3 = new RGBColor(168, 142, 54);
        expect(s3.getHSV().H).to.equal(46.32);
        expect(s3.getHSV().S).to.equal(67.86);
        expect(s3.getHSV().V).to.equal(65.88);
    });
    it("gives correct HSL values", () => {
        const s1 = new RGBColor(0, 0, 0);
        expect(s1.getHSL().H).to.equal(0);
        expect(s1.getHSL().S).to.equal(0);
        expect(s1.getHSL().L).to.equal(0);
        const s2 = new RGBColor(255, 255, 255);
        expect(s2.getHSL().H).to.equal(0);
        expect(s2.getHSL().S).to.equal(0);
        expect(s2.getHSL().L).to.equal(100);
        const s3 = new RGBColor(168, 142, 54);
        expect(s3.getHSL().H).to.equal(46.32);
        expect(s3.getHSL().S).to.equal(51.35);
        expect(s3.getHSL().L).to.equal(43.53);
    });
});

