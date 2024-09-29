window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 19 - DOWNLOADS XML
    function test19() {
        var el = issueDownload();
        var href = el.href.indexOf('data:image/svg+xml') > -1;
        href &&= el.href.indexOf('333') > -1;//text x="333" element
        return href && (el.download == 'act.svg');
    },
    // TDD TEST 20 - COPIES XML
    function test20() {
        // all we can test from ci is if the execCommand function was called
        document.execCommand = (cmd) => cmd=='copy';
        var copied = issueCopy();
        document.execCommnad = null;
        return copied;
    },
    // TDD TEST 27 - UPLOADS TEXT
    function test27() {
        window.onStart({});
        window.issueKeyNum(0, {});
        var t = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="750" height="750" viewBox="0,0,750,750">
    <circle cx="375" cy="39" r="10" fill="black" stroke="black" stroke-width="1"/>
    <polyline points="375 52 375 108 365 98 375 108 385 98" stroke="black" fill="transparent" stroke-width="1"/><rect id='test'/>
</svg>`;
        return window.issueUploadText(/*"<svg><rect id='test'/></svg>"*/t, {})
            .indexOf('test') > -1;
    }, // end test27
    // TDD TEST 82 - SVG UPLOAD SHOULD RESULT IN JUST 1 SVG ELEMENT
    function test82() {
        window.onStart({});
        window.issueKeyNum(0, {});
        svgNodes=[];window.onStart({});// just enough issueUpload implementation
                                       // to cause onStart bug (where 2nd svg
                                       // was being added rather than replaced)
        return document.getElementsByTagName("svg").length == 1;
    }, // end test82
    // TDD TEST 84 - COPYING XML SHOULD NOT DISABLE TEXTAREA
    function test84() {
        document.execCommand = (cmd) => cmd=='copy';
        var copied = issueCopy();
        document.execCommnad = null;
        return document.getElementById("svgFullTextarea").disabled == false;
    }, // end test84
];
