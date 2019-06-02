# SaltGUI

A new open source web interface for managing a SaltStack server. Built using vanilla ES6 and implemented as a wrapper around the rest_cherrypy server.

## Screenshots
![overview](/docs/screenshots/overview.png)

![job](/docs/screenshots/job.png)


## Features
- Login via PAM or any other supported authentication by Salt
- View minions and easily copy IPs
- Run state.highstate for a particular minion
- View the seven most recent jobs run on Salt
- Manually run any Salt function and see the output
- View the values for grains for a particular minion
- View the schedules for a particular minion
- View the values for pillars for a particular minion
- View the beacons for a particular minion


## Quick start using PAM as authentication method
- Install `salt-api` - this is available in the Salt PPA package which should already been installed if you're using Salt
- Open the master config /etc/salt/master
- Find `external_auth` and configure as following (see the note below!):
```
external_auth:
  pam:
    saltuser:
      - .*
      - '@runner'
      - '@wheel'
      - '@jobs'
```
- See `docs/PERMISSIONS.md` for more restricted security configurations.
- `saltuser` is a unix (PAM) user, make sure it exists or create a new one.
- At the bottom of this file, also setup the rest_cherrypi server:
```
rest_cherrypy:
  port: 3333
  host: 0.0.0.0
  disable_ssl: true
  app: /srv/saltgui/index.html
  static: /srv/saltgui/static
  static_path: /static
```
- Replace `/srv/saltgui` in the above config with the directory containing the saltgui html/js source files.
- Restart everything with ``pkill salt-master && pkill salt-api && salt-master -d && salt-api -d``
- You should be good to go. If you have any problems, open a GitHub issue. As always, SSL is recommended wherever possible but setup is beyond the scope of this guide.

**Note: With this configuration, the `saltuser` user has access to all salt modules available, maybe this is not what you want**

Please read the [Permissions](docs/PERMISSIONS.md) page for more information.


## Authentication
SaltGUI supports the following authentication methods supported by salt:
- pam
- file
- ldap
- mysql
- yubico

See the [EAUTH documentation](https://docs.saltstack.com/en/latest/topics/eauth/index.html) and the [Salt auth source code](https://github.com/saltstack/salt/tree/2018.3/salt/auth) for more information.

## Output
SaltGUI shows the data that is returned by the Salt API.
Some variation can be achieved by modifying salt master configuration file `/etc/salt/master`.
e.g. (the default)
```
saltgui_output_formats: doc,saltguihighstate,json
```
`doc` allows reformatting of documentation output into more readable format. Also implies that only the result from one minion is used.
`saltguihighstate` allows reformatting of highstate data in a sorted and more readable format.
`json`, `yaml` and `nested` specify how all other output should be formatted. Only the first available of these formats is used.

## Time representation
The time formats used by Salt are very detailed and by default have 6 decimal digits to specify as accurate as nano-seconds. For most uses that is not needed. The fraction can be truncated to less digits by modifying salt master configuration file `/etc/salt/master`.
e.g.
```
saltgui_datetime_fraction_digits: 3
```
The value must be a number from 0 to 6.
Note that the effect is achieved by string truncation only. This is equivalent to always rounding downwards.

## Templates
SaltGUI supports command templates for easier command entry into the command-box.
The menu item for that becomes visible there when you define one or more templates
in salt master configuration file `/etc/salt/master`.
The field `targettype` supports the values `glob`, `list`, `compound` and `nodegroup`.
Entries will be sorted in the GUI based on their key.
You can leave out any detail field.
e.g.:
```
saltgui_templates:
    template1:
        description: First template
        target: "*"
        command: test.fib num=10
    template2:
        description: Second template
        targettype: glob
        target: dev*
        command: test.version
```

## Jobs
SaltGUI shows a maximum of 7 jobs in on the right-hand-side of the screen.
SaltGUI shows a maximum of 50 jobs on the dedicated jobs page.
Commands that are used internally in SaltGUI are hidden.

Additional commands to hide can be configured
in salt master configuration file `/etc/salt/master`.
e.g.:
```
saltgui_hide_jobs:
    - test.ping
```

Commands that are normally hidden can be made visible using configuration
in salt master configuration file `/etc/salt/master`.
e.g.:
```
saltgui_show_jobs:
    - grains.items
```

## Grains
Selected grains can be previewed on the Grains page.
The names of these grains can be configured
in salt master configuration file `/etc/salt/master`.
e.g.:
```
saltgui_preview_grains:
    - osrelease_info
```

## Pillars
Pillars potentially contain security senstitive information.
Therefore their values are initially hidden.
Values become visible by clicking on them.
This behavior can be changed by adjusting the values of the configuration
in salt master configuration file `/etc/salt/master`.
The values for the pillar whose name match one of these regular expressions
are initially shown.
e.g.:
```
saltgui_public_pillars:
    - pub_.*
```

## Development environment with Docker
To make life a bit easier for testing SaltGUI or setting up a local development environment you can use the provided docker-compose setup in this repository to run a saltmaster with three minions, including SaltGUI:
```
cd docker
docker-compose up
```
Then browse to [http://localhost:3333/](http://localhost:3333/), you can login with `salt:salt`.


## Testing
We provide some functional tests and unit tests. They use the docker setup to run the functional tests. You will also need [yarn](https://yarnpkg.com) and [node.js](https://nodejs.org/en/) to run them. When you have docker, yarn and node.js installed, you can run the tests from the root of the repository like this:
```
./runtests.sh
```

To show the browser window + a debugger while running the functional tests you can run:
```
NIGHTMARE_DEBUG=1 ./runtests.sh
```

We use the following testing libraries:
- [nightmare.js](https://github.com/segmentio/nightmare), for functional/browser tests
- [mocha](https://https://mochajs.org/), a well documented testing framework for javascript
- [chai](http://www.chaijs.com/), the preferred assertion library for testing

You'll need at least:
- `docker-compose` 1.12 or above
- `nodejs` 8.11 or above
- `yarn` 1.7 or above


## Contributing
Open a PR! Try to use no dependencies where possible, as vanilla JS is the aim. Any libraries will need to be heavily considered first. Please see the section above as PR's won't be reviewed if they don't pass the tests.


## Credits
This excellent frontend is originally written by [Oliver Dunk](https://github.com/oliverdunk).


## Changelog

## 1.15.0 (2019-06-02)
- choose number of jobs visible on Jobs page (erwindon, thx elipsion)
- fixed problems with element ids (erwindon, thx lordfolken)
- show beacon values (erwindon)
- summary line for all pages (erwindon)
- do not claim events after session timeout (erwindon)
- properly handle details refresh of jobs that have now expired (erwindon)
- add standard texts to table filter textfield (erwindon)
- do not use getElementById for non-unique elements (erwindon)
- use standard function for texts that apply 0, 1 or many times (erwindon)
- use asynchronous updates for Keys page (erwindon)
- prevent crash on NULL output (erwindon)
- small layout fixes (erwindon)

## 1.14.0 (2019-05-14)
- implemented management of beacons (erwindon)
- added search function for tables (erwindon)
- major cleanup of js-promise handling (erwindon)
- re-organized all menu item creations (erwindon)
- better validations on url parameters (erwindon)
- js and css code cleanups (erwindon)
- small layout fixes (erwindon)
- additional testing (dawidmalina)

## 1.13.0 (2019-04-27)
- improved indication for sorted tables (erwindon)
- display ip-number from likely common network (erwindon, thx jonathanuntalan-rfg)
- enhanced display of in-progress jobs (erwindon)
- introduced placeholders when suggesting incomplete commands (erwindon)
- added term/kill/signal commands to jobs and processes (erwindon)

## 1.12.0 (2019-04-14)
- improved tooltips; added tooltips on more places (erwindon)
- improved job summary: show number of succeeded/failed (erwindon)
- fixed small issue with display of pillars (erwindon)
- fixed small issue with display of schedules (erwindon)
- added job-details column to jobs overview (erwindon)
- code cleanup: use consistent callback names (erwindon)
- code cleanup: better use of the page framework (erwindon)
- fixed dates in changelog (dawidmalina)
- completed historic overview in changelog (erwindon)
- fixes for maximum text in columns (erwindon)
- fix datetime display; always obey set format (erwindon)
- fixed missing summary of changes for SaltGuiHighstate (erwindon)
- added original highstate output format (erwindon)
- updated salt version to 2019.2.0 for docker images (erwindon)
- all js code is now in modules (erwindon)
- some more small fixes (erwindon)

## 1.11.0 (2019-03-30)
- Migrated from yarn to npm (smarletta)
- Separated unit tests and functional tests (smarletta)
- Standardized filenames (smarletta)
- Converted to JS modules (smarletta)
- Added coverage report for unit tests (smarletta)
- Close job details now returns to previous page (dawidmalina)
- Fixed small layout issues (erwindon)
- Standardized internal api functions (erwindon)
- Removed some unused functions (erwindon)

## 1.10.1 (2019-02-24)
- Small bugfix for copy of ip-number (erwindon)

## 1.10.0 (2019-02-12)
- Improved navigation: made rows clickable (erwindon)
- Fixed invisible menu in small width screens (dawidmalina/erwindon)
- Set display of keys to monospace (erwindon)

## 1.9.0 (2019-02-06)
- Added more control over output format (erwindon)
- Added link to GitHub project on login page (dawidmalina)
- Added separate Jobs page (dawidmalina)
- Fixed some OS-icons (erwindon)
- Support more compact time notation (erwindon)
- Show popup menu's as early as possible (erwindon)
- Added separate Job Templates page (dawidmalina)
- Show which jobs are still running (erwindon)
- Added re-run functionality for jobs (erwindon/dawidmalina)

## 1.8.0 (2019-01-13)
- Improved testing support (erwindon/dawidmalina)
- Allow most tables to be sorted (erwindon/dawidmalina)
- Added support for non-secret pillars (erwindon/dawidmalina)
- Removed sub-sections from keys page, unaccepted now sorts first (erwindon)
- Fixed auto-copy (erwindon)
- Fixed issues with ip-number when multiple available, reported by dawidmalina (erwindon)
- Improved the general design (dawidmalina)
- Added OS images with the OS names, suggested by dawidmalina (erwindon)
- Added sync-grains and sync-pillars commands, suggested by dawidmalina (erwindon)

## 1.7.0 (2018-12-22)
- Allow some editing on grains info (erwindon)
- Allow some editing on schedules info (erwindon)
- Minimize handling of pillar values (erwindon)
- Fixes some text/html representation problems (erwindon)

## 1.6.0 (2018-12-15)
- Added page for grain info (erwindon)
- Added page for schedules info (erwindon)
- Added page for pillars info (erwindon)
- Celebrating almost 100 stars on GitHub

## 1.5.2 (2018-12-10)
- Added list of values for targetfield: minions+nodegroups, suggested by lostsnow (erwindon)

## 1.5.1 (2018-12-08)
- fixed named parameter issues reported by marceliq (erwindon)
- fixed result display for wheel/runner functions (erwindon)

## 1.5.0 (2018-12-03)
- added command templates (erwindon)
- added targettype nodegroups (lostsnow)

## 1.4.1 (2018-11-07)
- added selectable targettype (erwindon)
- improved state output (erwindon)
- various output improvements (erwindon)

## 1.4.0 (2018-10-20)
- Improved (high)state output (erwindon)
- Added collapsable output (erwindon)
- Format jobs same as direct command output (erwindon)
- Jobs can now be started asynchronously (erwindon)

## 1.3.0 (2018-09-28)
- Improved command parser (erwindon)
- Loads of ES6 code improvements and testing including linting (erwindon/maerteijn)
- Documentation view option in the command box (erwindon)
- Show job progress in job list (erwindon)
- Improved job detail (erwindon)

## 1.2.0 (2018-07-30)
- Addition of menu bar; separation of minion vs keys (erwindon)
- Added mysql as authentication method and retired auto and sharedsecret (erwindon)
- Added some responsive improvements

## 1.1.1 (2018-07-23)
- Support for several EAUTH authentication methods (erwindon)

## 1.1.0 (2018-07-16)
- Shows inactive minions as well (erwindon)
- Switch to a more reliable grain indicating the ip-number (erwindon)
- Added a logout button (erwindon)
- Improved minion loading page: first the keys and update them according to their status (erwindon)
- Fixed issue with session timeout (erwindon)
- Added keymanagement functionality (erwindon)
- Created a nice dropdown menu (erwindon)
- Improved ES6 code (erwindon)
- Added a close button to the command popup (erwindon)

## 1.0.1 (2018-05-16)
- Fixed position of popup when main window has scrolled (erwindon)
- Sort minions by hostname (erwindon)
- Fixed OS description in minion overview (No lsb_distrib_description)(erwindon)
- Now sort the jobs correctly on ``StartDate`` in the overview window

## 1.0.0 (2018-03-07)
- Original release with some styling fixes and with enabled highstate functionality.

## (2017-11-15)
- New maintainer (maerteijn)

## (2016-07-20)
- Initial version (oliverdunk)
