window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 81 - OUTSIDE RECT VERTEX BOUNDS SHOULD NOT ACTIVATE RESIZE HOVER
    function test81() {
        let th = 21; // an even smaller threshold than 21 would be ideal (so
                     // it doesn't show resize trigger icon when it's not even
                     // near a rect corner), however any lower than 21 breaks
                     // test 44 (need to reasses, probably test 44 is too rigid)
        let size = 100;
        let nd = {tagName: 'rect', attrs: [
            {name: 'x', value: '0'},
            {name: 'y', value: '0'},
            {name: 'width', value: size+''},
            {name: 'height', value: size+''},
            {name: 'stroke-width', value: '1'}
        ]};//end node def
        let vtx = window.vxUnitCoord(nd, size+th+1, size+th+1); // go +1 outside
                                                                // the threshold
        let hovers = window.dwIsHoveringCorner(vtx, /*mode*/0);
        return !hovers;
    }, // end test 81
];
