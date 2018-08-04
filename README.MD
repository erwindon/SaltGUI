# SaltGUI

A new open source web interface for managing a SaltStack server. Built using vanilla ES6 and implemented as a wrapper around the rest_cherrypy server.


## Screenshots
![overview](/docs/overview.png)
![job](/docs/job.png)


## Features
- Login via PAM or any other supported authentication by Salt
- View minions and easily copy IPs
- Run state.highstate for a particular minion
- View the seven most recent jobs run on Salt
- Manually run any Salt function and see the output


## Quick start using PAM as authentication method
- Install `salt-api` - this is available in the Salt PPA package which should already been installed if you're using Salt
- Open the master config /etc/salt/master
- Find `external_auth` and add a user as follows:
```
external_auth:
  pam:
    desiredSaltGuiUsername:
      - .*
      - '@runner'
      - '@wheel'
      - '@jobs'
```
- Make sure to create this user, and set a password via the command line
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

## Authentication
SaltGUI supports the following authentication methods supported by salt:
- pam
- file
- ldap
- mysql
- yubico

See the [EAUTH documentation](https://docs.saltstack.com/en/latest/topics/eauth/index.html) and the [Salt auth source code](https://github.com/saltstack/salt/tree/2018.3/salt/auth) for more information.

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

We use the following testing libraries:
- [nightmare.js](https://github.com/segmentio/nightmare), for functional/browser tests
- [mocha](https://https://mochajs.org/), a well documented testing framework for javascript 
- [chai](http://www.chaijs.com/), the preferred assertion library for testing

You'll need at least:
- `docker-compose` 1.12 or above
- `nodejs` 8.11.x or above
- `yarn` 1.7.0 or above


## Contributing
Open a PR! Try to use no dependencies where possible, as vanilla JS is the aim. Any libraries will need to be heavily considered first. Please see the section above as PR's won't be reviewed if they don't pass the tests.


## Credits
This excellent frontend is originally written by [Oliver Dunk](https://github.com/oliverdunk).

## Changelog

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
