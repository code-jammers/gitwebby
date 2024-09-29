
function tddTestMsg(pass) {
    var pad = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var el = notifyMsg(
        pass?pad+"PASS"+pad:pad+"FAIL"+pad,
        pass?null:"rgba(255,0,0,0.6)"
    );
}

// RUN TDD
addEventListener('DOMContentLoaded', (e) => {
    var testNo = new URL(location.href).searchParams.get("tdd");
    var freeze = false;
    if (testNo == null) {
        testNo = new URL(location.href).searchParams.get("tddf");
        if (testNo == null) {
            if (new window.urPageUrl(location.href).template() == null) {
                window.onStart();  // auto-start if not testing // CT/52
                                   // or when not a template
            } // end not template check
            return;
        } // end testno nullCheck
        freeze = true;
    }
    window.gTest=true;  // only set if early return didn't happen
    testNo = parseInt(testNo);
    if (testNo >= tddTests.length) { return; }
    setTimeout(function() {
        // RUN TDD - CURRENT TEST
        var pass = tddTests.filter((fn)=>fn.name==('test'+testNo))[0]()
        tddTestMsg(pass);
        if (freeze || !pass) {return;}
        setTimeout(function() {
            var newUrl = location.href.replace("?tdd="+testNo,"?tdd="+(testNo+1));
            location.href = newUrl;
        }, 700);
    }, 200);
});

