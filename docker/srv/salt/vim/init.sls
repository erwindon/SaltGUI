{% from "vim/map.jinja" import vim with context %}

install vim package :
  pkg.installed:
    - pkgs:
      - {{ vim.package }}
