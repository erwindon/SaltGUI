# Settings and statistics

By using ctrl-click on the SaltGUI logo in the top-left corner, an otherwise hidden page is made visible. The page shows the relevant settings from 3 categories on the left side and the api statistics on the right side.

First category contains the "session" details, which are the result of the login.
Second category contains the variables from the master file that are also relevant for SaltGUI.
The final category contains the variables that are specific to SaltGUI.
Simple variables with a limited range of values can be changed here for the duration of the current session. Permanent changes must be made in the master file.

The statistics panel is updated every 3 seconds.
Numeric fields that are known to contain timestamps are reformatted as readable strings.
Numeric fields that are known to contain durations are reformatted as readable strings.
Statistics for most threads that did not handle any requests yet are replaced by an empty string.
The amount of details shown depends on the parameter `collect_stats` in the `rest_cherrypy` block of the master file.
