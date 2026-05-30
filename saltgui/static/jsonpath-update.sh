#!/bin/sh

VERSION=0.8.0

# part of SaltGUI
# to be run by maintainers to update the "jsonpath" package

set -x

# just in case is was deleted or not yet there
mkdir --parent jsonpath

wget -O jsonpath/jsonpath-$VERSION.js https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/jsonpath/jsonpath-$VERSION.js.txt
sed --in-place \
	-e 's/\[0-9\]/\\d/g' \
	-e 's/\[0-9\*\]/[\\d*]/g' \
	jsonpath/jsonpath-$VERSION.js

git add jsonpath

# show the result
git status
git diff --cached jsonpath

# End
