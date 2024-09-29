window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 83 - FINDS TEMPLATE VAR IN PAGE URL
    function test83() {
        return new window.urPageUrl("file:///?template=pins").template() == 'pins';
    }, // end test83
];
