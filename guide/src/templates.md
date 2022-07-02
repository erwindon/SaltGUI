# Templates

SaltGUI supports command templates for easier command entry into the command-box.
The menu item for that becomes visible there when you define one or more templates
in salt master configuration file `/etc/salt/master`.
The field `targettype` supports the values `glob`, `list`, `compound` and `nodegroup`.
Entries will be sorted in the GUI based on their key.
You can leave out any detail field.
e.g.:

```
saltgui_templates:
    template1:
        description: First template
        target: "*"
        command: test.fib num=10
    template2:
        description: Second template
        targettype: glob
        target: dev*
        command: test.version
```

When there are a lot of templates, they can be organized into categories.
e.g.:

```
saltgui_templates:
    template1:
        description: First template
        target: "*"
        command: test.fib num=10
        category: cat1
    template2:
        description: Second template
        targettype: glob
        target: dev*
        command: test.version
        categories:
          - cat1
          - cat2
```

When at least one template is assigned to a category, then you can select a template category before
selecting the actual category. Otherwise that choice remains hidden. Templates can be in multiple categories
when a list of categories is assigned.
