import { expect } from "chai";
import { describe, it } from "mocha";

import { HSVColor } from "../src/magicolors";


describe("Magicolors HSVColor", () => {
    it("can be initialized with 1 parameter", () => {
        const s = new HSVColor({H: 5, S: 6, V: 7});
        expect(s.getHSV().H).to.equal(5);
        expect(s.getHSV().S).to.equal(6);
        expect(s.getHSV().V).to.equal(7);
    });
    it("can be initialized with 1 number parameter", () => {
        const s = new HSVColor(5);
        expect(s.getHSV().H).to.equal(5);
        expect(s.getHSV().S).to.equal(100);
        expect(s.getHSV().V).to.equal(100);
    });
    it("can be initialized with 2 number parameter", () => {
        const s = new HSVColor(5, 6);
        expect(s.getHSV().H).to.equal(5);
        expect(s.getHSV().S).to.equal(6);
        expect(s.getHSV().V).to.equal(100);
    });
    it("can be initialized with 3 number parameter", () => {
        const s = new HSVColor(5, 6, 7);
        expect(s.getHSV().H).to.equal(5);
        expect(s.getHSV().S).to.equal(6);
        expect(s.getHSV().V).to.equal(7);
    });
    it("value H wrapd around 360", () => {
        const s1 = new HSVColor(380, 10, 10);
        expect(s1.getHSV().H).to.equal(20);
        const s2 = new HSVColor(-20, 10, 10);
        expect(s2.getHSV().H).to.equal(340);
    });
    it("value S crop at 100 and 0", () => {
        const s1 = new HSVColor(50, 150, 10);
        expect(s1.getHSV().S).to.equal(100);
        const s2 = new HSVColor(50, -10, 10);
        expect(s2.getHSV().S).to.equal(0);
    });
    it("value V crop at 100 and 0", () => {
        const s1 = new HSVColor(50, 50, 110);
        expect(s1.getHSV().V).to.equal(100);
        const s2 = new HSVColor(50, 50, -10);
        expect(s2.getHSV().V).to.equal(0);
    });
    it("for Value 0, all other are 0", () => {
        const s = new HSVColor(20, 20, 0);
        expect(s.getHSV().H).to.equal(0);
        expect(s.getHSV().S).to.equal(0);
        expect(s.getHSV().V).to.equal(0);
    });
    it("for Saturation and Value =0, Hue is 0", () => {
        const s = new HSVColor(20, 0, 0);
        expect(s.getHSV().H).to.equal(0);
        expect(s.getHSV().S).to.equal(0);
        expect(s.getHSV().V).to.equal(0);
    });
    it("gives correct RGB values", () => {
        const s1 = new HSVColor(0, 0, 0);
        expect(s1.getRGB().R).to.equal(0);
        expect(s1.getRGB().G).to.equal(0);
        expect(s1.getRGB().B).to.equal(0);
        const s2 = new HSVColor(0, 100, 100);
        expect(s2.getRGB().R).to.equal(255);
        expect(s2.getRGB().G).to.equal(0);
        expect(s2.getRGB().B).to.equal(0);
        const s3 = new HSVColor(46, 68, 66);
        expect(s3.getRGB().R).to.equal(168);
        expect(s3.getRGB().G).to.equal(142);
        expect(s3.getRGB().B).to.equal(54);
    });
    it("gives correct HSL values", () => {
        const s1 = new HSVColor(0, 0, 0);
        expect(s1.getHSL().H).to.equal(0);
        expect(s1.getHSL().S).to.equal(0);
        expect(s1.getHSL().L).to.equal(0);
        const s2 = new HSVColor(0, 0, 100);
        expect(s2.getHSL().H).to.equal(0);
        expect(s2.getHSL().S).to.equal(0);
        expect(s2.getHSL().L).to.equal(100);
        const s3 = new HSVColor(0, 100, 100);
        expect(s3.getHSL().H).to.equal(0);
        expect(s3.getHSL().S).to.equal(100);
        expect(s3.getHSL().L).to.equal(50);
        const s4 = new HSVColor(0, 50, 100);
        expect(s4.getHSL().H).to.equal(0);
        expect(s4.getHSL().S).to.equal(100);
        expect(s4.getHSL().L).to.equal(75);
        const s5 = new HSVColor(46, 68, 66);
        expect(s5.getHSL().H).to.equal(46);
        expect(s5.getHSL().S).to.equal(51.52);
        expect(s5.getHSL().L).to.equal(43.56);
    });
});
