import { Color } from "./Color";

export class RGBColor extends Color {
    /** The channel for red <0;1> */
    private R: number;
    /** The channel for green <0;1> */
    private G: number;
    /** The channel for blue <0;1> */
    private B: number;

    public colorNames: { [name: string]: [number, number, number] } =
    {   "black": [0, 0, 0],
        "blue":  [0, 255, 0],
        "green":  [0, 0, 255],
        "red":  [255, 0, 0],
        "white":  [255, 255, 255],
    };
    public colorByName(name: string): Color {
        return new RGBColor(...(this.colorNames[name]));
    }

    constructor(color: {R: number, G: number, B: number} | number, g?: number, b?: number) {
        super();
        let R: number, G: number, B: number;
        if (arguments.length === 1 && typeof color === "object" ) {
            R = color.R;
            G = color.G;
            B = color.B;
        } else if (typeof color === "number") {
            R = color;
            G = arguments.length >= 2 ? g : 0;
            B = arguments.length >= 3 ? b : 0;
        }
        let crop = (c: number) =>  c > 255 ? 1 : c >= 1 ? c / 255 : c < 0 ? 0 : c;

        this.R = crop(R);
        this.G = crop(G);
        this.B = crop(B);

        RGBColor.operations.add = (x: number, y: number): number => (x + y) > 1 ? 1 : x + y;
        RGBColor.operations.sub = (x: number, y: number): number => (x - y); // < 0 ? 0 : x - y;
        RGBColor.operations.mul = (x: number, y: number): number => x * y;
        RGBColor.operations.div = (x: number, y: number): number => y === 0 ? x : x / y;
    }
    public getHSL() {
        let r = this.R;
        let g = this.G;
        let b = this.B;

        let cmax = Math.max(r, g, b);
        let cmin = Math.min(r, g, b);
        let delta = cmax - cmin;

        let L = (cmax + cmin) / 2;
        let S = L === 0 ? 0 : L === 1 ? 0 : Color.fixed(100 * (cmax - cmin) / (1 - Math.abs(2 * L - 1)));
        L = Color.fixed(L * 100);

        let H = 0;
        if (cmax !== 0 && delta !== 0) {
            if (cmax === r) {
                H = ((g - b) / delta) % 6;
            } else if (cmax === g) {
                H = (b - r) / delta + 2;
            } else if (cmax === b) {
                H = (r - g) / delta + 4;
            }
        }
        H = Color.fixed( (H * 60 + 360) % 360) ;

        return {H, S, L};
    }

    public getHSV() {
        let r = this.R;
        let g = this.G;
        let b = this.B;

        let cmax = Math.max(r, g, b);
        let cmin = Math.min(r, g, b);
        let delta = cmax - cmin;

        let V = Color.fixed(cmax * 100);
        let S = cmax === 0 ? 0 : Color.fixed(100 * delta / cmax);
        let H = 0;
        if (cmax !== 0 && delta !== 0) {
            if (cmax === r) {
                H = ((g - b) / delta) % 6;
            } else if (cmax === g) {
                H = (b - r) / delta + 2;
            } else if (cmax === b) {
                H = (r - g) / delta + 4;
            }
        }

        return {H: Color.fixed((H * 60 + 360) % 360), S, V};
    }

    public getRGB() {
        let to255 = (c: number) => Math.round(c * 255);
        return {R: to255(this.R) , G: to255(this.G), B: to255(this.B)};
    }

    public getHEX() {
        let hex = (c: number) =>  {
            let h = Math.round(c * 255).toString(16);
            return h.length === 1 ? "0" + h : h;
        };
        return {hex : "#" + hex(this.R) + hex(this.G) + hex(this.B)};
    }

    protected operands (value: number | Color): any {
        let R: number, G: number, B: number, alpha: number;

        if (typeof value === "number") {
            R = value;
            G = value;
            B = value;
            alpha = 1;
        } else {
            let bRGB = (value as Color).getRGB();
            R = bRGB.R / 255;
            G = bRGB.G / 255;
            B = bRGB.B / 255;
            alpha = (value as Color).alpha;
        }
        return {R, G, B, alpha};
    }

    protected operate( b: number | Color, type: "add"|"sub"|"mul"|"div"): Color {
        let color = new RGBColor(0, 0, 0);

        let {R, G, B, alpha} = this.operands(b);

        color.R = RGBColor.operations[type](this.R, R);
        color.G = RGBColor.operations[type](this.G, G);
        color.B = RGBColor.operations[type](this.B, B);

        return (color as Color);
    }

}
