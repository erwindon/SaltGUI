# Reduced menus

When apis are disabled using the native `external_auth` mechanism,
SaltGUI may show menu-items that have become unuseable.
In that case, it may be useful to reduce the menu-bar to less items.
Variable `saltgui_pages` is read from salt master configuration file `/etc/salt/master`.
It contains the list of accessible pages per user.
The first page in the list also becomes the landing page.
Users that are not listed still have the full menu.
e.g.:

```
saltgui_pages:
  user1:
    - keys
    - grains
```

Note that this is NOT a security mechanism to reduce what a user can do.
All pages are still accessible using their original deep-link.
And also any command can still be issued using the command-box.
For real security measures, use parameter `external_auth`.
