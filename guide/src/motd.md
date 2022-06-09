# Message-of-the-day

A message-of-the-day (motd) can be added to the login screen.
It can be used for any information, e.g.:

- legal statement
- system identification
- useful links to other systems
- informing users about system availability
- etc.

The text is stored in file `saltgui/static/salt-motd.txt` or `saltgui/static/salt-motd.html`. The first must be pre-formatted text only. The second one can contain full HTML text. Both are shown when they are present. Note that the message should not contain sensitive data, as its content is shown before logging in.

Alternatively, or additionally, the text can be retrieved from the `master` file entries `saltgui_motd_txt` and `saltgui_motd_html`. These entries can contain sensitive information because its content can only be retrieved after login. But it is still recommended to not let the text contain any sensitive data.
