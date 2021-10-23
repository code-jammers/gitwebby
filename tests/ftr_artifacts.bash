#!/bin/bash
ss="$_"  # script source
sd=$(dirname "$ss")  # script dir
rd=$(dirname "$sd")  # repo dir

echo
echo ARTIFACTS TEST
echo 1. CREATE 1.txt
echo 2. GIT INIT+ADD+COMMIT
echo 3. RUN gitwebbyupd
echo 4. ENSURE ARTIFACT a_\{hash\}.txt IS SAVED
echo 5. AND ENSURE IT HAS THE CONTENTS OF 1.txt
echo ...
{
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
}
echo ... DONE
