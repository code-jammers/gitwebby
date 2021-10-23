# self_doc

## Self-documenting code

Self-documenting code can be accomplished in Bash via echo statements, which
for the most part appears like plain natural language.

This allows for unlimited space to comment on and describe a particular block
of code.

```sh
echo CODE GROUP NOTES ...
echo 1. PERFORM ACTION X
echo 2. PERFORM ACTION Y
echo 3. PERFORM ACITON Z
{
    action_X
    action_Y
    action_Z
}
```

Echoed self-documenting code commentary can be placed above code blocks which
also serves the purpose of logging to standard output, and with output
conventions and unix filters tools you can control the standard output in
whatever way is required (ie: filter out status logging, filter out self-
documenting code notes, etc).


## Literate Programming

The gitwebbyupd script was written with the "program as literature" mindset,
and is somewhat different than other literate programs since the code commentary
is structured with the linear flow of the program, and the reader will read
the program from top to bottom in order to understand the code at every step.

gitwebbyupd also outputs progress specific to a user's own git repositories,
for this reason the tabbed-echo progress statements can be removed with a
unix filter when generating the documentation.

The full literate program of the gitwebbyupd script is the script itself and the
commentary/documentation portion exists within the same hierarchy as the script
but under the self_doc folder (parent folder of this README.md).

The documentation can be re-generated by simply running the program and
filtering out the tabbed-echo statements with grep.

```sh
gitwebbyupd /path/to/repos_dir /path/to/gitwebby/instance | grep -v '^\s'
```