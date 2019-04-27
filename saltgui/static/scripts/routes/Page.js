import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {Route} from './Route.js';
import {TargetType} from '../TargetType.js';
import {Utils} from '../Utils.js';

export class PageRoute extends Route {

  constructor(path, name, page_selector, menuitem_selector, router) {
    super(path, name, page_selector, menuitem_selector, router);

    this._runCommand = this._runCommand.bind(this);
    this._handleRunnerJobsActive = this._handleRunnerJobsActive.bind(this);
    this._startRunningJobs = this._startRunningJobs.bind(this);
    this._handleRunnerJobsListJobs = this._handleRunnerJobsListJobs.bind(this);
    this._updateMinions = this._updateMinions.bind(this);
  }

  _updateMinions(data) {
    const minions = data.return[0];

    const list = this.getPageElement().querySelector("#minions");
    const hostnames = Object.keys(minions).sort();

    // save for the autocompletion
    window.localStorage.setItem("minions", JSON.stringify(hostnames));

    const ipNumberPrefixes = this._getIpNumberPrefixes(minions);

    for(const hostname of hostnames) {
      const minion_info = minions[hostname];

      // minions can be offline, then the info will be false
      if(minion_info === false) {
        this._updateOfflineMinion(list, hostname);
      } else {
        this._updateMinion(list, minion_info, hostname, minions);
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

  _getIpNumberPrefixes(allMinions) {
    // First we gather all (resonable) prefixes
    // Only use byte-boundaries for networks
    // Must match a subnet of A, B or C network
    const prefixes = { };
    for(const minion in allMinions) {
      const grains = allMinions[minion];
      if(!grains.fqdn_ip4) continue;
      if(!Array.isArray(grains.fqdn_ip4)) continue;
      for(const ip of grains.fqdn_ip4) {
        const parts = ip.split(".");
        if(ip.startsWith("10.")) {
          prefixes[parts[0] + "."] = true;
        }
        if(ip.startsWith("10.") ||
           ip.startsWith("172.16.") ||
           ip.startsWith("172.17.") ||
           ip.startsWith("172.18.") ||
           ip.startsWith("172.19.") ||
           ip.startsWith("172.20.") ||
           ip.startsWith("172.21.") ||
           ip.startsWith("172.22.") ||
           ip.startsWith("172.23.") ||
           ip.startsWith("172.24.") ||
           ip.startsWith("172.25.") ||
           ip.startsWith("172.26.") ||
           ip.startsWith("172.27.") ||
           ip.startsWith("172.28.") ||
           ip.startsWith("172.29.") ||
           ip.startsWith("172.30.") ||
           ip.startsWith("172.31.") ||
           ip.startsWith("192.168.")) {
          prefixes[parts[0] + "." + parts[1] + "."] = true;
          prefixes[parts[0] + "." + parts[1] + "." + parts[2] + "."] = true;
        }
      }
    }

    // Then we look whether each minion uses the prefix
    // When at least one minion does not use the subnet,
    //    then it is not a suitable subnet
    for(const p in prefixes) {
      for(const minion in allMinions) {
        let cnt = 0;
        const grains = allMinions[minion];
        if(!grains.fqdn_ip4) continue;
        if(!Array.isArray(grains.fqdn_ip4)) continue;
        for(const ip of grains.fqdn_ip4) {
          if(!ip.startsWith(p)) continue;
          cnt++;
        }
        // multiple or unused?
        //    then it is not a suitable subnet
        if(cnt !== 1) {
          prefixes[p] = false;
          break;
        }
      }
    }

    // actually remove the unused prefixes
    for(const p in prefixes) {
      if(!prefixes[p]) {
        delete prefixes[p];
      }
    }

    return prefixes;
  }

  _getBestIpNumber(minion, prefixes) {
    if(!minion) return null;
    const ipv4 = minion.fqdn_ip4;
    if(!ipv4) return null;
    // either a string or something strange
    if(!Array.isArray(ipv4)) return ipv4;

    // so, it is an array

    // get the public IP number (if any)
    for(const s of ipv4) {
      // See https://nl.wikipedia.org/wiki/RFC_1918
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

    // No public IP was found
    // Use a common prefix in all available IP numbers
    // get the private IP number (if any)
    // when it matches one of the common prefixes
    for(const p in prefixes) {
      for(const s of ipv4) {
        if(s.startsWith(p)) return s;
      }
    }

    // no luck...
    // try again, but without the restrictions
    for(const s of ipv4) {
      // C = 192.168.x.x
      if(s.startsWith("192.168.")) return s;
    }
    for(const s of ipv4) {
      // B = 172.16.0.0 .. 172.31.255.255
      // never mind the sub-ranges
      if(s.startsWith("172.")) return s;
    }
    for(const s of ipv4) {
      // A = 10.x.x.x
      if(s.startsWith("10.")) return s;
    }

    // just pick the first one, should then be a local address (127.x.x.x)
    return ipv4[0];
  }

  _updateMinion(container, minion, hostname, prefixes) {

    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const ipv4 = this._getBestIpNumber(minion, prefixes);
    if(ipv4) {
      const addressTd = Route._createTd("status", "");
      const addressSpan = Route._createSpan("status2", ipv4);
      addressTd.appendChild(addressSpan);
      // ipnumbers do not sort well, reformat into something sortable
      const ipv4parts = ipv4.split(".");
      let sorttable_customkey = "";
      if(ipv4parts.length === 4) {
        // never mind adding '.'; this is only a sort-key
        for(let i = 0; i < 4; i++) sorttable_customkey += ipv4parts[i].padStart(3, "0");
        addressTd.setAttribute("sorttable_customkey", sorttable_customkey);
      }
      addressTd.classList.add("address");
      addressTd.setAttribute("tabindex", -1);
      addressSpan.addEventListener("click", this._copyAddress);
      addressSpan.addEventListener("mouseout", this._restoreClickToCopy);
      Utils.addToolTip(addressSpan, "Click to copy");
      element.appendChild(addressTd);
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
      if(minion.os) {
        const img = document.createElement("img");
        img.setAttribute("src", "static/images/os-" + minion.os.replace(" ", "-").toLowerCase() + ".png");
        img.classList.add("osimage");
        td.prepend(img);
      }
      element.appendChild(td);
    }
  }

  _addMinion(container, hostname, freeColumns = 0) {

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
    while(element.cells.length < container.tHead.rows[0].cells.length - freeColumns) {
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

  _handleRunnerJobsListJobs(data, hasHeader = false, numberOfJobs = 7) {
    const jobContainer = this.getPageElement().querySelector(".jobs tbody");
    const jobs = this._jobsToArray(data.return[0]);
    this._sortJobs(jobs);

    // Add <numberOfJobs> most recent jobs
    let shown = 0;
    let i = 0;
    while(shown < numberOfJobs && jobs[i] !== undefined) {
      const job = jobs[i];
      i = i + 1;

      // These jobs are likely started by the SaltGUI
      // do not display them
      if(job.Function === "grains.append") continue;
      if(job.Function === "grains.delkey") continue;
      if(job.Function === "grains.delval") continue;
      if(job.Function === "grains.items") continue;
      if(job.Function === "grains.setval") continue;
      if(job.Function === "pillar.items") continue;
      if(job.Function === "pillar.obfuscate") continue;
      if(job.Function === "ps.proc_info") continue;
      if(job.Function === "ps.kill_pid") continue;
      if(job.Function === "runner.jobs.active") continue;
      if(job.Function === "runner.jobs.list_job") continue;
      if(job.Function === "runner.jobs.list_jobs") continue;
      if(job.Function === "saltutil.find_job") continue;
      if(job.Function === "saltutil.kill_job") continue;
      if(job.Function === "saltutil.refresh_grains") continue;
      if(job.Function === "saltutil.refresh_pillar") continue;
      if(job.Function === "saltutil.running") continue;
      if(job.Function === "saltutil.signal_job") continue;
      if(job.Function === "saltutil.term_job") continue;
      if(job.Function === "schedule.delete") continue;
      if(job.Function === "schedule.disable") continue;
      if(job.Function === "schedule.disable_job") continue;
      if(job.Function === "schedule.enable") continue;
      if(job.Function === "schedule.enable_job") continue;
      if(job.Function === "schedule.list") continue;
      if(job.Function === "schedule.modify") continue;
      if(job.Function === "schedule.run_job") continue;
      if(job.Function === "sys.doc") continue;
      if(job.Function === "wheel.config.values") continue;
      if(job.Function === "wheel.key.accept") continue;
      if(job.Function === "wheel.key.delete") continue;
      if(job.Function === "wheel.key.list_all") continue;
      if(job.Function === "wheel.key.reject") continue;
      if(job.Function === "wheel.key.finger") continue;

      // Note that "Jobs" has a specialized version
      this._addJob(jobContainer, job);

      shown = shown + 1;
    }

    if(hasHeader) {
      Utils.showTableSortable(this.getPageElement(), "jobs", true);
    }

    this.jobsLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _handleRunnerJobsActive(data) {
    const jobs = data.return[0];

    // mark all jobs as done, then re-update the running jobs
    for(const tr of this.page_element.querySelector("table.jobs tbody").rows) {
      const statusSpan = tr.querySelector("span.status");
      if(!statusSpan) continue;
      statusSpan.classList.remove("no_status");
      statusSpan.innerText = "done";
      // we show the tooltip here so that the user is invited to click on this
      // the user then sees other rows being updated without becoming invisible
      Utils.addToolTip(statusSpan, "Click to refresh");
    }

    // update all running jobs
    for(const k in jobs)
    {
      const job = jobs[k];

      // then add the operational statistics
      let statusText = "";
      if(job.Running.length > 0)
        statusText = statusText + ", " + job.Running.length + " running";
      if(job.Returned.length > 0)
        statusText = statusText + ", " + job.Returned.length + " returned";

      const statusSpan = this.page_element.querySelector("table.jobs td#job" + k + " span.status");
      // the field may not (yet) be on the screen
      if(!statusSpan) continue;

      statusSpan.innerText = statusText.substring(2);
      Utils.addToolTip(statusSpan, "Click to refresh");
    }
  }

  _addJob(container, job) {
    const tr = document.createElement("tr");

    const td = document.createElement("td");
    td.id = "job" + job.id;

    let targetText = TargetType.makeTargetText(job["Target-type"], job.Target);
    if(targetText.length > 50) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, 50) + "...";
    }
    const targetDiv = Route._createDiv("target", targetText);
    td.appendChild(targetDiv);

    const functionText = job.Function;
    const functionDiv = Route._createDiv("function", functionText);
    td.appendChild(functionDiv);

    const statusSpan = Route._createSpan("status", "loading...");
    statusSpan.classList.add("no_status");
    /* effectively also the whole column, but it does not look like a column on screen */
    statusSpan.addEventListener("click", evt => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no_status");
      statusSpan.innerText = "loading...";
      this._startRunningJobs();
      evt.stopPropagation();
    });
    td.appendChild(statusSpan);

    const startTimeText = Output.dateTimeStr(job.StartTime);
    const startTimeDiv = Route._createDiv("time", startTimeText);
    td.appendChild(startTimeDiv);

    tr.appendChild(td);

    const menu = new DropDownMenu(tr);
    menu.addMenuItem("Show&nbsp;details", function(evt) {
      window.location.assign("/job?id=" + encodeURIComponent(job.id));
    }.bind(this));
    menu.addMenuItem("Update&nbsp;status", function(evt) {
      statusSpan.classList.add("no_status");
      statusSpan.innerText = "loading...";
      this._startRunningJobs();
    }.bind(this));

    container.appendChild(tr);

    tr.addEventListener("click", evt => window.location.assign("/job?id=" + encodeURIComponent(job.id)));
  }

  _startRunningJobs() {
    const myThis = this;

    this.router.api.getRunnerJobsActive().then(data => {
      myThis._handleRunnerJobsActive(data);
    });
  }

  _jobsToArray(jobs) {
    const keys = Object.keys(jobs);
    const newArray = [];

    for(const key of keys) {
      const job = jobs[key];
      job.id = key;
      newArray.push(job);
    }

    return newArray;
  }

  _sortJobs(jobs) {
    jobs.sort(function(a, b){
      // The id is already a string value based on the date,
      // let's use it to sort the jobs
      if(a.id < b.id) return 1;
      if(a.id > b.id) return -1;
      return 0;
    });
  }

  _copyAddress(evt) {
    const target = evt.target;
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(target.firstChild);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();

    Utils.addToolTip(target, "Copied!");

    evt.stopPropagation();
  }

  _restoreClickToCopy(evt) {
    const target = evt.target;
    Utils.addToolTip(target, "Click to copy");
  }

}
