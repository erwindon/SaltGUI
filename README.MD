# SaltGUI

A new open source web interface for managing a SaltStack server. Built using vanilla ES6 and implemented as a wrapper around the rest_cherrypy server.

## Screenshots
![job](http://i.imgur.com/cY8hoLL.png)
![dashboard](http://i.imgur.com/rNNLGIk.png)

## Features
- Login via PAM to an external API
- View minions and easily copy IPs
- Run state.highstate for a particular minion (button is present but not currenntly implemented)
- View the six most recent jobs run on Salt
- Manually run any Salt function and see the output

## Installation
- Install `salt-api` - this is available in the Salt PPA package which should already been installed if you're using Salt
- Open the master config /etc/salt/master
- Find `external_auth` and add a user as follows:
```
external_auth:
  pam:
    desiredSaltpadUsername:
      - .*
      - '@runner'
      - '@wheel'
      - '@jobs'
```
- Make sure to create this user, and set a password via the command line
- At the bottom of this file, also setup the rest_cherrypi server:
```rest_cherrypy:
  port: 8000
  host: 0.0.0.0
  disable_ssl: true
  app: /srv/salt-gui/index.html
  static: /srv/salt-gui/static
  static_path: /static
```
- Replace `/srv/salt-gui` in the above config with a directory containing SaltGUI.
- Restart everything with ``pkill salt-master && pkill salt-api && salt-master -d && salt-api -d``
- You should be good to go. If you have any problems, open a GitHub issue. As always, SSL is recommended wherever possible but setup is beyond the scope of this guide.
## Contributing
- Just open a PR! Try to use no dependencies where possible, as vanilla JS is the aim. Any libraries will need to be heavily considered first.
