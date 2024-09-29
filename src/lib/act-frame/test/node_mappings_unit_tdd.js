window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 76 - SUBSELECTED POLYLN AFFECTED BY MAIN SELECTED POLYLINE EDIT
    function test76() {
        let src = {tagName: 'polyline', attrs: [
            {name:'stroke-width',value:'1'},
            {name:'points',value:'0 0 0 0'},
        ]}; // main selected node

        /*global.*/cacheNd = {attrs:[]}
        window.forceMap(src,cacheNd);  // cacheNd is a pre-edit copy

        src.attrs.filter(a => a.name == 'points')[0].value = '1 1 1 1'; // edit

        let dest = {tagName: 'polyline', attrs: [
            {name:'stroke-width',value:'1'},
            {name:'points',value:'2 2 2 2'},
        ]}; // subselected node
        window.smartMap(src, dest); // dest points becomes (orig) 2 + (src) 1

        return dest.attrs.filter(a=>a.name=='points')[0].value == '3 3 3 3';
    }, // end test 76
];
