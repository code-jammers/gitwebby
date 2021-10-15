#!/bin/bash

# Summary run just reports if all tests succeeds (Failing Tests: 0)
# or not (Failing Tests: 1+)
# Run like this:
#   tests/summ.bash

validjs=$(tests/validjs.bash)
timestamp=$(tests/timestamp.bash)
nl=$'\n'
failed_cnt=$(echo "${validjs}${nl}${timestamp}" | grep -i "fail" | wc -l)
echo $'\n'"Failing Tests: ${failed_cnt}"
