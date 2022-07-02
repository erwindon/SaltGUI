# Pillars

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
