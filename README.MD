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
        - 'jobs.*'
      - '@wheel':
        - 'key.*'
      - '@jobs'
```
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

## Development environment with Docker
To make life a bit easier for testing SaltGUI or setting up a local development environment you can use the provided docker-compose setup in this repository to run a saltmaster with two minions, including SaltGUI:
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
