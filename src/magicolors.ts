

abstract class Color {
    /** The alpha channel <0;1> */
    public alpha: number;

    public abstract getHSL(): {H: number; S: number; L: number};
    public abstract getHSV(): {H: number; S: number; V: number};
    public abstract getRGB(): {R: number; G: number; B: number};
    public abstract getHEX(): {hex: string};


    protected abstract operands (value: number | Color): any;
    protected abstract operate ( b: number | Color, type: "add"|"sub"|"mul"|"div"): Color ;

    protected static operations =  {
        "add": (x: number, y: number): number => x + y,
        "div": (x: number, y: number): number => y === 0 ? x : x / y,
        "mul": (x: number, y: number): number => x * y,
        "sub": (x: number, y: number): number => x - y,
    };

    public add (b: number | Color): Color {
        return this.operate(b, "add");
    }
    public sub(b: number | Color): Color {
        return this.operate(b, "sub");
    }
    public mul(b: number | Color): Color {
        return this.operate(b, "mul");
    }
    public div( b: number | Color): Color {
        return this.operate(b, "div");
    }
}

export class RGBColor extends Color {
    /** The channel for red <0;1> */
    private R: number;
    /** The channel for green <0;1> */
    private G: number;
    /** The channel for blue <0;1> */
    private B: number;

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
        let S = L === 0 ? 0 : L === 1 ? 0 : Math.round(100 * (cmax - cmin) / (1 - Math.abs(2 * L - 1)));
        L = Math.round(L * 100);

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
        H = Math.round( H * 60);

        return {H, S, L};
    }

    public getHSV() {
        let r = this.R;
        let g = this.G;
        let b = this.B;

        let cmax = Math.max(r, g, b);
        let cmin = Math.min(r, g, b);
        let delta = cmax - cmin;

        let V = Math.round(cmax * 100);
        let S = cmax === 0 ? 0 : Math.round(100 * delta / cmax);
        let H = 0;
        if (cmax !== 0 && delta !== 0) {
            if (cmax === r) {
                H = Math.round(((g - b) / delta) % 6 * 60);
            } else if (cmax === g) {
                H = Math.round(((b - r) / delta + 2) * 60);
            } else if (cmax === b) {
                H = Math.round(((r - g) / delta + 4) * 60);
            }
        }
        return {H, S, V};
    }

    public getRGB() {
        let to255 = (c: number) => Math.round(c * 255);
        return {R: to255(this.R) , G: to255(this.G), B: to255(this.B)};
    }

    public getHEX() {
        let hex = (c: number) =>  {
            let h = Math.floor(c * 255).toString(16);
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

export class HSVColor extends Color {
    /** The hue channel <0;1> */
    private H: number;
    /** The saturation channel <0;1> */
    private S: number;
    /** The value/brightness channel <0;1> */
    private V: number;

    constructor(color: {H: number, S: number, V: number} | number, s?: number, v?: number) {
        super();
        let H: number, S: number, V: number;
        if (arguments.length === 1 && typeof color === "object" ) {
            H = color.H;
            S = color.S;
            V = color.V;
        } else if (typeof color === "number") {
            H = color;
            S = arguments.length >= 2 ? s : 1;
            V = arguments.length >= 3 ? v : 1;
        }

        let crop = (c: number) =>  c > 100 ? 1 : c > 1 ? c / 100 : c < 0 ? 0 : c;
        this.H = H > 360 ? (H % 360 / 360) : H < 0 ? (H + 360) / 360 : H > 1 ? H / 360 : H ;
        this.S = crop(S);
        this.V = crop(V);
        if (this.V === 0) {
            this.S = 0;
        }
        if (this.S === 0) {
            this.H = 0;
        }
        this.alpha = 0;

        HSVColor.operations.add = (x: number, y: number): number => (x + y) > 1 ? 1 : x + y;
        HSVColor.operations.sub = (x: number, y: number): number => (x - y) < 0 ? 0 : x - y;
        HSVColor.operations.mul = (x: number, y: number): number => x * y;
        HSVColor.operations.div = (x: number, y: number): number => y === 0 ? x : x / y;
    }
    public getHSL() {
        let H = this.H * 360;
        let L = (2 - this.S) * this.V / 2;
        let S = L && L < 1 ? this.S  * this.V / (L < 0.5 ? L * 2 : 2 - L * 2)  : this.S;

        L = Math.round(L * 100);
        S = Math.round(S * 100);

        return {H, S, L};
    }

    public getHSV() {
        let to100 = (c: number) => Math.floor(c * 100);
        return {H: Math.floor(this.H * 360), S: to100(this.S), V: to100(this.V)};
    }

    public getRGB() {
        let R: number, G: number, B: number;
        let c = this.V * this.S;
        let x = c * ( 1 - Math.abs((this.H * 6) % 2 - 1));
        let m = this.V - c;
        let color = {R, G, B};

        if (this.H >= 0 && this.H < 60) {
            color = {R: c, G: x, B: 0};
        } else if (this.H >= 60 && this.H < 120) {
            color = {R: x, G: c, B: 0};
        } else if (this.H >= 120 && this.H < 180) {
            color = {R: 0, G: c, B: x};
        } else  if (this.H >= 180 && this.H < 240) {
            color = {R: 0, G: x, B: c};
        } else if (this.H >= 240 && this.H < 300) {
            color = {R: x, G: 0, B: c};
        } else if (this.H >= 300 && this.H < 360) {
            color = {R: c, G: 0, B: x};
        }
        let to255 = (col: number) => Math.round((col + m) * 255);
        color.R = to255(color.R);
        color.G = to255(color.G);
        color.B = to255(color.B);

        return color;
    }

    public getHEX() {
        let c = new RGBColor(this.getRGB());
        return c.getHEX();
    }

    protected operands (value: number | Color): any {
        let H: number, S: number, V: number, alpha: number;

        if (typeof value === "number") {
            V = value;
            S = value;
            V = value;
            alpha = 1;
        } else {
            let bRGB = (value as Color).getHSV();
            H = bRGB.H;
            S = bRGB.S;
            V = bRGB.V;
            alpha = (value as Color).alpha;
        }
        return {H, S, V, alpha};
    }

    private hueOperations = {
        "add": (x: number, y: number): number => (x + y)  - Math.floor(x + y),
        "div": (x: number, y: number): number =>  y === 0 ? x : x / y,
        "mul": (x: number, y: number): number =>  x * y,
        "sub": (x: number, y: number): number => (x - y + 1) - Math.floor(x - y + 1),
    };
    protected operate( b: number | Color, type: "add"|"sub"|"mul"|"div"): Color {
        let color = new HSVColor(0, 0, 0);
        let {H, S, V, alpha} = this.operands(b);

        color.H = this.hueOperations[type](this.H, H);
        color.S = HSVColor.operations[type](this.S, S);
        color.V = HSVColor.operations[type](this.V, V);
        color.alpha = Color.operations[type](this.alpha, alpha);

        return (color as Color);
    }
}

class ImageHelpers {

    private static imageData2pixels = (img: ImageData): Array<Array<Color>> => {
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
    }
    private static pixels2imageData2 = (img: Array<Array<Color>>): ImageData => {
        let height = img.length;
        let width = img[0].length;
        let  row = 0, col = 0;

        const arr = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < arr.length; i += 4) {
            col = Math.floor((i % (4 * width) ) / 4);
            row = Math.floor(i / (4 * width));
            let c = img[row][col].getRGB();
            arr[i] = c.R;
            arr[i + 1] = c.G;
            arr[i + 2] = c.B;
            arr[i + 3] = img[row][col].alpha * 255;
        }

        return new ImageData(arr, width, height);
    }

    public static compose = (operation: (pA: Color, pb: Color) => Color, imgA: ImageData, imgB: ImageData): ImageData => {
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
                } else if (row < imgA.height && col < imgA.width) {
                    result[row][col] = tableA[row][col];
                } else if (row < imgB.height && col < imgB.width) {
                    result[row][col] = tableB[row][col];
                } else {
                    result[row][col] = new RGBColor(0, 0, 0);
                    result[row][col].alpha = 0; // transparent pixel
                }
            }
        }
        return ImageHelpers.pixels2imageData2(result);
    }
}


export let blending = {
    "multiply" : function(imgA: ImageData, imgB: ImageData): ImageData {
        return ImageHelpers.compose(function(pixBack, pixFront) {
            let c: Color;

            if (typeof pixBack !== "undefined") {
                c = pixBack;
            }
            if (typeof pixFront !== "undefined") {
                if (pixFront.alpha === 1) {
                    c = c.mul(pixFront);
                    c.alpha = 1;
                }
            }

            return c;
        }, imgA, imgB);
    },
    "normal" : function(imgA: ImageData, imgB: ImageData): ImageData {
        return ImageHelpers.compose(function(pixBack, pixFront) {
            let c: Color;

            if (typeof pixBack !== "undefined") {
                c = pixBack;
            }
            if (typeof pixFront !== "undefined") {
                c = pixFront;
            }
            if (pixFront.alpha < 1) { // semitransparent pixel
                let alpha = pixFront.alpha +  (1 - pixFront.alpha) * pixBack.alpha;
                let back  = pixBack.mul(pixBack.alpha);
                let front = pixFront.mul(pixFront.alpha);
                let cc = back.mul(1 - pixFront.alpha);
                c = front.add(cc);

                c.alpha = alpha;
            }
            return c;

        }, imgA, imgB);

    },
};
