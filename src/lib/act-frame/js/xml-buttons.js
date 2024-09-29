// EVENTS - PROGRAMMATIC - ISSUE DOWNLOAD

window.issueDownload = function() { // TDDTEST19 FTR
    var temp = document.createElement('a');
    temp.href = 'data:image/svg+xml,' + encodeURI(document.getElementById('svgFullTextarea').value);
    temp.target = '_blank';
    temp.download = 'act.svg';
    temp.click();
    return {
        href:temp.href,
        download:temp.download,
        target:temp.target
    };
}

// EVENTS - PROGRAMMATIC - ISSUE COPY

window.issueCopy = function() { // TDDTEST20 FTR
    var ta = document.getElementById("svgFullTextarea");
    ta.focus();
    ta.select();
    var copied = document.execCommand("copy");
    ta.disabled = true;
    (() => { // TDDTEST84 FIX
        ta.disabled = false; // old version used to not allow textarea editing
    })();
    console.log('copy');
    return copied;
}

// EVENTS - PROGRAMMATIC - ISSUE UPLOAD

window.issueUploadText = function(text, test) {
    var ta = document.getElementById("svgFullTextarea");
    ta.value = text;
    svgNodes = [];
    window.onStart(test);
    if (test==null){setTimeout(function(){window.updateFrames();},100);} else {updateFrames();}
    return ta.value;
}

window.issueUpload = async function() { // TDDTEST? FTR
    var fileEl = document.getElementById('upload');
    fileEl.onchange = async function() {
        const file = event.target.files.item(0);
        const text = await file.text();
        window.issueUploadText(text);
    };
    fileEl.click();
}
