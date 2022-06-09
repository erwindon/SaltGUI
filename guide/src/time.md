# Time representation

The time formats used by Salt are very detailed and by default have 6 decimal digits to specify as accurate as nano-seconds. For most uses that is not needed. The fraction can be truncated to less digits by modifying salt master configuration file `/etc/salt/master`.
e.g.

```
saltgui_datetime_fraction_digits: 3
```

The value must be a number from 0 to 6.
Note that the effect is achieved by string truncation only. This is equivalent to always rounding downwards.

How the date and times that are shown can also be changed.
e.g.:

```
saltgui_datetime_representation: utc
```

The value must be `utc`, `local`, `utc-localtime` or `local-utctime`.
With `utc`, only the UTC date and time are shown.
With `local`, only the local date and time are shown. This includes an indication of the timezone.
With `utc-localtime`, the UTC date and time are shown. Additionally, the local time (not the local date) is shown.
With `local-utctime`, the local date and time are shown. Additionally, the UTC time (not the UTC date) is shown.
In all cases, a tooltip is added to a date+time field that shows the full representation of the date and time in both the local timezone and in UTC.
