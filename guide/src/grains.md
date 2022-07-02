# Grains

Selected grains can be previewed on the Grains page.
The names of these grains can be configured
in salt master configuration file `/etc/salt/master`.
e.g.:

```
saltgui_preview_grains:
    - "osrelease_info"
```

The names can be specified as simple names like the example above.
Alternatively, the [grains.get](https://docs.saltstack.com/en/latest/ref/modules/all/salt.modules.grains.html#salt.modules.grains.get) notation can be used to get more detailed information. The separator is always `:`. e.g. `locale_info:timezone`.
Alternatively, the [jsonpath](https://www.w3resource.com/JSON/JSONPath-with-JavaScript.php) notation can be used to allow even more freedom. Jsonpath is used when the text starts with a `$`. e.g. `$.ip4_interfaces.eth0[0]`.
