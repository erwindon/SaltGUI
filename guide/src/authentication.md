# Authentication

SaltGUI supports the following authentication methods supported by salt:

- pam
- file
- ldap
- mysql
- yubico

Since pam by itself is already very powerfull, that one is mentionned as standard.
By default, it provides access to the Linux password file,
When other authentication methods need to be used their names can be added to file `saltgui/static/salt-auth.txt`.
There is one name per line in that file. Choose the authentication methods that are activated
in the salt-master configuration wisely, as the integrity of the salt-master and all salt-minions depends on it.

See the [EAUTH documentation](https://docs.saltstack.com/en/latest/topics/eauth/index.html) and the [Salt auth source code](https://github.com/saltstack/salt/tree/master/salt/auth) for more information.
