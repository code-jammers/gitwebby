#!/bin/bash

ss="$_"  # script source
sd=$(dirname "$ss")  # script dir
rd=$(dirname "$sd")  # repo dir

cd "$rd" >>/dev/null
rd=$(pwd)
cd - >>/dev/null

# Summary run just reports if all tests succeed (Failing Tests: 0)
# or not (Failing Tests: 1+)

validjs=$("${rd}/"tests/validjs.bash)
features=$("${rd}/"tests/features.bash)
echo "$validjs" | grep -v '^\s' > "${rd}/self_doc/tests/validjs.bash/README"
echo "$features" | grep -v '^\s' > "${rd}/self_doc/tests/features.bash/README"
nl=$'\n'
failed_cnt=$(echo "${validjs}${nl}${features}" | grep -i "fail" | wc -l)
echo $'\n'"Failing Tests: ${failed_cnt}"
