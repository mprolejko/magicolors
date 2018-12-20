

abstract class Color {
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
    // channels as 0:255 values
    private R: number;
    private G: number;
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
        if (Number.isInteger(R) && Number.isInteger(G) && Number.isInteger(B)) {
            this.R = R > 255 ? 255 : (R < 0 ? 0 : R);
            this.G = G > 255 ? 255 : (G < 0 ? 0 : G);
            this.B = B > 255 ? 255 : (B < 0 ? 0 : B);
        } else {
            let to255 = c => Math.floor(c * 255);
            this.R = R > 1 ? 255 : (R < 0 ? 0 : to255(R));
            this.G = G > 1 ? 255 : (G < 0 ? 0 : to255(G));
            this.B = B > 1 ? 255 : (B < 0 ? 0 : to255(B));
        }
        this.alpha = 0;

        // overriding operations for 0-255 channel function
        RGBColor.operations.add = (x: number, y: number): number => (x + y) > 255 ? 255 : x + y;
        RGBColor.operations.sub = (x: number, y: number): number => (x - y) < 0 ? 0 : x - y;
        RGBColor.operations.mul = (x: number, y: number): number => x * y / 255;
        RGBColor.operations.div = (x: number, y: number): number => y === 0 ? x : x / y;

    }
    public getHSL() {
        let r = this.R / 255;
        let g = this.G / 255;
        let b = this.B / 255;

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
        let r = this.R / 255;
        let g = this.G / 255;
        let b = this.B / 255;

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
        return {R: this.R , G: this.G, B: this.B};
    }

    public getHEX() {
        let hex = (c: number) =>  {
            let h = c.toString(16);
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
            R = bRGB.R;
            G = bRGB.G;
            B = bRGB.B;
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
        // color.alpha = Color.operations[type](this.alpha, alpha);

        return (color as Color);
    }

}

export class HSVColor extends Color {
    // channels as 0:1 values
    private H: number;
    private S: number;
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
            S = arguments.length >= 2 ? s : 100;
            V = arguments.length >= 3 ? v : 100;
        }
        if (Number.isInteger(H) && Number.isInteger(S) && Number.isInteger(V)) {
            this.H = (H + 10 * 360) % 360; // ugly workaround
            this.S = S > 100 ? 100 : (S < 0 ? 0 : S);
            this.V = V > 100 ? 100 : (V < 0 ? 0 : V);
        } else {
            this.H = Math.floor( 360 * (H + 10) % 360 );
            this.S = S > 1 ? 100 : (S < 0 ? 0 : Math.floor(S * 100));
            this.V = V > 1 ? 100 : (V < 0 ? 0 : Math.floor(V * 100));
        }
        if (this.V === 0) {
            this.S = 0;
        }
        if (this.S === 0) {
            this.H = 0;
        }
        this.alpha = 0;

        HSVColor.operations.add = (x: number, y: number): number => (x + y) > 100 ? 100 : x + y;
        HSVColor.operations.sub = (x: number, y: number): number => (x - y) < 0 ? 0 : x - y;
        HSVColor.operations.mul = (x: number, y: number): number => x * y / 100;
        HSVColor.operations.div = (x: number, y: number): number => y === 0 ? x : x / y;

    }
    public getHSL() {
        let H = this.H;
        let L = (2 - this.S / 100) * this.V / 200;
        let S = L && L < 1 ? this.S / 100 * this.V / (L < 0.5 ? L * 2 : 2 - L * 2) / 100 : this.S / 100;

        L = Math.round(L * 100);
        S = Math.round(S * 100);

        return {H, S, L};
    }

    public getHSV() {
        return {H: this.H , S: this.S, V: this.V};
    }

    public getRGB() {
        let R: number, G: number, B: number;
        let c = this.V / 100 * this.S / 100;
        let x = c * ( 1 - Math.abs((this.H / 60) % 2 - 1));
        let m = this.V / 100 - c;
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
        "add": (x: number, y: number): number => (x + y) % 360,
        "div": (x: number, y: number): number =>  y === 0 ? x : x / y,
        "mul": (x: number, y: number): number =>  x * y / 360,
        "sub": (x: number, y: number): number => (x - y + 360) % 360,
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
        let index = 0;
        const arr = new Uint8ClampedArray(width * height * 4);

        let  row = 0, col = 0;
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
        return ImageHelpers.compose(function(pixA, pixB) {
            let c: Color;
            let alpha = 0;

            if (typeof pixA !== "undefined") {
                c = pixA;
            }
            if (typeof pixB !== "undefined") {
                c = pixA.mul(pixB);
                c.alpha = pixA.alpha + pixB.alpha * (1 - pixA.alpha);
                c = pixA.mul(pixB);
            }

            return c;
        }, imgA, imgB);
    },
    "normal" : function(imgA: ImageData, imgB: ImageData): ImageData {
        return ImageHelpers.compose(function(pixA, pixB) {
            let c: Color;
            let alpha = 0;

            if (typeof pixA !== "undefined") {
                c = pixA;
            }
            if (typeof pixB !== "undefined") {
                c = pixB;
            }
            return c;

        }, imgA, imgB);

    },
};
