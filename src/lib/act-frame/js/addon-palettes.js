window.StartEndFrame = class {
    constructor(startX, startY, endX, endY) {
        this.start = { x: startX, y: startY };
        this.end = { x: endX, y: endY };
    }
    static FromTextThruClick(clickX, clickY) {
        return new window.StartEndFrame(clickX-7,clickY+3,    clickX,clickY);
    }
    static FromText(elOrNd) { // TDDTEST49 FIX
        let isNd = elOrNd.attrs != null;
        let x = parseInt(isNd ? getscal(elOrNd.attrs, "x") : elOrNd.getAttribute("x"));
        let y = parseInt(isNd ? getscal(elOrNd.attrs, "y") : elOrNd.getAttribute("y"));
        let startX = x - 1;
        let startY = y - 13;
        let endX = x + (9.7 * (isNd ? elOrNd.text : elOrNd.innerHTML).length); // TDDTEST1 FIX
        let endY =  y + 4;
        return new window.StartEndFrame(startX,startY,endX,endY);
    }
    static FromEl(el) {
        let x1 = -1;
        let y1 = -1;
        let x2 = -1;
        let y2 = -1;
        switch (el.tagName.toLowerCase()) {
            case 'line': {
                x1 = parseInt(el.getAttribute("x1"));
                y1 = parseInt(el.getAttribute("y1"));
                x2 = parseInt(el.getAttribute("x2"));
                y2 = parseInt(el.getAttribute("y2"));
                break;
            }
            case 'polyline': {
                let ptStr = el.getAttribute("points");
                let ndAttrs = [{name: 'points', value: ptStr}];
                var xs = getscalarr(ndAttrs, "points", "even");
                var ys = getscalarr(ndAttrs, "points", "odd");
                let minX = 750;
                let minY = 750;
                let maxX = 0;
                let maxY = 0;
                for (var i=0; i<xs.length; i++) {
                    if (xs[i] < minX) { minX = xs[i]; }
                    if (xs[i] > maxX) { maxX = xs[i]; }
                }
                for (var i=0; i<ys.length; i++) {
                    if (ys[i] < minY) { minY = ys[i]; }
                    if (ys[i] > maxY) { maxY = ys[i]; }
                }
                x1 = minX;
                y1 = minY;
                x2 = maxX;
                y2 = maxY;
                break;
            }
            case 'rect': {
                x1 = parseInt(el.getAttribute("x"));
                y1 = parseInt(el.getAttribute("y"));
                x2 = x1 + parseInt(el.getAttribute("width"));
                y2 = y1 + parseInt(el.getAttribute("height"));
                break;
            }
            case 'circle': {
                let cx = parseInt(el.getAttribute("cx"));
                let cy = parseInt(el.getAttribute("cy"));
                let r = parseInt(el.getAttribute("r"));
                x1 = cx - r;
                y1 = cy - r;
                x2 = cx + r;
                y2 = cy + r;
                break;
            }
            case 'text': {
                return window.StartEndFrame.FromText(el);
            }
        }
        /*let x = parseInt(el.getAttribute("x"));
        let y = parseInt(el.getAttribute("y"));
        let x2 = parseInt(el.getAttribute("width")) + x;
        let y2 = parseInt(el.getAttribute("height")) + y;*/
        return new window.StartEndFrame(x1,y1,    x2,y2);
    }
    setFrame(startX, startY, endX, endY) {
        this.start.x = startX;
        this.start.y = startY;
        this.end.x = endX;
        this.end.y = endY;
    }
    getStart() {
        return this.start;
    }
    getEnd() {
        return this.end;
    }
}

window.AggregateNode = class {
    constructor({frame, id, top, left}) {
        this.frame = frame;
        this.id = id;
        this.top = top;
        this.left = left;
    }
    getFrame() {
        return this.frame;
    }
    calcFrame() {
        var calcX = 0;
        var calcY = 0;
        var current = this.left;
        var s = this.getFrame().getStart();
        var e = this.getFrame().getEnd();
        var w = e.x - s.x;
        var h = e.y - s.y;
        while (current != null) {
            var start = current.getFrame().getStart();
            var end = current.getFrame().getEnd();
            var xSum = end.x - start.x;
            calcX += xSum;
            current = current.left;
        }
        current = this.top;
        while (current != null) {
            var start = current.getFrame().getStart();
            var end = current.getFrame().getEnd();
            var ySum = end.y - start.y;
            calcY += ySum;
            current = current.top;
        }
        this.frame.setFrame(calcX, calcY, calcX+w, calcY+h);
    }
    applyFrame() {
        var el = document.getElementById(this.id);
        var start = this.getFrame().getStart();
        var end = this.getFrame().getEnd();
        el.style.top = (start.y) + 'px';
        el.style.left = (start.x) + 'px';
        el.style.height = (end.y - start.y) + 'px';
        el.style.width = (end.x - start.x) + 'px';
        el.style.overflow = 'hidden'; // otherwise it shows collapsed content
    }
    applyFrames() {
        var current = this;
        while (current != null) {
            current.calcFrame();
            current.applyFrame();
            if (current.left != null) {
                current = current.left;
            } else if (current.top != null) {
                current = current.top;
            } else {
                current = null;
            }
        }
    }
}

//window.gWinOffset = 0;
window.pal = function(name) {
    let url = '?template='+name;
    let target = '_blank';
    let winTitleH = 2;//just a guess of the height, also change in templates.js
    let winScrollH = 21;//just a guess of the height
    let h = (winTitleH + winScrollH + 750);
    let windowFeatures = `height=${h},width=750,left=999,top=0`;//+(0+window.gWinOffset);
    //window.gWinOffset += 100;
    window.open(url, target, windowFeatures);
}
