window.tyResizable = function() {
    let types = {'1':'line', '2':'polyline', '3': 'rect', '4': 'rect', '5':'polyline', '8':'line'};

    (() => { // TDDTEST75 FTR
        types['6']='circle';
    })(); // TOGGLE (); <-> ;
    return types;
}; // end resizable types function

window.tyFromMode = function(mode) {
    let types=window.tyResizable();
    return types[mode+''];
}

window.tyIsDecisionNd = function(nd) {
    // nd input must be a polyline or error will be thrown
    var points = nd.attrs.filter(a => a.name == "points")[0].value.split(" ");
    var l = points.length;
    return points[0] == points[l-2] && points[1] == points[l-1];
}
