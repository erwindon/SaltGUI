# Quick start using PAM as authentication method

- Install `salt-api` - this is available in the Salt PPA package which should already been installed if you're using Salt
- Open the master config /etc/salt/master
- Find `external_auth` and configure as following (see the note below!):

```
external_auth:
  pam:
    saltuser1:
      - .*
      - '@runner'
      - '@wheel'
      - '@jobs'
```

- See `docs/PERMISSIONS.md` for more restricted security configurations.
- The username 'saltuser1' is only an example. Generic accounts are not recommended, use personal accounts instead. Or use a user-group, see https://docs.saltproject.io/en/latest/topics/eauth/index.html for details.
- Multiple entries like `saltuser1` can be added when you have multiple users.
- `saltuser1` is a unix (PAM) user, make sure it exists or create a new one.
- At the bottom of this file, also setup the rest_cherrypi server to access SaltGUI from "http://localhost:3333" (or on any of the hostnames that the server has):

```
rest_cherrypy:
  port: 3333
  host: 0.0.0.0
  disable_ssl: true
  app: /srv/saltgui/index.html
  static: /srv/saltgui/static
  static_path: /static
```

- Note that the cherrypi server is part of the salt-api package and has no separate installation. It is configured using the master configuration file. When configured using the above configurations, both the api calls and the html/js files are served by the cherrypy server. Therefore no additional web application server is needed.
- Note that from the SaltGUI GIT repository, only the directory `saltgui` forms the actual SaltGUI web application.
- Replace each of the `/srv/saltgui` in the above config with the actual `saltgui` directory from the GIT repository. Alternatively, you can create a soft-link /src/saltgui that points to the actual saltgui directory.
- Restart everything with `pkill salt-master && pkill salt-api && salt-master -d && salt-api -d`
- You should be good to go. If you have any problems, open a GitHub issue. As always, SSL is recommended wherever possible but setup is beyond the scope of this guide.

**Note: With this configuration, the user has access to all salt modules available, maybe this is not what you want**

Please read the [Permissions](https://github.com/erwindon/SaltGUI/blob/master/guide/PERMISSIONS.md) page for more information.
