window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 21 - SELECTS USING RECTANGLE
    function test21() {
        onStart({});

        var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        // click to select just outside of it
        window.issueRectSelectClick(actionNd.xmin-1, actionNd.ymin-1);
        window.issueRectSelectClick2(actionNd.xmax+1, actionNd.ymax+1);

        // should have selected 3 nodes (the rectangle and the 2 inner text nds)
        return curIds.length === 3;
    },
    // TDD TEST 22 - RECTANGULAR SELECTION IS VISIBLE
    function test22() {
        onStart({});

        window.issueRectSelectClick(751, 89);

        var selEl = document.getElementById("selMarker");
        
        return window.getComputedStyle(selEl).visibility == 'visible';
    },
    // TDD TEST 23 - RECTANGULAR SELECTION UPDATES WITH MOVE
    function test23() {
        onStart({});

        window.issueRectSelectClick(751, 89);
        window.updateVisibleRectSelection(1000, 100);
        var selEl = document.getElementById("selMarker");
        return parseInt(window.getComputedStyle(selEl).width.replace('px',''))>200;
    },
    // TDD TEST 24 - BG-CLICK CANCELS SELECTION
    function test24() {
        onStart({});

        var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        // click to select just outside of it
        window.issueRectSelectClick(actionNd.xmin-1, actionNd.ymin-1);
        window.issueRectSelectClick2(actionNd.xmax+1, actionNd.ymax+1);

        window.mousedown({clientX:750+10, clientY:88+10});
        window.mouseup({clientX:750+10, clientY:88+10}); // cancels selection
        return curIds.length === 0;
    },
    // TDD TEST 25 - RECTANGULAR SELECTION WORKS IN SWIMLANE
    function test25() {
        onStart({});
        issueKeyNum(4, {}); // rect mode
        issueDrag(1,1,    749,749);  // create bounding rect
        //issueClick(1, 1);    updateFrames();
        //issueClick(749, 749);    updateFrames();  // create bounding rect

        var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        var x1 = /*750 + */actionNd.xmin-1;
        var y1 = /*88 + */actionNd.ymin-1;
        var x2 = /*750 + */actionNd.xmax+1;
        var y2 = /*88 + */actionNd.ymax+1; // surrounding rect

        issueKeyNum(0, {}); // select mode

        issueDrag(x1,y1,    x2,y2);
        //window.mousedown({clientX:x1, clientY:y1});
        //window.mousemove({clientX:x2, clientY:y2, view:{event:{preventDefault:function(){}}}});
        //window.mouseup({clientX:x2, clientY:y2}); // selects action node
        return window.id2nd(curIds[0].id).xmin>10;//ensures bounding rect isn't selected

        // maybe say any rect that has a dimension >=greater a quadrant
        // 1/4 of 750px is a swimlane
        // return false;
    },
    // TDD TEST 26 - SWIMLANE CLICK SELECTS SWIMLANE
    function test26() {
        onStart({});
        issueKeyNum(4, {}); // rect mode
        issueClick(1, 1);    updateFrames();
        issueClick(749, 749);    updateFrames();  // create bounding rect

        /*var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        var x1 = 750 + actionNd.xmin-1;
        var y1 = 88 + actionNd.ymin-1;
        var x2 = 750 + actionNd.xmax+1;
        var y2 = 88 + actionNd.ymax+1; // surrounding rect
        */
        issueKeyNum(0, {}); // select mode

        window.mousedown({clientX:750+1, clientY:88+1});
        window.mouseup({clientX:750+1, clientY:88+1}); // selects bounding rect
        return curIds.length==1 && window.id2nd(curIds[0].id).xmin<10;//ensures bounding rect is selected
    },
    // TDD TEST 28 - MOVES NODE THAT OVERLAPS OTHER NODES
    function test28() {
        onStart({});

        // there are 3 nodes.
        // * 1 - the default rect node that is already there
        // * 2 - another node that gets placed on top of #1, and will move to #3
        // * 3 - another node that gets placed at 0,0

        issueKeyNum(4, {}); // rect mode

        var dfltNd = svgNodes.filter(n => n.tagName =='rect')[0];
        //console.warn(dfltNd.attrs);
        var dX = parseInt(
            dfltNd.attrs.filter(a=>a.name=='x')[0].value
        ); // default X
        var dY = parseInt(
            dfltNd.attrs.filter(a=>a.name=='y')[0].value
        ); // default Y
        var dW = parseInt(dfltNd.attrs.filter(a=>a.name=='width')[0].value);
        var dH = parseInt(dfltNd.attrs.filter(a=>a.name=='height')[0].value);
        var dX2 = dX + dW;
        var dY2 = dY + dH;
        issueClick(dX,dY);    updateFrames();
        issueClick(dX2,dY2);    updateFrames(); // draws overlapping node

        issueClick(0,0);    updateFrames();
        issueClick(dW,dH);    updateFrames();

        issueKeyNum(0, {}); // select mode

        // first select circle movee
        var circle = document.getElementsByTagName('circle')[0];
        issueClick(/*750+*/circle.attributes['cx'].value, /*88+*/circle.attributes['cy'].value);    updateFrames();
        // next select the overlapped rect being tested
        issueClick(dX, dY);    updateFrames();

        //document.getElementById(curIds[0].id)
        //    .attributes['x'].value;

        //console.warn(curIds[0]);
        /*console.warn(document.getElementById("svgFullTextarea").value
                        .split(`
`).filter(ln=>ln.indexOf('rect1')>-1)[0]);
*/

        var mt = new MoveTester({
            mover: document.getElementById(curIds[1].id),
            movee: circle
        });

        mt.moveBy(-dX,-dY);//go to 0,0

        return mt.test();
        //return document.getElementById("svgFullTextarea").value.split('x="0"').length ==2 && document.getElementById("svgFullTextarea").value.indexOf(`x=${dX}`)>-1;
    },
    // TDD TEST 29 - COPY PASTE MULTIPLE NODES
    function test29() {/*global=window;*/ //if (window.gTest)global.NamedNodeMap=window.NamedNodeMap;
        onStart({});

        window.mousedown({clientX:750+1, clientY:88+1});
        window.mouseup({clientX:750+700, clientY:88+700}); // selects everything

        window.mouse.x = 600;
        window.mouse.y = 600; // will paste into quadrant 4

        window.manageKeyDownEvent({key:'c',ctrlKey:true});
        window.issuePaste(()=>{
            var ta=document.getElementById('svgFullTextarea');
            ta.value = ta.value.replace('</svg>', `
    <circle cx="375" cy="39" r="10" fill="black" stroke="black" stroke-width="1"  class='unresolvedmover'/>
    <polyline points="375 52 375 108 365 98 375 108 385 98" stroke="black" fill="transparent" stroke-width="1"  class='unresolvedmovee'/>
    <rect rx="10" ry="10" x="325" y="112" width="100" height="50" stroke="black" fill="transparent" stroke-width="1"  class='unresolvedmovee'/>
    <text x="333" y="134" fill="black" class='unresolvedmovee'>Receive</text>
    <text x="333" y="154" fill="black"  class='unresolvedmovee'>Request</text>
</svg>
`);
        });

        var countQ4 = 0;
        for (var i=0; i<svgNodes.length; i++) {
            if (window.getX1(svgNodes[i])>(750/2) &&
                window.getY1(svgNodes[i])>(750/2)) {
                countQ4 += 1;
            }
        }
        return countQ4 == 5; // copied all 5 default nodes into quadrant 4
    },
    // TDD TEST 30 - DELETE NODE(S) VIA CUT
    function test30() {
        onStart({});

        window.mousedown({clientX:750+1, clientY:88+1});
        window.mousemove({view:{event:{preventDefault:()=>{}}},clientX:750+700, clientY:88+700});
        window.mouseup({clientX:750+700, clientY:88+700}); // selects everything
        // console.warn(curIds.length);
        window.manageKeyDownEvent({key:'x',ctrlKey:true});

        return svgNodes.length == 0;
    },
    // TDD TEST 31 - MODE 9 CLICK SHOULD HIGHLIGHT QUESTION MARK
    function test31() {
        onStart({});

        // This bug happened after the change that gives selected nodes
        // id numbers (<.. id="rect1"/>). To fix it 2 things must happen,
        // 1) the selection range needs to apply after a short setTimeout
        //    (this part could not be tested) and
        // 2) the focus and the selection range calculation needs to 
        //     happen after the id="rect1" is applied,
        //     which is what is coded below, and is accomplished by calling the
        //     inner-level functions directly in the same order as happens
        //     when using the real dom's outer functions (mousedown/up).
        window.issueDraw(`<text x="0" y="0" fill="black">?</text>`, 'text');
        issueKeyNum(9, {});
        window.issueClick(10,10); // changed from 0,0 since user clicks the
                                  // the middle of the text and a 0,0 click
                                  // causes text's left-edge to go offscreen
        svgNodes.filter(nd => nd.attrs.filter(a => a.name == 'x' && a.value =='0').length > 0)[0].attrs.push({name:'id',value:'text10'});    updateFrames();

        var ta = document.getElementById("svgPartTextarea");
        return ta.selectionStart > `<text x="-7" y="3" fill="black" id="text1"`.length && ta.selectionEnd - ta.selectionStart == 1;
    },
    // TDD TEST 33 - CLICK-SELECT THEN CLICK DESELECTS
    function test33() {
        onStart({});
        var left = window.gSvgFrame.getStart().x;
        var top = window.gSvgFrame.getStart().y;
        var e = {clientX: left+375, clientY: top+79};
        window.mousedown(e); window.mouseup(e);window.updateFrames();
        window.mousedown(e); window.mouseup(e);window.updateFrames();
        return curIds.length == 0;
    },
    // TDD TEST 34 - CLICK-SELECT, CLICK-DESELECT, THEN CLICK AGAIN SELECTS
    function test34() {
        onStart({});
        var left = window.gSvgFrame.getStart().x;
        var top = window.gSvgFrame.getStart().y;
        var e = {clientX: left+375, clientY: top+79};
        window.mousedown(e); window.mouseup(e);
        window.mousedown(e); window.mouseup(e);
        window.mousedown(e); window.mouseup(e);
        return curIds.length > 0;
    },
    // TDD TEST 35 - NODE X,Y ATTRIBUTE SHOULD BE A STRING TYPE
    // bug fix unit test, was seeing nonquoted int numbers
    function test35() {
        onStart({});
        issueKeyNum(1, {}); // line mode
        issueDrag(10,10,    40,10);
        issueKeyNum(0, {});
        issueClick(10,10);
        let attrs = id2nd(curIds[0].id).attrs;
        let x2 = attrs.filter(a => a.name == 'x2')[0].value;
        let y2 = attrs.filter(a => a.name == 'y2')[0].value;
        //console.warn(attrs); // shows nonquoted only for x2,y2
        return  x2 === '40' && y2 === '10';
    },
    // TDD TEST 36 - NODE WIDTH,HEIGHT ATTRIBUTE SHOULD BE A STRING TYPE
    // bug fix unit test, was seeing nonquoted int numbers
    function test36() {
        onStart({});
        issueKeyNum(3, {}); // line mode
        issueDrag(10,10,    40,20);
        issueKeyNum(0, {});
        issueClick(10,10);
        let attrs = id2nd(curIds[0].id).attrs;
        let width = attrs.filter(a => a.name == 'width')[0].value;
        let height = attrs.filter(a => a.name == 'height')[0].value;
        // console.warn(attrs); // shows nonquoted only for width,height
        return  width === '30' && height === '10';
    },
    // TDD TEST 37 - RECTANGULAR SELECTION OF DIAGONAL LINE
    function test37() {
        onStart({});
        issueKeyNum(1, {});
        issueDrag(20,200,    80,260);
        issueKeyNum(0, {});
        issueDrag(/*10,190,*/0,0,    90,270); // now w/ edge resizing can't
                                              // select so close to line vertex,
                                              // so start selection at 0,0
        // needs to be tracked as a selected curId,
        // and be changed to a color indicating that it is selected
        return curIds.length > 0 && document.getElementsByTagName('line')[0].getAttribute('stroke')!='black';
    },
    // TDD TEST 38 - BACKWARDS RECTANGULAR SELECTION
    function test38() {
        onStart({});
        issueKeyNum(0, {});
        issueDrag(750,750,    0,0);
        return curIds.length > 0;
    },
    // TDD TEST 39 - BACKWARDS RECTANGULAR SELECTION DISPLAYS CORRECTLY
    function test39() {
        onStart({});
        issueKeyNum(0, {});
        var svgPt = window.gSvgFrame.getStart();
        var x = svgPt.x + 750;
        var y = svgPt.y + 750;
        window.mousedown({clientX: x, clientY: y});
        window.mousemove({clientX: svgPt.x, clientY: svgPt.y,
            view:{event:{preventDefault:function(){}}}});
        var marker = document.getElementById("selMarker");
        var markerStyle = window.getComputedStyle(marker);
        var left = parseInt(markerStyle.left.replace("px,",""));
        var top = parseInt(markerStyle.top.replace("px",""));
        return left <= svgPt.x && top <= svgPt.y;
    },
    // TDD TEST 41 - OUT OF BOUNDS DRAW DOES NOT ADD NEW NODE
    function test41() {
        onStart({});
        issueKeyNum(1, {});
        issueDrag(800,100,    600,100);
        return document.getElementById('svgFullTextarea').value.indexOf('<line') == -1 && document.getElementsByTagName('line').length == 0;
    }, // end test41
    // TDD TEST 43 - SELECTS INNER RECTANGLE
    function test43() {
        onStart({});
        issueKeyNum(3, {});
        issueDrag(200,200,    400,400); // bug only happened when drawing larger
                                        // rectangle first
        issueDrag(250,250,    300,300); // small rect

        var e = {view:{event:{preventDefault:()=>{}}}};
        e.clientX = window.gSvgFrame.getStart().x + 251;
        e.clientY = window.gSvgFrame.getStart().y + 251;
        issueKeyNum(0, {});
        window.mousedown(e); window.mouseup(e); // should select small rect
        var selEl = document.getElementById(curIds[0].id);
        return curIds.length == 1 &&
            window.StartEndFrame.FromEl(selEl).getStart().x == 250;
    }, // end test43
    // TDD TEST 44 - SELECTS INNER ELEMENT OF RECTANGLE PERMUTATIONS
    function test44() {
        // like test 43 but with more element types
        onStart({});
        issueKeyNum(3, {});
        issueDrag(1,1,    400,400); // large surrounding rect

        let types = ['line', 'rect', 'circle', 'polyline', 'text'];
        let drawInfo = {
            'line': { drag: true, mode: 1 },
            'polyline': { drag: true, mode: 2 },
            'rect': { drag: true, mode: 3 },
            'circle': { drag: false, mode: 6 },
            'text': { drag: false, mode: 9 }
        }; // end drawInfo associated array
        let x = 3;
        let y = 3;
        for (var i=0; i<types.length; i++) {
            let type = types[i];
            let di = drawInfo[type];
            issueKeyNum(di.mode, {});

            if (di.drag) {
                issueDrag(x,y,    x+13,y+13);
            } // end drag-to-draw cond

            if (!di.drag) {
                issueClick(x, y);
            } // end not drag-to-draw cond

            if (di.mode == 6) {
                // default circle has r=10 so need to offset click by that much:
                x -= 10;
                y -= 10;
            } // end circle mode cond

            if (di.mode == 9) {
                var f = window.StartEndFrame.FromText(/*mock node:*/{
                    attrs:[
                        {name: 'x', value: ''+x},
                        {name: 'y', value: ''+y}
                    ],
                    text: '?'
                });

                x = f.getStart().x; // invisible bounding rect
                y = f.getStart().y; // determined by FromText
                let offsetStart = window.StartEndFrame.FromTextThruClick(x, y).getStart();
                x = offsetStart.x;
                y = offsetStart.y;
            } // end text mode cond

            issueKeyNum(0, {});
            var e = {view:{event:{preventDefault:()=>{}}}};
            e.clientX = window.gSvgFrame.getStart().x + x;
            e.clientY = window.gSvgFrame.getStart().y + y;

            window.mousedown(e); window.mouseup(e); // should select cur el
            var selEl = document.getElementById(curIds[0].id);
            window.lgLogNode(`actsvg - test44 attempt sel inside rect curIds.length==${curIds.length} selEl==${selEl.tagName} StartFrameX==${window.StartEndFrame.FromEl(selEl).getStart().x} x==${x} StartFrameY==${window.StartEndFrame.FromEl(selEl).getStart().y} y==${y}`, selEl);
            if (    !(curIds.length == 1 &&
                      window.StartEndFrame.FromEl(selEl).getStart().x == x &&
                      window.StartEndFrame.FromEl(selEl).getStart().y == y)) {
                return false;
            } // end not cur el selected cond
            x += 26;
            y += 26;
            e.clientX = window.gSvgFrame.getStart().x + 600;
            e.clientY = window.gSvgFrame.getStart().y + 600;
            window.mousedown(e); window.mouseup(e); //resets to nothing selected
        } // end for i in types len.
        return true;
    }, // end test44
    // TDD TEST 48 - DRAGGING FROM OUTSIDE DESELECTS RECT
    function test48() {
        // code generated from window.lgUserFlush():
        window.onStart({});
        window.mousedown({clientX:1162,clientY:230});
        window.mouseup({clientX:1162,clientY:230});
        window.mousedown({clientX:1207,clientY:205});
        window.mousemove({clientX:1207,clientY:205,view:{event:{preventDefault:()=>{}}}});// added uncaptured mousemove
        window.mousemove({clientX:1080,clientY:235,view:{event:{preventDefault:()=>{}}}});// added uncaptured mousemove
        window.mousemove({clientX:1057,clientY:260,view:{event:{preventDefault:()=>{}}}});
        window.mouseup({clientX:1057,clientY:260});

        let rect = document.getElementsByTagName("rect")[0];
        return curIds.length == 0 &&
            rect.getAttribute("x") == "325" &&
            rect.getAttribute("y") == "112";
    }, // end test48,
    // TDD TEST 50 - DRAGGING FROM OUTSIDE LARGE SLIGHTLY OVERLAPPING SMALL RECT
    // SELECTS BOTH RECTS
    function test50() {
        // clear screen code taken from window.lgUserFlush() capture:
        window.onStart({});
        window.mousedown({clientX:1012,clientY:100});
        window.mousemove({clientX:1247,clientY:317,view:{event:{preventDefault:()=>{}}}});
        window.mouseup({clientX:1247,clientY:317});
        window.keydown({key:"Control", shiftKey:false,ctrlKey:true,view:{event:{preventDefault:()=>{}}}});
        window.keydown({key:"x", shiftKey:false,ctrlKey:true,view:{event:{preventDefault:()=>{}}}});
        window.keydown({key:"3", shiftKey:false,ctrlKey:false,view:{event:{preventDefault:()=>{}}}});

        issueDrag(106,94,    106+139,94+22);
        issueDrag(106,115,    106+295,115+541);        

        window.keydown({key:"0", shiftKey:false,ctrlKey:false,view:{event:{preventDefault:()=>{}}}});

        issueDrag(0,0,    750,750);

        return curIds.length == 2;
    }, // end test50
    // TDD TEST 52 - PASTING INTO FULL XML TEXTAREA WON'T RESULT IN A NODE PASTE
    function test52() {
        // no onstart call
        window.dispatchEvent(new Event('paste'));
        return window.lgUserFlush().indexOf('paste') == -1;
    }, // end test52
    // TDD TEST 53 - PASTING INTO PART XML TEXTAREA WON'T RESULT IN A NODE PASTE
    function test53() {
        // copied from lgUserFlush
        window.onStart({});
        window.mousedown({clientX:1127,clientY:123});
        window.mouseup({clientX:1127,clientY:123});
        // paste

        // non-copied code
        window.dispatchEvent(new Event('paste'));
        let logStr = window.lgUserFlush();
        return logStr.indexOf('paste') == -1;
    }, // end test53
    // TDD TEST 54 - RIGHT-CLICK INTERRUPTING RECT DRAW THEN LEFT-CLICK DISMISS
    // DOESN'T CREATE A NEW RECT WITH NEGATIVE WIDTH (OR HEIGHT)
    function test54() {
        let x2 = 100;
        let y2 = 100;
        issueClear();
        issueMK(4);
        issueDrag(10,10,    x2,y2,    false);
        x2 += window.gSvgFrame.getStart().x;
        y2 += window.gSvgFrame.getStart().y;
        window.mousedown({clientX:x2, clientY:y2,button:2}); // 2 => right-click
        window.mousemove({clientX:x2-20, clientY:y2-20}); // mouse moves
        window.mouseup({clientX:x2, clientY:y2,button:2}); // 2 => right-click
        x2 /= 2; // divide in half to click somewhere
        y2 /= 2; // in the middle of the originally drawn rectangle
        window.mousedown({clientX:x2, clientY:y2,button:0}); // 0 => left-click
        window.mouseup({clientX:x2, clientY:y2,button:0}); // 0 => left-click
        return document.getElementsByTagName("rect").length == 1 &&
            parseInt(document.getElementsByTagName("rect")[0].getAttribute("width"))>0 &&
            parseInt(document.getElementsByTagName("rect")[0].getAttribute("height"))>0;
    }, // end test54
    // TDD TEST 55 - RIGHT-CLICK INTERRUPTING RECT DRAW THEN LEFT-CLICK DISMISS
    // AND THEN TRY TO SELECT ORIGINAL RECTANGLE SHOULD RESULT IN A SELECTION
    function test55() {
        // starts from same code as test54
        let x2 = 100;
        let y2 = 100;
        issueClear();
        issueMK(4);
        issueDrag(10,10,    x2,y2,    false);
        x2 += window.gSvgFrame.getStart().x;
        y2 += window.gSvgFrame.getStart().y;
        window.mousedown({clientX:x2, clientY:y2,button:2}); // 2 => right-click
        window.mousemove({clientX:x2-20, clientY:y2-20}); // mouse moves
        window.mouseup({clientX:x2, clientY:y2,button:2}); // 2 => right-click
        x2 /= 2; // divide in half to click somewhere
        y2 /= 2; // in the middle of the originally drawn rectangle
        window.mousedown({clientX:x2, clientY:y2,button:0}); // 0 => left-click
        window.mouseup({clientX:x2, clientY:y2,button:0}); // 0 => left-click

        // continuing on beyond test54 code
        issueMK(0);
        issueDrag(0,0,    750,750);
        window.updateFrames(); // necessary so next test can run
        return svgNodes.length == 1 && // should only have 1 node (the original rect)
            curIds.length == 1; // original rect should be be selected
    }, // end test55
];
