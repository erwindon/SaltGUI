# Output

SaltGUI shows the data that is returned by the Salt API.
Some variation can be achieved by modifying salt master configuration file `/etc/salt/master`.
e.g. (the default)

```
saltgui_output_formats: doc,saltguihighstate,json
```

`doc` allows reformatting of documentation output into more readable format. Also implies that only the result from one minion is used.
`saltguihighstate` allows reformatting of highstate data in a sorted and more readable format.
`json`, `yaml` and `nested` specify how all other output should be formatted. Only the first available of these formats is used.
