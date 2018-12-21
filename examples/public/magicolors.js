var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Color = /** @class */ (function () {
    function Color() {
    }
    Color.prototype.add = function (b) {
        return this.operate(b, "add");
    };
    Color.prototype.sub = function (b) {
        return this.operate(b, "sub");
    };
    Color.prototype.mul = function (b) {
        return this.operate(b, "mul");
    };
    Color.prototype.div = function (b) {
        return this.operate(b, "div");
    };
    Color.operations = {
        "add": function (x, y) { return x + y; },
        "div": function (x, y) { return y === 0 ? x : x / y; },
        "mul": function (x, y) { return x * y; },
        "sub": function (x, y) { return x - y; }
    };
    return Color;
}());
var RGBColor = /** @class */ (function (_super) {
    __extends(RGBColor, _super);
    function RGBColor(color, g, b) {
        var _this = _super.call(this) || this;
        var R, G, B;
        if (arguments.length === 1 && typeof color === "object") {
            R = color.R;
            G = color.G;
            B = color.B;
        }
        else if (typeof color === "number") {
            R = color;
            G = arguments.length >= 2 ? g : 0;
            B = arguments.length >= 3 ? b : 0;
        }
        var crop = function (c) { return c > 255 ? 1 : c >= 1 ? c / 255 : c < 0 ? 0 : c; };
        _this.R = crop(R);
        _this.G = crop(G);
        _this.B = crop(B);
        RGBColor.operations.add = function (x, y) { return (x + y) > 1 ? 1 : x + y; };
        RGBColor.operations.sub = function (x, y) { return (x - y); }; // < 0 ? 0 : x - y;
        RGBColor.operations.mul = function (x, y) { return x * y; };
        RGBColor.operations.div = function (x, y) { return y === 0 ? x : x / y; };
        return _this;
    }
    RGBColor.prototype.getHSL = function () {
        var r = this.R;
        var g = this.G;
        var b = this.B;
        var cmax = Math.max(r, g, b);
        var cmin = Math.min(r, g, b);
        var delta = cmax - cmin;
        var L = (cmax + cmin) / 2;
        var S = L === 0 ? 0 : L === 1 ? 0 : Math.round(100 * (cmax - cmin) / (1 - Math.abs(2 * L - 1)));
        L = Math.round(L * 100);
        var H = 0;
        if (cmax !== 0 && delta !== 0) {
            if (cmax === r) {
                H = ((g - b) / delta) % 6;
            }
            else if (cmax === g) {
                H = (b - r) / delta + 2;
            }
            else if (cmax === b) {
                H = (r - g) / delta + 4;
            }
        }
        H = Math.round(H * 60);
        return { H: H, S: S, L: L };
    };
    RGBColor.prototype.getHSV = function () {
        var r = this.R;
        var g = this.G;
        var b = this.B;
        var cmax = Math.max(r, g, b);
        var cmin = Math.min(r, g, b);
        var delta = cmax - cmin;
        var V = Math.round(cmax * 100);
        var S = cmax === 0 ? 0 : Math.round(100 * delta / cmax);
        var H = 0;
        if (cmax !== 0 && delta !== 0) {
            if (cmax === r) {
                H = Math.round(((g - b) / delta) % 6 * 60);
            }
            else if (cmax === g) {
                H = Math.round(((b - r) / delta + 2) * 60);
            }
            else if (cmax === b) {
                H = Math.round(((r - g) / delta + 4) * 60);
            }
        }
        return { H: H, S: S, V: V };
    };
    RGBColor.prototype.getRGB = function () {
        var to255 = function (c) { return Math.round(c * 255); };
        return { R: to255(this.R), G: to255(this.G), B: to255(this.B) };
    };
    RGBColor.prototype.getHEX = function () {
        var hex = function (c) {
            var h = Math.floor(c * 255).toString(16);
            return h.length === 1 ? "0" + h : h;
        };
        return { hex: "#" + hex(this.R) + hex(this.G) + hex(this.B) };
    };
    RGBColor.prototype.operands = function (value) {
        var R, G, B, alpha;
        if (typeof value === "number") {
            R = value;
            G = value;
            B = value;
            alpha = 1;
        }
        else {
            var bRGB = value.getRGB();
            R = bRGB.R / 255;
            G = bRGB.G / 255;
            B = bRGB.B / 255;
            alpha = value.alpha;
        }
        return { R: R, G: G, B: B, alpha: alpha };
    };
    RGBColor.prototype.operate = function (b, type) {
        var color = new RGBColor(0, 0, 0);
        var _a = this.operands(b), R = _a.R, G = _a.G, B = _a.B, alpha = _a.alpha;
        color.R = RGBColor.operations[type](this.R, R);
        color.G = RGBColor.operations[type](this.G, G);
        color.B = RGBColor.operations[type](this.B, B);
        return color;
    };
    return RGBColor;
}(Color));
export { RGBColor };
var HSVColor = /** @class */ (function (_super) {
    __extends(HSVColor, _super);
    function HSVColor(color, s, v) {
        var _this = _super.call(this) || this;
        _this.hueOperations = {
            "add": function (x, y) { return (x + y) - Math.floor(x + y); },
            "div": function (x, y) { return y === 0 ? x : x / y; },
            "mul": function (x, y) { return x * y; },
            "sub": function (x, y) { return (x - y + 1) - Math.floor(x - y + 1); }
        };
        var H, S, V;
        if (arguments.length === 1 && typeof color === "object") {
            H = color.H;
            S = color.S;
            V = color.V;
        }
        else if (typeof color === "number") {
            H = color;
            S = arguments.length >= 2 ? s : 1;
            V = arguments.length >= 3 ? v : 1;
        }
        var crop = function (c) { return c > 100 ? 1 : c > 1 ? c / 100 : c < 0 ? 0 : c; };
        _this.H = H > 360 ? (H % 360 / 360) : H < 0 ? (H + 360) / 360 : H > 1 ? H / 360 : H;
        _this.S = crop(S);
        _this.V = crop(V);
        if (_this.V === 0) {
            _this.S = 0;
        }
        if (_this.S === 0) {
            _this.H = 0;
        }
        _this.alpha = 0;
        HSVColor.operations.add = function (x, y) { return (x + y) > 1 ? 1 : x + y; };
        HSVColor.operations.sub = function (x, y) { return (x - y) < 0 ? 0 : x - y; };
        HSVColor.operations.mul = function (x, y) { return x * y; };
        HSVColor.operations.div = function (x, y) { return y === 0 ? x : x / y; };
        return _this;
    }
    HSVColor.prototype.getHSL = function () {
        var H = this.H * 360;
        var L = (2 - this.S) * this.V / 2;
        var S = L && L < 1 ? this.S * this.V / (L < 0.5 ? L * 2 : 2 - L * 2) : this.S;
        L = Math.round(L * 100);
        S = Math.round(S * 100);
        return { H: H, S: S, L: L };
    };
    HSVColor.prototype.getHSV = function () {
        var to100 = function (c) { return Math.floor(c * 100); };
        return { H: Math.floor(this.H * 360), S: to100(this.S), V: to100(this.V) };
    };
    HSVColor.prototype.getRGB = function () {
        var R, G, B;
        var c = this.V * this.S;
        var x = c * (1 - Math.abs((this.H * 6) % 2 - 1));
        var m = this.V - c;
        var color = { R: R, G: G, B: B };
        if (this.H >= 0 && this.H < 60) {
            color = { R: c, G: x, B: 0 };
        }
        else if (this.H >= 60 && this.H < 120) {
            color = { R: x, G: c, B: 0 };
        }
        else if (this.H >= 120 && this.H < 180) {
            color = { R: 0, G: c, B: x };
        }
        else if (this.H >= 180 && this.H < 240) {
            color = { R: 0, G: x, B: c };
        }
        else if (this.H >= 240 && this.H < 300) {
            color = { R: x, G: 0, B: c };
        }
        else if (this.H >= 300 && this.H < 360) {
            color = { R: c, G: 0, B: x };
        }
        var to255 = function (col) { return Math.round((col + m) * 255); };
        color.R = to255(color.R);
        color.G = to255(color.G);
        color.B = to255(color.B);
        return color;
    };
    HSVColor.prototype.getHEX = function () {
        var c = new RGBColor(this.getRGB());
        return c.getHEX();
    };
    HSVColor.prototype.operands = function (value) {
        var H, S, V, alpha;
        if (typeof value === "number") {
            V = value;
            S = value;
            V = value;
            alpha = 1;
        }
        else {
            var bRGB = value.getHSV();
            H = bRGB.H;
            S = bRGB.S;
            V = bRGB.V;
            alpha = value.alpha;
        }
        return { H: H, S: S, V: V, alpha: alpha };
    };
    HSVColor.prototype.operate = function (b, type) {
        var color = new HSVColor(0, 0, 0);
        var _a = this.operands(b), H = _a.H, S = _a.S, V = _a.V, alpha = _a.alpha;
        color.H = this.hueOperations[type](this.H, H);
        color.S = HSVColor.operations[type](this.S, S);
        color.V = HSVColor.operations[type](this.V, V);
        color.alpha = Color.operations[type](this.alpha, alpha);
        return color;
    };
    return HSVColor;
}(Color));
export { HSVColor };
var ImageHelpers = /** @class */ (function () {
    function ImageHelpers() {
    }
    ImageHelpers.imageData2pixels = function (img) {
        var width = img.width;
        var height = img.height;
        var table = [];
        for (var row = 0; row < height; row++) {
            table[row] = [];
            for (var col = 0; col < width; col++) {
                var index = (col + (row * img.width)) * 4;
                table[row][col] = new RGBColor(img.data[index], img.data[index + 1], img.data[index + 2]);
                table[row][col].alpha = img.data[index + 3] / 255;
            }
        }
        return table;
    };
    ImageHelpers.pixels2imageData2 = function (img) {
        var height = img.length;
        var width = img[0].length;
        var row = 0, col = 0;
        var arr = new Uint8ClampedArray(width * height * 4);
        for (var i = 0; i < arr.length; i += 4) {
            col = Math.floor((i % (4 * width)) / 4);
            row = Math.floor(i / (4 * width));
            var c = img[row][col].getRGB();
            arr[i] = c.R;
            arr[i + 1] = c.G;
            arr[i + 2] = c.B;
            arr[i + 3] = img[row][col].alpha * 255;
        }
        return new ImageData(arr, width, height);
    };
    ImageHelpers.compose = function (operation, imgA, imgB) {
        var width = Math.max(imgA.width, imgB.width);
        var height = Math.max(imgA.height, imgB.height);
        var tableA = ImageHelpers.imageData2pixels(imgA);
        var tableB = ImageHelpers.imageData2pixels(imgB);
        var result = [];
        for (var row = 0; row < height; row++) {
            result[row] = [];
            for (var col = 0; col < width; col++) {
                if (row < imgA.height && row < imgB.height && col < imgA.width && col < imgB.width) {
                    result[row][col] = operation(tableA[row][col], tableB[row][col]);
                }
                else if (row < imgA.height && col < imgA.width) {
                    result[row][col] = tableA[row][col];
                }
                else if (row < imgB.height && col < imgB.width) {
                    result[row][col] = tableB[row][col];
                }
                else {
                    result[row][col] = new RGBColor(0, 0, 0);
                    result[row][col].alpha = 0; // transparent pixel
                }
            }
        }
        return ImageHelpers.pixels2imageData2(result);
    };
    return ImageHelpers;
}());
export var blending = {
    "multiply": function (imgA, imgB) {
        return ImageHelpers.compose(function (pixBack, pixFront) {
            var c;
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
    "normal": function (imgA, imgB) {
        return ImageHelpers.compose(function (pixBack, pixFront) {
            var c;
            if (typeof pixBack !== "undefined") {
                c = pixBack;
            }
            if (typeof pixFront !== "undefined") {
                c = pixFront;
            }
            if (pixFront.alpha < 1) { // semitransparent pixel
                var alpha = pixFront.alpha + (1 - pixFront.alpha) * pixBack.alpha;
                var back = pixBack.mul(pixBack.alpha);
                var front = pixFront.mul(pixFront.alpha);
                var cc = back.mul(1 - pixFront.alpha);
                c = front.add(cc);
                c.alpha = alpha;
            }
            return c;
        }, imgA, imgB);
    }
};
