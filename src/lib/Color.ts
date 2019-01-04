export abstract class Color {
    /** The alpha channel <0;1> */
    public alpha: number;

    public abstract getHSL(): {H: number; S: number; L: number};
    public abstract getHSV(): {H: number; S: number; V: number};
    public abstract getRGB(): {R: number; G: number; B: number};
    public abstract getHEX(): {hex: string};

    public static precision = 2;
    protected static fixed = function(n: number): number {
        return Number(n.toFixed(Color.precision));
    };

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

    public colorNames: { [name: string]: [number, number, number] };

    public abstract colorByName(name: string): Color;

    public static getColorByName<T extends Color>(name: string): T {
        let color: new () => T;
        return (new color()).colorByName(name) as T;
    }
}
