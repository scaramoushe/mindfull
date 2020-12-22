import _ from "lodash";

interface HslToRgbParams {
    h: any;
    s: any;
    l: any;
}

interface Hue2rgbParams {
    p: any;
    q: any;
    t: any;
}

export default class Tools{
    static randBool(){
        return  Math.random() < 0.5;
    }

    static randomArrayMember(arr:any[]){
        return _.sample(arr);
    }

    static randomNumber(min:number,max:number){
        return min + Math.floor(Math.random() * (max - min));
    }

    static randomColor = (() => {
        const golden_ratio_conjugate = 0.618033988749895;
        let h = Math.random();

        const hslToRgb = ({h, s, l}: HslToRgbParams) => {
            let r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                const hue2rgb = ({p, q, t}: Hue2rgbParams) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb({p : p, q : q, t : h + 1 / 3});
                g = hue2rgb({p : p, q : q, t : h});
                b = hue2rgb({p : p, q : q, t : h - 1 / 3});
            }

            return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
        };

        return () => {
            h += golden_ratio_conjugate;
            h %= 1;
            return hslToRgb({h : h, s : 0.5, l : 0.60});
        };
    })()
}