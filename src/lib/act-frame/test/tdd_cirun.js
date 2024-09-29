import { JSDOM } from "jsdom";
import fs from "fs";

var dom = new /*jsdom.*/JSDOM();
global.window = dom.window;
window.tddTests = [...(window.tddTests||[])];
global.document = window.document;
global.DOMParser = window.DOMParser;
global.templateXml = null;
global.addEventListener = window.addEventListener;
global.NamedNodeMap = window.NamedNodeMap;
global.Event = window.Event;
global.gLibFastXmlValidator = null;
global.gLibSaxophoneParser = null;
//global.StartEndFrame = class{};
//global.AggregateNode = class{};
//global.SvgMouse = class{};
var page = document.createElement("div");
var html = `
<!-- PAGE CONTENT - TOOLBAR -->
        <div id="pageToolbar">
            <div id="tools1" class="tool">&lt;<button class="tool" id="buttonStart" onclick="onStart()">START</button>/&gt;</div>
            <div style="visibility:hidden" id="tools2" class="tool">
                <button id="btn1" class="tool" onclick="onNum(this)">-- 1</button>
                <button id="btn2" class="tool" onclick="onNum(this)">-&gt; 2</button>
                <button id="btn3" class="tool" onclick="onNum(this)">|| 3</button>
                <button id="btn4" class="tool" onclick="onNum(this)">() 4</button>
                <button id="btn5" class="tool" onclick="onNum(this)">&lt;&gt; 5</button>
                <button id="btn6" class="tool" onclick="onNum(this)">&nbsp;@ 6</button>
                <button id="btn7" class="tool" onclick="onNum(this)">(@ 7</button>
                <button id="btn8"  class="tool" onclick="onNum(this)">= 8</button>
                <button id="btn9" class="tool" onclick="onNum(this)">Txt 9</button>
                <button id="btn0" class="tool active" onclick="onNum(this)">0</button>
            </div>
        </div>
<!-- PAGE CONTENT - CODE FRAME -->
        <div id="pageCodeFrame">
            <textarea id="svgFullTextarea"></textarea>
            <div id="editModalBG">
                <div id="editModal">
                    <button class="tabtrue inptrue clickfalse" onclick="cssToggle(this)">Node XML</button>
                    <button class="tabfalse inpfalse clicktrue" onclick="cssToggle(this)">Node Cmd</button>
                    <textarea class="inptrue" id="svgPartTextarea" onchange="onApplyEdits()"></textarea>
                    <textarea class="inpfalse" id="commandTextarea">setw 100</textarea>
                    <button class="inpfalse subm" id="run" onclick="onRun()">Run</button><button class="inptrue subm" id="btnModal" onclick="onDone()">Done</button>
                </div>
            </div>
        </div>
<!-- PAGE CONTENT - DISPLAY FRAME -->
        <div id="pageDisplayFrame">
        </div>
<!-- PAGE CONTENT - FOOTER -->
        <div id="footer">
            <a href="?page=home">ActSvg</a>
            <a href="?tdd=0">Run tdd tests</a>
            <a href="?template=swim3">3-Swim template</a>
            <a href="?template=pins">Pins template</a>
            <a href="?template=connectors">Connectors template</a>
        </div>
<!-- PAGE CONTENT - MARKERS --><div id="selMarker"></div>
        <div id="moveMarker"><pre>+</pre></div>
`;
page.innerHTML = html;
document.body.appendChild(page);

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

document.getElementById("svgFullTextarea").value = svgHead+svgEx+svgTrail;

global.svgBaseNode = null;
global.svgNodes = null;
global.curIds = null;
global.curMvX = 0;
global.curMvY = 0;
global.cacheNd = null;
global.selColor = null;
global.editColor = null;
global.numMode = 0;
global.clickCnt = 0;
global.drawClick = null;
global.notifyTextArr = null;
global.ndV1Strs = null;

var imports = [];

function run3(imports, cb) {
    // console.warn(imports);
    var initialImp = imports.shift();
    var last = import(/*imports[0]*/initialImp);
    // console.warn('initial imp', initialImp);
    while (imports.length > 0) {
        let imp = imports.shift();
        last = last.then(m => {
            if (imp.indexOf('fast')>-1) {
                import('../lib/dist/fast-xml-parser.js').then(m => {gLibFastXmlValidator = window.gLibFastXmlValidator;});
            } // end fast xml parser cond
            if (imp.indexOf('saxophone')>-1) {
                import('../lib/dist/saxophone.js').then(m => { gLibSaxophoneParser = window.gLibSaxophoneParser; });
            } // end sax cond
            // console.warn('imp', imp);
            if (imp.endsWith('tdd_move.js')) {
                Object.keys(window).forEach(function(key) {
                    var isEvt = /^on[A-Z]+.*/.test(key);
                    isEvt ||= /^keydown$/.test(key);
                    isEvt ||= /Click$/.test(key);
                    isEvt ||= /^issue/.test(key);
                    //isEvt ||= /key/.test(key.toLowerCase());
                    isEvt ||= /num/.test(key.toLowerCase());
                    isEvt ||= /update[A-Z]+/.test(key);
                    isEvt ||= /^mousedown$/.test(key);
                    isEvt ||= /^mousemove$/.test(key);
                    isEvt ||= /^mouseup$/.test(key);
                    var isConv = /^xdom/.test(key);
                    isConv ||= /scal/.test(key);
                    isConv ||= /map/.test(key.toLowerCase());
                    isConv ||= /2xml/.test(key);
                    isConv ||= /2nd/.test(key);
                    var isGeom = /rect/.test(key.toLowerCase());
                    var isNd = /node/.test(key.toLowerCase()); 
                    isNd ||= /Nd/.test(key);
                    isNd ||= /color$/.test(key.toLowerCase()); 
                    if (isEvt||isConv||isGeom||isNd) {
                        // console.warn(key,isEvt,isConv,isGeom,isNd);
                        global[key] = window[key];
                    }
                });
            }
global.issueDrag = window.issueDrag;
global.issueHover = window.issueHover;
global.issueClear = window.issueClear;
global.issueMK = window.issueMK;
global.rotate = window.rotate;
global.notifyMsg = window.notifyMsg;
global.gCmCacheObj = window.gCmCacheObj;
            return import(imp);
        })  .catch((err) => { console.warn(err.message); });
    }
    last = last.then(m => cb());
}

function run2(imports,cb) {
    var imports = ['./tdd_cmd.js', '../js/node-snap.js','../lib/dist/fast-xml-parser.js', '../lib/dist/saxophone.js',...imports,'../index.js', './tdd_move.js', './tdd.js', '../js/svg-mouse.js'];//manually setting node-snap since it must precede node-manage
    fs.readdir('./test', (err, files) => {
        files.forEach(file => {
            var isEditorFile = file.indexOf('#')>-1;
            isEditorFile ||= file.indexOf('~')>-1;
            if (file.endsWith('_tdd.js') && !isEditorFile) {
                imports.push('./'+file);
            }
        });
        run3(imports,cb);
    });
}


function run(cb) {
    fs.readdir('./js', (err, files) => {
        files.forEach(file => {
            if (file.endsWith('.js')) {
                imports.push('../js/'+file);
            }
        });
        run2(imports, cb);
    });
}

run(() => {
    window.gLgWarn = false;
    global.MoveTester = window.MoveTester;
    global.CmdTester = window.CmdTester;
    // Build the tests array
    //     Stores the test names that we do have,
    //     can't rely on test0 through tests{length-1} because
    //     there might be numbers missing for tests being developed in other
    //     git branches.
    var tests = [];
    for (var i=0; i<window.tddTests.length; i++) {
        if (tests.indexOf(window.tddTests[i].name) > -1) {
            throw `fail, multiple tests named ${window.tddTests[i].name}`;
            process.exit(1);
        }
        tests.push(window.tddTests[i].name);
    }
    // Run the tests
    for (var i=0; i<tests.length; i++) {
        window.gTest = true;
        global.navigator = {clipboard:{writeText: function(t){return '';}}};
        var res = window.tddTests.filter((fn)=>fn.name==(tests[i]))[0]();
        console.warn(/*"test"+i*/ window.tddTests[i].name + ' - '+ (res?'pass':'fail'));
        if (!res) {/*throw `test${i} failed`;process.exit(1);*/
            /*console.error(window.tddTests.filter((fn)=>fn.name==(tests[i]))[0].name + ` failed`);*/}
        document.body.innerHTML = '';
        var page2 = document.createElement("div");
        page2.innerHTML = html;
        document.body.appendChild(page2);
        document.getElementById("svgFullTextarea").value = svgHead+svgEx+svgTrail;
        svgBaseNode = {attrs:[]};
        svgNodes = [];
        curIds = []; // { x:-1, y:-1 };
        curMvX = null;
        curMvY = null;
        cacheNd = {attrs:[]};
        selColor = "#C0D6FC";
        editColor = "#CAFFB5";
        numMode = 0;
        clickCnt = 0;
        drawClick = { x:-1, y: -1 };
        window.gRectSelectState.state = window.gRectSelectStates.None;
    }
});
