// ACTIVITY SVG
svgBaseNode = {attrs:[]};
svgNodes = [];
curIds = []; // { id: 'rect1' };
curMvX = null;
curMvY = null;
cacheNd = {attrs:[]};
// todo: custom cursor to help w/ selection precision of lines
// todo: add in template links in footer to pre-load examples (ie: swimlanes)
                            // todo: should optionally allow reconfiguring to
                            //       have a much larger image area?
selColor = "#C0D6FC";
editColor = "#CAFFB5";

numMode = 0;
// clickCnt = 0;
// drawClick = { x:-1, y: -1 };
notifyTextArr = [
    "0 =&gt; Select Mode",
    "1 =&gt; Line Mode",
    "2 =&gt; Arrow Mode",
    "3 =&gt; Rect Mode",
    "4 =&gt; Rounded Rect Mode",
    "5 =&gt; Decision Node Mode",
    "6 =&gt; Initial Node Mode",
    "7 =&gt; Final Node Mode",
    "8 =&gt; Fork/Join Node Mode",
    "9 =&gt; Text Mode"
];

// ACTIVITY SVG - GLOBALS

window.gXmlEditor = new window.xeEditor();
window.gStarted = false;
window.gToolbarFrame = new window.StartEndFrame(0,0,1500,88);
let topFrameNode = new window.AggregateNode({
    frame: window.gToolbarFrame,
    id: 'pageToolbar',
    top: null,
    left: null
});
window.gCodeFrame = new window.StartEndFrame(0,0,0,0); // .StartEndFrame(0,88,750,88+750);
let leftFrameNode = new window.AggregateNode({
    frame: window.gCodeFrame,
    id: 'pageCodeFrame',
    top: topFrameNode,
    left: null
});
window.gSvgFrame = new window.StartEndFrame(0, 88, 750, 750);// StartEndFrame(750, 88, 750+750, 88+750);
window.gSvgFrameNode = new window.AggregateNode({
    frame: window.gSvgFrame,
    id: 'pageDisplayFrame',
    top: topFrameNode,
    left: leftFrameNode
});
setTimeout(() => {window.gSvgFrameNode.applyFrames();}, 800);

window.gSvgMouse = new window.SvgMouse(window.gSvgFrame.getStart());

var svgHead=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="750" height="750" viewBox="0,0,750,750">`;
var svgEx = `
    <circle cx="375" cy="39" r="10" fill="black" stroke="black" stroke-width="1"/>
    <polyline points="375 52 375 108 365 98 375 108 385 98" stroke="black" fill="transparent" stroke-width="1"/>
    <rect rx="10" ry="10" x="325" y="112" width="100" height="50" stroke="black" fill="transparent" stroke-width="1"/>
    <text x="333" y="134" fill="black">Receive</text>
    <text x="333" y="154" fill="black">Request</text>
`;
var svgTrail = `
</svg>
`; // cy=40 -> cy=39 fix: // TDDTEST0 FIX

window.notifyMsg = function(htmlMsg, styleBG) {
    var notifyMd = document.createElement("div");
    notifyMd.style.backgroundColor=(styleBG==null)?"rgba(238, 255, 238, 1)":styleBG;
    notifyMd.style.color="black";
    notifyMd.style.position="absolute";
    notifyMd.style.left=(window.gSvgFrame.getStart().x+2)+'px';//"752px";
    notifyMd.style.top=(/*750+88*//*window.gSvgFrame.getStart().y+*/window.gSvgFrame.getEnd().y-16-12)+"px";
    notifyMd.style.fontSize="16px";
    notifyMd.style.padding="6px";
    notifyMd.style.width="736px";
    notifyMd.innerHTML = htmlMsg;
    document.body.appendChild(notifyMd);
    setTimeout(function(){notifyMd.remove();}, 1400);
    return notifyMsg;
}

window.setNumMode = function(num, test) {
    numMode = num;
    /*var active = document.getElementsByClassName("active");
    while (active.length > 0) {
        active[0].classList.remove("active");
    }
    document.getElementById("btn"+num).classList.add("active");*/
    if (test == null) {
        notifyMsg(notifyTextArr[num]);
    }
}

window.gDispatch = function(call, delay) {
    if (window.gTest) { call(); return 1; }
    else { return setTimeout(call, delay); }
}

// ATTRIBUTE ACCESS FUNCTIONS
window.setcolor = function(nd, color) {
    // console.warn(nd);
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        var textFill = (
            attr.name == "fill" &&
            nd.tagName.toLowerCase() == "text"
        );
        if (textFill || attr.name == "stroke") {
            //attr.value = color;
            nd.attrs[i].value = color;
            break;
        }
    }
}
window.getcolor = function(nd) {
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        var textFill = (
            attr.name == "fill" &&
            nd.tagName.toLowerCase() == "text"
        );
        if (textFill || attr.name == "stroke") {
            return attr.value;
        }
    }
    return "#FF0000";
}

window.getscal = function(attrs, name) {
    // returns scalar value for attribute name
    for (var i=0; i<attrs.length; i++) {
        if (attrs[i].name == name) {
            return parseFloat(attrs[i].value);
        }
    }
    return -999;
}

window.addscal = function(nd, name, scalar) {
    for (var i=0; i<nd.attrs.length; i++) {
        if (nd.attrs[i].name == name) {
            nd.attrs[i].value = (parseFloat(nd.attrs[i].value)+scalar)+"";
            break;
        }
    }
}

window.getscalarr = function(attrs, name, query) {
    // returns array of scalar value
    for (var i=0; i<attrs.length; i++) {
        if (attrs[i].name == name) {
            var strs = attrs[i].value.split(/[ ,]+/);
            var arr = [];
            var inc = 1; var j = 0;  // "all"
            if (query == "odd") { j+=1; inc=2; }
            if (query == "even") { inc=2; }
            for (; j<strs.length; j+=inc) {
                arr.push(parseFloat(strs[j]));
            }
            return arr;
        }
    }
    return [];
}

window.addscalarr = function(nd, name, query, scalar) {
    for (var i=0; i<nd.attrs.length; i++) {
        if (nd.attrs[i].name == name) {
            var strsRd = nd.attrs[i].value.split(/[ ,]+/);
            var strsWrt = nd.attrs[i].value.split(/[ ,]+/);
            var inc = 1; var j = 0;  // "all"
            if (query == "odd") { j+=1; inc=2; }
            if (query == "even") { inc=2; }
            for (; j<strsRd.length; j+=inc) {
                strsWrt[j] = ''+(parseFloat(strsRd[j]) + scalar);
            }
            nd.attrs[i].value = strsWrt.join(' ');
            break;
        }
    }
}

// SET CLICK RECTANGLE FUNCTION
window.setMouseRects = function(nd) {

    // reset vals: // TDDTEST17 FIX
        nd.xmin = null;  // TDDTEST17 FIX
        nd.xmax = null;  // TDDTEST17 FIX
        nd.ymin = null;  // TDDTEST17 FIX
        nd.ymax = null;  // TDDTEST17 FIX

    if (nd.tagName.toLowerCase() == "circle") {
        var cx = getscal(nd.attrs, "cx");
        var cy = getscal(nd.attrs, "cy");
        var r = getscal(nd.attrs, "r");
        var strokeWidth = getscal(nd.attrs, "stroke-width");
        nd.xmin = cx - r - strokeWidth;
        nd.xmax = cx + r + strokeWidth;
        nd.ymin = cy - r - strokeWidth;
        nd.ymax = cy + r + strokeWidth;
    }
    if (nd.tagName.toLowerCase() == "polyline") {
        var xs = getscalarr(nd.attrs, "points", "even");
        var ys = getscalarr(nd.attrs, "points", "odd");
        for (var i=0; i<xs.length; i++) {
            var val = xs[i];
            if (nd.xmin == null) { nd.xmin = val; }
            else if (nd.xmin > val) { nd.xmin = val; }
            if (nd.xmax == null) { nd.xmax = val; }
            else if (nd.xmax < val) { nd.xmax = val; }
        }
        for (var i=0; i<ys.length; i++) {
            var val = ys[i];
            if (nd.ymin == null) { nd.ymin = val; }
            else if (nd.ymin > val) { nd.ymin = val; }
            if (nd.ymax == null) { nd.ymax = val; }
            else if (nd.ymax < val) { nd.ymax = val; }
        }
    }
    if (nd.tagName.toLowerCase() == "rect") {
        var x = getscal(nd.attrs, "x");
        var y = getscal(nd.attrs, "y");
        var width = getscal(nd.attrs, "width");
        var height = getscal(nd.attrs, "height");
        var strokeWidth = getscal(nd.attrs, "stroke-width");
        nd.xmin = x - strokeWidth;
        nd.xmax = x + width + strokeWidth;
        nd.ymin = y - strokeWidth;
        nd.ymax = y + height + strokeWidth;
    }
    if (nd.tagName.toLowerCase() == "text") {
        var f = window.StartEndFrame.FromText(nd);//frame
        nd.xmin = f.getStart().x;
        nd.xmax = f.getEnd().x;
        nd.ymin = f.getStart().y;
        nd.ymax = f.getEnd().y;
    }
    if (nd.tagName.toLowerCase() == "line") { // TDDTEST3 FTR
        var x1 = getscal(nd.attrs, "x1");
        var y1 = getscal(nd.attrs, "y1");
        var x2 = getscal(nd.attrs, "x2");
        var y2 = getscal(nd.attrs, "y2");
        nd.xmin = Math.min(x1, x2) - 1; // TDDTEST32 FIX (add Math.max/min now
        nd.xmax = Math.max(x1, x2) + 1; // that drawing backwards is supported)
        nd.ymin = Math.min(y1, y2) - 1;
        nd.ymax = Math.max(y1, y2) + 1;
    }
}

// ARRAY ALGORITHM FUNCTION
// Text nodes MUST be first in the array in order to
// ensure text in a box gets prioritized on the click
// over the surrounding rectangle
window.sortedSvgNodes = function() {
    function swimLane(nd) {
        return (
            nd.tagName.toLowerCase() == "rect" &&
            ((nd.xmax - nd.xmin) > 200) &&
            ((nd.ymax - nd.ymin) > 300)
        );
    }
    var newArray = [];
    // text nodes go first
    for (var i=0; i<svgNodes.length; i++) {
        if (svgNodes[i].tagName.toLowerCase() == "text") {
            newArray.push(svgNodes[i]);
        }
    }
    for (var i=0; i<svgNodes.length; i++) {
        if (svgNodes[i].tagName.toLowerCase() != "text") {
            if (swimLane(svgNodes[i])) { continue; }
            newArray.push(svgNodes[i]);
        }
    }
    for (var i=0; i<svgNodes.length; i++) {
        if (swimLane(svgNodes[i])) {
            newArray.push(svgNodes[i]);
        }
    }
    // svgNodes = newArray;
    return newArray;
}
// CONVERSIONS

// https://stackoverflow.com/a/17411276
window.rotate = function(cx, cy, x, y, angle) { // TDDTEST7
    var rad = (Math.PI / 180) * angle;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var pt = {};
    pt.x = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    pt.y = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return pt;
}

window.arrowPoint = function(pt1, pt2, deg, len, sign) {  // TDDTEST7
    var m = /*rise/run*/ (pt2.y-pt1.y)/(pt2.x-pt1.x);
    var b = pt2.y - m*pt2.x;
    var dir = 1;
    if (pt2.x > pt1.x) {
        dir = -1;
    }
    pt1.x = pt2.x;//todo:check
    pt1.x += (dir)*1;
    pt1.y = m*pt1.x + b;
    var d = Math.sqrt( (pt2.x - pt1.x)*(pt2.x - pt1.x) +
        (pt2.y - pt1.y)*(pt2.y - pt1.y));
    var maxIter = 30; var i = 0;
    while (d < len) {
        pt1.x += (dir)*1;
        pt1.y = m*pt1.x + b;
        d = Math.sqrt( (pt2.x - pt1.x)*(pt2.x - pt1.x) +
            (pt2.y - pt1.y)*(pt2.y - pt1.y));
        i += 1;
        if (i>maxIter) {console.warn("max iter"); break;}
    }
    return rotate(pt2.x,pt2.y, pt1.x, pt1.y, sign*deg);
}

window.nds2xml = function(nds) {
    var xml = nd2xml(svgBaseNode);
    xml = xml.substring(0, xml.length -2);
    xml += ">"+`
`;
    for (var i=0; i<svgNodes.length; i++) {
        xml += "    "+nd2xml(svgNodes[i])+`
`;
    }
    xml += "</svg>";
    return xml;
}

window.nd2xml = function(nd, colorOverride) {
    var xml = "<" + nd.tagName;
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        // this is tricky: in the 1 case where a component gets loaded from
        // the active selected node that stroke color (selColor) should not
        // be included in the edit. So use cacheColor instead.
        var textOverride = (
            nd.tagName.toLowerCase() == "text" &&
            attr.name == "fill" &&
            colorOverride != null
        );
        var strokeOverride = (
            !textOverride &&
            (colorOverride != null && nd.attrs[i].name == "stroke")
        );
        if (strokeOverride || textOverride) {
            //for (var j=0; j<nd.attrs.length; j++) {
                //if (nd.attrs[j].name == "stroke") {
                    nd.attrs[i].value = colorOverride;
                    // console.log("OVERRIDE", colorOverride);
                //}
            //}
        }
        xml += (" "+ attr.name + "=" + `"` + attr.value + `"`);
    }
    if (nd.tagName.toLowerCase() == "text") {
        xml += (">" + nd.text + "</text>");
    } else {
        xml += "/>";
    }
    // window.lgLogNode('actsvg - nd2xml - colorOverride='+(colorOverride), nd);
    return xml;
}

window.minxydist = function(nd, x, y) { // TDDTEST43 FIX
    // Math.abs should not be necessary since it can be assumed that x and y
    // are within the bounds of the node by the calling code;
    // e.g., one-click selection decision via issueClick -> xy2nd -> minxydist
    // to find the node with nearest edge to the x,y coord.
    //
    // Math.abs is added regardless of the calling code's boundary guard.
    // The repititous positive number guard is put in anyway
    // just in case a large negative value did occur from the subtraction
    // in which it would choose a small positive over large negative number.
    return Math.min(
        /*x minimum=*/ Math.min(Math.abs(x-nd.xmin), Math.abs(nd.xmax-x)),
        /*y minimum=*/ Math.min(Math.abs(y-nd.ymin), Math.abs(nd.ymax-y))
    ); // end return Math.min xmin ymin
} // end minxydist function - returns min. ver./hor. dist. to nd's bounding rect

window.xy2nd = function(x, y, withNearestEdge = false) { // TDDTEST43 FIX
    var nd = null;
    let sorted = svgNodes;
    (() => { // TDDTEST5 FTR
        sorted = window.sortedSvgNodes();
    })(); // TOGGLE (); <-> ;
    for (var i=0; i<sorted.length; i++) {
        var svgNd = sorted[i];
        // console.log(x,y,svgNd.xmin, svgNd.ymin, svgNd.xmax, svgNd.ymax);
        if ((x >= svgNd.xmin)
        && (x <= svgNd.xmax)
        && (y >= svgNd.ymin)
        && (y <= svgNd.ymax)) {
            if (!withNearestEdge) {
                nd = svgNd;
                break;
            } // end early-ret. cond - no near. edge logic & ret. 1st in bounds
            if (nd == null) {
                nd = svgNd;
                continue;
            } // end nd null cont. cond - next it. it will have 2 nds to compare
            if (window.minxydist(svgNd, x, y) < window.minxydist(nd, x, y)) {
                nd = svgNd;
            } // end impli.-cont. cond - near. edge logic performed til loop-end
        } // end if x y in bounds check
    } // end for i in svgNodes len. loop
    return nd;
} // end xy2nd function

window.xdom2nd = function(xdomNd, nd) {
    var push = false;
    if (nd.attrs == null) { nd.attrs = []; push = true;} // var nd = {attrs:[]}
    for (var i=0; i<xdomNd.attributes.length; i++) {
        if (!push) {
            push = true;
            for (var j=0; j<nd.attrs.length; j++) {
                if (nd.attrs[j].name == xdomNd.attributes[i].nodeName) {
                    push = false;
                    nd.attrs[j].value = xdomNd.attributes[i].nodeValue;
                    break;
                }
            }
        }
        if (push) {
            nd.attrs.push({
                name: xdomNd.attributes[i].nodeName,
                value: xdomNd.attributes[i].nodeValue
            });
        }
    }
    nd.tagName = xdomNd.tagName;
    if (nd.tagName == "text") {
        nd.text = xdomNd.innerHTML;
    }
    //nd.cacheColor = cacheColor;
    return nd;
}

// This function requires an updateFrames call in order to
// get this new node to show up in the left code pane and
// the right display frame.
window.xml2nd = function(xml, tagName) {  // TDDTEST2 FTR
    // console.log(xml);
    var nd = {attrs:[]};
    svgNodes.push(nd);
    var dp = new DOMParser();
    var xmlDocument = dp.parseFromString(xml, 'text/xml');
    var xdomNd = xmlDocument.getElementsByTagName(tagName)[0];
    /*var nd = */xdom2nd(xdomNd, nd);
    window.lgLogNode('actsvg - xml converted to nd', nd);
    // sortSvgNodes();
}

// DIFFERENCES
window.diffscal = function(ndV1, ndV2, name) {
    return getscal(ndV2.attrs, name) - getscal(ndV1.attrs, name);
}

window.diffscalarr = function(ndV1, ndV2, name, query) {

    var i1=0;
    var i2=0;


    var ndV2Strs = [];
    for (var i=0; i<ndV2.attrs.length; i++) {
        if (ndV2.attrs[i].name == name) {
            i2=i;
            //
            break;
        }
    }

    for (var i=0; i<ndV1.attrs.length; i++) {
        if (ndV1.attrs[i].name == name) {
            i1=i;
            break;
        }
    }
    ndV1Strs = ndV1.attrs[i1].value.split(/[ ,]+/);
    ndV2Strs = ndV2.attrs[i2].value.split(/[ ,]+/);
    if (ndV1Strs.length != ndV2Strs.length) { return 0; }
    if (ndV1Strs.length == 0) { return 0; }
    if (ndV2Strs.length == 0) { return 0; }

    if (query == "odd") {
        return parseFloat(ndV2Strs[1]) - parseFloat(ndV1Strs[1]);
    }
    else if (query == "even") {
        return parseFloat(ndV2Strs[0]) - parseFloat(ndV1Strs[0]);
    }
    return 0;
}

// ETC

// updateFrames MUST be called after issueClick since updateFrames
// depends on curId that gets modified by track/untrack functions
window.updateFrames = function(selNd, ctx) {
    for (var i=0; i<svgNodes.length; i++) { setMouseRects(svgNodes[i]); }

    document
        .getElementById("editModalBG")
        .style
        .visibility = (curIds.length == 0) ? "hidden" : "visible";
    /*if (curIds.length == 0) {
        document.getElementById("editModalBG").style.visibility = "hidden";
    }
    else {
        //if (selNd == null) {
        //    selNd = xy2nd(curIds[curIds.length-1].x, curIds[curIds.length-1].y);
        //}
        document.getElementById("editModalBG").style.visibility = "visible";
        //document.getElementById("svgPartTextarea").value = nd2xml(selNd);
        //    prepareAndGetMultiEdit(selNd);
    }*/
    document.getElementById("svgId").remove();
    var svg = document.createElement("div");
    svg.id = "svgId";
    var xml = nds2xml(svgNodes);
    svg.innerHTML = xml;
    document.getElementById("svgFullTextarea").value = xml;
    document.getElementById("pageDisplayFrame").appendChild(svg);
    window.lgLogNode('actsvg - updateFrames - curIds.length='+(curIds.length),selNd);
    if (curIds.length == 0) return;
    var editNd = id2nd(curIds[curIds.length-1].id);
    // window.lgLogNode('actsvg - updateFrames - editNd, editNd.cacheColor='+(editNd?.cacheColor),editNd);
    window.lgLogNode('actsvg - updateFrames - pre-xml selNd. cacheColor='+editNd.cacheColor, selNd);
    document
        .getElementById("svgPartTextarea")
        .value = nd2xml(editNd,
            ctx!=null&&ctx.isSel?null:editNd.cacheColor); // TDDTEST37 FIX (ctx)
    window.cmFill(editNd); // CT/49
    window.lgLogNode('actsvg - updateFrames - pre-map', selNd);
    cacheNd = {attrs:[]};
    forceMap(editNd, cacheNd);
    window.lgLogNode('actsvg - updateFrames - mapped', selNd);
}

window.trackNd = function(nd) {
    var id = nd.attrs.filter(a => a.name == 'id')?.[0]?.value;
    if (id == null) {
        id = nd.tagName + (window.getMaxNodeId(nd.tagName)+1);
        nd.attrs.push({name: 'id', value: id});
    }
    curIds.push({id: id});
    window.cmFill(nd); // CT/49
}

window.untrackNd = function(nd) {
    var j=-1;
    for (var i=0; i<curIds.length; i++) {
        var testId = curIds[i].id;
        if (testId === nd.attrs.filter(a=>a.name=='id')[0].value) { j=i; break; }
    }
    if (curIds.length == 1) {
        curIds.shift();
        return;
    }
    if (j>-1) { curIds.splice(j, 1); }
    else { console.warn("unable to untrack"); }
}

// EVENTS - PROGRAMMATIC - ISSUE SELECTION
//for (var i=0; i<svgNodes.length; i++) { var nd=svgNodes[i]; console.log(nd.tagName, nd.xmin,nd.ymin, nd.xmax, nd.ymax); }
window.issueSelection = function(nd) {
    var selType = "select";
    var color = getcolor(nd);
    if (color.toUpperCase() == selColor || color.toUpperCase() == editColor
        || nd.cacheColor != null // TDDTEST6 FTR
    ) {
        // setcolor(nd, nd.cacheColor);
        selType = "deselect";
        untrackNd(nd);
    }
    else {
        trackNd(nd);
        nd.cacheColor = color; 
        // setcolor(nd, selColor);
    }
    // if (curIds.length == 0) { return selType; }
    if (selType == "select") {
        setcolor(
            /*nd=*/ nd,
            /*color=*/ editColor
        );
        var prevLastNd = (curIds.length>1) ?
            id2nd(curIds[curIds.length-2].id) : null;
        if (prevLastNd != null) {
            setcolor(
                /*nd=*/ prevLastNd,
                /*color=*/ selColor
            );
        }
    }
    else if (selType == "deselect") {
        if (nd.cacheColor == null) {
            console.warn("WARNING: "+nd.tagName+" is too close to another element" );
            //nd.cacheColor = 'black';//todo: find a better fix
        }
        setcolor(
            /*nd=*/ nd,
            /*color=*/ nd.cacheColor
        );
        nd.cacheColor=null; // TDDTEST6 FTR
    }
    let logColor = window.getcolor(nd);
    let logColorTxt = logColor;
    if (logColor == editColor) {logColorTxt = 'edit color';} else if (logColor == selColor) { logColorTxt = 'sel color'; }
    window.lgLogNode('actsvg - issue selection - '+selType+',color='+logColorTxt, nd);
    return selType;
}

// EVENTS - PROGRAMMATIC - ISSUE DRAW

window.issueDraw = function(xml, tagName) {
    xml2nd(xml, tagName);
    updateFrames();
}

// EVENTS - PROGRAMMATIC - ISSUE CLICK

window.issueClick = function(x, y) {
    var id = window.dwNewId(numMode);

    var adjPt = new window.snNodeSnapper()
        .snapXYToEnv(window.tyFromMode(numMode)+'', x, y);
    x = adjPt.x;
    y = adjPt.y;
    if (numMode == 1) {  // TDDTEST2 FTR
        //if (clickCnt == 1) {
            //var id = window.dwDraw();
            issueDraw(`<line x1="`
                +/*drawClick.x*/(x)+`" y1="`
                +/*drawClick.y*/(y)+`" x2="`
                +(x+5)+`" y2="`// TDDTEST3 FIX (x1,y1 should be exactly x,y)
                +(y+5)+`" stroke="black" stroke-width="1" id="${id}"/>`, 'line');
            //clickCnt = 0;  drawClick = {x:-1,y:-1};
        //}
        /*else {
            //clickCnt += 1;
            //drawClick.x = x; drawClick.y = y;
        }*/
        return;
    }
    if (numMode == 2) { // TDDTEST7 FTR
        //if (clickCnt == 1) {
            var iter = 0;
            var x1 = x; //drawClick.x;
            var x2 = x+10;
            var s = (x2>x1) ? -1 : 1;

            var pt1={};
            var pt2={};

            //if (Math.abs(drawClick.x - x) < 11) { x = drawClick.x; }
            //if (Math.abs(drawClick.y - y) < 11) { y = drawClick.y; }
            //if (drawClick.x == x) {
                pt1.x = x;//-10;
                pt2.x = x;//+10;
                pt1.y = y + (/*y>drawClick.y?-1:*/1)*10;
                pt2.y = y + (/*y>drawClick.y?-1:*/1)*10;
            //} else if (drawClick.y == y) {
                pt1.y = y - 10;
                pt2.y = y + 10;
                pt1.x = x + (/*x>drawClick.x?-1:*/1)*10;
                pt2.x = x + (/*x>drawClick.x?-1:*/1)*10;
            //} else {
            //    var pt1in = {x: /*drawClick.*/x, y: /*drawClick.*/y};
            //    var pt2in = {x: x+10, y: y+10};
            //    pt1 = arrowPoint(pt1in, pt2in, 45, 10, -1);
            //    pt2 = arrowPoint(pt1in, pt2in, 45, 10, 1);
            //}

            issueDraw(`<polyline points="`
                +/*drawClick.*/x+` `
                +/*drawClick.y*/y+` `
                +(x)+` `
                +(y+10)+` `
                +/*pt1.x*/(x-10)+` `
                +/*pt1.y*/y+` `
                +(x)+` `
                +(y+10)+` `
                +/*pt2.x*/(x+10)+` `
                +/*pt2.y*/(y)+`" `
                +` stroke="black" fill="transparent" stroke-width="1" id="${id}"/>`, 'polyline');
            //clickCnt = 0;  drawClick = {x:-1,y:-1};
        //}
        //else {
            //clickCnt += 1;
            //drawClick.x = x; drawClick.y = y;
        //}
        return;
    }
    if (numMode == 3) {
        //if (clickCnt == 1) {
            issueDraw(`<rect rx="0" ry="0" x="`
                +x+`" y="`
                +y+`" width="`
                +(3)+`" height="`
                +(3)+`" stroke="black" fill="transparent" stroke-width="1" id="${id}"/>`, 'rect');
            //clickCnt = 0;  drawClick = {x:-1,y:-1};
        //}
        //else {
            //clickCnt += 1;
            //drawClick.x = x; drawClick.y = y;
        //}
        return;
    }
    if (numMode == 4) { // TDDTEST8 FTR
        //if (clickCnt == 1) {
            issueDraw(`<rect rx="10" ry="10" x="`
                +x+`" y="`
                +y+`" width="`
                +(3)+`" height="`
                +(3)+`" stroke="black" fill="transparent" stroke-width="1" id="${id}"/>`, 'rect');
            //clickCnt = 0;  drawClick = {x:-1,y:-1};
        //}
        //else {
            //clickCnt += 1;
            //drawClick.x = x; drawClick.y = y;
        //}
        return;
    }
    if (numMode == 5) { // TDDTEST10 FTR
        var segLen = 7;
        var x1=x-segLen,        y1=y,
            x2=x,               y2=y-segLen,
            x3=x+segLen,        y3=y,
            x4=x,               y4=y+segLen,
            x5=x-segLen,        y5=y;
        issueDraw(`<polyline points="${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${x4} ${y4} ${x5} ${y5}" stroke="black" fill="transparent" stroke-width="1" id="${id}"/>`, 'polyline'); // +id // CT/47
        // drawClick = {x:-1,y:-1}; clickCnt = 0;
        return;
    }
    if (numMode == 6) { // TDDTEST11 FTR
        issueDraw(`<circle cx="${x}" cy="${y}" r="10" fill="black" stroke="black" stroke-width="1"/>`, 'circle');
        // drawClick = {x:-1,y:-1}; clickCnt = 0;
        return;
    }
    if (numMode == 7) { // TDDTEST12 FTR
        // smaller circle must precede larger in order to allow
        // clicking and selecting both
        issueDraw(`<circle cx="${x}" cy="${y}" r="6" fill="black" stroke="black" stroke-width="1"/>`, 'circle');
        issueDraw(`<circle cx="${x}" cy="${y}" r="10" fill="transparent" stroke="black" stroke-width="1"/>`, 'circle');
        // drawClick = {x:-1,y:-1}; clickCnt = 0;
        return;
    }
    if (numMode == 8) { // TDDTEST13 FTR
        //if (clickCnt == 1) {
            issueDraw(`<line x1="${x}" y1="${y}" x2="${(x+10)}" y2="${y}" stroke="black" stroke-width="3" id="${id}"/>`, 'line');
            //clickCnt = 0;  drawClick = {x:-1,y:-1};
        //}
        //else {
            //clickCnt += 1;
            //drawClick.x = x; drawClick.y = y;
        //}
        return;
    }
    if (numMode == 9) { // TDDTEST14 FTR
        let offsetFrameStart = window.StartEndFrame.FromTextThruClick(x,y).getStart();
        var adjY = offsetFrameStart.y;
        var adjX = offsetFrameStart.x;
        var elStr = `<text x="${adjX}" y="${adjY}" fill="black">?</text>`;
        issueDraw(elStr, 'text');

        issueKeyNum(0, {});
        /*step1*/issueClick(x,y); // TDDTEST51 FIX // CT/41
        /*step2*/updateFrames(); // keep step 1 and 2 together

        window.gDispatch(()=>{ // TDDTEST31 FIX
            document.getElementById("svgPartTextarea").focus();
            document.getElementById("svgPartTextarea").setSelectionRange(
                document.getElementById("svgPartTextarea").value.indexOf("?"),
                document.getElementById("svgPartTextarea").value.indexOf("?")+1
            );
        },100);
        // drawClick = {x:-1,y:-1}; clickCnt = 0;
        return;
    }
    // clickCnt = 0; drawClick = {x:-1,y:-1};
    var clickedNd = xy2nd(x, y, /*withNearestEdge=*/true); // TDDTEST43 FIX
    if (clickedNd == null && x>=0 && x<=750 && y>=0 && y<=750) {
        /*setTimeout(()=>*/issueRectSelectClick(x, y)/*, 100)*/; // TDDTEST21 FTR
        return;
    } else if (clickedNd == null) { return; }
    setMouseRects(clickedNd);
    var selType = issueSelection(clickedNd);
// for (var i=0; i<curIds.length; i++) { setMouseRects(xy2nd(curIds[i].x, curIds[i].y)); }
    return selType;
/////         if (curIds.length == 0) { if (removeTracking) {untrackNd(clickedNd);}
/////     
/////         //var removeTracking = false;
/////         ///// 
/////             //console.log("--");
/////             //console.log(clickedNd.attrs[3]?.value, clickedNd.cacheColor);
/////             
/////             //console.log(clickedNd.attrs[3]?.value, clickedNd.cacheColor);
/////             //clickedNd.attrs[i].value = clickedNd.cacheColor; //"black";
/////             // remove the de-selected node from cur IDs
/////             //removeTracking = true;
/////             //untrackNd(clickedNd);
/////             //clickedNd = null; // this is important to unset since the
/////             //           the node got de-selected
/////         ////}
/////         ////else {
/////                     //clickedNd.attrs[i].value;
/////              // clickedNd.attrs[i].value = selColor;
/////         ////}
/////     
/////         //// return clickedNd; }
/////     
/////         ////if (curIds.length == 1) { if (removeTracking) {untrackNd(clickedNd);} return clickedNd; }
/////     
/////         // fix the previous last select to not be the active click
/////     //     setcolor(
/////     //         /*nd=*/ xy2nd(curIds[curIds.length-2].x,curIds[curIds.length-2].y),
/////     //         /*color=*/ selColor
/////     //     );
/////     
/////     //     for (var i=0; i<clickedNd.attrs.length; i++) {
/////     //         if (clickedNd.attrs[i].name == "stroke") {
/////     //     
/////     //             break;
/////     //         }
/////     //     }
/////     
/////     //     if (removeTracking) {untrackNd(clickedNd);} return clickedNd;
}
// EVENTS - PROGRAMMATIC - ISSUE KEY NUM

window.issueKeyNum = function(num, test) {
    setNumMode(num, test);
    /*prevents cirun test error (content window undefined):*/test=window.gTest;
    if (!test)document.getElementsByTagName('iframe')[0].contentWindow.postMessage('num:'+num, '*');
}

// EVENTS - UI

window.keydown = function(e) {
    if (document.activeElement && document.activeElement.tagName.toLowerCase() != "body") { return; }
    e = e || window.event;
    window.lgUser(
        'window.keydown({key:"'+e.key+'", shiftKey:'+e.shiftKey+',ctrlKey:'+e.ctrlKey+',view:{event:{preventDefault:()=>{}}}});'
    ); // end log user keydown
    if ("1234567890".indexOf(e.key) > -1) {
        issueKeyNum(parseInt(e.key));
        e.view.event.preventDefault();
    } else if (window.mvIsMoveKey(e.key)) { // TDDTEST18 FTR
        window.mvIssueMoveKey(e.key, e.shiftKey);
        e.view.event.preventDefault();
    } else {
        window.manageKeyDownEvent(e);
        //e.view.event.preventDefault();
    }
}

window.mousedown = function(e) {
    if (document.activeElement && document.activeElement.tagName.toLowerCase() != "body") { return; }
    e = e || window.event;
    if (e.button > 0) return; // TDDTEST54 FIX // TDDTEST55 FIX // CT/44
    window.lgUser(
        'window.mousedown({clientX:'+e.clientX+',clientY:'+e.clientY+'});'
    ); // log user mousedown action
    var x = window.gSvgMouse.getX(e.clientX);
    var y = window.gSvgMouse.getY(e.clientY);

    let boundsFrame = new window.StartEndFrame(0,0,
        window.gSvgFrame.getEnd().x - window.gSvgFrame.getStart().x,
        window.gSvgFrame.getEnd().y - window.gSvgFrame.getStart().y);
    let boundsStart = boundsFrame.getStart();
    let boundsEnd = boundsFrame.getEnd();

    if (x<boundsStart.x||x>boundsEnd.x||y<boundsStart.y||y>boundsEnd.y) {
        return;  // TDDTEST41 FIX
    }
    window.lgLogNode('actsvg - mousedown');
    if (window.mgCanSelect(numMode)) {  // TDDTEST25 FIX
        window.issueRectSelectClick(x, y);
        return;
    }
    // console.log(x,y);
    if (isNaN(x) || isNaN(y)) { return; }
    // curIds.push({x: x, y: y});
    // curId.x = x;
    // curId.y = y;
    updateFrames( /*selNd=*/ issueClick(x, y) );

    (()=>{ // TDDTEST80 FTR
        // Cancels out resize vertex from hovering mouse
        // arrow mode. Otherwise a vtx=={0,0}
        // would result in a new arrow being drawn backwards.
        window.gDwVtx = null;
    })(); // TOGGLE (); <-> ;
}

window.mouseup = function(e) {
    e = e || window.event;
    window.gDwVtx = null;window.dwCloseDrawing(); // CT/50
    window.lgLogNodeCacheFlush('mousemove');
    window.lgUserCacheFlush('mousemove');
    window.lgUser(
        'window.mouseup({clientX:'+e.clientX+',clientY:'+e.clientY+'});'
    ); // end user log mouseup
    window.lgLogNodeCacheFlush('drawupd');
    var x = window.gSvgMouse.getX(e.clientX);
    var y = window.gSvgMouse.getY(e.clientY);
    window.lgLogNode(`actsvg - mouseup client(${e.clientX},${e.clientY}), svg(${x},${y})`);
    window.mvClose();
    if (window.mgIsDragging()) {
        issueRectSelectClick(x, y);
        /*updateFrames();*/ // TDDTEST37 FIX (removed updateFrames, an extra
                            // update beyond rect select updateFrames call
                            // was reverting the edit node color)
    }
    if (window.mgIsOneClickSelect(x,y)) { // TDDTEST26 FIX
        window.lgLogNode('actsvg - select');
        updateFrames( issueClick(x, y), {isSel:true} ); // TDDTEST42 FIX isSel
        window.mgCloseSelection();
        return;
    }
    if (window.mgIsNoSelectClick(x,y)) { // TDDTEST24 FIX
        window.lgLogNode('actsvg - missclick');
        window.onDone();
        window.mgCloseSelection();
    }
    if (!window.dwIsDrawingClosed()) {
        window.lgLogNode('actsvg - closing drawing');
        window.dwCloseDrawing();
        //console.warn('done draw');
        window.updateFrames();
    }
}

window.mousemove = function(e) {
    e = e || window.event;
    let x = window.gSvgMouse.getX(e.clientX);
    let y = window.gSvgMouse.getY(e.clientY);
    window.lgLogNodeCache('mousemove', 'actsvg - mousemove');
    window.lgUserCache(
        'mousemove',
        'window.mousemove({clientX:'+e.clientX+',clientY:'+e.clientY+',view:{event:{preventDefault:()=>{}}}});'
    ); // end user log mousemove
    let nd = xy2nd(x,y);
    let th = window.gVxThreshold; // CT/50 // TDDTEST56 FTR
    let ndXY = nd ||
        xy2nd(x-th,y-th)/*1,1*/ || 
        xy2nd(x+th,y+th)/*0,0*/ ||
        xy2nd(x-th,y+th)/*1,0*/ ||
        xy2nd(x+th,y-th)/*0,1*/; // CT/50 // TDDTEST56 FTR
    if (window.gDwVtx==null) window.gDwVtx = window.vxUnitCoord(nd||ndXY, x, y); // unit coords: 0,0  0,1  1,0  1,1 // CT/50 // TDDTEST56 FTR
    let ndVtx = window.gDwVtx;

    if (// resize cond // CT/50
        !window.gMvState.moving && // TDDTEST74 FIX
        //curIds.length > 0 &&
        window.dwTriggerResize(nd||ndXY, ndVtx, x, y, numMode)
    ) { // CT/50 // TDDTEST56 FTR
        nd = nd||ndXY;
        if (window.drawing.id == 'null0') {
            if (nd.attrs.filter(a => a.name == "id").length == 0) {
                let map = window.tyResizable();
                let keys = Object.keys(map);let key=null;
                for (var i=0; i<keys.length; i++) if (map[keys[i]]==nd.tagName)key=keys[i];
                nd.attrs.push({name: 'id', value: window.dwNewId(parseInt(key))}); // TDDTEST73 FIX
            } // end id not present cond
            window.dwDraw(nd.tagName,nd.attrs.filter(a => a.name == "id")[0].value);
            window.gDwVtx = ndVtx;
        }
        window.window.mgCloseSelection();window.gRectSelectState.state = window.gRectSelectStates.Down;
        window.dwDrawUpdate(x, y/*, ndVtx*/);
        let vtx = window.gDwVtx;
        window.dwHover(vtx);
        return;
    } // end resize cond
    else if (window.dwIsHoveringCorner(ndVtx, numMode)) { // CT/50
        window.dwHover(ndVtx);window.gDwVtx=null;//force it to re-caculate
    } // end draw hover
    else { window.dwHover(null);/*window.gDwVtx={x:1,y:1};*/ } // CT/50
    if (window.mgCanDrag()) { // TDDTEST23 FTR
        if (window.mvIsMove(nd, x,y)) {
            window.mvMove(x,y);
        } else {
            window.updateVisibleRectSelection(x,y);
        }
        e.view.event.preventDefault(); // prevents builtin browser svg image drag
        return;
    }
    if (x>0 && x<750
        && y>0 && y<750) { // TDDTEST25 FIX -should reach bot-right
        window.mgSetMouse(x, y);
        //window.lgLogNodeCache('mousemove', 'actsvg - mousemove - isClosed = '+window.dwIsDrawingClosed());
        if (!window.dwIsDrawingClosed()) {
            window.dwDrawUpdate(x, y);
        }
    }
}

window.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById("svgFullTextarea").value =
        svgHead
        + svgEx
        + svgTrail;
});

window.onDone = function() {
    var i=0;
    var j=curIds.length;
    var limit =10000; var id ='null-1';
    while (j > 0/*-1*/) {
        //setcolor(xy2nd(curIds[0].x, curIds[0].y), selColor); // This is a temp.
            // workaround because somewhere else the color is resetting to cache
            // value and shouldn't be
        if (id == curIds[0].id) throw new Error("foreverloop"+id);
        id=curIds[0].id;
        var clickedNd=id2nd(curIds[0].id);setMouseRects(clickedNd);issueSelection(clickedNd);
        i += 1;
        if (i > limit) {console.warn("max num iterations"); break;}
        j = curIds.length;
        if (j ==0) j--;
    }
    updateFrames();
/////         var ids = [];
/////         for (var i=0; i<curIds.length; i++) {
/////             ids.push({x: curIds[i].x, y: curIds[i].y});
/////         }
/////         for (var i=0; i<ids.length; i++) {
/////             // issueClick will modify length of curIds
/////             // so this is done iterating a different
/////             // array
/////             console.log(i);
/////             issueClick(ids[i].x, ids[i].y); // de-selects all nodes
/////             // untrackNd(xy2nd(ids[i].x, ids[i].y));
/////             console.log("IS IT EMPTY?: ", curIds.length);
/////         }    /*curIds = [];*/    updateFrames();
}

window.loadSvg = function(xml, test) {
    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(xml, "text/xml");
    var elements = xmlDocument.getElementsByTagName('*');
    var sni = -1; //svg nodes index
    for (var i=0; i<elements.length; i++) {
        var nd = elements[i];
        if (nd.tagName.toLowerCase() == "svg") {
            //svgBaseNode = xdom2nd(nd,null);
            xdom2nd(nd,svgBaseNode);
            /*svgBaseNode.tagName = nd.tagName;
            for (var j=0; j<nd.attributes.length; j++) {
                svgBaseNode["attrs"].push({
                    name: nd.attributes[j].nodeName,
                    value: nd.attributes[j].nodeValue
                });
            }*/
            continue;
        }
        sni += 1; svgNodes.push({}); // svgNodes.push({attrs:[]});
        //svgNodes[sni] = xdom2nd(nd,null);
        xdom2nd(nd, svgNodes[sni]);
        setMouseRects(svgNodes[sni]);
        /*
        for (var j=0; j<nd.attributes.length; j++) {
            svgNodes[sni].attrs.push({
                name: nd.attributes[j].nodeName,
                value: nd.attributes[j].nodeValue
            });
            svgNodes[sni].tagName = nd.tagName;
            setMouseRects(svgNodes[sni]);
        }*/
    }
    // sortSvgNodes();
    issueKeyNum(0, test);
    updateFrames();
}

window.onStart = function(test) {
    window.gStarted = true;
    window.lgUser('window.onStart({});');
    (() => { // TDDTEST82 FIX
        document.getElementById("svgId")?.remove();
    })(); // TOGGLE (); <-> ;
    var svg = document.createElement("div");
    svg.id = "svgId";
    svg.innerHTML = (svgHead + svgEx + svgTrail);
    document.getElementById("pageDisplayFrame").appendChild(svg);

    document.getElementById("tools1").style.visibility = "hidden";
    document.getElementById("tools2").style.visibility = "visible";

    // document.getElementById("pageCodeFrame").classList.add("disabled");
    // document.getElementById("svgFullTextarea").disabled="disabled";

    document.onkeydown = keydown;
    window.gDispatch(
        function(){
            document.onmousedown = mousedown;
            document.onmousemove = mousemove;
            document.onmouseup = mouseup;
        }, // end dispatch callback
        8 // CT/43
    );// skip first click

    window.loadSvg(document.getElementById("svgFullTextarea").value, test);
}

window.onNum = function(obj) {
    var num = parseInt(obj.innerHTML[obj.innerHTML.length-1]);
    issueKeyNum(num);
}

window.onmessage = function(e) {
    var msgComponents = e.data.split(':');
    if (msgComponents.length > 0 && msgComponents[0] == 'num') {
        window.onNum({innerHTML: msgComponents[1]});
    }
    //if (msgComponents.length > 0 && msgComponents[0] == 'key') {
    //    window.issueKeyNum(parseInt(msgComponents[1]));
    //}
    //window.gDispatch(function() {
    //document.getElementById('svgFullTextarea').setSelectionRange(1,2);
    //}, 100);
    //document.body.click();
    //document.body.focus();
    if (e.data.startsWith('actframe'))
    {
        var xml = e.data.substring('actframe'.length);
        window.issueUploadText(xml);
    }
}

window.onApplyEdits = function() {
    var text = document
        .getElementById("svgPartTextarea")
        .value;
    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(text, "text/xml");
    var failed = xmlDocument.getElementsByTagName("parsererror").length > 0;

    if (failed) { return; }
    var elements = xmlDocument.getElementsByTagName('*');
    failed = elements.length != 1;
    if (failed) { return; }

    var xdomNd = elements[0];
    var nd = id2nd(curIds[curIds.length-1].id);
    cacheNd = {attrs:[]}  // TDDTEST17 FIX
    forceMap(nd,cacheNd);  // TDDTEST17 FIX

    // {
        // must happen all together
        //forceMap(xdom2nd(xdomNd, nd.cacheColor), nd);
        //forceMap(xdom2nd(xdomNd, nd), nd);
        xdom2nd(xdomNd, nd);
        setMouseRects(nd);
        /* there should no longer be a need to update x,y to a new position
           because we now track nodes on an id (e.g, id='rect1').
        curIds[curIds.length-1].x = nd.xmin;
        curIds[curIds.length-1].y = nd.ymin; 
        */
    // }
    var i=curIds.length-2;
    while (i > -1) {
        var passiveSelNd = id2nd(curIds[i].id);
        // {
            // must happen all together
            smartMap(nd, passiveSelNd);
            setMouseRects(passiveSelNd);
            /* there should no longer be a need to update x,y to a new position
               because we now track nodes on an id (e.g, id='rect1').
            curIds[i].x = passiveSelNd.xmin;
            curIds[i].y = passiveSelNd.ymin;
            */
        // }
        i-=1;
    }
    // console.log("IMPORTANT", curIds.length);
    onDone();
    // console.log("IMPORTANT", curIds.length);
    // updateFrames();
}
