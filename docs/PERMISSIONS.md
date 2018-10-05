# Permission settings

What users can do with SaltGUI is configured in salt using the `external_auth` configuration directive.
See the [EAUTH](https://docs.saltstack.com/en/latest/topics/eauth/index.html) documentation for more information.

## Quick start configuration
Let's take our example from the quickstart and explain what it means:
```
external_auth:
  pam:
    saltuser:            # the unix username which is allowed to login
      - .*               # allow to execute all modules

      - '@runner':
        - 'jobs.*'       # allows the job runner function to determine if jobs are running
      - '@wheel':
        - 'key.*'        # allows keys management and listing
      - '@jobs'          # allows acccess to the `/jobs` rest api
```

So this is a basic configuration which allows all of the basic functionality SaltGUI has to offer. Resticting access to
modules can be simply done by specifiying the modules like this
```
      ...
      - grains.items
      - sys.doc
      - state.apply
      - cmd.*
      ...
```

## Minimum permission settings

The following configuration is a mimimum (logical) set of permissions SaltGUI can work with:
```
external_auth:
  pam:
    saltuser:
      - grains.items
      - sys.doc
      - state.apply

      - '@wheel':
        - 'key.list'
```
