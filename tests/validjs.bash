#!/bin/bash

ss="$_"  # script source
sd=$(dirname "$ss")  # script dir
rd=$(dirname "$sd")  # repo dir

echo
echo VALID JS TEST
echo 0. RM SCRIPT-SOURCE-DIR/../.gitwebby AND SCRIPT-SOURCE-DIR/../data
echo TO ENSURE FILES FROM LATEST CODE ARE CREATED.
echo 1. RUN COMMAND BASED BASED ON SCRIPT SOURCE RELATIVE PATH
echo WHICH WILL GENERATE JS DATA FILES IN ../data AND
echo HAVE IT UPDATE THE LITERATE PROGRAMMING SELF DOC
echo "../bin/gitwebbyupd ../../ ../ |grep -v '^\s' > \"${root}self_doc/bin/gitwebbyupd/README\""
echo 2. SEND CONTENTS OF ../data/repos.js TO node COMMAND AND TEST EXIT STATUS
echo 3. SEND CONTENTS OF ../data/branches.js TO node COMMAND AND TEST EXIT STATUS
echo 4. FOREACH JS FILE IN ../data/\*.js SEND TO node COMMAND AND TEST EXIT STATUS
echo 5. ERROR LOGGING WILL BE STORED IN ../.gitwebby/validjs.log
echo ...
{
    root="$rd"
    cd "$root" >>/dev/null
    root=$(pwd)
    cd - >>/dev/null
    win="${root}/tests/window.js"
    data="${root}/data"

    rm -rf "${root}/data"
    rm -rf "${root}/.gitwebby"
    mkdir "${root}/data"
    touch "${root}/data/.gitkeep"
 
    "${root}"/bin/gitwebbyupd "${root}/../" "${root}" | grep -v '^\s' > "${root}/self_doc/bin/gitwebbyupd/README"

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
        fnm=$(basename "$jsfile")
        if [[ "${fnm:0:2}" = "a_" ]]; then
            continue  # don't test artifact files
        fi
        echo "test: $jsfile" >>"${root}/.gitwebby/validjs.log"
        cat "$win" "$jsfile" | node 2>>"${root}/.gitwebby/validjs.log"
        excd=$?
        failcd=$((failcd+excd))
    done
    if [[ $failcd -eq 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi
    echo

    echo "For errors check ${root}/.gitwebby/validjs.log"
}
echo ... DONE
