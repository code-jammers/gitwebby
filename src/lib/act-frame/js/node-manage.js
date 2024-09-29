window.gRectSelectStates = { None: 0/* / Up */, Down: 1, Drag: 2 };
window.gRectSelectState = {
    /*numClicks*/state: window.gRectSelectStates.None,
    firstX: null,
    firstY: null
};

window.gTest = false;

window.gmgNodeSnap = new window.snNodeSnapper();

window.mouse = {x:-1,y:-1};


window.mgCanSelect = function(numMode) {
    return numMode == 0 && window.gRectSelectState.state == window.gRectSelectStates.None;
}

window.mgCanDrag = function() {
    return window.gRectSelectState.state == window.gRectSelectStates.Down || window.gRectSelectState.state == window.gRectSelectStates.Drag;
}

window.mgIsDragging = function() {
    return window.gRectSelectState.state == window.gRectSelectStates.Drag;
}

window.mgIsOneClickSelect = function(x, y) {
    var nd = xy2nd(x, y);
    var ndId = nd?.attrs.filter(a => a.name == 'id')[0]?.value;
    if (ndId != null) {
        if (curIds.filter(o => o.id == ndId).length>0) {
            return false; // TDDTEST33 FIX
        }
    }
    return window.gRectSelectState.state == window.gRectSelectStates.Down &&
        nd != null;
}

window.mgIsNoSelectClick = function(x, y) {
    return !window.mgIsOneClickSelect() && window.gRectSelectState.state == window.gRectSelectStates.Down;
}

window.mgCloseSelection = function() {
    window.gRectSelectState.state = window.gRectSelectStates.None;
    window.gRectSelectState.firstX=null;
    window.gRectSelectState.firstY=null;
    window.closeVisibleRectSelection();
}

window.mgSetMouse = function(x, y) {
    window.mouse.x = x; window.mouse.y = y;
}

window.getMaxNodeId = function(type) {
    var maxId = 0;
    for (var i=0; i<svgNodes.length; i++) {
        var node = svgNodes[i];
        if (node.tagName == type) {
            var idlist = node.attrs.filter(a => a.name == 'id');
            if (idlist.length > 0) {
                maxId = Math.max(
                    parseInt(idlist[0].value.replace(type,'')),
                    maxId
                );
            }
        }
    }
    return maxId;
}

window.id2nd = function(id) { // TDDTEST28 FIX
    //var type = id.replace(/[0-9]+/g, '');
    //id = parseInt(id.replace(/[a-z]+/g, ''));
    var nd = null;
    for (var i=0; i<svgNodes.length; i++) {
        var svgNd = svgNodes[i];
        if (svgNd.attrs.filter(a => a.name == 'id' && a.value == id).length>0) {
            return svgNd;
        }
    }
    return nd;
}

window.getPosId = function(attrs) {
    var posId = '';
    if (attrs instanceof NamedNodeMap) {
        // dom element attributes
        if (attrs["x"] != null){
            posId = attrs["x"].value+','+attrs["y"].value;
        } else if (attrs["cx"]!=null){
            posId = attrs["cx"].value+','+attrs["cy"].value;
        } else if (attrs["x1"]!=null){
            posId = attrs["x1"].value+','+attrs["y1"].value;
        } else {
            posId = attrs["points"].value;
        }
    } else {
        // svg node attrs array
        if (attrs.filter(a=>a.name == 'x').length > 0) {
            posId = attrs.filter(a=>a.name == 'x')[0].value +','+
                attrs.filter(a=>a.name == 'y')[0].value;
        } else if (attrs.filter(a=>a.name == 'cx').length > 0) {
            posId = attrs.filter(a=>a.name == 'cx')[0].value +','+
                attrs.filter(a=>a.name == 'cy')[0].value;
        } else if (attrs.filter(a=>a.name == 'x1').length > 0) {
            posId = attrs.filter(a=>a.name == 'x1')[0].value +','+
                attrs.filter(a=>a.name == 'y1')[0].value;
        }else {
            posId = attrs.filter(a=>a.name == 'points')[0].value;
        }
    }
    return posId;
}

window.getX1 = function(nd) {

    if (nd.attrs.filter(a => a.name == 'points').length > 0) {
        return parseInt(nd.attrs.filter(a => a.name == 'points')[0].value.split(' ')[0]);
    }

    var key = 'x';
    if (nd.attrs.filter(a=>a.name == 'cx').length > 0) { key='cx'; }
    else if (nd.attrs.filter(a=>a.name == 'x1').length > 0) { key='x1'; }
    return getscal(nd.attrs,key);
}

window.getY1 = function(nd) {

    if (nd.attrs.filter(a => a.name == 'points').length > 0) {
        return parseInt(nd.attrs.filter(a => a.name == 'points')[0].value.split(' ')[1]);
    }

    var key = 'y';
    if (nd.attrs.filter(a=>a.name == 'cy').length > 0) { key='cy'; }
    else if (nd.attrs.filter(a=>a.name == 'y1').length > 0) { key='y1'; }
    return getscal(nd.attrs,key);
}

window.setPos = function(nd, x, y) {
    var dummyTargetNd = {attrs:[{name:'x',value:x+''},{name:'y',value:y+''}]};
    var dummySrcNd = {attrs:[
        {name:'x',value:window.getX1(nd)+''},
        {name:'y',value:window.getY1(nd)+''}
    ]};

    var attrs = nd.attrs;
    if (attrs.filter(a=>a.name == 'x').length > 0) {
        addscal(nd, "x", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscal(nd, "y", diffscal(dummySrcNd,dummyTargetNd,"y"));
    } else if (attrs.filter(a=>a.name == 'cx').length > 0) {
        addscal(nd, "cx", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscal(nd, "cy", diffscal(dummySrcNd,dummyTargetNd,"y"));
    } else if (attrs.filter(a=>a.name == 'x1').length > 0) {
        addscal(nd, "x1", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscal(nd, "x2", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscal(nd, "y1", diffscal(dummySrcNd,dummyTargetNd,"y"));
        addscal(nd, "y2", diffscal(dummySrcNd,dummyTargetNd,"y"));
    } else {
        addscalarr(nd, "points", "even", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscalarr(nd, "points", "odd", diffscal(dummySrcNd,dummyTargetNd,"y"));
    }
}

window.matchNode = function(domElement) {
    var posId = window.getPosId(domElement.attributes);

    for (var i=0; i<svgNodes.length; i++) {
        var nd = svgNodes[i];
        if (
            nd.tagName == domElement.tagName &&
            window.getPosId(nd.attrs) == posId &&
            domElement.attributes['class']?.value==
                nd.attrs.filter(a=>a.name=='class')?.[0]?.value
        ) {
            return nd;
        }
    }
    return null;
}

// EVENTS - PROGRAMMATIC - KEYPRESS

window.issuePaste = function(testCb) {
    if (window.gTest) { testCb(); }
    //onStart();
    window.gDispatch(function() {
        // after paste event
        var x = window.mouse.x;
        var y = window.mouse.y;
        svgNodes = [];
        //onStart();
        document.getElementById("svgId").innerHTML='';
        window.loadSvg(document.getElementById("svgFullTextarea").value, window.gTest?{}:null);
        var els = document.getElementsByClassName("unresolvedmovee");
        cacheNd = {};
        var moverNd = window.matchNode(document.getElementsByClassName("unresolvedmover")[0]);
        window.forceMap(moverNd, cacheNd);

        window.setPos(moverNd, x, y);
        // console.warn('mover: '+window.getPosId(moverNd.attrs), 'mouse: '+x+','+y);

        for (var i=0; i<els.length; i++) {
            var el = els[i];
            var moveeNd = window.matchNode(el);
            moveeNd.attrs = moveeNd.attrs.filter(a => a.name != 'class');
            window.smartMap(moverNd, moveeNd);
        }
        moverNd.attrs = moverNd.attrs.filter(a => a.name != 'class');
        updateFrames();
        document.getElementById("svgFullTextarea").disabled = true;
    }, 600);
}

window.addEventListener("paste", function(e) {
    if (window.gStarted && // TDDTEST52 FIX // CT/40
           window.getComputedStyle(document.getElementById("editModalBG"))
               .visibility != "visible" // TDDTEST53 FIX // CT/42
    ) { // end paste condition
        window.lgUser('// paste'); // TDDTEST52
                                   // and // TDDTEST53
                                   // tests look for this value
        window.issuePaste();
    } // end started condition
}); // end paste event listener
window.managePaste = /*async*/ function() {

    //TODO: if instead pasting in textarea could work, it wouldn't
    //     require the permission prompt
    //TODO: also if going the textarea paste approach, needs to do smartMap
    //      still
    var ta = document.getElementById("svgFullTextarea");
    ta.disabled = false;
    ta.focus();
    ta.selectionStart = ta.value.indexOf('</svg>')-1;
    ta.selectionEnd = ta.value.indexOf('</svg>');
    //console.log(document.execCommand("paste"));
    //ta.disabled = true;
    //svgNodes=[];
    //onStart();
    //updateFrames();
    return;
//     var text = await navigator.clipboard.readText();
//     window.gDispatch(()=>{
//     if (text.indexOf('<')>-1 && text.indexOf('<') < 5) {
//         var xml = '<svg>'+text+'</svg>';
//         var doc = new DOMParser().parseFromString(xml, "text/xml");
//         var elements = doc.getElementsByTagName('*');
//         var ii = svgNodes.length;//insert-index
//         var x = window.mouse.x;
//         var y = window.mouse.y;
//         console.warn(x,y);
//         //var dummyCacheNd = {tagName:'text', cacheColor:null, text:'', attrs:[{name:'x',value:''+x},{name:'y',value:''+y},{name:'fill',value:'black'}]};
//         var dummyNode = {tagName:'text', text:'', cacheColor:null, attrs:[{name:'x',value:''+x},{name:'y',value:''+y},{name:'fill',value:'black'}]};
//         //var saveCacheNd = {};
// 
//         //window.forceMap(cacheNd, saveCacheNd);
//         //window.forceMap(dummyCacheNd, cacheNd);
//         if (elements.length > 1) {
//             var cNd = {};
//             window.xdom2nd(elements[elements.length-1], cNd);//last selected
//             window.forceMap(cNd, cacheNd);
//         }
//         for (var i=0; i<elements.length; i++) {
//             var el = elements[i];
//             if (el.tagName.toLowerCase() == 'svg'){continue;}
//             var nd = {};
//             svgNodes.push({});
//             window.xdom2nd(el, svgNodes[ii]);
//             window.smartMap(dummyNode, svgNodes[ii]);
//             ii++;
//         }
//         //window.forceMap(saveCacheNd, cacheNd);
//         window.updateFrames();
//     }
//     },600);
}

window.manageKeyDownEvent = function(e) {
    if ((e.key == 'c' || e.key == 'x') && e.ctrlKey && curIds.length > 0) {
        var xml = '';
        for (var i=0; i<curIds.length; i++) {
            var nd = {};
            window.forceMap(window.id2nd(curIds[i].id), nd);
            nd.attrs = nd.attrs.filter(a => a.name != 'id');
            if (i<curIds.length-1){
                nd.attrs.push({name:'class', value:'unresolvedmovee'});
            } else {
                nd.attrs.push({name:'class', value:'unresolvedmover'});
            }
            xml += '    '+window.nd2xml(nd, nd.cacheColor) +`
`;
        }

        navigator.clipboard.writeText(xml);

        if (e.key == 'x') { // TDDTEST30 FTR
            var curIdsCopy = [];
            for (var i=0; i<curIds.length; i++) {
                curIdsCopy.push({id: curIds[i].id});
            }
            window.onDone(); // stop selection
            svgNodes = svgNodes.filter(nd =>
                curIdsCopy.filter(c =>
                    c.id==nd.attrs.filter(a=>
                        a.name=='id')?.[0]?.value).length==0);
            window.updateFrames();
        }
    } else if (e.key == 'v' && e.ctrlKey) {
        window.onDone();
        window.managePaste();
    }
}

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - ISSUE
window.issueVisibleRectSelection = function(x, y) { // TDD TEST 22 FTR
    var marker = document.getElementById("selMarker");
    marker.style.visibility = 'visible';
    marker.style.width = '16px';
    marker.style.height = '16px';
    marker.style.left = (/*750*/window.gSvgFrame.getStart().x+x)+'px';
    marker.style.top = (/*88*/window.gSvgFrame.getStart().y+y)+'px';
} /* end issueVisibleRectSelection fn */

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - UPDATE

window.updateVisibleRectSelection = function(x, y) { // TDDTEST23 FTR
    window.gRectSelectState.state = window.gRectSelectStates.Drag;
    var marker = document.getElementById("selMarker");
    var left = Math.min(
                window.gSvgFrame.getStart().x + window.gRectSelectState.firstX,
                window.gSvgFrame.getStart().x + x
               ) + 'px'; // TDDTEST39 FIX
    var top = Math.min(
                window.gSvgFrame.getStart().y + window.gRectSelectState.firstY,
                window.gSvgFrame.getStart().y + y
              ) + 'px'; // TDDTEST39 FIX
    var w = Math.abs((window.gRectSelectState.firstX/*+750*/) - (x));
    var h = Math.abs((window.gRectSelectState.firstY/*+88*/) - (y));
    marker.style.top = top; // TDDTEST39 FIX
    marker.style.left = left; // TDDTEST39 FIX
    marker.style.width = (w)+'px';
    marker.style.height = (h)+'px';
} /* end updateVisibleRectSelection fn */

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - CLOSE

window.closeVisibleRectSelection = function(x, y) { // TDD TEST 22 FTR
    document.getElementById("selMarker").style.visibility = 'hidden';
} /* end closeVisibleRectSelection fn*/


// EVENTS - PROGRAMMATIC - ISSUE CANCEL RECT SELECT CLICK
window.cancelRectSelectClick = function() {
    window.onDone();
}


// EVENTS - PROGRAMMATIC - ISSUE RECT SELECT CLICK

window.issueRectSelectClick2 = function(x,y) { // TDDTEST21 FTR
    var firstX = window.gRectSelectState.firstX;
    var firstY = window.gRectSelectState.firstY;

    var x1 = Math.min(firstX, x);
    var y1 = Math.min(firstY, y);

    var x2 = Math.max(firstX, x);
    var y2 = Math.max(firstY, y);

    var l = (curIds.length > 0) ? 0 : svgNodes.length;

    var lastNd = null;

    var selLst = [];

    for (var i=0; i<l; i++) {
        var nd = svgNodes[i];
        setMouseRects(nd);
        var isLastNd = false;//console.log(nd.xmin>x1,nd.xmax <x2,nd.ymin>y1,nd.ymax <y2,nd);
        var inBounds = nd.xmin>x1 && nd.xmax <x2 && nd.ymin>y1 && nd.ymax <y2;
        if (
            inBounds && 
            lastNd==null &&
            (
                nd.attrs.filter(o=>o.name=='x').length > 0 ||
                nd.attrs.filter(o=>o.name=='cx').length > 0
            )
        ) {
            lastNd = nd;
            isLastNd = true;
        }
        if (inBounds) {
            if (!isLastNd) {
                selLst.push(nd);
            }
        }
    } /*end svgNodes loop*/

    if (lastNd != null) {
        selLst.push(lastNd);
        // console.log(lastNd);
    }

    window.gRectSelectState.state = window.gRectSelectStates.None;
    window.gRectSelectState.firstX = null;
    window.gRectSelectState.firstY = null;

    for (var i=0; i<selLst.length; i++) {

        /*svgNodes = [
            selLst[i], // bring to-be-selected node to the front of nodes list
            ...svgNodes.filter(nd => nd != selLst[i])
        ];*/ // TDDTEST50 FIX
        //        /*setTimeout(function(){*/window.issueClick(selLst[i].xmin, selLst[i].ymin);/*},10);*/
        setMouseRects(selLst[i]); // TDDTEST50 FIX // CT/52
        issueSelection(selLst[i]); // TDDTEST50 FIX // CT/52
        //console.log('click',selLst[i]);
        window.updateFrames(selLst[i], {isSel:true}); // TDDTEST37 FIX
        window.lgLogNode('actsvg - issued rect click', selLst[i]);
    } /*end selLst loop*/

    if (selLst.length == 0) { // TDDTEST24 FIX
        //selected nothing
        //console.warn('selected nothing');
        //setTimeout(function(){window.onDone()},100);window.onDone();
        window.gDispatch(window.onDone, 100);
    }

    window.closeVisibleRectSelection(x,y);

} /*end window.issueRectSelectClick2 fn*/

window.issueRectSelectClick = function(x,y) { // TDDTEST21 FTR
    if (window.gRectSelectState.state == window.gRectSelectStates.Drag) {
        // setTimeout fixes a display issue where last selected node
        // wouldn't be showing as selected. for testing just call
        // issueRectSelectClick2 directly
        //setTimeout(function(){window.issueRectSelectClick2(x, y)},100);
        window.gDispatch(function(){window.issueRectSelectClick2(x, y);}, 100);
        return;
    }
    window.issueVisibleRectSelection(x, y); // TDDTEST22 FTR
    window.gRectSelectState.state = window.gRectSelectStates.Down;
    window.gRectSelectState.firstX = x;
    window.gRectSelectState.firstY = y;
} /*end window.issueRectSelectClick fn*/


