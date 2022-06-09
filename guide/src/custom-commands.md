# Custom command documentation

A custom HTML help text can be shown from the "Manual Run" overlay.

To use it,

- specify `saltgui_custom_command_help` in the salt master config. Example:

```
saltgui_custom_command_help: |
  <h2>Job Commands</h2>
    runners.jobs.active
      => Show active jobs

    runners.jobs.list_job «JID»
      => Show job with given job id (JID)
```

- Hover the documentation icon (`📖︎`) near the command input field and select `Show custom help`
