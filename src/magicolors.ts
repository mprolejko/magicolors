interface Color{
   getHSL():{H: number; S: number; L:number}
   getHSV():{H: number; S: number; V:number}
   getRGB():{R: number; G: number; B:number}
   getHEX():{hex:string}
}


export class RGBColor implements Color{
    // channels as 0:255 values 
    private R:number;
    private G:number;
    private B:number;
    
    constructor(color: {R:number,G:number,B:number} | number, g?:number,b?:number) { 
        let R,G,B;
        if (arguments.length == 1 && typeof color == "object" ) {
            R = color.R;
            G = color.G;
            B = color.B;
        }
        else if(typeof color == "number"){
            R = color;
            G = arguments.length >= 2 ? g:0;
            B = arguments.length >= 3 ? b:0;
        }
        if(Number.isInteger(R) && Number.isInteger(G) && Number.isInteger(B)){
            this.R = R>255 ? 255: (R<0 ? 0 : R);
            this.G = G>255 ? 255: (G<0 ? 0 : G);
            this.B = B>255 ? 255: (B<0 ? 0 : B);
        }
        else {
            let to255 = c => Math.floor(c*255);
            this.R = R>1 ? 255: (R<0 ? 0 : to255(R));
            this.G = G>1 ? 255: (G<0 ? 0 : to255(G));
            this.B = B>1 ? 255: (B<0 ? 0 : to255(B));
        }
    }
    getHSL(){
        let r = this.R/255;
        let g = this.G/255;
        let b = this.B/255;
        
        let cmax = Math.max(r,g,b);
        let cmin = Math.min(r,g,b);
        let delta = cmax-cmin;

        let L = (cmax+cmin)/2;
        let S = L==0? 0 : L==1? 0: Math.round(100 * (cmax-cmin)/(1 - Math.abs(2*L-1)));
        L = Math.round(L*100);

        let H = 0;
        if (cmax != 0 && delta != 0) {
            if (cmax == r) {
                H = ((g-b)/delta)%6;
            }
            else if (cmax == g) {
                H = (b-r)/delta + 2;
            }
            else if (cmax == b) {
                H = (r-g)/delta + 4;
            }
        }
        H = Math.round( H*60);
        
        return {H,S,L};
    } 

    getHSV(){
        let r = this.R/255;
        let g = this.G/255;
        let b = this.B/255;
        
        let cmax = Math.max(r,g,b);
        let cmin = Math.min(r,g,b);
        let delta = cmax-cmin;

        let V = Math.round(cmax*100);
        let S = cmax == 0 ? 0 : Math.round(100*delta/cmax);
        let H = 0;
        if (cmax != 0 && delta != 0) {
            if (cmax == r) {
                H = Math.round(((g-b)/delta)%6 * 60);
            }
            else if (cmax == g) {
                H = Math.round(((b-r)/delta + 2) * 60);
            }
            else if (cmax == b) {
                H = Math.round(((r-g)/delta + 4) * 60);
            }
        }
        return {H,S,V};
    }

    getRGB(){
        return {R:this.R , G:this.G, B:this.B};
    }

    getHEX() {
        let hex = c =>  {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return {hex : "#" + hex(this.R) + hex(this.G) + hex(this.B)};
    }
}

export class HSVColor implements Color{
    // channels as 0:1 values 
    private H:number;
    private S:number;
    private V:number;
    

    constructor(color: {H:number,S:number,V:number} | number, s?:number,v?:number) { 
        let H,S,V;
        if (arguments.length == 1 && typeof color == "object" ) {
            H = color.H;
            S = color.S;
            V = color.V;
        }
        else if(typeof color == "number"){
            H = color;
            S = arguments.length >= 2 ? s:100;
            V = arguments.length >= 3 ? v:100;
        }
        if(Number.isInteger(H) && Number.isInteger(S) && Number.isInteger(V)){
            this.H = (H+10*360)%360; // ugly workaround
            this.S = S>100 ? 100: (S<0 ? 0 : S);
            this.V = V>100 ? 100: (V<0 ? 0 : V);
        }
        else {
            this.H = Math.floor( 360*(H+10) % 360 );
            this.S = S>1 ? 100: (S<0 ? 0 : Math.floor(S*100));
            this.V = V>1 ? 100: (V<0 ? 0 : Math.floor(V*100));
        }
        if(this.V == 0){
            this.S = 0;
        }
        if(this.S == 0){
            this.H = 0;
        }
    }
    getHSL(){
        let H = this.H;
        let L = (2 - this.S/100) * this.V / 200;
        let S = L && L<1 ? this.S/100*this.V/(L<0.5 ? L*2 : 2-L*2)/100 : this.S/100;

        L = Math.round(L*100);
        S = Math.round(S*100);
        
        return {H,S,L};
    } 

    getHSV(){
        return {H:this.H , S:this.S, V:this.V};
    }

    getRGB(){
        let R,G,B;
        let c = this.V/100 * this.S/100;
        let x = c * ( 1 - Math.abs((this.H/60)%2 - 1));
        let m = this.V/100 - c;
        let color = {R,G,B};

        if(this.H >= 0 && this.H < 60)
            color = {R:c,G:x,B:0}
        else if(this.H >= 60 && this.H < 120)
            color = {R:x,G:c,B:0}
        else if(this.H >= 120 && this.H < 180)
            color = {R:0,G:c,B:x}
        else  if(this.H >= 180 && this.H < 240)
            color = {R:0,G:x,B:c}
        else if(this.H >= 240 && this.H < 300)
            color = {R:x,G:0,B:c}
        else if(this.H >= 300 && this.H < 360)
            color = {R:c,G:0,B:x}

        let to255 = c=> Math.round((c+m)*255);
        color.R = to255(color.R);
        color.G = to255(color.G);
        color.B = to255(color.B);

        return color;
    }

    getHEX() {
        let c = new RGBColor(this.getRGB());
        return c.getHEX();
    }
  }