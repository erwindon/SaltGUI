#!/bin/sh

# part of SaltGUI
# to be run by maintainers to update the "hilitor" package

set -x

#wget -O hilitor/hilitor.js https://www.the-art-of-web.com/hilitor.js

# we made adjustments:
# - allow case-sensitive matches
# - limit the number of highlighted matched to 25

# add it to git
git add hilitor/hilitor.js

# show the result
git status
git diff --cached hilitor

# End
