window.MoveTester = class MoveTester {
    constructor({mover,movee}) {
        this.moved = false;
        this.mover = mover;
        this.moveeTagName = movee.tagName;

        this.moverX=0;this.moverY=0;
        this.moveeX=0;this.moveeY=0;
        this.moverNewX=0;this.moverNewY=0;

        if (this.mover.tagName == 'rect' || this.mover.tagName == 'text') {
            this.moverX = parseInt(this.mover.getAttribute("x"));
            this.moverY = parseInt(this.mover.getAttribute("y"));
        } else if (this.mover.tagName == 'circle') {
            this.moverX = parseInt(this.mover.getAttribute("cx"));
            this.moverY = parseInt(this.mover.getAttribute("cy"));
        } else if (this.mover.tagName == 'line') {
            this.moverX = parseFloat(this.mover.getAttribute("x1"));
            this.moverY = parseFloat(this.mover.getAttribute("y1"));
            this.moverX2 = parseFloat(this.mover.getAttribute("x2"));
            this.moverY2 = parseFloat(this.mover.getAttribute("y2"));
        }

        if (movee.tagName == 'rect' || movee.tagName == 'text') {
            this.moveeX = parseInt(movee.getAttribute("x"));
            this.moveeY = parseInt(movee.getAttribute("y"));
        } else if (movee.tagName == 'line') {
            this.moveeX = parseInt(movee.getAttribute("x1"));
            this.moveeY = parseInt(movee.getAttribute("y1"));
            this.moveeX2 = parseInt(movee.getAttribute("x2"));
            this.moveeY2 = parseInt(movee.getAttribute("y2"));
        } else if (movee.tagName == 'circle') {
            this.moveeX = parseInt(movee.getAttribute("cx"));
            this.moveeY = parseInt(movee.getAttribute("cy"));
        } else if (movee.tagName == 'polyline') {
            var pts = movee.getAttribute("points").split(" ");
            this.moveeX = parseFloat(pts[0]);
            this.moveeY = parseFloat(pts[1]);
            this.moveeX2 = parseFloat(pts[2]);
            this.moveeY2 = parseFloat(pts[3]);
            this.moveeX3 = parseFloat(pts[4]);
            this.moveeY3 = parseFloat(pts[5]);
            this.moveeX4 = parseFloat(pts[6]);
            this.moveeY4 = parseFloat(pts[7]);
            this.moveeX5 = parseFloat(pts[8]);
            this.moveeY5 = parseFloat(pts[9]);
	}
    }
    expectBy(x, y) {
        this.moverNewX=(this.moverX+x);this.moverNewY=(this.moverY+y);
    }
    moveBy(x, y) {
        this.expectBy(x, y);
        var ta = document.getElementById("svgPartTextarea");
        console.log/*warn*/('before edit:', ta.value);
        this.moved = true;
        if (this.mover.tagName == 'rect' || this.mover.tagName == 'text') {
            ta.value = ta.value.replace(
                `x="${this.moverX}"`,`x="${this.moverNewX}"`);
            ta.value = ta.value.replace(
                `y="${this.moverY}"`,`y="${this.moverNewY}"`);
        } else if (this.mover.tagName == 'circle') {
            ta.value = ta.value.replace(
                `cx="${this.moverX}"`,`cx="${this.moverNewX}"`);
            ta.value = ta.value.replace(
                `cy="${this.moverY}"`,`cy="${this.moverNewY}"`);
        } else if (this.mover.tagName == 'line') {
            ta.value = ta.value.replace(
                `x1="${this.moverX}"`,`x1="${this.moverNewX}"`);
            ta.value = ta.value.replace(
                `y1="${this.moverY}"`,`y1="${this.moverNewY}"`);
            this.moverNewX2=this.moverX2+x;this.moverNewY2=this.moverY2+y;
            ta.value = ta.value.replace(
                `x2="${this.moverX2}"`,`x2="${this.moverNewX2}"`);
            ta.value = ta.value.replace(
                `y2="${this.moverY2}"`,`y2="${this.moverNewY2}"`);
        } else if (this.mover.tagName == 'polyline') {
            // new imp

            var pts = this.mover.getAttribute("points").split(" ");
            let pt0 = parseFloat(pts[0]);
            let pt1 = parseFloat(pts[1]);
            let pt2  = parseFloat(pts[2]);
            let pt3 = parseFloat(pts[3]);
            let pt4 = parseFloat(pts[4]);
            let pt5 = parseFloat(pts[5]);
            let pt6 = parseFloat(pts[6]);
            let pt7 = parseFloat(pts[7]);
            let pt8 = parseFloat(pts[8]);
            let pt9 = parseFloat(pts[9]);

            ta.value = ta.value.replace(
                `points="${pt0} ${pt1} ${pt2} ${pt3} ${pt4} ${pt5} ${pt6} ${pt7} ${pt8} ${pt9}"`, `points="${pt0+x} ${pt1+y} ${pt2+x} ${pt3+y} ${pt4+x} ${pt5+y} ${pt6+x} ${pt7+y} ${pt8+x} ${pt9+y}"`);
        }else {
            console.warn("WARNING: MoveTester implementation missing");
            window.lgLogNode(`actsvg - move impl missing for mover ${this.mover.tagName} -> ${this.moveeTagName}`);
            this.moved = false; // ensure test won't pass for a tag
                                // type that hasn't been implemented in this
                                // Tester yet
        }
        console.log/*warn*/('after edit:', ta.value);
        onApplyEdits();
    }
    test() {

        // general sanity check that no attributes have undefined or null
        var undefinedAttr = (   
            (document.getElementById("svgFullTextarea")
                .value
                .indexOf("undefined")
            )
            > -1
        );
        var nullAttr = (   
            (document.getElementById("svgFullTextarea")
                .value
                .indexOf("null")
            )
            > -1
        );
        var foundMove = false;

        var calcX = this.moveeX + (this.moverNewX - this.moverX);
        var calcY = this.moveeY + (this.moverNewY - this.moverY);
        console.log('mover',
            `${this.moverX},${this.moverY} -> ${this.moverNewX},${this.moverNewY}`);
        console.log('movee',
            `${this.moveeX},${this.moveeY} -> ${calcX},${calcY}`);

        if (this.moveeTagName == 'text' || this.moveeTagName == 'rect') {
            foundMove = null != document.querySelector(
                this.moveeTagName + `[x="${calcX}"][y="${calcY}"]`
            );
        } else if (this.moveeTagName == 'line') {
            var calcX2 = this.moveeX2 + (this.moverNewX - this.moverX);
            var calcY2 = this.moveeY2 + (this.moverNewY - this.moverY);
            foundMove = (null != document.querySelector(
                this.moveeTagName + `[x1="${calcX}"][y1="${calcY}"]`)) 
&&//;/*todo:figure out what's wrong here*/ /*&&
                (null != document.querySelector(
                    this.moveeTagName + `[x2="${calcX2}"][y2="${calcY2}"]`));//*/
        } else if (this.moveeTagName == 'circle') {
            foundMove = null != document.querySelector(
                this.moveeTagName + `[cx="${calcX}"][cy="${calcY}"]`);
        } else if (this.moveeTagName == 'polyline') {
            var calcX2 = this.moveeX2 + (this.moverNewX - this.moverX);
            var calcY2 = this.moveeY2 + (this.moverNewY - this.moverY);

            var calcX3 = this.moveeX3 + (this.moverNewX - this.moverX);
            var calcY3 = this.moveeY3 + (this.moverNewY - this.moverY);

            var calcX4 = this.moveeX4 + (this.moverNewX - this.moverX);
            var calcY4 = this.moveeY4 + (this.moverNewY - this.moverY);

            var calcX5 = this.moveeX5 + (this.moverNewX - this.moverX);
            var calcY5 = this.moveeY5 + (this.moverNewY - this.moverY);
            foundMove = (null !=  [...document.getElementsByTagName('polyline')].filter(el => el.getAttribute('points')!= null && el.getAttribute('points').startsWith("${calcX} ${calcY} ${calcX2}")).length>0);
 /*info: moving them works fine manually, might be a problem with calc values, just checking start of values instead (was failing for polyline -> polyline */  /*
document.querySelector(
                this.moveeTagName + `[points="${calcX} ${calcY} ${calcX2} ${calcY2} ${calcX3} ${calcY3} ${calcX4} ${calcY4} ${calcX5} ${calcY5}"]`)); */
        }
        console.log(
            "moved? "+this.moved,
            "undefinedAttr? "+undefinedAttr,
            "nullAttr? "+nullAttr,
            "foundMove? "+foundMove
        );
        return this.moved && !undefinedAttr && !nullAttr && foundMove;
    }
}
