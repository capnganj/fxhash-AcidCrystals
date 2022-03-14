import { interpolateCool, interpolateInferno, interpolateMagma, interpolateWarm, interpolateViridis } from 'd3-scale-chromatic'
import { rgb, hsl, color } from 'd3-color';

class StonerSculpturesFeatures {
    constructor() {

        //color scheme 
        this.color = {
            name: ""
        };
        this.setColor();

        //drives major parameter of mobius 3d geometry
        this.major = {
            tag: "",
            value: ""
        }
        this.setMajor();

        //drives a parameter of mobius 3d geometry
        this.a = {
            tag: "",
            value: ""
        };
        this.setA();

        //drives b parameter of mobius 3d geometry
        this.b = {
            tag: "",
            value: ""
        };
        this.setB();
        
        //drives size of voxelish box geometry
        this.boxSize = {
            tag: "",
            value: ""
        }
        this.setBoxSize();

        //drives material shuffle / pixelation behavior
        this.shuffle = {
            tag: "",
            value: ""
        }
        this.setShuffle();

        //drives how many subdivisions in the surface
        this.density = {
            tag: "",
            value1: "",
            value2: ""
        }
        this.setDensity();

        //drives rotation of boxes
        this.rotation = {
            tag: "",
            value: ""
        }
        this.setRotation();
    }

    //color palette interpolation
    interpolateFn(val){
        switch (this.color.name) {
            case "Cool": return rgb(interpolateCool(val));
            case "Warm": return rgb(interpolateWarm(val));
            case "Viridis": return rgb(interpolateViridis(val));
            case "Magma": return rgb(interpolateMagma(val));
            case "Inferno": return rgb(interpolateInferno(val));
            default:
                return "high"
        }
    }

    //map function logic from processing <3
    map(n, start1, stop1, start2, stop2){
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        return newval;
    }

    //color inverter
    invertColor(rgb, bw) {
        let hex = color(rgb).formatHex()
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // https://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        let inverted = color("#" + padZero(r) + padZero(g) + padZero(b)).rgb();
        let desaturated = hsl(inverted);
        desaturated.s -= 0.7;
        return color(desaturated).rgb();

        function padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }
    }

    setColor(){
        let c = fxrand();
        
        if( c < 0.15){
            this.color.name = "Warm"
        }
        else if( c < 0.25){
            this.color.name = "Cool"
        }
        else if( c < 0.5){
            this.color.name = "Viridis"
        }
        else if( c < 0.7){
            this.color.name = "Magma"
        }
        else {
            this.color.name = "Inferno"
        }
    }

    setMajor(){
        let t = fxrand();
        this.major.value = this.map(t, 0, 1, 1.33, 1.75);

        //set feature tag value
        if (t < 0.15) {
            this.major.tag = "Shallow"
        }
        else if ( t < 0.85) {
            this.major.tag = "Medium"
        }
        else {
            this.major.tag = "Deep"
        }
    }

    setA(){
        let c = fxrand();
        this.a.value = this.map(c, 0, 1, 0.1, 0.25);

        //set feature tag values
        if (c < 0.4) this.a.tag = "Flat";
        else if (c < 0.6) this.a.tag = "Smooth";
        else if (c < 0.85) this.a.tag = "Bulge";
        else this.a.tag = "Bloat"


    }

    setB(){
        let c = fxrand();
        this.b.value = this.map(c, 0, 1, 0.5, 0.8);

        //set feature tag values
        if (c < 0.4) this.b.tag = "Short";
        else if (c < 0.6) this.b.tag = "Normal";
        else if (c < 0.85) this.b.tag = "Tall";
        else this.b.tag = "Stretch"


    }

    setBoxSize(){
        let b = fxrand();
        this.boxSize.value = this.map(b, 0, 1, 0.15, 0.23);

        if(b<0.33) this.boxSize.tag = "Small";
        else if(b<0.75) this.boxSize.tag = "Medium";
        else this.boxSize.tag = "Large";
    }

    setShuffle(){
        let sh = fxrand();
        this.shuffle.value = this.map(sh, 0, 1, 0.25, 0.9);

        //tags
        if (sh < 0.35) this.shuffle.tag = "Smooth";
        else if( sh < 0.65) this.shuffle.tag = "Medium";
        else if( sh < 0.85) this.shuffle.tag = "High";
        else this.shuffle.tag = "Shuffled!"
    }

    setDensity(){
        let d = fxrand();
        this.density.value1 = this.map(d, 0, 1, 40, 65);
        this.density.value2 = this.map(d, 0, 1, 110, 135);

        if( d < 0.35 ) this.density.tag = "Sparse";
        else if ( d < 0.8 ) this.density.tag = "Medium";
        else this.density.tag = "Dense";
    }

    setRotation(){
        let r = fxrand();
        this.rotation.value = this.map(r, 0, 1, 0.5, 1.5);
        
        if( r < 0.4) this.rotation.tag = "Gradual";
        else if( r < 0.8 ) this.rotation.tag = "Steady";
        else this.rotation.tag = "Rapid";
    }
}

export {StonerSculpturesFeatures}