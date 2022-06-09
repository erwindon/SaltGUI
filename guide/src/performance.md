# Performance

SaltGUI does not have artificial restrictions.
But displaying all data may be slow when there is a lot of data.
Most notorious is the display of a highstate with hundreds of minions, each with douzens of states.
SaltGUI can be forced to use a slightly simpler output by setting a parameter in salt master configuration file `/etc/salt/master`.
e.g.:

```
saltgui_tooltip_mode: simple
```

This parameter forces SaltGUI to use a very simple tooltip representation.
This is then the built-in version from the brower.
Typical effect is that it is shown slightly delayed and that is looks a bit primitive.
The only other allowed value is "none", with the effect that no tooltips are shown at all.
