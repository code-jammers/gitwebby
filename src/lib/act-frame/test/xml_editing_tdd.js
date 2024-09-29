window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 68 - CHANGE X,Y DIRECTLY IN XML EDITOR
    function test68() {
        onStart({});
        document.getElementById("svgFullTextarea").value = document.getElementById("svgFullTextarea").value.replaceAll('x="333"', 'x="111"').replace('y="134"', 'y="144"');
        window.gXmlEditor.backgroundUpdate();
        // svgNodes.forEach((n) => console.warn(n.attrs.map(a => a.name+' '+a.value).join(" ")));
        return svgNodes.filter(nd => nd.attrs.filter(a => (a.name=='x'&&a.value=="111")).length>0).length == 2 &&
               svgNodes.filter(nd => nd.attrs.filter(a => (a.name=='y'&&a.value=="144")).length>0).length == 1;
    }, // end test 68
    // TDD TEST 69 - CHANGE WIDTH,HEIGHT DIRECTLY IN XML EDITOR
    function test69() {
        onStart({});
        document.getElementById("svgFullTextarea").value = document.getElementById("svgFullTextarea").value.replace('width="100"', 'width="200"').replace('height="50"', 'height="150"');
        window.gXmlEditor.backgroundUpdate();
        // svgNodes.forEach((n) => console.warn(n.attrs.map(a => a.name+' '+a.value).join(" ")));
        return svgNodes.filter(nd => nd.attrs.filter(a => (a.name=='width'&&a.value=="200")).length>0).length == 1 &&
               svgNodes.filter(nd => nd.attrs.filter(a => (a.name=='height'&&a.value=="150")).length>0).length == 1;
    }, // end test 69
];
