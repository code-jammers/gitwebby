#!/bin/bash

# Run like this:
#   tests/features.bash

for ftr_f in tests/ftr_*.bash
do
    ${ftr_f}
done
