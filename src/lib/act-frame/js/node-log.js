window.gLgPattern = 'ignored -';//'actsvg - test';//null;
window.gLgWarn = null;
window.gLgCacheKV = {};

window.lgLogNodeCache = function(key, msg, nd) {
    window.gLgCacheKV[key] = {msg: msg, nd: nd};
}

window.lgLogNodeCacheFlush = function(key) {
    let kv = window.gLgCacheKV[key];
    if (kv == null) return;
    window.lgLogNode(kv.msg, kv.nd);
    window.gLgCacheKV[key] = null;
}

window.lgLogNode = function(msg, nd) {
    if (window.gLgPattern == null) return;
    if (!new RegExp(window.gLgPattern).test(msg)) return;
    if (window.gLgWarn == null) window.gLgWarn = window.gTest;
    let id = nd?.attrs?.filter(a => a.name == 'id')?.[0]?.value;
    let attrStr = '';nd?.attrs?.forEach(a => attrStr+=(a.name+':'+a.value+' '));
    let consoleMsg = '--- '+msg+'\n'+
        'TRACE    '+Error().stack.replace(/^Error\n    /,'')+'\n'+
        `NODE    tag=${nd?.tagName},pos=(${nd==null||nd.attrs==null||(nd.tagName.toLowerCase()=='svg')?'null':window.getPosId(nd?.attrs)}),id=${id},curIdx=${curIds.findIndex(c=>c.id==id)},svgNodesIdx=${svgNodes.findIndex(n=>n==nd)}`+'\n'+
        `ATTRS    ${attrStr}`+'\n'+
        '-- end '+msg;
    if (window.gLgWarn) {
        console.warn(consoleMsg);
        return;
    }
    console.log(consoleMsg);
}

