---
name: Add SALT release
about: Add SALT release to the SaltGUI code
title: Add SALT release 30xx.yy
labels: enhancement
assignees: erwindon

---

File https://github.com/erwindon/SaltGUI/blob/master/saltgui/static/scripts/panels/Minions.js contains a list of known CVEs.
SaltGUI warns for these vulnerabilities when they still apply for the Salt Master or any of the Salt Minions.
The list ends with a statement on which SALT versions are already supported.
The release that you are reporting now must be newer than that.
When multiple releases are missing, create a separate issue for each.

Note that we do not register Release Candidates.

**Which release is missing**
SALT version 30xx.yy: https://docs.saltproject.io/en/30xx/topics/releases/30xx.yy.html

**Describe the solution you'd like**
Update list with new CVEs (if any).
Update the text just below `ADD_RELEASE` in file `saltgui/static/scripts/panels/Minions.js`.

**Additional context**
Add any other context or screenshots about the request here.
