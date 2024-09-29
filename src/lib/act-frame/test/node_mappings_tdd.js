window.BoolSwitch = class {
    constructor() {
        this.val = false;
    }
    switch() {
        this.val = !this.val;
        return this.val;
    }
}
window.tdd = {
    getDraw: function() {
        var draw = {};
        draw.line = function(x,y) {
window.lgLogNode('actsvg - test draw line - will draw line');
            issueKeyNum(1, {});
            issueDrag(x,y,    x+5,/*y-5*/y+5);//have to go southeast dir
                                              //due to moveeX+=1 and moveeY+=1
            //issueKeyNum(0, {});
            //issueClick(x,y);    window.updateFrames();
            var line = [...document.getElementsByTagName('line')]
                .filter(el => el.getAttribute('x1') == (''+x))
                .filter(el => el.getAttribute('y1') == (''+y))[0];
            window.lgLogNode('actsvg - test draw line==null '+(line==null));
            return line;
        };
        draw.rect = function(x,y) {
            document.getElementById('svgFullTextarea').focus();
            let mode = (window.tdd.roundedSwitch.switch()) ? 3 : 4;
            issueKeyNum(mode, {});
            issueDrag(x,y,    x+15,y+15);
            window.lgLogNode('actsvg - test'+`${x},${y},${x+15},${y+15}`, null);
            //window.updateFrames();
            //issueKeyNum(0, {});
            let rect = [...document.getElementsByTagName('rect')]
                .filter(el => el.getAttribute('x') == (''+x))
                .filter(el => el.getAttribute('y') == (''+y))[0];
            window.lgLogNode('actsvg - test find Rect'+`${x},${y},${x+15},${y+15}`, rect);
            return rect;
        }
        draw.circle = function(x,y) {
            issueKeyNum(6, {});
            issueClick(x,y);
            var circ = [...document.getElementsByTagName('circle')]
                .filter(el => el.getAttribute('cx') == (''+x))
                .filter(el => el.getAttribute('cy') == (''+y))[0];
            return circ;
        }
        draw.polyline = function(x,y) {
            issueKeyNum(2, {});
            issueDrag(x,y,    x+25,y+25);//back to x-5,x-5?
            var polyline = [...document.getElementsByTagName('polyline')]
                .filter(el => el.getAttribute('points').split(" ")[0] == (''+x))
                .filter(el => el.getAttribute('points').split(" ")[1] == (''+y))[0];
            window.lgLogNode('actsvg - test draw polyline==null '+(polyline==null));
            return polyline;
        }
        draw.text = function(x,y) {
            issueKeyNum(9, {});
            //issueClick(x,y);
            window.mousedown({clientX: window.gSvgFrame.getStart().x+x, clientY: window.gSvgFrame.getStart().y+y});
            window.mouseup({clientX: window.gSvgFrame.getStart().x+x, clientY: window.gSvgFrame.getStart().y+y});
            //document.getElementById('svgPartTextarea').value = document.getElementById('svgPartTextarea').value.replace('?', 'FOOTEXT1234567890');
            // text gets adjusted on draw by x-7, y+3
            document.activeElement?.blur();window.onApplyEdits();
            var text = [...document.getElementsByTagName('text')]
                .filter(el => el.getAttribute('x') == (''+(x-7)))
                .filter(el => el.getAttribute('y') == (''+(y+3)))[0];
            window.lgLogNode('actsvg - test drew text, text==null ='+text==null);
            return text;
        }
        return draw;
    }
};
window.tdd.roundedSwitch = new window.BoolSwitch();
window.tdd.types = ['line', 'rect', 'circle', 'polyline', 'text'];
window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 32 - DRAWING ORDER PERMUTATIONS TEST
    function test32() {
        onStart({});
        let types = window.tdd.types;
        var draw = window.tdd.getDraw();

        var kx=8; var ky=8; var px=100;var px2=100;
        for (var i=0; i<types.length; i++) {
            for (var j=0; j<types.length; j++) {
                var ij = i+j+2;//+(kx++)+(ky++);
                let moverX = ij*10+(kx);kx+=20;
                let moverY = ij*10+(ky);ky+=5;if (kx>300){kx=10;ky+=80;}
                let moveeX = ij*10+30;
                let moveeY = ij*10+30;                window.lgLogNode('actsvg - test MAPPINGS TEST'+ types[i] + ' -> ' + types[j]);
                if (types[i] == 'circle') {moverX += 200;} // got to make
                if (types[j] == 'circle') {moveeX += 200;} // space so
                if (types[i] == 'polyline') {moverY += 150;moverX+=px;px+=100;} // they won't
                if (types[j] == 'polyline') {moveeY += 150;moveeX+=px2;px2+=100;} // overlap and
                                                             // mess with
                                                            // mt.test() impl

                var mover = draw[types[i]](moverX,moverY);
                var movee = draw[types[j]](moveeX,moveeY);
                issueKeyNum(0, {});
                //console.warn('test',mover.getAttribute('x1'),mover.getAttribute('y1'),mover.getAttribute('x2'),mover.getAttribute('y2'),ij*10,ij*10);
                //console.warn('test2',movee.getAttribute('x1'),movee.getAttribute('y1'),ij*10+30,ij*10+30);
                /*if (movee.tagName == 'text') {
                    moveeX -=7;
                    moveeY +=3;//x,y is adjusted when drawn for text elements
                //moveeX += 1;
                //moveeY += 1;

                }
                if (mover.tagName == 'text') {
                    moverX -=7;
                    moverY +=3;//x,y is adjusted when drawn for text elements
                }
                moveeX += 1;
                moveeY += 1;
*/

                var e1 = {clientX:window.gSvgFrame.getStart().x+moveeX,clientY:window.gSvgFrame.getStart().y+moveeY};
                var e2 = {clientX:window.gSvgFrame.getStart().x+moverX,clientY:window.gSvgFrame.getStart().y+moverY};
                if (mover.tagName == 'line' && movee.tagName == 'text') {
                    //window.issueDrag(50,50,    110,110);
/*                    issueDrag(70,50,110,110);
                    issueClick(61,58); window.updateFrames();//why??
*/
                    issueClick(moveeX,moveeY);window.updateFrames();
                    issueClick(moverX,moverY);window.updateFrames();

//                    window.mousedown(e1);    window.mouseup(e1);
                    //window.mousedown(e2);    window.mouseup(e2);
                }
                else {
                    window.mousedown(e1);    window.mouseup(e1);
                    window.mousedown(e2);    window.mouseup(e2);
                }
                //console.warn('testMovee', xy2nd(moveeX,moveeY));
                //console.warn('testMover', xy2nd(moverX,moverY));
                //console.warn("---------------------------->selected",mover.tagName,movee.tagName);

                var mt = new MoveTester({
                    mover: mover,
                    movee: movee
                });
                mt.moveBy(-20,5);
                //console.warn(mover.getAttribute('x1'),mover.getAttribute('x1'),mt.test());
                //console.warn(movee.getAttribute('x1'),movee.getAttribute('x1'),mt.test());
                if (!mt.test()) { return false; }
                //just clear everything out so overlapping nodes won't
                // cause issues when clicking to select the right one
                //document.getElementById('svgFullTextarea').value = svgHead + '\n'  + svgTrail; svgNodes = []; window.updateFrames();
            }
        }
        return true;
    }
];
