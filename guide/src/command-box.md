# Command Box

SaltGUI supports entry of commands using the "command-box". Click on `>_` in the top right corner to open it.

Enter `salt-run` commands with the prefix `runners.`. e.g. `runners.jobs.last_run`. The target field can remain empty in that case as it is not used.

Enter `salt-call` commands with the prefix `wheel.`. e.g. `wheel.key.finger`. The target field will be added as named parameter `target`. But note that that parameter may not actually be used depending on the command.

Enter regular commands without special prefix. e.g. `test.ping`. The command is sent to the minions specified in the target field.

The text `##connected` in the target field will be immediatelly replaced by the list of connected
minions, or with `*` when all minions are connected, or with an expression when that is shorter.

Commands can be run normally, in which case the command runs to completion and shows the results. Alternatively, it can be started asynchronously, in which case only a bit of progress information is shown. When variable `state_events` is set to `true`, then the progress is shown per state when applicable. Batch commands are not supported at this time.
