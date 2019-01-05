{%- if grains['os_family'] == 'Debian' %}
  {%- set package = "vim" %}
{%- elif grains['os_family'] == 'RedHat' %}
  {%- set package = "vim-enhanced" %}
{%- endif %}
requirements:
  pkg.installed:
    - pkgs:
      - {{ package }}
