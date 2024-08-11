#!/bin/sh

# part of SaltGUI
# to be run by maintainers to update the "highlight" package

set -x

[ -f /tmp/highlight.zip ] ||
	wget -O /tmp/highlight.zip --header='Content-Type: application/json' --post-data='{"api":2,"languages":["json","yaml"]}' https://highlightjs.org/api/download

# remove previous edition
git rm -r -f highlight
# just in case is was deleted or not yet there
mkdir --parent highlight
# unzip the downloaded file
(cd highlight && unzip -q /tmp/highlight.zip)
# add it to git
git add highlight

# cleanup
rm /tmp/highlight.zip

# show the result (summary)
git status
git diff --cached highlight/es/core.js

# End
