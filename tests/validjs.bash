#!/bin/bash

# Run from root project directory like this:
#   tests/validjs.bash

root=$(pwd)
win="${root}/tests/window.js"
data="${root}/data"

echo
echo "repos.js test"
echo "test: ${data}/repos.js" >"${root}/.gitwebby/validjs.log"
cat "$win" "${data}/repos.js" | node 2>>"${root}/.gitwebby/validjs.log"
if [[ $? -eq 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi

echo
echo "branches.js test"
echo "test: ${data}/branches.js" >>"${root}/.gitwebby/validjs.log"
cat "$win" "${data}/branches.js" | node 2>>"${root}/.gitwebby/validjs.log"
if [[ $? -eq 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi

echo
echo '*.js test (will take a few mins)'
failcd=0
for jsfile in ${data}/*.js;
do
    echo "test: $jsfile" >>"${root}/.gitwebby/validjs.log"
    cat "$win" "$jsfile" | node 2>>"${root}/.gitwebby/validjs.log"
    excd=$?
    failcd=$((failcd+excd))
done
if [[ $failcd -eq 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi
echo

echo "For errors check ${root}/.gitwebby/validjs.log"
echo
