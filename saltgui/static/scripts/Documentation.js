/* global document */

// documentation utilities

import {Character} from "./Character.js";
import {CommandBox} from "./CommandBox.js";
import {ParseCommandLine} from "./ParseCommandLine.js";
import {TargetType} from "./TargetType.js";
import {Utils} from "./Utils.js";

export class Documentation {

  // formatting of the documentation is done as a regular output type
  // that is therefore in output.js

  constructor (pRouter, pCommandBox) {
    this.router = pRouter;
    this.commandbox = pCommandBox;

    pCommandBox.cmdmenu.addMenuItem(
      () => Documentation._manualRunMenuSysDocPrepare(),
      () => this._manualRunMenuSysDocRun());
    pCommandBox.cmdmenu.addMenuItem(
      () => Documentation._manualRunMenuHtmlDocPrepare(),
      () => Documentation._manualRunMenuHtmlDocRun());
    pCommandBox.cmdmenu.addMenuItem(
      () => Documentation._manualRunMenuBeaconNamePrepare(),
      () => Documentation._manualRunMenuBeaconNameRun());
    pCommandBox.cmdmenu.addMenuItem(
      () => Documentation._manualRunMenuCustomHelpPrepare(),
      () => Documentation._manualRunMenuCustomHelpRun());

    Documentation.DOCUMENTATION_URL = "https://docs.saltstack.com/en/latest/ref/";
    Documentation.EXTERNAL_LINK = Character.NO_BREAK_SPACE + Character.EXTERNAL_LINK_IMG;

    Documentation.PROVIDERS = { };
  }

  // INTERNAL DOCUMENTATION

  static _manualRunMenuSysDocPrepare () {
    const targetField = document.getElementById("target");
    let target = targetField.value;
    target = target ? "target" : "all minions";

    const commandField = document.getElementById("command");
    const commandLine = commandField.value;

    const argsArray = [];
    const argsObject = {};
    ParseCommandLine.parseCommandLine(commandLine, argsArray, argsObject);

    if (!argsArray.length) {
      // No command entered yet (or only name-value pairs)
      return null;
    }

    if (typeof argsArray[0] !== "string") {
      return null;
    }

    const cmdFragments = Documentation.getKeywordFragments(commandLine);

    const category = cmdFragments.shift();
    let arg = "";
    if (cmdFragments.length) {
      arg = " " + cmdFragments.join(".");
    }

    if (category === "runners") {
      // actually "command" is not passed, but we select that part of the actual result
      // because `runners.doc.runner` always returns all documentation for "runners"
      return "Run 'runners.doc.runner" + arg + "'";
    }

    if (category === "wheel") {
      // actually "command" is not passed, but we select that part of the actual result
      // because `runners.doc.wheel` always returns all documentation for "wheel"
      return "Run 'runners.doc.wheel" + arg + "'";
    }

    return "Run 'sys.doc " + arg + "' on " + target;
  }

  _manualRunMenuSysDocRun () {
    const button = document.getElementById("run-command");
    if (button.disabled) {
      return;
    }
    const output = document.getElementById("popup-output");

    const targetField = document.getElementById("target");
    let target = targetField.value;
    // the help text is taken from the first minion that answers
    // when no target is selected, just ask all minions
    if (target === "") {
      target = "*";
    }

    const commandField = document.getElementById("command");
    const commandLine = commandField.value;
    const cmd = ParseCommandLine.getCommandFromCommandLine(commandLine);

    button.disabled = true;
    output.innerText = "loading...";

    let docCommand;
    let dummyCommand;
    if (cmd === "runners" || cmd.startsWith("runners.")) {
      // runners command. docCommand is WITHOUT further arguments
      docCommand = "runners.doc.runner";
      dummyCommand = "runners.doc.runner " + cmd;
    } else if (cmd === "wheel" || cmd.startsWith("wheel.")) {
      // wheel command. docCommand is WITHOUT further arguments
      docCommand = "runners.doc.wheel";
      dummyCommand = "runners.doc.wheel " + cmd;
    } else {
      // regular command. docCommand is WITH further argument
      docCommand = "sys.doc " + cmd;
      dummyCommand = "sys.doc " + cmd;
    }

    const targetType = TargetType.menuTargetType._value;

    const func = this.commandbox.getRunParams(targetType, target, docCommand, true);
    if (func === null) {
      return;
    }
    func.then((pResponse) => {
      CommandBox.onRunReturn(pResponse.return[0], dummyCommand);
      return true;
    }, (pResponse) => {
      CommandBox.onRunReturn("DOCUMENTATION ERROR:\n\n" + JSON.stringify(pResponse), dummyCommand);
      return false;
    });
  }

  // ONLINE DOCUMENTATION

  static _handleLocalTestProviders (data) {
    const providerlists = data.return[0];
    for (const host in providerlists) {

      // did we (not) get an answer from the minion?
      if (!providerlists[host]) {
        continue;
      }

      const providerlist = providerlists[host];
      for (let key in providerlist) {

        const value = providerlist[key];

        // Some Windows minions report module names
        // with this extra part, remove it
        if (key.endsWith(".cpython-35")) {
          key = key.substring(0, key.length - 11);
        }

        // This seems to be returned for the 'vsphere' module.
        // That is clearly a wrong answer, fix it.
        // See also https://github.com/saltstack/salt/issues/49332.
        if (key === "__init__" && value === "vsphere") {
          key = "vsphere";
        }

        // This is sometimes returned for the 'win_pkg' module.
        // That is clearly a wrong answer, fix it.
        if (key === "functools" && value === "pkg") {
          key = "win_pkg";
        }

        // This is sometimes returned for the 'win_lgpo' module.
        // That is clearly a wrong answer, fix it.
        if (key === "configparser" && value === "lgpo") {
          key = "win_lgpo";
        }

        // This is seems to be returned for the 'travisci' module.
        // That is clearly a wrong answer, fix it.
        if ((key === "parse" || key === "urlparse") && value === "travisci") {
          key = "travisci";
        }

        // create an initial empty mapping
        if (!Documentation.PROVIDERS[value]) {
          Documentation.PROVIDERS[value] = [];
        }

        // add the new mapping, prevent duplicates as
        // multiple minions provide (almost) the same answers
        if (Documentation.PROVIDERS[value].indexOf(key) < 0) {
          Documentation.PROVIDERS[value].push(key);
        }
      }
    }
  }

  static getKeywordFragments (pCommandLine) {

    const argsArray = [];
    const argsObject = {};
    ParseCommandLine.parseCommandLine(pCommandLine, argsArray, argsObject);

    // empty commandline
    if (!argsArray.length) {
      return ["modules"];
    }

    // first argument is not a string
    if (typeof argsArray[0] !== "string") {
      return ["modules"];
    }

    let cmd = argsArray[0].replace(/[.]*$/, "").split(".");

    // re-organize the command with its formal category
    switch (cmd[0]) {
    case "":
      cmd = ["modules"];
      break;
    case "runners":
      // we recognize this category
      break;
    case "wheel":
      // we recognize this category
      break;
    case "modules":
      // we recognize this category
      break;
    default:
      // all unknown categories are actually modules
      cmd.unshift("modules");
    }

    return cmd;
  }

  static _manualRunMenuHtmlDocPrepare () {
    const commandLine = document.querySelector(".run-command #command").value;
    const cmd = Documentation.getKeywordFragments(commandLine);
    return "Online reference for '" + cmd.join(".").replace(/^modules[.]/, "") + "'";
  }

  static _manualRunMenuHtmlDocRun () {
    const commandLine = document.querySelector(".run-command #command").value;
    const cmd = Documentation.getKeywordFragments(commandLine);

    // title line
    let html = "";
    html += "<h3>Documentation for '" + cmd.join(".").replace(/^modules[.]/, "") + "':</h3>";

    // level 0
    html += "<p><a href='" + Documentation.DOCUMENTATION_URL + "' target='_blank' rel='noopener'>Salt Module Reference</a>" + Documentation.EXTERNAL_LINK + "</p>";

    // level 1
    // Function getKeywordFragments makes sure that
    // the cmd array has at least one element.
    // The default is "modules"
    let pageTitle = "All '" + cmd[0] + "' modules";
    if (cmd[0] === "modules") {
      // the page title is different for this page
      // the link to the page must use the same title
      pageTitle = "All 'execution' modules";
    }
    html += "<p><a href='" + Documentation.DOCUMENTATION_URL + cmd[0] + "/all/index.html' target='_blank' rel='noopener'>" + pageTitle + "</a>" + Documentation.EXTERNAL_LINK + "</p>";

    // When the module is a virtual module, we want
    // to show all relevant concrete modules
    // only 'modules' can have virtual modules as these
    // are implemented on the minions and can be different
    // per minion. RUNNERS and WHEEL run on the master
    // and have no naming tricks.
    // Also note that some commands are named differently
    // in their implementation. e.g. "cmd.run" is actually "cmdmod.run".
    // This translation serves both purposes.
    let concreteModules = [];
    if (cmd.length >= 2) {

      // only 'modules' has a translation table
      // other categories are taken literal
      if (cmd[0] === "modules") {
        concreteModules = Documentation.PROVIDERS[cmd[1]];
        if (!concreteModules) {
          concreteModules = [];
        }
      } else {
        concreteModules = [cmd[1]];
      }

      if (Object.keys(Documentation.PROVIDERS).length === 0) {
        html += "<p>The documentation index has not been retrieved yet. We'll just assume this is a regular command.</p>";
        concreteModules = [cmd[1]];
      }

      switch (concreteModules.length) {
      case 0:
        html += "<p>'" + cmd[1] + "' is an unknown module name. We'll just assume it actually exists. The links below (if any) might not work.</p>";
        break;
      case 1:
        // simple modules case
        // wheel/runners cases are always simple
        if (cmd[0] !== "modules") {
          html += "<p>Module-name '" + cmd[0] + "." + cmd[1] + "' cannot be verified. We'll just assume it actually exists. The links below might not work.</p>";
        } else if (cmd[1] !== concreteModules[0]) {
          html += "<p>The internal name for '" + cmd[1] + "' is '" + concreteModules[0] + "'.</p>";
        }
        break;
      default:
        html += "<p>" + concreteModules.length + " variations of this module seem to be used. These all listed below.</p>";
      }
    }

    // See https://docs.saltstack.com/en/latest/ref/modules/all/index.html
    const knownVirtualModules = [
      "group",
      "kernelpkg",
      "pkg",
      "service",
      "shadow",
      "user"
    ];

    let indent = "";
    if (concreteModules.length > 1) {
      // only useful to indent level 3 information
      // when there are multiple instances available
      indent = Character.NO_BREAK_SPACE + Character.NO_BREAK_SPACE;
    }

    for (const concreteModule of concreteModules) {

      // level 2
      if (cmd.length >= 2) {
        html += "<p><a href='" + Documentation.DOCUMENTATION_URL + cmd[0] + "/all/salt." + cmd[0] + "." + concreteModule + ".html' target='_blank' rel='noopener'>Module '" + (cmd[0] + "." + concreteModule).replace(/^modules[.]/, "") + "'</a>" + Documentation.EXTERNAL_LINK + "</p>";
      }

      // level 3
      if (cmd.length >= 3) {
        html += "<p>Function-name '" + cmd[2] + "' cannot be verified here. We'll just assume it actually exists. The link below might not work.</p>";
        html += "<p>" + indent + "<a href='" + Documentation.DOCUMENTATION_URL + cmd[0] + "/all/salt." + cmd[0] + "." + concreteModule + ".html#salt." + cmd[0] + "." + concreteModule + "." + cmd[2] + "' target='_blank' rel='noopener'>Function '" + (cmd[0] + "." + concreteModule + "." + cmd[2]).replace(/^modules[.]/, "") + "'</a>" + Documentation.EXTERNAL_LINK + "</p>";
      }
    }

    if (cmd.length >= 2 && cmd[0] === "modules" && knownVirtualModules.indexOf(cmd[1]) >= 0) {
      html += "<p>The link below is the overview page of all related virtual package modules.</p>";
      html += "<p><a href='" + Documentation.DOCUMENTATION_URL + cmd[0] + "/all/salt." + cmd[0] + "." + cmd[1] + ".html' target='_blank' rel='noopener'>'" + cmd[0] + "." + cmd[1] + "' modules</a>" + Documentation.EXTERNAL_LINK + "</p>";
    }

    // grains?

    if (cmd.length >= 2 && cmd[0] === "modules" && cmd[1] === "grains") {
      html += "<p>It looks you are using grains. The link below gives the overview of the grains modules. </p>";
      html += "<p><a href='" + Documentation.DOCUMENTATION_URL + "grains/all/index.html' target='_blank' rel='noopener'>Grains Modules</a>" + Documentation.EXTERNAL_LINK + "</p>";
    }
    // no action for first parameter
    // there are extra pages for grains-functions,
    // but these are for the grains-providers
    // and not for individual grains

    // pillars?

    if (cmd.length >= 2 && cmd[0] === "modules" && cmd[1] === "pillar") {
      html += "<p>It looks you are using pillars. The link below gives the overview of the pillar modules. </p>";
      html += "<p><a href='" + Documentation.DOCUMENTATION_URL + "pillar/all/index.html' target='_blank' rel='noopener'>Pillar Modules</a>" + Documentation.EXTERNAL_LINK + "</p>";
    }
    // no action for first parameter
    // there are extra pages for pillar-functions,
    // but these are for the pillar-providers
    // and not for individual pillars

    // states?

    if (cmd.length >= 2 && cmd[0] === "modules" && cmd[1] === "state") {
      html += "<p>It looks you are using states. The link below gives the overview of the state modules. </p>";
      html += "<p><a href='" + Documentation.DOCUMENTATION_URL + "states/all/index.html' target='_blank' rel='noopener'>State Modules</a>" + Documentation.EXTERNAL_LINK + "</p>";
    }
    // no action for first parameter
    // there are extra pages for state-functions,
    // but these are for the state-providers
    // and not for individual states

    // cloud?

    if (cmd.length >= 2 && cmd[0] === "modules" && cmd[1] === "cloud") {
      html += "<p>It looks you are using cloud. The link below gives the overview of the cloud modules. </p>";
      html += "<p><a href='" + Documentation.DOCUMENTATION_URL + "clouds/all/index.html' target='_blank' rel='noopener'>Cloud Modules</a>" + Documentation.EXTERNAL_LINK + "</p>";
    }
    // no action for first parameter
    // there are extra pages for cloud-functions,
    // but these are for the cloud-providers
    // and not for individual clouds

    // beacons?

    if (cmd.length >= 2 && cmd[0] === "modules" && cmd[1] === "beacons") {
      html += "<p>It looks you are using beacons. The link below gives the overview of the beacons modules. </p>";
      html += "<p><a href='" + Documentation.DOCUMENTATION_URL + "beacons/all/index.html' target='_blank' rel='noopener'>Beacon Modules</a>" + Documentation.EXTERNAL_LINK + "</p>";
    }

    // also provide information about individual beacons

    const argsArray = [];
    const argsObject = {};
    ParseCommandLine.parseCommandLine(commandLine, argsArray, argsObject);

    if (cmd.length >= 3 && cmd[0] === "modules" && cmd[1] === "beacons" && ["add", "modify"].indexOf(cmd[2]) >= 0 && argsArray.length >= 2 && typeof argsArray[1] === "string") {
      const beaconName = argsArray[1];
      html += "<p>Beacon-name '" + beaconName + "' cannot be verified. We'll just assume it actually exists. The link below might not work.</p>";
      html += "<p><a href='" + Documentation.DOCUMENTATION_URL + "beacons/all/salt.beacons." + beaconName + ".html' target='_blank' rel='noopener'>Beacon Module '" + beaconName + "'</a>" + Documentation.EXTERNAL_LINK + "</p>";
    }

    const output = document.querySelector(".run-command pre");
    output.innerHTML = html;
  }

  static _manualRunMenuBeaconNamePrepare () {
    const commandLine = document.querySelector(".run-command #command").value;
    if (!commandLine.startsWith("beacons.add ")) {
      return null;
    }
    return "List standard beacon names";
  }

  static _manualRunMenuBeaconNameRun () {
    const beaconsList = {
      "adb": `
                {
                  "states": [
                    "offline",
                    "unauthorized",
                    "missing"
                  ],
                  "no_devices_event": "True",
                  "battery_low": 25,
                  "interval": 3600
                }`,
      "aix_account": `
                {
                  "user": "ALL",
                  "interval": 3600
                }`,
      "avahi_announce": `
                {
                  "run_once": "True",
                  "interval": 3600
                }`,
      "bonjour_announce": `
                {
                  "run_once": "True",
                  "interval": 3600
                }`,
      "btmp": `
                {
                  "users": {
                    "gareth": null
                  },
                  "defaults": {
                    "time_range": {
                      "start": "8am",
                      "end": "4pm"
                    }
                  },
                  "users": {
                    "gareth": {
                      "time_range": {
                        "start": "8am",
                        "end": "4pm"
                      }
                    }
                  },
                  "defaults": {
                    "time_range": {
                      "start": "8am",
                      "end": "4pm"
                    }
                  },
                  "groups": {
                    "users": {
                      "time_range": {
                        "start": "8am",
                        "end": "4pm"
                      }
                    }
                  },
                  "defaults": {
                    "time_range": {
                      "start": "8am",
                      "end": "4pm"
                    }
                  },
                  "interval": 3600
                }`,
      "cert_info": `
                {
                  "files": [
                    "/etc/pki/tls/certs/mycert.pem",
                    {
                      "/etc/pki/tls/certs/yourcert.pem": {
                        "notify_days": 15
                      }
                    },
                    "/etc/pki/tls/certs/ourcert.pem"
                  ],
                  "notify_days": 45,
                  "interval": 86400
                }`,
      "diskusage": `
                {
                  "interval": 120
                }`,
      "glxinfo": `
                {
                  "user": "frank",
                  "interval": 3600
                }`,
      "haproxy": `
                {
                  "backends": {
                    "www-backend": {
                      "threshold": 45,
                      "servers": [
                        "web1",
                        "web2"
                      ]
                    }
                  },
                  "interval": 120
                }`,
      "imgadm": `
                {
                  "interval": 60
                }`,
      "inotify": `
                {
                  "files": {
                    "/path/to/file/or/dir": {
                      "mask": [
                        "open",
                        "create",
                        "close_write"
                      ],
                      "recurse": "True",
                      "auto_add": "True",
                      "exclude": [
                        "/path/to/file/or/dir/exclude1",
                        "/path/to/file/or/dir/exclude2",
                        {
                          "/path/to/file/or/dir/regex[a-m]*$": {
                            "regex": "True"
                          }
                        }
                      ]
                    }
                  },
                  "coalesce": "True",
                  "interval": 3600
                }`,
      "journald": `
                {
                  "services": {
                    "sshd": {
                      "SYSLOG_IDENTIFIER": "sshd",
                      "PRIORITY": 6
                    }
                  },
                  "interval": 3600
                }`,
      "junos_rre_keys": `
                {
                  "interval": 43200
                }`,
      "load": `
                {
                  "averages": {
                    "1m": [
                      0,
                      2
                    ],
                    "5m": [
                      0,
                      1.5
                    ],
                    "15m": [
                      0.1,
                      1
                    ]
                  },
                  "emitatstartup": true,
                  "onchangeonly": false,
                  "interval": 3600
                }`,
      "log": `
                {
                  "file": "/var/log/messages",
                  "tags": {
                    "goodbye/world": {
                      "regex": ".*good-bye.*"
                    }
                  },
                  "interval": 3600
                }`,
      "memusage": `
                {
                  "percent": "63%",
                  "interval": 60
                }`,
      "napalm": `
                {
                  "net.interfaces": {
                    "*": {
                      "is_up": false
                    }
                  },
                  "net.interfaces": {
                    "xe-0/0/0": {
                      "is_up": false
                    }
                  },
                  "ntp.stats": {
                    "synchronized": false
                  },
                  "ntp.stats": {
                    "_args": [
                      "172.17.17.2"
                    ],
                    "synchronized": false
                  },
                  "ntp.stats": {
                    "stratum": "> 5"
                  },
                  "interval": 3600
                }`,
      "network_info": `
                {
                  "interfaces": {
                    "eth0": {
                      "type": "greater",
                      "bytes_sent": 100000,
                      "bytes_recv": 100000,
                      "packets_sent": 100000,
                      "packets_recv": 100000,
                      "errin": 100,
                      "errout": 100,
                      "dropin": 100,
                      "dropout": 100
                    }
                  },
                  "interval": 3600
                }`,
      "network_settings": `
                {
                  "coalesce": "True",
                  "interval": 3600
                }`,
      "pkg": `
                {
                  "pkgs": [
                    "zsh",
                    "apache2"
                  ],
                  "refresh": "True",
                  "interval": 3600
                }`,
      "proxy_example": `
                {
                  "endpoint": "beacon",
                  "interval": 3600
                }`,
      "ps": `
                {
                  "processes": {
                    "salt-master": "running",
                    "mysql": "stopped"
                  },
                  "interval": 3600
                }`,
      "salt_monitor": `
                {
                  "salt_fun": "test.ping",
                  "slsutil.renderer": {
                    "args": [
                      "salt://states/apache.sls"
                    ],
                    "kwargs": [
                      {
                        "default_renderer": "jinja"
                      }
                    ]
                  },
                  "interval": 3600
                }`,
      "salt_proxy": `
                {
                  "proxies": {
                    "p8000": {},
                    "p8001": {}
                  },
                  "interval": 3600
                }`,
      "sensehat": `
                {
                  "sensors": {
                    "humidity": "70%",
                    "temperature": [
                      20,
                      40
                    ],
                    "temperature_from_pressure": 40,
                    "pressure": 1500
                  },
                  "interval": 3600
                }`,
      "service": `
                {
                  "services": {
                    "salt-master": {},
                    "mysql": {}
                  },
                  "interval": 3600
                }`,
      "sh": `
                {
                  "interval": 3600
                }`,
      "status": `
                {
                  "interval": 3600
                }`,
      "swapusage": `
                {
                  "percent": "13%",
                  "interval": 60
                }`,
      "telegram_bot_msg": `
                {
                  "token": "<bot access token>",
                  "interval": 3600
                }`,
      "twilio_txt_msg": `
                {
                  "account_sid": "<account sid>",
                  "interval": 3600
                }`,
      "vmadm": `
                {
                  "interval": 60
                }`,
      "watchdog": `
                {
                  "directories": {
                    "/path/to/dir": {
                      "mask": [
                        "create",
                        "modify",
                        "delete",
                        "move"
                      ]
                    }
                  },
                  "interval": 3600
                }`,
      "wtmp": `
                {
                  "users": {
                    "gareth": null
                  },
                  "defaults": {
                    "time_range": {
                      "start": "8am",
                      "end": "4pm"
                    }
                  },
                  "users": {
                    "gareth": {
                      "time_range": {
                        "start": "7am",
                        "end": "3pm"
                      }
                    }
                  },
                  "defaults": {
                    "time_range": {
                      "start": "8am",
                      "end": "4pm"
                    }
                  },
                  "groups": {
                    "users": {
                      "time_range": {
                        "start": "7am",
                        "end": "3pm"
                      }
                    }
                  },
                  "defaults": {
                    "time_range": {
                      "start": "8am",
                      "end": "4pm"
                    }
                  },
                  "interval": 3600
                }`
    };

    const beaconsListAvailableStr = Utils.getStorageItem("session", "beacons_list_available", "[]");
    const beaconsListAvailable = JSON.parse(beaconsListAvailableStr);

    // show the beacon names
    let html = "<p>Choose a template for 'beacons.add'</p>";
    html += "<p>Using a template will completely replace the current command</p>";

    let headerShown1 = false;
    for (const beaconName in beaconsList) {
      if (beaconName.startsWith("_")) {
        continue;
      }
      if (beaconName in beaconsListAvailable && beaconsListAvailable[beaconName] === beaconsListAvailable["_cnt"]) {
        if (!headerShown1) {
          html += "<p>&nbsp;</p>";
          html += "<p>beacons available on all minions:</p>";
          headerShown1 = true;
        }
        html += "<p>&nbsp;&nbsp;<a id='beaconname'>" + beaconName + "</a></p>";
      }
    }

    let headerShown2 = false;
    for (const beaconName in beaconsList) {
      if (beaconName === "_cnt") {
        continue;
      }
      if (beaconName in beaconsListAvailable && beaconsListAvailable[beaconName] !== beaconsListAvailable["_cnt"]) {
        if (!headerShown2) {
          html += "<p>&nbsp;</p>";
          html += "<p>beacons available on some minions:</p>";
          headerShown2 = true;
        }
        html += "<p>&nbsp;&nbsp;<a id='beaconname'>" + beaconName + "</a> (" + beaconsListAvailable[beaconName] + " of " + beaconsListAvailable["_cnt"] + ")</p>";
      }
    }

    let headerShown3 = false;
    for (const beaconName in beaconsListAvailable) {
      if (beaconName.startsWith("_")) {
        continue;
      }
      if (!(beaconName in beaconsList)) {
        if (!headerShown3) {
          html += "<p>&nbsp;</p>";
          html += "<p>beacons available on one or more minions, but no template available:</p>";
          headerShown3 = true;
        }
        html += "<p>&nbsp;&nbsp;" + beaconName;
        if (beaconsListAvailable[beaconName] !== beaconsListAvailable["_cnt"]) {
          html += " (" + beaconsListAvailable[beaconName] + " of " + beaconsListAvailable["_cnt"] + ")";
        }
        html += "</p>";
      }
    }

    let headerShown4 = false;
    for (const beaconName in beaconsList) {
      if (beaconName === "_cnt") {
        continue;
      }
      if (!(beaconName in beaconsListAvailable)) {
        if (!headerShown4) {
          html += "<p>&nbsp;</p>";
          if (beaconsListAvailable.length === 0) {
            html += "<p>all known standard beacons:</p>";
          } else {
            html += "<p>beacons not available on any minion:</p>";
          }
          headerShown4 = true;
        }
        html += "<p>&nbsp;&nbsp;<a id='beaconname'>" + beaconName + "</a></p>";
      }
    }

    if (beaconsListAvailable.length === 0) {
      html += "<p>&nbsp;</p>";
      html += "<p>no information is available on the availability of the beacon types on the minions, that information is still being loaded in the background</p>";
    } else if (beaconsListAvailable["_offline"] > 0) {
      html += "<p>&nbsp;</p>";
      html += "<p>some minions are offline and therefore did not provide information about available beacon types</p>";
    }

    const output = document.querySelector(".run-command pre");
    output.innerHTML = html;

    // activate the links
    for (const atag of output.querySelectorAll("a")) {
      atag.addEventListener("click", (pClickEvent) => {
        const commandLine = document.querySelector(".run-command #command");
        const beaconName = atag.innerText;
        const beaconValue = [JSON.parse(beaconsList[beaconName])];
        if ("interval" in beaconValue[0]) {
          const interval = beaconValue[0]["interval"];
          delete beaconValue[0]["interval"];
          beaconValue.push({"interval": interval});
        }
        commandLine.value = "beacons.add " + beaconName + " " + JSON.stringify(beaconValue);
        pClickEvent.stopPropagation();
      });
    }
  }

  static _manualRunMenuCustomHelpPrepare () {
    const customHelp = Utils.getStorageItem("session", "custom_command_help");
    if (!customHelp) {
      return null;
    }
    return "Show custom help";
  }

  static _manualRunMenuCustomHelpRun () {
    const customHelp = Utils.getStorageItem("session", "custom_command_help");
    const output = document.querySelector(".run-command pre");
    output.innerHTML = customHelp;
  }
}
