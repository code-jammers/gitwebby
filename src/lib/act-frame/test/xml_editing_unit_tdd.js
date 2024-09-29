window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 70 - FALSE FAST XML VALIDATION RETURNS FALSE
    function test70() {
        let fxValid = {validate: (xml) => false};
        let saxParser = class { on(cb) { cb(); }
                                parse() {}
                              };
        let e = new window.xeEditor(fxValid, saxParser);
        return !e.valid("<svg><fail/></svg>");
    }, // end test 70
    // TDD TEST 71 - TRUE FAST XML VALIDATION RETURNS TRUE
    function test71() {
        let fxValid = {validate: (xml) => true};
        let saxParser = class { on(tag,cb) { cb('nada'); }
                                parse() {}
                              };
        let e = new window.xeEditor(fxValid, saxParser);
        return e.valid("<svg><true/></svg>");
    }, // end test 71
    // TDD TEST 72 - VALIDATE SELF-CLOSING TESTS
    function test72() {
        let fxValid = {validate: (xml) => true};
        let tagopen = null;

        let tagObj = {tag: null};
        let saxParser = class {
            constructor() { this.tagObj=tagObj; }
            on(tag,cb) { tagopen = cb; }
            parse() {
                tagopen(this.tagObj.tag);//{name: 'text', attrs: textAttrs, isSelfClosing: true}
            } // end parse
        }; // end saxParser

        let runSeq = [ // text is the only !isSelfClosing, because text
                       // has inner xml, e.g. <text..>inner xml</text>.
                       // All others should have expect == isSelfClosing
            { expect: true, name: 'text', isSelfClosing: false},
            { expect: false, name: 'text', isSelfClosing: true},
            { expect: true, name: 'circle', isSelfClosing: true},
            { expect: false, name: 'circle', isSelfClosing: false},
            { expect: true, name: 'polyline', isSelfClosing: true},
            { expect: false, name: 'polyline', isSelfClosing: false},
            { expect: true, name: 'line', isSelfClosing: true},
            { expect: false, name: 'line', isSelfClosing: false},
            { expect: true, name: 'rect', isSelfClosing: true},
            { expect: false, name: 'rect', isSelfClosing: false},
        ]; // end run sequence

        let allAttrs = {
            text: 'x="1" y="1" fill="black"',
            circle: 'cx="1" cy="1" r="1" fill="black" stroke="black" stroke-width="1"',
            polyline: 'points="1 1" stroke="black" fill="transparent" stroke-width="1"',
            line: 'x1="1" y1="1" x2="1" y2="1" stroke="black" stroke-width="1"',
            rect: 'rx="1" ry="1" x="1" y="1" width="1" height="1" stroke="black" fill="transparent" stroke-width="1"'
        }; // end all attributes

        for (var i=0; i<runSeq.length; i++) {
            let cur = runSeq[i];
            tagObj.tag = { name: cur.name, attrs: allAttrs[cur.name],
                              isSelfClosing: cur.isSelfClosing };
            let e = new window.xeEditor(fxValid, saxParser);
            if (cur.expect == e.valid("<svg><ignored/></svg>")){}
            else {console.warn(cur);return false};
        } // end for run sequence
        return true;
    }, // end test 72

];
