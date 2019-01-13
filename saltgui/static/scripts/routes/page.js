class PageRoute extends Route {

  constructor(path, name, page_selector, menuitem_selector, router) {
    super(path, name, page_selector, menuitem_selector, router);

    this._runCommand = this._runCommand.bind(this);
    this._updateMinions = this._updateMinions.bind(this);

    if(PageRoute.hasMenu === undefined) {
      const mainmenumini = document.querySelector("#mainmenumini");
      const menu = new DropDownMenu(mainmenumini);
      menu.addMenuItem("minions", function(evt) {
        window.location.replace("/");
      });
      menu.addMenuItem("keys", function(evt) {
        window.location.replace("/keys");
      });
      menu.addMenuItem("grains", function(evt) {
        window.location.replace("/grains");
      });
      menu.addMenuItem("schedules", function(evt) {
        window.location.replace("/schedules");
      });
      menu.addMenuItem("pillars", function(evt) {
        window.location.replace("/pillars");
      });
      menu.addMenuItem("jobs", function(evt) {
        window.location.replace("/jobs");
      });
      menu.addMenuItem("logout", function(evt) {
        const api = new API();
        api.logout().then(window.location.replace("/"));
      });
      PageRoute.hasMenu = true;
    }
  }

  _updateMinions(data) {
    const minions = data.return[0];

    const list = this.getPageElement().querySelector("#minions");
    const hostnames = Object.keys(minions).sort();

    // save for the autocompletion
    window.localStorage.setItem("minions", JSON.stringify(hostnames));

    for(const hostname of hostnames) {
      const minion_info = minions[hostname];

      // minions can be offline, then the info will be false
      if (minion_info === false) {
        this._updateOfflineMinion(list, hostname);
      } else {
        this._updateMinion(list, minion_info, hostname);
      }
    }
  }

  _getElement(container, id) {
    let element = document.getElementById(id);

    if(element === null) {
      // minion not found on screen...
      // construct a basic element that can be updated
      element = document.createElement("tr");
      element.id = id;
      container.appendChild(element);
      return element;
    }

    // remove existing content
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }

    return element;
  }

  _updateOfflineMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const offline = Route._createTd("status", "offline");
    offline.classList.add("offline");
    element.appendChild(offline);
  }

  _getBestIpNumber(minion) {
    if(!minion) return null;
    const ipv4 = minion.fqdn_ip4;
    if(!ipv4) return null;
    // either a string or something strange
    if(!Array.isArray(ipv4)) return ipv4;

    // so, it is an array

    // get the public IP number (if any)
    for(const s of ipv4) {
      // local = 127.0.0.0/8
      if(s.startsWith("127.")) continue;
      // private A = 10.0.0.0/8
      if(s.startsWith("10.")) continue;
      // private B = 172.16.0.0/20
      if(s.startsWith("172.16.")) continue;
      if(s.startsWith("172.17.")) continue;
      if(s.startsWith("172.18.")) continue;
      if(s.startsWith("172.19.")) continue;
      if(s.startsWith("172.20.")) continue;
      if(s.startsWith("172.21.")) continue;
      if(s.startsWith("172.22.")) continue;
      if(s.startsWith("172.23.")) continue;
      if(s.startsWith("172.24.")) continue;
      if(s.startsWith("172.25.")) continue;
      if(s.startsWith("172.26.")) continue;
      if(s.startsWith("172.27.")) continue;
      if(s.startsWith("172.28.")) continue;
      if(s.startsWith("172.29.")) continue;
      if(s.startsWith("172.30.")) continue;
      if(s.startsWith("172.31.")) continue;
      // private C = 192.168.0.0/16
      if(s.startsWith("192.168.")) continue;
      // not a local/private address, therefore it is public
      return s;
    }

    // no public IP number
    // get the private IP number (if any)
    for(const s of ipv4) {
      // local = 127.0.0.0/8
      if(s.startsWith("127.")) continue;
      // not a local address, therefore it is private
      return s;
    }

    // just pick the first one, should then be a local address
    return ipv4[0];
  }

  _updateMinion(container, minion, hostname) {

    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const ipv4 = this._getBestIpNumber(minion);
    if(ipv4) {
      const address = Route._createTd("status", ipv4);
      // ipnumbers do not sort well, reformat into something sortable
      const ipv4parts = ipv4.split(".");
      let sorttable_customkey = "";
      if(ipv4parts.length === 4) {
        // never mind adding '.'; this is only a sort-key
        for(let i = 0; i < 4; i++) sorttable_customkey += ipv4parts[i].padStart(3, "0");
        address.setAttribute("sorttable_customkey", sorttable_customkey);
      }
      address.classList.add("address");
      address.setAttribute("tabindex", -1);
      address.addEventListener("click", this._copyAddress);
      element.appendChild(address);
    } else {
      const accepted = Route._createTd("status", "accepted");
      accepted.classList.add("accepted");
      element.appendChild(accepted);
    }

    let saltversion = "---";
    if(minion && minion.saltversion) saltversion = minion.saltversion;
    if(minion) element.appendChild(Route._createTd("saltversion", saltversion));

    let os = "---";
    if(minion && minion.os && minion.osrelease) os = minion.os + " " + minion.osrelease;
    else if(minion && minion.os) os = minion.os;
    if(minion) {
      const td = Route._createTd("os", os);
      const img = document.createElement("img");
      img.setAttribute("src", "static/images/os-" + minion.os.toLowerCase() + ".png");
      img.classList.add("osimage");
      td.prepend(img);
      element.appendChild(td);
    }
  }

  _addMinion(container, hostname) {

    let element = document.getElementById(hostname);
    if(element !== null) {
      // minion already on screen...
      return;
    }

    element = document.createElement("tr");
    element.id = hostname;

    element.appendChild(Route._createTd("hostname", hostname));

    const minion = Route._createTd("status", "accepted");
    minion.classList.add("accepted");
    element.appendChild(minion);

    element.appendChild(Route._createTd("os", "loading..."));

    // fill out the number of columns to that of the header
    while(element.cells.length < container.tHead.rows[0].cells.length) {
      element.appendChild(Route._createTd("", ""));
    }

    container.tBodies[0].appendChild(element);
  }

  _addNone(container) {
    const tr = document.createElement("tr");
    const td = Route._createTd("hostname", "none");
    td.setAttribute("colspan", container.rows[0].cells.length);
    tr.appendChild(td);
    container.appendChild(tr);
  }

  _copyAddress(evt) {
    const target = evt.target;
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
  }

  _runCommand(evt, targetString, commandString) {
    this.router.commandbox._showManualRun(evt);
    const target = document.querySelector("#target");
    const command = document.querySelector("#command");
    target.value = targetString;
    command.value = commandString;
    // the menu may become (in)visible due to content of command field
    this.router.commandbox.cmdmenu.verifyAll();
  }

  _runStateApply(evt, hostname) {
    this._runCommand(evt, hostname, "state.apply");
  }

  _runAcceptKey(evt, hostname, extra) {
    this._runCommand(evt, hostname, "wheel.key.accept" + extra);
  }

  _runRejectKey(evt, hostname, extra) {
    this._runCommand(evt, hostname, "wheel.key.reject" + extra);
  }

  _runDeleteKey(evt, hostname, extra) {
    this._runCommand(evt, hostname, "wheel.key.delete" + extra);
  }
}
