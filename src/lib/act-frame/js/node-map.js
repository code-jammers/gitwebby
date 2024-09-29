// MAPPINGS
// [mappings.js]
window.forceMap = function(src, dest) {
    dest.tagName = src.tagName;
    if (src.tagName == "text") {
        dest.text = src.text;
    }
    dest.attrs = [];
    dest.cacheColor = src.cacheColor;
    for (var i=0; i<src.attrs.length; i++) {
        var attr = src.attrs[i];
        dest.attrs.push({name: attr.name, value: attr.value});
    }
}

window.smartMap = function(src, dest) {
    var mapDescriptor = src.tagName.toLowerCase() +
        " -> " +
        dest.tagName.toLowerCase();
    switch (mapDescriptor) {

        // MAPPINGS - RECT
        case "rect -> circle": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "cx", diffscal(cacheNd,src,"x"));
            addscal(dest, "cy", diffscal(cacheNd,src,"y"));
            break;
        }
        case "circle -> rect": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x", diffscal(cacheNd,src,"cx"));
            addscal(dest, "y", diffscal(cacheNd,src,"cy"));
            break;
        }

        case "rect -> polyline": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscalarr(dest, "points", "even", diffscal(cacheNd,src,"x"));
            addscalarr(dest, "points", "odd", diffscal(cacheNd,src,"y"));
            break;
        }
        case "polyline -> rect": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x", diffscalarr(cacheNd,src,"points","even"));
            addscal(dest, "y", diffscalarr(cacheNd,src,"points","odd"));
            break;
        }

        case "rect -> line": { // TDDTEST4 FIX
            var diffX = diffscal(cacheNd,src,"x");
            var diffY = diffscal(cacheNd,src,"y");
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x1", diffX);
            addscal(dest, "x2", diffX);
            addscal(dest, "y1", diffY);
            addscal(dest, "y2", diffY);
            break;
        }
        case "line -> rect": { // TDDTEST4 FIX
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x", diffscal(cacheNd,src,"x1"));
            addscal(dest, "y", diffscal(cacheNd,src,"y1"));
            break;
        }

        case "rect -> text": {
            addscal(dest, "x", diffscal(cacheNd,src,"x")); // TDDTEST0 FIX
            addscal(dest, "y", diffscal(cacheNd,src,"y")); // TDDTEST0 FIX
            break;
        }
        case "text -> rect": {
            addscal(dest, "x", diffscal(cacheNd,src,"x"));
            addscal(dest, "y", diffscal(cacheNd,src,"y"));
            break;
        }

        case "rect -> rect": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x", diffscal(cacheNd,src,"x")); // TDDTEST9 9
            addscal(dest, "y", diffscal(cacheNd,src,"y")); // TDDTEST9 9
            break;
        }

        // MAPPINGS - (EXCL RECT) POLYLINE

        case "circle -> polyline": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscalarr(dest, "points", "even", diffscal(cacheNd,src,"cx"));
            addscalarr(dest, "points", "odd", diffscal(cacheNd,src,"cy"));
            break;
        }
        case "polyline -> circle": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "cx", diffscalarr(cacheNd,src,"points","even"));
            addscal(dest, "cy", diffscalarr(cacheNd,src,"points","odd"));
            break;
        }

        case "text -> polyline": {
            addscalarr(dest, "points", "even", diffscal(cacheNd,src,"x"));
            addscalarr(dest, "points", "odd", diffscal(cacheNd,src,"y"));
            break;
        }
        case "polyline -> text": {
            addscal(dest, "x", diffscalarr(cacheNd,src,"points","even"));
            addscal(dest, "y", diffscalarr(cacheNd,src,"points","odd"));
            break;
        }

        case "polyline -> line": { // TDDTEST4 FIX
            var diffX = diffscalarr(cacheNd,src,"points","even");
            var diffY = diffscalarr(cacheNd,src,"points","odd");
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x1", diffX);
            addscal(dest, "x2", diffX);
            addscal(dest, "y1", diffY);
            addscal(dest, "y2", diffY);
            break;
        }
        case "line -> polyline": { // TDDTEST4 FIX
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscalarr(dest, "points", "even", diffscal(cacheNd,src,"x1"));
            addscalarr(dest, "points", "odd", diffscal(cacheNd,src,"y1"));
            break;
        }

        case "polyline -> polyline": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscalarr(dest, "points", "even", diffscalarr(cacheNd,src,"points","even"));
            (() => { // TDDTEST76 FIX
                addscalarr(dest, "points", "odd", diffscalarr(cacheNd,src,"points","odd")); // TDDTEST45 FIX // TDDTEST46 FIX
            })(); // (); <-> ;
            break;
        }


        // MAPPINGS - (EXCL RECT,POLYLINE) CIRCLE

        case "circle -> text": {
            addscal(dest, "x", diffscal(cacheNd,src,"cx"));
            addscal(dest, "y", diffscal(cacheNd,src,"cy"));
            break;
        }
        case "text -> circle": {
            addscal(dest, "cx", diffscal(cacheNd,src,"x"));
            addscal(dest, "cy", diffscal(cacheNd,src,"y"));
            break;
        }

        case "circle -> line": { // TDDTEST4 FIX
            var diffX = diffscal(cacheNd,src,"cx");
            var diffY = diffscal(cacheNd,src,"cy");
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x1", diffX); // TDDTEST15 FIX
            addscal(dest, "x2", diffX); // TDDTEST15 FIX
            addscal(dest, "y1", diffY); // TDDTEST15 FIX
            addscal(dest, "y2", diffY); // TDDTEST15 FIX
            break;
        }
        case "line -> circle": { // TDDTEST4 FIX
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "cx", diffscal(cacheNd,src,"x1")); // TDDTEST16 FIX
            addscal(dest, "cy", diffscal(cacheNd,src,"y1")); // TDDTEST16 FIX
            break;
        }

        case "circle -> circle": {
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "cx", diffscal(cacheNd,src,"cx"));
            addscal(dest, "cy", diffscal(cacheNd,src,"cy"));
            break;
        }

        // MAPPING (EXCL RECT,POLYLINE,CIRCLE) TEXT

        case "text -> line": { // TDDTEST4 FIX
            var diffX = diffscal(cacheNd,src,"x");
            var diffY = diffscal(cacheNd,src,"y");
            addscal(dest, "x1", diffX);
            addscal(dest, "x2", diffX);
            addscal(dest, "y1", diffY);
            addscal(dest, "y2", diffY);
            break;
        }
        case "line -> text": { // TDDTEST4 FIX
            addscal(dest, "x", diffscal(cacheNd,src,"x1"));
            addscal(dest, "y", diffscal(cacheNd,src,"y1"));
            break;
        }

        case "text -> text": {
            addscal(dest, "x", diffscal(cacheNd,src,"x"));
            addscal(dest, "y", diffscal(cacheNd,src,"y"));
            break;
        }

        // MAPPINGS (EXCL RECT,POLYLINE,CIRCLE,TEXT) LINE
        case "line -> line": { // TDDTEST4 FIX
            addscal(dest, "stroke-width", diffscal(cacheNd,src,"stroke-width"));
            addscal(dest, "x1", diffscal(cacheNd,src,"x1"));
            addscal(dest, "x2", diffscal(cacheNd,src,"x2"));
            addscal(dest, "y1", diffscal(cacheNd,src,"y1"));
            addscal(dest, "y2", diffscal(cacheNd,src,"y2"));
            break;
        }

        default: ()=>{};
    }
}
