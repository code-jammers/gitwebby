window.atPosName = function(nd, vtx) {
    let posName = null;
    if (nd.tagName == 'line') {
        posName = {x: 'x1', y: 'y1'};
        if (vtx?.x == 1) {
            posName.x = 'x2';
            posName.y = 'y2';
        }// end 1,1 vertex cond
        else {}//end 0,0 vertex cond (default values: x1, y1)
    } // end line type cond
    return posName;
}; // end position attribute name
