window.xeEditor = class {
    constructor(validator = null, saxParser = null) {
        this.backgroundId = null;
        this.timeFrame = 1800;
        this.validator = validator;
        this.saxParser = saxParser;
    } // end constructor
    valid(xml) { // CT/52 // CT/53
        let err = "";

        let self = this;
        if (self.validator ==null) self.validator = window.gLibFastXmlValidator;
        if (self.saxParser == null) self.saxParser = window.gLibSaxophoneParser;

        // VALID - DOM CHECK
        let quickCheck = (((new DOMParser()).parseFromString(xml, 'text/xml')
            ).getElementsByTagName('parsererror')
            ).length == 0;
        if (!quickCheck) {
            console.warn("Failed quickCheck");
            return quickCheck;
        } // end quickCheck

        // VALID - FX CHECK
        if (self.validator == null) {
            console.error("Cannot perform xml validation, requires fast-xml-parser.");
            return true;
        } // end fx nullcheck
        let fxValid = self.validator;
        if (!fxValid.validate(xml)) { // CT/53 // TDDTEST70 FTR // TDDTEST71 FTR
            err = "Fix xml, it is not parseable.";
            window.notifyMsg("Failed validation. " + err, "red"); // CT/53
            return false;
        } // end fxValid

        // VALID - SAX CHECK
        let saxCheck = true;
        if (self.saxParser == null) {
            console.error("Cannot perform svg validation, requires saxophone.");
            return true;
        } // end gLibSaxophoneParser nullcheck
        let parser = new self.saxParser();
        parser.on('tagopen', tag => { // TDDTEST72 FTR // CT/53

            switch (tag.name) {
                case 'circle': {
                    let s = tag.attrs.replace(/ /g, '');
                    let circleCheck = s.indexOf('cx=') > -1
                        && s.indexOf('cy=') > -1
                        && s.indexOf('r=') > -1
                        && s.indexOf('fill=') > -1
                        && s.indexOf('stroke=') > -1
                        && s.indexOf('stroke-width=') > -1
                        && tag.isSelfClosing;
                    if (!circleCheck) err+="<circle> requires: attrs [cx,cy,r,fill,stroke,stroke-width] and self-closes (no inner xml text)";
                    saxCheck &&= circleCheck;
                    break; // break circle
                } // end case circle
                case 'line': {
                    let s = tag.attrs.replace(/ /g, '');
                    let lineCheck = s.indexOf('x1=') > -1
                        && s.indexOf('y1=') > -1
                        && s.indexOf('x1=') > -1
                        && s.indexOf('y2=') > -1
                        && s.indexOf('stroke=') > -1
                        && s.indexOf('stroke-width=') > -1
                        && tag.isSelfClosing;
                    if (!lineCheck) err+="<line> requires: attrs [x1,y1,x2,y2,stroke,stroke-width] and self-closes (no inner xml text)";
                    saxCheck &&= lineCheck;
                    break; // break line
                } // end case line
                case 'polyline': {
                    let s = tag.attrs.replace(/ /g, '');
                    let plineCheck = s.indexOf('points=') > -1
                        && s.indexOf('fill=') > -1
                        && s.indexOf('stroke=') > -1
                        && s.indexOf('stroke-width=') > -1
                        && tag.isSelfClosing;
                    if (!plineCheck) err+="<polyline> requires: attrs [points,stroke,fill,stroke-width] and self-closes (no inner xml text)";
                    saxCheck &&= plineCheck;
                    break; // break polyline
                } // end case polyline
                case 'rect': {
                    let xyCheck = tag.attrs.split(" ").filter(a => a.startsWith('x') || a.startsWith('y')).length >= 2;
                    let s = tag.attrs.replace(/ /g, '');
                    let rectCheck = s.indexOf('rx=') > -1
                        && s.indexOf('ry=') > -1
                        && s.indexOf('x=') > -1
                        && s.indexOf('y=') > -1
                        && s.indexOf('stroke=') > -1
                        && s.indexOf('stroke-width=') > -1
                        && s.indexOf('width=') > -1
                        && s.indexOf('height=') > -1
                        && s.indexOf('fill=') > -1
                        && tag.isSelfClosing
                        && xyCheck;
                    if (!rectCheck) err+="<rect> requires: attrs [rx,ry,x,y,width,height,stroke,fill,stroke-width] and self-closes (no inner xml text)";
                    saxCheck &&= rectCheck;
                    break; // break rect
                } // end case rect
                case 'text': {
                    let s = tag.attrs.replace(/ /g, '');
                    let textCheck = s.indexOf('x=') > -1
                        && s.indexOf('y=') > -1
                        && s.indexOf('fill=') > -1
                        && !tag.isSelfClosing;
                    if (!textCheck) err+="<text> requires: attrs [x,y,fill] and inner xml text";
                    saxCheck = saxCheck && textCheck;
                    break; // break text
                } // end case text
                default:
                    break; // default break
            } // end switch tag name
        }); // end saxophone tagopen cb
        parser.parse(xml);

        if (!saxCheck) {
            // console.warn("Failed saxCheck");
            window.notifyMsg("Failed validation. " + err, "red"); // CT/53
        } // end saxCheck
        return saxCheck;
    }
    // only updates 1x when called Nx (within timeFrame)
    backgroundUpdate() { // CT/52 // CT/53
        // console.log("backgroundUpdate");
        clearTimeout(this.backgroundId);
        //this.dispatched = false; //this.backgroundId = null;
        let self = this;
        this.backgroundId = window.gDispatch(() => {
            if (self.valid(document.getElementById("svgFullTextarea").value)) {
                document.querySelector("#pageCodeFrame").style.backgroundColor = "rgb(1,1,1)"; // CT/53
                //if (self.backgroundId != null) {
                    svgNodes=[]; window.loadSvg(
                        document.getElementById("svgFullTextarea").value
                    ); // loadSvg call also updates frames
                    // todo: save op.
                //}
            } else { // not valid
                document.querySelector("#pageCodeFrame").style.backgroundColor = "rgb(220,170,170)"; // CT/53 // rgb(255,240,240)
            }
        }, this.timeFrame);
    }
};
