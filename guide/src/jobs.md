# Jobs

SaltGUI shows a maximum of 7 jobs in on the right-hand-side of the screen.
SaltGUI shows a maximum of 50 jobs on the dedicated jobs page.
Commands that are used internally in SaltGUI are initially hidden.

On the Jobs page, more jobs can be made visible.
Select 'Show eligible jobs` to show all jobs that are not classified as internally-used jobs. Select 'Show all jobs` to show all jobs that are known to salt.

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
