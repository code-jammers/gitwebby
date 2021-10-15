#!/bin/bash

# Run from root project directory like this:
#   tests/timestamp.bash

root=$(pwd)
win="${root}/tests/window.js"
data="${root}/data"

echo "Valid Timestamp Test"
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
