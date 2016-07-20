# SaltGUI

A new open source web interface for managing a SaltStack server. Built using vanilla ES6 and implemented as a wrapper around the rest_cherrypy server.

![dashboard](http://i.imgur.com/rNNLGIk.png)

## Features
- Login via PAM to an external API
- View minions and easily copy IPs
- Run state.highstate for a particular minion (button is present but not currenntly implemented)
- View the six most recent jobs run on Salt
- Manually run any Salt function and see the output

## Installation
- Documentation to be added soon (want to write it properly before publishing anything)
- For now, the suggested method for trying SaltGUI is to run it as a rest_cherrypi app. Running the client on a separate domain is possible, but requires NGINX in order to add headers allowing the browser to make requests.
- Open an issue if you can't figure something out, but https://github.com/Lothiraldan/saltpad/blob/master/docs/installation/salt-api-cherrypy-embedded.md may be a good place to start if you're willing to pick and choose which bits are relevent (of course, use SaltGUI rather than the SaltPad files).
- If you plan to use the API on a different domain, set this.APIURL in scripts/API.js to http://yourdomain.com

## Contributing
- Just open a PR! Try to use no dependencies where possible, as vanilla JS is the aim. Any libraries will need to be heavily considered first.
