#!/bin/bash

ss="$_"  # script source
sd=$(dirname "$ss")  # script dir
rd=$(dirname "$sd")  # repo dir

cd "$sd" >>/dev/null
sd=$(pwd)
cd - >>/dev/null

cd "$rd" >>/dev/null
rd=$(pwd)
cd - >>/dev/null

echo
echo PROJ2 \(--proj=2\) FEATURE TEST
echo 1. CLONE gitwebby CODE IN NESTED HIERARCHIES:
echo - proj2_dir = SCRIPT_SOURCE_DIR/../.gitwebby/proj2/
echo a. REMOVE proj2_dir
echo - team_dir = proj2_dir/gitwebby-repo-root/team-\{a\|b\}/
echo - team_dir/\{alice\|bob\|carol\|dan\}/gitwebby_\{apple\|banana\}
echo b. CREATE ENTIRE team_dir FOLDER HIERARCHY
echo 2. RUN GITWEBBY ON alice DIRECTORY AND TEST THAT A DATA FILE IS CREATED
echo ...
{
    root="$rd"
    cd "$root"
    root=$(pwd)

    win="${root}/tests/window.js"
    data="${root}/data"

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

    bin/gitwebbyupd --proj=2 "${dir}/gitwebby-repo-root" "${dir}/gitwebby-repo-root/team-a/alice/gitwebby_apple" >>/dev/null
    wcl=$(ls "${dir}/gitwebby-repo-root/team-a/alice/gitwebby_apple/data" | wc -l)
    if [[ $wcl -gt 0 ]]; then echo "  PASS"; else echo "  FAIL"; fi
}
echo ... DONE
