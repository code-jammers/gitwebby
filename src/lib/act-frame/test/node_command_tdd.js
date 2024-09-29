window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 79 - SETX 1 NODE
    function test79() {
        var ct = new window.CmdTester([{type: 'text', x:150, y:150}]);
        return ct.testSetX(400);
    }
];
