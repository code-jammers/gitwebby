window.cssToggle = function(el) {

    function dedupe(arr) {
        var l = arr.length;
        for (var i=0; i<l; i++) {
            var item = arr[i];
            var l2 = l;
            for (var j=i+1; j<l2; j++) {
                if (item == arr[j]) {
                    arr.splice(0,j);
                    j -= 1;
                    i -= 1;
                    l2 -= 1;
                    l -= 1;
                }
            }
            if (i>=l)break;
        }
    }

    if (el.className.indexOf("clickfalse") > -1) return;
    function setTrue(element, name) {
        element.classList.remove(name+"false");
        element.classList.add(name+"true");
    }
    function setFalse(element, name) {
        element.classList.remove(name+"true");
        element.classList.add(name+"false");
    }
    var classes = [...el.classList];
    var toTrue = {};
    var toFalse = {};
    var names = new Set();
    for (var i=0; i<classes.length; i++) {
        var name = null;
        if (classes[i].endsWith("true")) {
            name = classes[i].substring(0, classes[i].length - 4);
        } else if (classes[i].endsWith("false")) {
            name = classes[i].substring(0, classes[i].length - 5);
        }
        if (name == null) continue;
        names.add(name);
    }
    var nameValues = [...names.values()];
    for (var i=0; i<nameValues.length; i++) {
        var name = nameValues[i];
        if (toTrue[name] == null) toTrue[name]=[];
        if (toFalse[name] == null) toFalse[name]=[];
        toTrue[name] = toTrue[name].concat([...document.getElementsByClassName(name+"false")]);
        toFalse[name] = toFalse[name].concat([... document.getElementsByClassName(name+"true")]);
    }
    //dedupe(toTrue);
    //dedupe(toFalse);
//    console.log(toTrue.length, toFalse.length);
    var toTrueKeys = Object.keys(toTrue);
    var toFalseKeys = Object.keys(toFalse);
    for (var i=0; i<toTrueKeys.length; i++) {
        var key = toTrueKeys[i];
        for (var j=0; j<toTrue[key].length; j++) {
            setTrue(toTrue[key][j], key);
        }
    }
    for (var i=0; i<toFalseKeys.length; i++) {
        var key = toFalseKeys[i];
        for (var j=0; j<toFalse[key].length; j++) {
            setFalse(toFalse[key][j], key);
        }
    }

//    console.log(toTrue.length, toFalse.length);
//    for (var i=0; i<toFalse.keys().length; i++) { console.log('toFalse', toFalse[i]); setFalse(toFalse[i], name); }
//    console.log(toTrue.length, toFalse.length);
};
