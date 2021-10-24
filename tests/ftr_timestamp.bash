#!/bin/bash

ss="$_"  # script source
sd=$(dirname "$ss")  # script dir
rd=$(dirname "$sd")  # repo dir

cd "$sd"
sd=$(pwd)
cd -

cd "$rd"
rd=$(pwd)
cd -

echo
echo VALID TIMESTAMP FEATURE TEST
echo FOR ALL \*.commit.js FILES WITHIN SCRIPT-SOURCE-DIR/../data
echo RUN IT WITH THE node COMMAND AND ADDITIONAL JS CODE THAT CHECKS
echo THAT THE timestamp JS KEY LOOKUP RESULTS IN A VALID TIMESTAMP
echo ONLY INCLUDING CHARS: 0123456789T-
echo THE ERROR LOG CAN BE VIEWED AT SCRIPT-SOURCE-DIR/../.gitwebby/timestamp.log
echo ...
{
    cd "$rd"
    root=$(pwd)
    win="${root}/tests/window.js"
    data="${root}/data"

    check_code="function reduce(str) { s=''; for (var i=0;i<str.length;i++) { var c=str[i]; if (c==':'||c=='0'||c=='1'||c=='2'||c=='3'||c=='4'||c=='5'||c=='6'||c=='7'||c=='8'||c=='9'||c=='T'||c=='-'){}else{ s+=c; }}return s;}  function check(str) {return reduce(str).length==0;}"
    failcd=0
    echo >"${root}/.gitwebby/timestamp.log"
    for jsfile in ${data}/*.commits.js;
    do
        js=$(cat "${win}" "$jsfile")
        js="${js}${check_code}  if (!check(window.COMMITS[Object.keys(window.COMMITS)][0].timestamp)) throw 'invalid timestamp';"
        echo "$js" | node --trace-uncaught 2>>"${root}/.gitwebby/timestamp.log"
    done
    errors=$(cat "${root}/.gitwebby/timestamp.log" | grep -i "thrown at" | wc -l)
    if [[ $errors -eq 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi
}
echo ... DONE
