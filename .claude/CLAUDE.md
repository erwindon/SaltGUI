SaltGUI is a webapplication to manage a Saltstack installation.
Saltstack manages a group of computers.
Saltstack has an API server called salt-api that provides a REST based API and also provides a webserver for static files.
The SaltGUI files are placed in the static file area of salt-api.
The static files are public.
The REST API is protected by a login mechanism.

* Browser Compatibility
The code is plain javascript, not using features that were introduced in the last 5 years.
This makes it possible to use any webbrowser that itself is not older than 5 years.
That may seem a long period, but the target audience may have environments that are not connected to internet.

* Key Architectural Patterns:
App API calls have helper functions in API.js. The APIs are called using Promises.
Pages are composed of (typically) 1 or 2 panels.
Source code for pages and panels is separate.
There are only few images. Alle icons are just unicode characters that look like an icon.
There are very few html controls: buttons, drop-down menus and popup-menus are implemented as DIV/SPAN panels. Radio-buttons and check-boxes are implemented as INPUT controls.
The menu-bar has 2 editions. Small screens only have a menu-button that shows the main menu. Wider screens directly show the whole main menu. With wide screens, multiple panels are shown side-by-side, with small screens the panels are stacked.

* coding style
Functions start with "_" when they are used in the same file only.
Functions must not start with "_" when they are used (also) in other files.
CSS colors must use a color-name when one is generally available.
Variable names must be descriptive and are in camelCase.
Function parameters start with a single "p".

* Code quality
CSS code must pass "npm run stylelint" without warnings/errors.
JS code must pass "npm run eslint" without warnings/errors.
All unit tests must pass "npm run test:unit") without warnings/errors.
All regression tests must pass "npm run test:unit") without warnings/errors.
SonarQube findings must never be "accepted", they must be solved, only few exceptions are possible.

* Refactoring
When refactoring code, always keep the original comments.

* Pipelines
In the GitHub repository the following quality controls are present. The last 2 validate code and must always succeed.
** Dependabot - for NPM and GitHub actions
** pages-build-deployment - builds the public documentation (in GitHub Pages)
** CodeQL - for security problems
** Node.js CI - for static tests and unit tests

* GIT
Assistants may NEVER perform git commands that modify either the workspace or the remote repository.
