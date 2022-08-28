# Permission settings

What users can do with SaltGUI is configured in salt using the `external_auth` configuration directive.
See the [EAUTH](https://docs.saltstack.com/en/latest/topics/eauth/index.html) documentation for more information.

## Alternative configuration
The default configuration from the quickstart allows all commands.
Here is an example with a more detailed configuration:
```
external_auth:
    pam:
        saltuser:            # the unix username which is allowed to login
            - .*             # allow to execute all modules

            - '@jobs'        # allows acccess to the `/jobs` rest api
            - '@runner':
                - 'jobs.*'   # allows the job runner function to determine if jobs are running
                             # but no other runner commands
            - '@wheel':
                - 'key.*'    # allows keys management and listing
                             # but no other wheel commands
                - 'config.values'
```

So this is a basic configuration which allows some of the basic functionality SaltGUI has to offer.
Resticting access to modules can be simply done by replacing a wildcard and specifiying explicit details like this:
```
        ...
        - grains.items
        - sys.doc
        - state.apply
        - cmd.*
        ...
```

## Minimum permission settings

The following configuration is a mimimum set of permissions, so that SaltGUI can populate its screens:
```
        - beacons.list
        - grains.items
        - pillar.items
        - pillar.obfuscate
        - schedule.list
        - '@runner':
            - jobs.active
            - jobs.list_job
            - jobs.list_jobs
            - manage.versions
        - '@wheel':
            - config.values
            - key.finger
            - key.list_all
            - minions.connected
```
Adititional permissions are needed to run the commands associated with the popupmenu items.
These commands are clearly visible in the gui, and are not listed here.

SaltGUI is designed to cope with any API failure, whether due to authorization issues, or due to technical issues.
Please report any deviations from that.
