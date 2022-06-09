# Key administration

In situations like cloud hosting, hosts may be deleted or shutdown frequently.
But Salt remembers the key status from both.
SaltGUI can compare the list of keys against a reference list.
The reference list is maintained as a text file, one minion per line.
First column is the minion name.
Second column is `false` when the minion is known to be absent due to machine shutdown.
It should be `true` otherwise.
When the second column is missing, this validation is not performed.
Lines starting with `#` are comment lines.
The filename is `saltgui/static/minions.txt`.
Differences with this file are highlighted on the Keys page.
Minions that are unexpectedly down are highlighted on the Minions page.
When the file is absent or empty, no such validation is done.
It is suggested that the file is generated from a central source,
e.g. the Azure, AWS or similar cloud portals; or from a company asset management list.
