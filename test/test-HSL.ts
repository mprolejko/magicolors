import { expect } from "chai";
import { describe, it } from "mocha";

import { HSLColor } from "../src/magicolors";




describe("Magicolors HSLColor", () => {

    it("can be initialized with 1 parameter", () => {
        const s = new HSLColor({H: 5, S: 6, L: 7});
        expect(s.getHSL().H).to.equal(5);
        expect(s.getHSL().S).to.equal(6);
        expect(s.getHSL().L).to.equal(7);
    });
    it("can be initialized with 1 number parameter", () => {
        const s = new HSLColor(5);
        expect(s.getHSL().H).to.equal(5);
        expect(s.getHSL().S).to.equal(100);
        expect(s.getHSL().L).to.equal(50);
    });
    it("can be initialized with 2 number parameter", () => {
        const s = new HSLColor(5, 6);
        expect(s.getHSL().H).to.equal(5);
        expect(s.getHSL().S).to.equal(6);
        expect(s.getHSL().L).to.equal(50);
    });
    it("can be initialized with 3 number parameter", () => {
        const s = new HSLColor(5, 6, 7);
        expect(s.getHSL().H).to.equal(5);
        expect(s.getHSL().S).to.equal(6);
        expect(s.getHSL().L).to.equal(7);
    });
    it("value H wrapd around 360", () => {
        const s1 = new HSLColor(380, 10, 10);
        expect(s1.getHSL().H).to.equal(20);
        const s2 = new HSLColor(-20, 10, 10);
        expect(s2.getHSL().H).to.equal(340);
    });
    it("value S crop at 100 and 0", () => {
        const s1 = new HSLColor(50, 150, 10);
        expect(s1.getHSL().S).to.equal(100);
        const s2 = new HSLColor(50, -10, 10);
        expect(s2.getHSL().S).to.equal(0);
    });
    it("value L crop at 100 and 0", () => {
        const s1 = new HSLColor(50, 50, 110);
        expect(s1.getHSL().L).to.equal(100);
        const s2 = new HSLColor(50, 50, -10);
        expect(s2.getHSL().L).to.equal(0);
    });
    it("for Lightness 0 or 1, all other are 0", () => {
        const s1 = new HSLColor(20, 20, 0);
        expect(s1.getHSL().H).to.equal(0);
        expect(s1.getHSL().S).to.equal(0);
        expect(s1.getHSL().L).to.equal(0);
        const s2 = new HSLColor(20, 20, 1);
        expect(s2.getHSL().H).to.equal(0);
        expect(s2.getHSL().S).to.equal(0);
        expect(s2.getHSL().L).to.equal(100);
    });
    it("for Saturation 0, Hue is 0", () => {
        const s = new HSLColor(20, 0, 0);
        expect(s.getHSL().H).to.equal(0);
        expect(s.getHSL().S).to.equal(0);
        expect(s.getHSL().L).to.equal(0);
    });
    it("gives correct RGB values", () => {
        const s1 = new HSLColor(0, 0, 0);
        expect(s1.getRGB().R).to.equal(0);
        expect(s1.getRGB().G).to.equal(0);
        expect(s1.getRGB().B).to.equal(0);
        const s2 = new HSLColor(0, 100, 100);
        expect(s2.getRGB().R).to.equal(255);
        expect(s2.getRGB().G).to.equal(255);
        expect(s2.getRGB().B).to.equal(255);
        const s3 = new HSLColor(46, 52, 44);
        expect(s3.getRGB().R).to.equal(171);
        expect(s3.getRGB().G).to.equal(143);
        expect(s3.getRGB().B).to.equal(54);
    });
    it("gives correct HSV values", () => {
        const s1 = new HSLColor(0, 0, 0);
        expect(s1.getHSV().H).to.equal(0);
        expect(s1.getHSV().S).to.equal(0);
        expect(s1.getHSV().V).to.equal(0);
        const s2 = new HSLColor(0, 0, 100);
        expect(s2.getHSV().H).to.equal(0);
        expect(s2.getHSV().S).to.equal(0);
        expect(s2.getHSV().V).to.equal(100);
        const s3 = new HSLColor(0, 100, 100);
        expect(s3.getHSV().H).to.equal(0);
        expect(s3.getHSV().S).to.equal(0);
        expect(s3.getHSV().V).to.equal(100);
        const s4 = new HSLColor(0, 100, 50);
        expect(s4.getHSV().H).to.equal(0);
        expect(s4.getHSV().S).to.equal(100);
        expect(s4.getHSV().V).to.equal(100);
        const s5 = new HSLColor(46, 52, 44);
        expect(s5.getHSV().H).to.equal(46);
        expect(s5.getHSV().S).to.equal(68.42);
        expect(s5.getHSV().V).to.equal(66.88);
    });
});
