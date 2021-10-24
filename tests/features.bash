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
echo FEATURE TESTS
echo RUN EACH ftr_\*.bash file IN SCRIPT-SOURCE-DIR/
echo AND SAVE LITERATE PROGRAMMNIG OUTPUT WITHIN SCRIPT-SOURCE-DIR/../self_doc
echo ...
{
    for ftr_f in $sd/ftr_*.bash
    do
        bnm=$(basename $ftr_f)
        mkdir -p "${rd}/self_doc/tests/${bnm}/"
        ftr_out=$($ftr_f)
        echo "$ftr_out" | grep -v '^\s' > "${rd}/self_doc/tests/${bnm}/README"
        echo "$ftr_out" | grep -i PASS
        echo "$ftr_out" | grep -i FAIL
    done
}
echo ... DONE
