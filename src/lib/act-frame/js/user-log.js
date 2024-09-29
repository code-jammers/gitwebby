window.gLgUserCacheKV = {};
window.gLgUserString = "";

window.lgUserCache = function(key, msg) {
    window.gLgUserCacheKV[key] = {msg: msg};
}

window.lgUserCacheFlush = function(key) {
    let kv = window.gLgUserCacheKV[key];
    if (kv == null) return;
    window.lgUser(kv.msg);
    window.gLgUserCacheKV[key] = null;
}

window.lgUser = function(msg) {
    window.gLgUserString += (msg+`
`);

    if (window.gLgUserString.length > 6000) {
        window.lgUserFlush(); // don't hold onto all this extra memory
    } // end user log length cond
}

// after a bug is spotted, call this function
// and use the output as code for a new unit test
window.lgUserFlush = function() {
    let userLogString = window.gLgUserString;
    console.log(userLogString);
    window.gLgUserString = "";
    return userLogString;
} // end flush user log function
