#!/bin/bash

# Run from root project directory like this:
#   tests/ftr_proj2.bash

root=$(pwd)
win="${root}/tests/window.js"
data="${root}/data"

echo "--proj=2 Test"
dir="${root}/.gitwebby/proj2"
if [[ -d "${dir}" ]]; then
    rm -rf "$dir"
fi
mkdir "$dir"
mkdir "${dir}/gitwebby-repo-root"
mkdir "${dir}/gitwebby-repo-root/team-a"
mkdir "${dir}/gitwebby-repo-root/team-b"
mkdir "${dir}/gitwebby-repo-root/team-a/alice"
mkdir "${dir}/gitwebby-repo-root/team-a/bob"

mkdir "${dir}/gitwebby-repo-root/team-b/carol"
mkdir "${dir}/gitwebby-repo-root/team-b/dan"
cd "$dir"
par=$(pwd)

#alice
cd gitwebby-repo-root/team-a/alice
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple >>/dev/null 2>>/dev/null
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana >>/dev/null 2>>/dev/null

#bob
cd "$par"
cd gitwebby-repo-root/team-a/bob
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple >>/dev/null 2>>/dev/null
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana >>/dev/null 2>>/dev/null

#carol
cd "$par"
cd gitwebby-repo-root/team-b/carol
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple >>/dev/null 2>>/dev/null
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana >>/dev/null 2>>/dev/null

#dan
cd "$par"
cd gitwebby-repo-root/team-b/dan
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple >>/dev/null 2>>/dev/null
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana >>/dev/null 2>>/dev/null

cd "$root"

bin/gitwebbyupd --proj=2 "${dir}/gitwebby-repo-root" "${dir}/gitwebby-repo-root/team-a/alice/" >>/dev/null
wcl=$(ls "${dir}/gitwebby-repo-root/team-a/alice/data" | wc -l)
if [[ $wcl -gt 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi
