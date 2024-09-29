window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 42 - ARROW KEY MOVE KEEPS SELECTION ACTIVE
    function test42() {
        onStart({});

        // rect frame in svg coordinate
        let rectFrame = window.StartEndFrame.FromEl(
            document.getElementsByTagName('rect')[0]
        ); // frame of the default rect svg element

        let clX = window.gSvgFrame.getStart().x + rectFrame.getEnd().x - 1;
        let clY = window.gSvgFrame.getStart().y + rectFrame.getEnd().y - 1;
            //^ 1px just inside end of rect frame (avoids selecting inner text)

        var e  = {clientX:clX, clientY:clY};

        // click Rect as single click to select
        window.mousedown(e); window.mouseup(e);

        // Left Arrow keypress
        window.keydown({
            key: 'ArrowLeft',
            shiftKey: false,
            view:{event:{preventDefault:()=>{}}}
        }); // moves 1 px left

        // Must be tracked (curId) and not reverted back to original cacheColor
        return curIds.length > 0 &&
            document.getElementsByTagName('rect')[0]
                .getAttribute('stroke') != 'black';
    }, // end test42
    // TDD TEST 45 - DRAGGING FORK WITH TWO POLYLINES SHOULD KEEP POSITION
    function test45() {

        let forkY1 = 410;
        let forkY2 = 450;

        let xml = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="750" height="750" viewBox="0,0,750,750">
    <line x1="228" y1="410" x2="406" y2="409" stroke="black" stroke-width="3" id="line1"/>
    <polyline points="256 424 256 493 246 483 256 493 266 483" stroke="black" fill="transparent" stroke-width="1" id="polyline1"/>
    <polyline points="377 429 377 496 367 486 377 496 387 486" stroke="black" fill="transparent" stroke-width="1" id="polyline2"/>
</svg>
`;
        document.getElementById("svgFullTextarea").value = xml;
        onStart({});

        issueDrag(0,0,    750,750); // select fork + 2 polylines
        issueDrag(325,forkY1,    325,forkY2); // drag from fork Y-pos downward
        return [...document.getElementsByTagName("polyline")]
            .filter(el =>
                parseInt(el.getAttribute("points").split(" ")[1])<forkY2)
            .length == 0; // a polyline beneath the fork shouldn't have been 
                          // raised to a position above it
    }, // end test45
    // TDD TEST 46 - MOVEE NODE KEEPS SAME OFFSET TO MOVER NODE WHEN DRAGGED
    function test46() {
        // a more generalized (for all permuted types) version of test 46

        let blankXml = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="16750" height="750" viewBox="0,0,16750,750">
</svg>
`;
        // reset to empty svg
        document.getElementById("svgFullTextarea").value = blankXml;
        onStart({});

        document.getElementById("pageDisplayFrame").style.width = "16750px";
        window.gSvgFrame.setFrame(750, 88, 750+16750, 88+750);
        let types = window.tdd.types;
        var draw = window.tdd.getDraw();

        let moverX = -100; //-130; //-150;
        let moverY = 100; //80;//60;
        for (var i=0; i<types.length; i++) {
            for (var j=0; j<types.length; j++) {
                if(moverX</*490*/16200){moverX+=450;}else{moverX=/*60*/100;moverY+=/*200*/250;}

                //svgNodes = []; window.updateFrames(); // reset to empty svg
                let mover = draw[types[i]](moverX,moverY);
                let movees = [];
                let moveeNds = [];
                for (var k=0; k<4; k++) {// 4 directions nswe
                    let offsetX = [0,0,-50,50][k];
                    let offsetY = [-50,50,0,0][k];
                    movees.push(draw[types[j]](moverX+offsetX,moverY+offsetY));
                }

                issueKeyNum(0, {});
                issueDrag(moverX-99,moverY-90,moverX+155,moverY+155);// select all 5 nodes
                for (var k=0; k<movees.length; k++) {
                    // have to retrieve the nodes via id2nd while there is
                    // a current selection (and id attr will only be guaranteed
                    // to be present during that time)
//console.warn(curIds.length, movees[k].tagName, movees[k].id, movees[k].getAttribute("id"),xy2nd(parseInt(movees[k].getAttribute("x")),parseInt(movees[k].getAttribute("y"))),
//xy2nd(parseInt(movees[k].getAttribute("x1")), parseInt(movees[k].getAttribute("y1"))));
                    moveeNds.push(
                        id2nd(movees[k].getAttribute("id")||movees[k].id)||
                        xy2nd(
                            parseInt(movees[k].getAttribute("cx")),
                            parseInt(movees[k].getAttribute("cy")))||
                        xy2nd(
                            parseInt(movees[k].getAttribute("x")),
                            parseInt(movees[k].getAttribute("y")))||
                        xy2nd(
                            parseInt(movees[k].getAttribute("x1")),
                            parseInt(movees[k].getAttribute("y1")))
                    );
                }

                issueDrag(moverX,moverY,    moverX+90,moverY+90); // move

                for (var k=0; k<movees.length; k++) {
                    let offsetX = [0,0,-50,50][k];
                    let offsetY = [-50,50,0,0][k];

                    let movee = movees[k];
                    /*
                    let moverSty = window.getComputedStyle(mover);
                    let moveeSty = window.getComputedStyle(movee);
                    let moverLeft = parseInt(moverSty.left.replace("px",""));
                    let moverTop = parseInt(moverSty.top.replace("px",""));
                    let moveeLeft = parseInt(moveeSty.left.replace("px",""));
                    let moveeTop = parseInt(moveeSty.top.replace("px",""));
                    let moveeNd = id2nd(movee.getAttribute("id"));
                    */
                    let moveeNd = moveeNds[k];

//console.warn(id2nd(mover.getAttribute("id")), xy2nd(parseInt(mover.getAttribute("x1")),parseInt(mover.getAttribute("y1"))), xy2nd(parseInt(mover.getAttribute("x1")), parseInt(mover.getAttribute("y1"))), mover.getAttribute("x1"), xy2nd(parseInt(mover.getAttribute("cx")), parseInt(mover.getAttribute("cy"))), parseInt(mover.getAttribute("cx")), parseInt(mover.getAttribute("cy")), mover.tagName);
                    let moverNd = (id2nd(mover.getAttribute("id"))||
                        xy2nd(parseInt(mover.getAttribute("x1")), parseInt(mover.getAttribute("y1")))||
                        xy2nd(parseInt(mover.getAttribute("cx"))+90, parseInt(mover.getAttribute("cy"))+90)
                    );
                    let moverNewX = window.getX1(moverNd);
                    let moverNewY = window.getY1(moverNd);
                    let moveeNewX = window.getX1(moveeNd);
                    let moveeNewY = window.getY1(moveeNd);
                    if (mover.tagName != 'text' && movee.tagName == 'text') { moveeNewX += 7;moveeNewY-=3; }//text has extra offset
                    if (mover.tagName == 'text' && movee.tagName != 'text') { moveeNewX -= 7;moveeNewY+=3; }//text has extra offset
//console.warn(moverNewY,offsetY,moveeNewY);
                    if (moverNewX + offsetX != moveeNewX) return false;
                    if (moverNewY + offsetY != moveeNewY) return false;
                    /*
                    if (offsetX < 0 && moveeLeft >= moverLeft) return false;
                    if (offsetX > 0 && moveeLeft <= moverLeft) return false;
                    if (offsetY < 0 && moveeTop >= moverTop) return false;
                    if (offsetY > 0 && moveeTop <= moverTop) return false;
                    */
                }
            }
        }
        return true;
    }, // end test46
    // TDD TEST 47 - DRAGGING SELECTED EMPTY RECT INSIDE RECT MOVES INNER RECT
    function test47() {
        // code generated from window.lgUserFlush():
        window.onStart({});
        window.mousedown({clientX:1024,clientY:102});
        window.mousemove({clientX:1209,clientY:308,view:{event:{preventDefault:()=>{}}}});
        window.mouseup({clientX:1209,clientY:308});
        window.keydown({key:"Control", shiftKey:false,ctrlKey:true,view:{event:{preventDefault:()=>{}}}});
        window.keydown({key:"x", shiftKey:false,ctrlKey:true,view:{event:{preventDefault:()=>{}}}});
        window.keydown({key:"3", shiftKey:false,ctrlKey:false,view:{event:{preventDefault:()=>{}}}});
        /*window.mousedown({clientX:804,clientY:132});
        window.mousemove({clientX:971,clientY:625,view:{event:{preventDefault:()=>{}}}});
        window.mouseup({clientX:971,clientY:625});*/window.issueDrag(804-window.gSvgFrame.getStart().x,132-window.gSvgFrame.getStart().y,971-window.gSvgFrame.getStart().x,625-window.gSvgFrame.getStart().y,true);
        /*window.mousedown({clientX:853,clientY:284});
        window.mousemove({clientX:933,clientY:413,view:{event:{preventDefault:()=>{}}}});
        window.mouseup({clientX:933,clientY:413});*/window.issueDrag(853-window.gSvgFrame.getStart().x,284-window.gSvgFrame.getStart().y,933-window.gSvgFrame.getStart().x,413-window.gSvgFrame.getStart().y,true);
        window.keydown({key:"0", shiftKey:false,ctrlKey:false,view:{event:{preventDefault:()=>{}}}});
        window.mousedown({clientX:889,clientY:360});
        window.mouseup({clientX:889,clientY:360});
        window.mousedown({clientX:889,clientY:360});/*added out of necessity: */window.mousemove({clientX:889,clientY:360,view:{event:{preventDefault:()=>{}}}});
        window.mousemove({clientX:891,clientY:426,view:{event:{preventDefault:()=>{}}}});
        window.mouseup({clientX:891,clientY:426});

        // return true if the inner rect moved:
        // inner rect should have moved beyond
        // its initial y=196 (196+88 = 284, see mousedown y=284 above)
        // and its initial x=103 (103+750=853, see mousedown x=853 above)
        let countYGT196 = 0;
        let countXGT103 = 0;
        var rects = document.getElementsByTagName("rect");
        for (var i=0; i<rects.length; i++) {
            if (parseInt(rects[i].getAttribute("y")) > 196) { countYGT196+=1; }
            if (parseInt(rects[i].getAttribute("x")) > 103) { countXGT103+=1; }
        }

        return countYGT196 == 1 && countXGT103 == 1; // only 1 rect (the inner
                                                     // rect) should have
                                                     // moved and this rect
                                                     // will have x,y >
                                                     // surrounding rect's x,y
    }, // end test47
];
