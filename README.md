# gitwebby

## Setup

- npm i
- npm start

## Dev data

To cleanly get some dev data generated to the data/ directory, cd into the
same directory as this README.md file and run the following commands.

```sh
dir=$(pwd)
mkdir -p ../gitwebby-repo-root
mkdir -p ../gitwebby-repo-root/team-a
mkdir -p ../gitwebby-repo-root/team-b
mkdir -p ../gitwebby-repo-root/team-a/{alice,bob}
mkdir -p ../gitwebby-repo-root/team-b/{carol,dan}
cd ..
par=$(pwd)

#alice
cd gitwebby-repo-root/team-a/alice
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana

#bob
cd "$par"
cd gitwebby-repo-root/team-a/bob
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana

#carol
cd "$par"
cd gitwebby-repo-root/team-b/carol
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana

#dan
cd "$par"
cd gitwebby-repo-root/team-b/dan
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana

cd "$dir"

bin/gitwebbyupd --proj=2 ../gitwebby-repo-root .

```
