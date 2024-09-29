window.unittestnd = function(x, y, w, h, tagName = 'rect') {
    let x1Name = "x";
    let y1Name = "y";
    let x2Name = "width";
    let y2Name = 'height';
    if (tagName == 'line') {
        x2Name = 'x2';
        y2Name = 'y2';
        x1Name = "x1";
        y1Name = "y1";
    } // end line cond
    if (tagName == 'polyline') {
        return {tagName: tagName, attrs: [{name: 'points', value: `${x} ${y} ${x+w} ${y+h} ${x+w-3} ${y-3} ${x+w} ${y+h} ${x+w-3} ${y+w+3} ${x+w} ${y+h}`}]};
    } // end polyl cond
    if (tagName == 'circle') {
        x1Name = "cx";
        y1Name = "cy";
        x2Name = "r";
        y2Name = "ignore";
    } // end circ cond
    if (tagName == 'text') { x2Name = 'ignore1'; y2Name='ignore2'; }
    let nd = {tagName: tagName, attrs:[
            {name: x1Name, value: ''+x},
            {name: y1Name, value: ''+y},
            {name: x2Name, value: ''+w},
            {name: y2Name, value: ''+h},
    ]};
    return nd;
}; // end unit test node func
window.unittestndattr = function(nd, attr) {
    if (attr == 'x' && nd.tagName == 'line') attr = 'x1';
    if (attr == 'y' && nd.tagName == 'line') attr = 'y1';
    if (attr == 'width' && nd.tagName == 'line') attr = 'x2';
    if (attr == 'height' && nd.tagName == 'line') attr = 'y2';

    if (attr == 'x' && nd.tagName == 'polyline') return nd.attrs.filter(a => a.name == "points")[0].value.split(" ")[0];
    if (attr == 'y' && nd.tagName == 'polyline') return nd.attrs.filter(a => a.name == "points")[0].value.split(" ")[1];
    if (attr == 'width' && nd.tagName == 'polyline') return nd.attrs.filter(a => a.name == "points")[0].value.split(" ")[10]/2;
    if (attr == 'height' && nd.tagName == 'polyline') return nd.attrs.filter(a => a.name == "points")[0].value.split(" ")[11];

    if (attr == 'x' && nd.tagName == 'circle') attr = 'cx';
    if (attr == 'y' && nd.tagName == 'circle') attr = 'cy';
    if ((attr == 'width' || attr == 'height') && nd.tagName == 'circle') attr='r';
    if (nd.tagName == 'text' && (attr=='width' || attr=='height')) attr='ignore1';
    return nd.attrs.filter(a => a.name == attr)[0].value;
}; // end unit test node attr func
window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 59 - SET X,Y COMMAND PARSE
    function test59() {
        let foundX = false;
        let foundY = false;
        let p = new window.cmParser(
            () => {return "setx 1; sety 1"},
            (cmd,vals) => {
                if (cmd=='setx' && vals.x === 1) foundX=true;
                if (cmd=='sety' && vals.y === 1) foundY=true;
            }// end cb arg
        ); // end init parser
        p.parseArgs();
        return foundX && foundY;
    }, // end test 59
    // TDD TEST 60 - INC X,Y COMMAND PARSE
    function test60() {
        let foundX = false;
        let foundY = false;
        let p = new window.cmParser(
            () => {return "incx -1; incy -1"},
            (cmd,vals) => {
                if (cmd=='incx' && vals.x === -1) foundX=true;
                if (cmd=='incy' && vals.y === -1) foundY=true;
            }// end cb arg
        ); // end init parser
        p.parseArgs();
        return foundX && foundY;
    }, // end test 60
    // TDD TEST 61 - SET W,H COMMAND PARSE
    function test61() {
        let foundW = false;
        let foundH = false;
        let p = new window.cmParser(
            () => {return "setw 10; seth 10"},
            (cmd,vals) => {
                if (cmd=='setw' && vals.w === 10) foundW=true;
                if (cmd=='seth' && vals.h === 10) foundH=true;
            }// end cb arg
        ); // end init parser
        p.parseArgs();
        return foundW && foundH;
    }, // end test 61
    // TDD TEST 62 - INC W,H COMMAND PARSE
    function test62() {
        let foundW = false;
        let foundH = false;
        let p = new window.cmParser(
            () => {return "incw 10; inch 10"},
            (cmd,vals) => {
                if (cmd=='incw' && vals.w === 10) foundW=true;
                if (cmd=='inch' && vals.h === 10) foundH=true;
            }// end cb arg
        ); // end init parser
        p.parseArgs();
        return foundW && foundH;
    }, // end test 62
    // TDD TEST 63 - SET X,Y COMMANDS RECT
    function test63() {
        let expectX = '3'; let expectY = '3';
        let nd = window.unittestnd(0,0,0,0);
        window.cmNd(nd, `setx ${expectX}; sety ${expectY}`);
        return window.unittestndattr(nd, 'x') == expectX && window.unittestndattr(nd, 'y') == expectY;
    }, // end test 63
    // TDD TEST 64 - SET X,Y COMMANDS ALL TYPES
    function test64() {
        let expectX = '3'; let expectY = '3';
        let types = ['rect', 'line', 'polyline', 'circle', 'text'];
        let valid = true;
        types.forEach((type) => {
            let nd = window.unittestnd(0,0,0,0, type);
            window.cmNd(nd, `setx ${expectX}; sety ${expectY}`);
            valid &&= (window.unittestndattr(nd, 'x') == expectX && window.unittestndattr(nd, 'y') == expectY);
        }); // end for each type
        return valid;
    }, // end test 64
    // TDD TEST 65 - SET W,H COMMANDS ALL TYPES
    function test65() {
        let expectW = '13'; let expectH = '13';
        let types = ['rect', 'line', 'polyline', 'circle', 'text'];
        let valid = true;
        types.forEach((type) => {
            let nd = window.unittestnd(0,0,0,0, type);
            window.cmNd(nd, `setw ${expectW}; seth ${expectH}`);
            // console.warn('check', type, window.unittestndattr(nd, 'width'), window.unittestndattr(nd, 'height'), expectW, expectH);
            valid &&= nd.tagName == 'text' || ((window.unittestndattr(nd, 'width') == expectW && window.unittestndattr(nd, 'height') == expectH));
        }); // end for each type
        return valid;
    }, // end test 65
    // TDD TEST 66 - INC X,Y COMMANDS ALL TYPES
    function test66() {
        let startX = 13; let startY = 13;
        let inputX = '13'; let inputY = '13';
        let expectX = '26'; let expectY = '26';
        let types = ['rect', 'line', 'polyline', 'circle', 'text'];
        let valid = true;
        types.forEach((type) => {
            let nd = window.unittestnd(startX,startY,0,0, type);
            window.cmNd(nd, `incx ${inputX}; incy ${inputY}`);
            // console.warn('check', type, window.unittestndattr(nd, 'x'), window.unittestndattr(nd, 'y'), expectX, expectY);
            valid &&= ((window.unittestndattr(nd, 'x') == expectX && window.unittestndattr(nd, 'y') == expectY));
        }); // end for each type
        return valid;
    }, // end test 66
    // TDD TEST 67 - INC W,H COMMANDS ALL TYPES
    function test67() {
        let startW = 13; let startH = 13;
        let inputW = '13'; let inputH = '13';
        let expectW = '26'; let expectH = '26';
        let types = ['rect', 'line', 'polyline', 'circle', 'text'];
        let valid = true;
        types.forEach((type) => {
            let nd = window.unittestnd(0,0,startW,startH, type);
            window.cmNd(nd, `incw ${inputW}; inch ${inputH}`);
            // console.warn('check', type, window.unittestndattr(nd, 'width'), window.unittestndattr(nd, 'height'), expectW, expectH);
            valid &&= nd.tagName == 'text' || ((window.unittestndattr(nd, 'width') == expectW && window.unittestndattr(nd, 'height') == expectH));
        }); // end for each type
        return valid;
    }, // end test 67
];
