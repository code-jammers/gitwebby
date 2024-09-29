// MV - GLOBALS
window.gMvState = {moving: false, offsetX: null, offsetY: null,
    moverStartX: null, moverStartY: null};
// MV - IS MOVE KEY EVENT
window.mvIsMoveKey = function(key) {
    return (key == "Enter" || key.substring(0,5) == "Arrow") &&
        window.getComputedStyle(document.getElementById("svgPartTextarea")).visibility == 'visible';
}

// MV - SHOULD CANCEL

window.mvShouldCancel = function(x,y) {
    return Math.abs(window.gRectSelectState.firstX-x)>18 ||
        Math.abs(window.gRectSelectState.firstY-y)>18;
/*
    var markerSty = window.getComputedStyle(document.getElementById("selMarker"));
    let w = parseInt(markerSty.width.replace('px', ''));
    let h = parseInt(markerSty.height.replace('px', ''));
    return w>18||h>18;*/
}

// MV - CAN SELECT AND MOVE
// TODO: this function along with the mvIsMove function follows a bad pattern
// of returning a true/false value and also setting necessary tracking values;
// both functions should be refactored to follow the CQS principle
window.mvCanSelectAndMove = function(nd, x,y) {
    // If you click on whitespace inside a rectangle with no other nodes
    // anywhere inside the rect, then drag, it should select & start moving it.
    // However if you click the whitespace inside a rectangle to drag a
    // selection rectangle around something (ie: a text node) that exists
    // inside the rectangle then it should return false and not select and move,
    // but rather let the selection rectangle choose what gets selected.
    if (window.gMvState.moving) return false;//don't cancel a move-in-progress
    // let nd = xy2nd(x,y);
    if (nd == null) {
        return false; } // can't select and move if it didn't click a node
    if (curIds.length > 0) {
        for (var i=0; i<curIds.length; i++) {
            var testNd = id2nd(curIds[i].id);
            if (x>=testNd.xmin && x<=testNd.xmax &&
                y>=testNd.ymin && y<=testNd.ymax) {
                return false; } // shouldn't cancel multi-selected movement
                                // when you are click-dragging on the already
                                // selected node. A non-selected node click-drag
                                // will cancel the selection and do a sel-mv op.
        }
    }
    for (var i=0; i<svgNodes.length; i++) {
        if (svgNodes[i] == nd) continue;
        let testNd = svgNodes[i];
        if (testNd.xmin>=nd.xmin && testNd.xmax<=nd.xmax &&
            testNd.ymin>=nd.ymin && testNd.ymax<=nd.ymax) {
            return false; } // can't perform select-move op. if another node is
                            // contained in the clicked node's bounds
    }
    if (curIds.length > 0){onApplyEdits();}

    if (window.mvShouldCancel(x,y)) {
        return false; } // a rectangluar selection was already started outside
                        // the node that is now detected at x,y
    issueClick(x,y);  // select the node
    return true;
}

// MV - CAN MOVE
window.mvCanMove = function() {
    // you can only move (ie: on left keypress) if something is selected
    return curIds.length > 0;
}
// MV - IS MOVE
window.mvIsMove = function(nd, x,y) {
    if (!window.gMvState.moving && ((window.mvCanSelectAndMove(nd, x,y)||window.mvCanMove()) && xy2nd(x,y)!=null)) {
        var clickedNd = xy2nd(x,y,/*withNearestEdge=*/true); // TDDTEST47 FIX
        var clickedId = clickedNd.attrs.filter(a => a.name == 'id').length == 0
            ? 'bad0'
            : clickedNd.attrs.filter(a => a.name == 'id')[0].value;

          if (window.mvShouldCancel(x,y)) { // TDDTEST48 FIX
              return false; // cancel the move since it has already dragged
          }                 // far enough to start a selection rectangle

        for (var i=0; i<curIds.length; i++) {
            if (clickedId == id2nd(curIds[i].id).attrs.filter(a => a.name == 'id')[0].value) {
                window.gMvState.moving = true;
                break;
            }
        }
    }
    return window.gMvState.moving;
}
// MV - CLOSE MOVE
window.mvClose = function() {
    window.gCmCacheObj.id = null; // CT/49
    let wasMoving = window.gMvState.moving;
    window.gMvState.moving = false;
    window.gMvState.offsetX = null;
    window.gMvState.offsetY = null;
    window.gMvState.moverStartX = null;
    window.gMvState.moverStartY = null;
    if (wasMoving) { //window.mvIssueMoveKey('Enter');
                     //window.mgCloseSelection();onApplyEdits();
                      }// TDDTEST33 FIX
}
// MV - MOVE
window.mvMove = function(x,y) {
    if (window.gMvState.offsetX === null) {
        let nd = id2nd(curIds[curIds.length-1].id);
        let ndX = window.getX1(nd);
        let ndY = window.getY1(nd);
        window.gMvState.offsetX = x - ndX;
        window.gMvState.offsetY = y - ndY;
        window.gMvState.moverStartX = ndX;
        window.gMvState.moverStartY = ndY;
        return;
    }
    if (curIds.length == 0) {return;}//not sure why this could happen
    let moverNd = id2nd(curIds[curIds.length-1].id);
    window.forceMap(moverNd, cacheNd);
    window.setPos(moverNd, x - window.gMvState.offsetX, y - window.gMvState.offsetY);

    for (var i=0; i<curIds.length - 1; i++) {
        var moveeNd = id2nd(curIds[i].id);
        // moveeNd.attrs = moveeNd.attrs.filter(a => a.name != 'class');
        window.smartMap(moverNd, moveeNd);
        // code is similar to paste code in window.issuePaste js/node-manage.js
    }

    window.updateFrames(moverNd, {isSel:true}); // isSel means keep the
                                                // selection showing w/out
                                                // reverting stroke back to
                                                // original color.
    /*var moveMark = document.getElementById("moveMarker");
    moveMark.style.visibility = "visible";
    moveMark.style.left=(window.gSvgFrame.getStart().x-10+x)+"px";//why not 750??
    moveMark.style.top=(window.gSvgFrame.getStart().y-88+37+y)+"px";*/
}

// MV - ISSUE MOVE KEY EVENT
window.mvIssueMoveKey = function(key, shiftKey) { // TDDTEST18 FTR
    key = (key.substring(0,5) == "Arrow") ? key.substring(5).toLowerCase() : key.toLowerCase();
    let name = key;

    if (name == "enter") {
        window.mvClose();
        window.onApplyEdits();
        return;
    }
    if (("left|right|down|up".indexOf(name) == -1) || !window.mvCanMove()) {
        return; } // repititious early-exit guard (already guarded in index.js)

    // calc deltaX, deltaY
    let deltaX = 0
    let deltaY = 0
    let i = shiftKey ? 20 : 1;  // increment amount
    switch(name) {
        case "left":  { deltaX -= i; break; }
        case "right": { deltaX += i; break; }
        case "up":    { deltaY -= i; break; }
        case "down":  { deltaY += i; break; }
    }

    // setup move call pre-requisites
    let nd = id2nd(curIds[curIds.length-1].id); // the mover node
    let ndX = window.getX1(nd);
    let ndY = window.getY1(nd);
    window.gMvState.offsetX = 0; // offset not necessary on a key press event,
    window.gMvState.offsetY = 0; // only mouse move event needs to know how far
                                 // the mouse was away from sel node start x,y
    window.gMvState.moverStartX = ndX;
    window.gMvState.moverStartY = ndY;
    window.gMvState.moving = true;

    // call move
    window.mvMove(ndX+deltaX, ndY+deltaY);

    // reset move status
    window.mvClose(); // window.gMvState.moving = false;


//     var moveMark = document.getElementById("moveMarker");
//     moveMark.style.visibility = "visible";
// 
//     if (name == "enter") {
//         curMvX = null;
//         curMvY = null;
//         moveMark.style.visibility = "hidden";
//         onApplyEdits();
//         return;
//     }
// 
//     if (curMvX == null) {
//         var nd = id2nd(curIds[curIds.length-1].id);
//         curMvX = getscal(nd.attrs, "x");
//         curMvY = getscal(nd.attrs, "y");
//     }
// 
//     var ta = document.getElementById("svgPartTextarea");
//     var x = curMvX;
//     var y = curMvY;
//     if (ta.value.indexOf(` x="`) > -1) {
//         if (name == "left" || name == "right") {
//             var delta = 1;
//             if (name == "left") {
//                 delta = -1;
//             }
//             x += delta;
//             ta.value = ta.value.replace(/ x="[0-9]+"/g, ` x="${x}"`);
//             //addscal(nd, "x", delta);
//         }
//         if (name == "up" || name == "down") {
//             var delta = 1;
//             if (name == "up") {
//                 delta = -1;
//             }
//             y += delta;
//             ta.value = ta.value.replace(/ y="[0-9]+"/g, ` y="${y}"`);
//             //addscal(nd, "y", delta);
//         }
//     }
//     curMvX = x;
//     curMvY = y;
//     moveMark.style.left=(window.gSvgFrame.getStart().x-10/*740*/+x)+"px";//why not 750??
//     moveMark.style.top=(window.gSvgFrame.getStart().y-88+37+y)+"px";
}
