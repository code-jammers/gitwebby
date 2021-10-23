#!/bin/bash
ss="$_"  # script source
sd=$(dirname "$ss")  # script dir
rd=$(dirname "$sd")  # repo dir

# Run from root project directory like this:
#   tests/ftr_artifacts.bash
echo "Artifacts Test"
rld="${rd}/.gitwebby/testrepos"  # repo list dir
rm -rf "${rld}" 2>>/dev/null
mkdir "${rld}"
cd "${rld}"
mkdir artifacts_test
cd artifacts_test
git init >>/dev/null 2>>/dev/null
echo "1" >>1.txt
git add 1.txt >>/dev/null 2>>/dev/null
git commit -m 1.txt >>/dev/null 2>>/dev/null
mkdir data
../../../bin/gitwebbyupd ../ ./ >>/dev/null
cd data
found=0
touch a_ignore.txt
fnm=
for f in a_*.txt
do
    if [[ $f = a_ignore.txt ]]; then
        continue
    fi
    found=1
    fnm="$f"
    break
done

val=$(cat "$fnm")
if [[ "$val" -eq 1 ]]; then :; else found=0; fi
if [[ $found -gt 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi
