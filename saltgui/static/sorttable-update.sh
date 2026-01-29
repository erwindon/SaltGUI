#!/bin/sh

# part of SaltGUI
# to be run by maintainers to update the "sorttable" package

# file sorttable/sorttable.css was added for SaltGUI

set -x

# just in case is was deleted or not yet there
mkdir --parent sorttable

#wget -O sorttable/sorttable.js https://www.kryogenix.org/code/browser/sorttable/sorttable.js

git add sorttable

# show the result
git status
git diff --cached sorttable

# End
