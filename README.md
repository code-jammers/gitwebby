# gitwebby

## Setup

```sh
bin/gitwebbyupd ../ ./
npm i
npm start
```

## gitwebbyupd

Explain: `bin/gitwebbyupd ../ ./`

This is equivalent to `bin/gitwebbyupd --proj=0 ../ ./`

- The `../` arg tells gitwebbyupd that the list of repository folders is in the
  gitwebby repository's parent folder
- The `./` arg tells gitwebbyupd that the web instance that will receive the
  generated js data files will be the current (gitwebby repository) directory

Explain: `bin/gitwebbyupd --proj=1 ../../ ./`

- The `--proj=1` arg tells gitwebbyupd that there is 1 level of project folder
  nesting in hierarchy before the usual folder that lists repositories
- The `../../` when combined with 1-level project nesting tells gitwebbyupd that
  folder hierarchy being read will be `{proj1|..}/{repocontainer1|..}/{gitwebby|other-repo}`

## Run Tests

The test scripts must be ran from within this repository root directory.

To test a new set of repositories first empty the data directory and run
gitwebbyupd before running the test scripts.

### Summary Test

For reporting purposes you can run a summary test which will run all tests.

```sh
tests/summ.bash
```

### Valid JS test

```sh
tests/validjs.bash
```

### Feature tests

```sh
tests/features.bash
```

## Env Var Overrides

### GITWEBBY_FORCE

The gitwebby update script skips certain files that have been written
previously. However if things are in a bad state, for whatever reason
(ie: cancelled run, old gitwebby version bug, etc) you can force it
to overwrite all those files using the latest code with the GITWEBBY_FORCE
override environment variable.

```sh
export GITWEBBY_FORCE=1
bin/gitwebbyupd ../ ./
```
### GITWEBBY_REMOTE

By default gitwebby tries to prevent network lag by ignoring remote branches.

You can enable remote branches by setting the GITWEBBY_REMOTE env variable to 1.

```sh
export GITWEBBY_REMOTE=1
bin/gitwebbyupd ../ ./
```

### GITWEBBY_1BRANCH

You can also cause only 1 branch per repository (the current branch) by
setting the GITWEBBY_1BRANCH env variable to 1.

```sh
export GITWEBBY_1BRANCH=1
bin/gitwebbyupd ../ ./
```

### Simpler Syntax

There is simpler syntax to set environment variables if you place the
assignment on the same line before the command invocation.

```sh
GITWEBBY_1BRANCH=1 GITWEBBY_FORCE=1 bin/gitwebbyupd ../ ./
```
### Test environment variable

If you added these as environment variables in Windows or exported in your
~/.profile or ~/.bashrc, etc in Linux then you can test by re-logging in
to your machine with new shell session and try to echo in terminal (Lnx) or
Git Bash shell (Win).

```sh
echo $GITWEBBY_1BRANCH
echo $GITWEBBY_FORCE
echo $GITWEBBY_REMOTE
# any of these that are unset will become 0 (OFF) when the script runs
# and they need to display a 1 if you desire it to be enabled for the script
```

## Documentation

The gitwebby update script is a literate\* program that you can read
at bin/gitwebbyupd or you can read just the extracted commentary at
self_doc/bin/gitwebbyupd/README.

The commentary file can be re-generated from the code by just running the code
and using unix pipeline filters to write the output file:

```sh
bin/gitwebbyupd ../ ./ | grep -v '^\s' > self_doc/bin/gitwebbyupd/README
```

\* arguably a literate program for reasons found in self_docs/README.md.
