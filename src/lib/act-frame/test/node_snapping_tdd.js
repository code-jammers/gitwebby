window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 40 - POLYLINE SNAPS TO RIGHT-ANGLE
    function test40() {
        onStart({});
        issueKeyNum(2, {});
        issueDrag(1,1,    4,40); // x==4 should snap to x=1
        return [...document.getElementsByTagName("polyline")]
            .filter(el => el.getAttribute("points").indexOf("1 1 1 40")>-1)
            .length > 0;
    }
];
