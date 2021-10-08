# gitwebby

## Setup

- npm i
- npm start

## Easiest method to get dev data

```sh
bin/gitwebbyupd ../ ./
```

## Dev data simple

This example only has 1 nesting.

```sh
dir=$(pwd)
mkdir -p ../gitwebby-repo-root-simple
cd ../gitwebby-repo-root-simple
git clone https://github.com/code-jammers/gitwebby.git gitwebby_apple
git clone https://github.com/code-jammers/gitwebby.git gitwebby_banana
cd "$dir"
bin/gitwebbyupd ../gitwebby-repo-root-simple .

#end
```

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

#end
```

## Run Tests

The valid js test script must be ran from within this repository root directory

```sh
tests/validjs.bash
```

To test a new set of repositories first empty the data directory and run
gitwebbyupd before running validjs.bash
