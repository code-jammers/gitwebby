window.CmdTester = class CmdTester {
    constructor(arr) { // [{type,x,y,w,h},]
        window.issueClear(); // also calls onStart
        window.issueMK(0);
        this.arr = arr;
        for (var i=0; i<arr.length; i++) {
            var type = arr[i].type;
            var x = arr[i].x;
            var y = arr[i].y;
            if (type == 'text') {
                window.issueMK(9);
                window.issueClick(x+7,y-3); // text auto-selects after draw
            }
        }
    }
    testSetX(x) {
        var id = curIds[curIds.length-1].id; //cacheNd.attrs.filter(a => a.name == 'id')[0].value;
        document.getElementById("commandTextarea").value = `setx ${x}`;
        window.onRun();
        var el = document.getElementById(id);
        return el.getAttribute("x") === ""+x;
    }
    testIncX(x) {
        var oldX = parseInt(cacheNd.attrs.filter(a => a.name == 'x')[0]);
        return false;
    }
}
