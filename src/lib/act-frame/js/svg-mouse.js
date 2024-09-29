window.SvgMouse = class {

    constructor(svgCoord) {
        this.svgCoord = svgCoord;//an object so external update gets reflected
        //this.svgX = svgX; // 750
        //this.svgY = svgY; // 88
    }

    getX(clientX) {
        return clientX - this.svgCoord.x + this.scrollX();
    }

    getY(clientY) {
        return clientY - this.svgCoord.y + this.scrollY();
    }

    scrollX() {
        //console.warn('scrollLeft',window.pageXOffset);
        return window.pageXOffset;
    }

    scrollY() {
        //console.warn('scrollTop',window.pageYOffset);
        return window.pageYOffset;
    }
}
