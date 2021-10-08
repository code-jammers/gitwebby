#!/bin/bash

# Run from root project directory like this:
#   tests/validjs.bash

root=$(pwd)
win="${root}/tests/window.js"
data="${root}/data"

echo
echo "repos.js test"
node "$win" "${data}/repos.js"
if [[ $? -eq 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi

echo
echo "branches.js test"
node "$win" "${data}/branches.js"
if [[ $? -eq 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi

echo
echo "\*.js test (will take a few mins)"
failcd=0
for jsfile in ${data}/*.js;
do
    node "$win" "$jsfile"
    excd=$?
    failcd=$((failcd+excd))
done
if [[ $failcd -eq 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi
echo
