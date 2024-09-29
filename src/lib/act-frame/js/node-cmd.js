window.gCmCacheObj = {id: null, x: 0, y: 0};
window.cmParser = class {
    constructor(cmdStrProvider, cbReceiver) {
        this.cmdStrProvider = cmdStrProvider;
        this.cbReceiver = cbReceiver;
    } // end constructor
    parseArgs() {
        let commandText = this.cmdStrProvider();
        let commands = commandText
            .replace(/;/g,'\n') // convert ; delimiter to be \n
            .replace(/^\s+/gm,'') // remove leading space on each line
            .split('\n');
        for (var i=0; i<commands.length; i++) {
            var c = commands[i].split(' ');
            if (c.length == 0) continue;
            let c1 = c[0];
            let c2 = c[1];
            let args = {};
            switch (c1) {
                case 'setx': // TDDTEST59 FTR
                case 'incx': // TDDTEST60 FTR
                    args.x = parseInt(c2);
                    break;
                case 'sety': // TDDTEST59 FTR
                case 'incy': // TDDTEST60 FTR
                    args.y = parseInt(c2);
                    break;
                case 'setw': // TDDTEST61 FTR // TDDTEST65 FTR
                case 'incw': // TDDTEST62 FTR
                    args.w = parseInt(c2);
                    break;
                case 'seth':
                case 'inch':
                    args.h = parseInt(c2);
                    break;
                default:
                    break; // break default
            } // end c1 switch
            this.cbReceiver(c1, args);
        } // end for cmd
    } // end parse arg func
}; // end comamnd parser class
window.cmFill = function(nd) { // CT/49
    let text = "";
    let x = window.getX1(nd);
    let y = window.getY1(nd);
    let w = window.getscal(nd.attrs, "width");
    let h = window.getscal(nd.attrs, "height");
    if (gCmCacheObj.id == null) {
        gCmCacheObj.x = window.getX1(nd);
        gCmCacheObj.y = window.getY1(nd);
        gCmCacheObj.id = nd.attrs.filter(a=>a.name == 'id')[0].value;
    }
    let incx = x - gCmCacheObj.x;
    let incy = y - gCmCacheObj.y;
    text += "setx " + x + '\n' + "incx " + incx + '\n';
    text += "sety " + y + '\n' + "incy " + incy + '\n';
    if (w > -999) {
        text += "setw " + w + '\n' + "incw " + 0 + '\n';
    }
    if (h > -999) {
        text += "seth " + h + '\n' + "inch " + 0 + '\n';
    }
    document.getElementById("commandTextarea").value = text;
};

window.cmNd = function(nd, cmd) {
    const vtx0 = {x: 0, y: 0};
    let parser = new window.cmParser(
        () => /*command text=*/
            cmd,
        (cmd,args) => {
            switch (cmd) {
                case 'incx': // TDDTEST66 FTR
                    let vtxA = window.vxGet(nd, vtx0);
                    window.vxSet(nd, args.x + vtxA.x, vtxA.y, vtx0);
                    break; // break increase x
                case 'incy': // TDDTEST66 FTR
                    let vtxB = window.vxGet(nd, vtx0);
                    window.vxSet(nd, vtxB.x, args.y+vtxB.y, vtx0);
                    break; // break increase y
                case 'incw': // TDDTEST67 FTR
                    let vtxC = window.vxGet(nd, {x: 1, y: 1});
                    window.vxSet(nd, vtxC.x + args.w, vtxC.y, {x: 1, y: 1});
                    break; // break increase width
                case 'inch': // TDDTEST67 FTR
                    let vtxD = window.vxGet(nd, {x: 1, y: 1});
                    window.vxSet(nd, vtxD.x, vtxD.y+args.h, {x: 0, y: 1});
                    break;// break increase height
                case 'setx': // TDDTEST63 FTR // TDDTEST64 FTR
                    window.vxSet(nd, args.x, window.getY1(nd), {x:0,y:0});
                    //window.setPos(nd, args.x,
                    //    parseInt(nd.attrs.filter(a=>a.name=='y')[0].value));
                    break; // break setx
                case 'sety': // TDDTEST63 FTR // TDDTEST64 FTR
                    window.vxSet(nd, window.getX1(nd), args.y, {x:0, y:0});
                    break; // break sety
                case 'setw': // TDDTEST65 FTR
                    let h = window.vxGet(nd,{x:0, y:1}).y;
                    window.vxSet(nd, args.w, h, {x:1, y:0});
                    break; // break setw
                case 'seth': // TDDTEST65 FTR
                    let w = window.vxGet(nd,{x:1, y:0}).x;
                    window.vxSet(nd, w, args.h, {x:0, y:1});
                    break; // break seth
                default:
                    break; // break default
            } // end cmd switch
        } // end callback arg
    ); // end init parser
    parser.parseArgs();
    
}; // end command node func

window.onRun = function() { // CT/49
    let nd = window.id2nd(curIds[curIds.length-1].id);
    window.cmNd(nd, document.getElementById("commandTextarea").value);//inttests
                                                        // setx // TDDTEST79 FTR
    window.gCmCacheObj.id = null;
    window.onDone();
};
