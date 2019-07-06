import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {Route} from './Route.js';
import {TargetType} from '../TargetType.js';
import {Utils} from '../Utils.js';

export class PageRoute extends Route {

  constructor(pPath, pPageName, pPageSelector, pMenuItemSelector, pRouter) {
    super(pPath, pPageName, pPageSelector, pMenuItemSelector, pRouter);

    this._runCommand = this._runCommand.bind(this);
    this._handleRunnerJobsActive = this._handleRunnerJobsActive.bind(this);
    this._startRunningJobs = this._startRunningJobs.bind(this);
    this._handleRunnerJobsListJobs = this._handleRunnerJobsListJobs.bind(this);
    this._updateMinions = this._updateMinions.bind(this);
  }

  _updateMinions(pData) {
    if(!pData) return;

    const minions = pData.return[0];

    const table = this.getPageElement().querySelector("#minions");
    const minionIds = Object.keys(minions).sort();

    // save for the autocompletion
    window.localStorage.setItem("minions", JSON.stringify(minionIds));

    const ipNumberPrefixes = this._getIpNumberPrefixes(minions);

    let cntOnline = 0;
    let cntOffline = 0;
    for(const minionId of minionIds) {
      const minionInfo = minions[minionId];

      // minions can be offline, then the info will be false
      if(minionInfo === false) {
        this._updateOfflineMinion(table, minionId);
        cntOffline++;
      } else {
        this._updateMinion(table, minionInfo, minionId, minions);
        cntOnline++;
      }
    }

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    let txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    if(cntOnline !== minionIds.length)
      txt += ", " + Utils.txtZeroOneMany(cntOnline,
        "none online", "{0} online", "{0} online");
    if(cntOffline > 0)
      txt += ", " + Utils.txtZeroOneMany(cntOffline,
        "none offline", "{0} offline", "{0} offline");
    msgDiv.innerText = txt;
  }

  _getElement(pContainer, id) {
    let minionTr = pContainer.querySelector("#" + id);

    if(minionTr === null) {
      // minion not found on screen...
      // construct a basic element that can be updated
      minionTr = document.createElement("tr");
      minionTr.id = id;
      pContainer.appendChild(minionTr);
      return minionTr;
    }

    // remove existing content
    while(minionTr.firstChild) {
      minionTr.removeChild(minionTr.firstChild);
    }

    return minionTr;
  }

  _updateOfflineMinion(pContainer, pMinionId) {
    const minionTr = this._getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route._createTd("minion-id", pMinionId));

    const offline = Route._createTd("status", "offline");
    offline.classList.add("offline");
    minionTr.appendChild(offline);
  }

  _getIpNumberPrefixes(pAllMinionsGrains) {
    // First we gather all (resonable) prefixes
    // Only use byte-boundaries for networks
    // Must match a subnet of A, B or C network
    const prefixes = { };
    for(const minionId in pAllMinionsGrains) {
      const grains = pAllMinionsGrains[minionId];
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
    for(const prefix in prefixes) {
      for(const minionId in pAllMinionsGrains) {
        let cnt = 0;
        const grains = pAllMinionsGrains[minionId];
        if(!grains.fqdn_ip4) continue;
        if(!Array.isArray(grains.fqdn_ip4)) continue;
        for(const ip of grains.fqdn_ip4) {
          if(!ip.startsWith(prefix)) continue;
          cnt++;
        }
        // multiple or unused?
        //    then it is not a suitable subnet
        if(cnt !== 1) {
          prefixes[prefix] = false;
          break;
        }
      }
    }

    // actually remove the unused prefixes
    for(const prefix in prefixes) {
      if(!prefixes[prefix]) {
        delete prefixes[prefix];
      }
    }

    return prefixes;
  }

  _getBestIpNumber(pMinionData, prefixes) {
    if(!pMinionData) return null;
    const ipv4 = pMinionData.fqdn_ip4;
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
    for(const prefix in prefixes) {
      for(const s of ipv4) {
        if(s.startsWith(prefix)) return s;
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

  _updateMinion(pContainer, pMinionData, pMinionId, prefixes) {

    const minionTr = this._getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route._createTd("minion-id", pMinionId));

    const ipv4 = this._getBestIpNumber(pMinionData, prefixes);
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
      minionTr.appendChild(addressTd);
    } else {
      const accepted = Route._createTd("status", "accepted");
      accepted.classList.add("accepted");
      minionTr.appendChild(accepted);
    }

    let saltversion = "---";
    if(typeof pMinionData === "string") saltversion = "";
    else if(pMinionData && pMinionData.saltversion) saltversion = pMinionData.saltversion;
    if(pMinionData) {
      const td = Route._createTd("saltversion", saltversion);
      if(typeof pMinionData === "string") Utils.addErrorToTableCell(td, pMinionData);
      minionTr.appendChild(td);
    }

    let os = "---";
    if(typeof pMinionData === "string") os = "";
    else if(pMinionData && pMinionData.os && pMinionData.osrelease) os = pMinionData.os + " " + pMinionData.osrelease;
    else if(pMinionData && pMinionData.os) os = pMinionData.os;
    if(pMinionData) {
      const td = Route._createTd("os", os);
      if(typeof pMinionData === "string") Utils.addErrorToTableCell(td, pMinionData);
      if(pMinionData.os && typeof pMinionData !== "string") {
        const img = document.createElement("img");
        img.setAttribute("src", "static/images/os-" + pMinionData.os.replace(" ", "-").toLowerCase() + ".png");
        img.classList.add("osimage");
        td.prepend(img);
      }
      minionTr.appendChild(td);
    }
  }

  _addMinion(pContainer, pMinionId, freeColumns = 0) {

    let minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    if(minionTr !== null) {
      // minion already on screen...
      return;
    }

    minionTr = document.createElement("tr");
    minionTr.id = Utils.getIdFromMinionId(pMinionId);

    minionTr.appendChild(Route._createTd("minion-id", pMinionId));

    const minionTd = Route._createTd("status", "accepted");
    minionTd.classList.add("accepted");
    minionTr.appendChild(minionTd);

    minionTr.appendChild(Route._createTd("os", "loading..."));

    // fill out the number of columns to that of the header
    while(minionTr.cells.length < pContainer.tHead.rows[0].cells.length - freeColumns) {
      minionTr.appendChild(Route._createTd("", ""));
    }

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addNone(pContainer) {
    const tr = document.createElement("tr");
    const td = Route._createTd("minion-id", "none");
    td.setAttribute("colspan", pContainer.rows[0].cells.length);
    tr.appendChild(td);
    pContainer.appendChild(tr);
  }

  _handleRunnerJobsListJobs(pData, hasHeader = false, pMaxNumberOfJobs = 7) {
    const jobContainer = this.getPageElement().querySelector(".jobs tbody");

    if(PageRoute.showErrorRowInstead(jobContainer, pData)) return;

    const jobs = this._jobsToArray(pData.return[0]);
    this._sortJobs(jobs);

    // collect the list of hidden minions
    let hideJobsText = window.localStorage.getItem("hide_jobs");
    if(!hideJobsText || hideJobsText === "undefined") {
      hideJobsText = "[]";
    }
    this._hideJobs = JSON.parse(hideJobsText);
    if(!Array.isArray(this._hideJobs)) {
      this._hideJobs = [ ];
    }
    // collect the list of hidden minions
    let showJobsText = window.localStorage.getItem("show_jobs");
    if(!showJobsText || showJobsText === "undefined") {
      showJobsText = "[]";
    }
    this._showJobs = JSON.parse(showJobsText);
    if(!Array.isArray(this._showJobs)) {
      this._showJobs = [ ];
    }

    // These jobs are likely started by the SaltGUI
    // do not display them
    this._hideJobs.push("beacons.add");
    this._hideJobs.push("beacons.delete");
    this._hideJobs.push("beacons.disable");
    this._hideJobs.push("beacons.disable_beacon");
    this._hideJobs.push("beacons.enable");
    this._hideJobs.push("beacons.enable_beacon");
    this._hideJobs.push("beacons.list");
    this._hideJobs.push("beacons.modify");
    this._hideJobs.push("beacons.reset");
    this._hideJobs.push("beacons.save");
    this._hideJobs.push("grains.append");
    this._hideJobs.push("grains.delkey");
    this._hideJobs.push("grains.delval");
    this._hideJobs.push("grains.items");
    this._hideJobs.push("grains.setval");
    this._hideJobs.push("pillar.items");
    this._hideJobs.push("pillar.obfuscate");
    this._hideJobs.push("ps.kill_pid");
    this._hideJobs.push("ps.proc_info");
    this._hideJobs.push("runner.jobs.active");
    this._hideJobs.push("runner.jobs.list_job");
    this._hideJobs.push("runner.jobs.list_jobs");
    this._hideJobs.push("saltutil.find_job");
    this._hideJobs.push("saltutil.kill_job");
    this._hideJobs.push("saltutil.refresh_grains");
    this._hideJobs.push("saltutil.refresh_pillar");
    this._hideJobs.push("saltutil.running");
    this._hideJobs.push("saltutil.signal_job");
    this._hideJobs.push("saltutil.term_job");
    this._hideJobs.push("schedule.delete");
    this._hideJobs.push("schedule.disable");
    this._hideJobs.push("schedule.disable_job");
    this._hideJobs.push("schedule.enable");
    this._hideJobs.push("schedule.enable_job");
    this._hideJobs.push("schedule.list");
    this._hideJobs.push("schedule.modify");
    this._hideJobs.push("schedule.run_job");
    this._hideJobs.push("sys.doc");
    this._hideJobs.push("wheel.config.values");
    this._hideJobs.push("wheel.key.accept");
    this._hideJobs.push("wheel.key.delete");
    this._hideJobs.push("wheel.key.finger");
    this._hideJobs.push("wheel.key.list_all");
    this._hideJobs.push("wheel.key.reject");

    let numberOfJobsShown = 0;
    let numberOfJobsEligible = 0;
    const numberOfJobsPresent = jobs.length;
    for(const job of jobs) {

      if(!this._hideJobs.includes(job.Function) ||
         this._showJobs.includes(job.Function)) {
        numberOfJobsEligible++;
      } else if(pMaxNumberOfJobs !== 99999) {
        continue;
      }

      // Add only <pMaxNumberOfJobs> most recent jobs
      if(numberOfJobsShown >= pMaxNumberOfJobs) continue;

      // Note that "Jobs" has a specialized version
      this._addJob(jobContainer, job);

      numberOfJobsShown++;
    }

    const page = this.getPageElement().querySelector(".job-list");
    if(hasHeader) {
      Utils.showTableSortable(page, true);
    }
    Utils.makeTableSearchable(page);

    const msgDiv = this.pageElement.querySelector("div.job-list .msg");
    let txt = Utils.txtZeroOneMany(numberOfJobsShown,
      "No jobs shown", "{0} job shown", "{0} jobs shown");
    txt += Utils.txtZeroOneMany(numberOfJobsEligible,
      "", ", {0} job eligible", ", {0} jobs eligible");
    txt += Utils.txtZeroOneMany(numberOfJobsPresent,
      "", ", {0} job present", ", {0} jobs present");
    msgDiv.innerText = txt;
  }

  _handleRunnerJobsActive(pData) {

    if(!pData) return;

    if(typeof pData !== "object") {
      const tbody = this.pageElement.querySelector("table.jobs tbody");
      for(const tr of tbody.rows) {
        const statusSpan = tr.querySelector("span.status");
        if(!statusSpan) continue;
        statusSpan.classList.remove("no-status");
        statusSpan.innerText = "(error)";
        // we show the tooltip here so that the user is invited to click on this
        // the user then sees other rows being updated without becoming invisible
        Utils.addToolTip(statusSpan, pData);
      }
      return;
    }

    // mark all jobs as done, then re-update the running jobs
    const tbody = this.pageElement.querySelector("table.jobs tbody");
    for(const tr of tbody.rows) {
      const statusSpan = tr.querySelector("span.status");
      if(!statusSpan) continue;
      statusSpan.classList.remove("no-status");
      statusSpan.innerText = "done";
      // we show the tooltip here so that the user is invited to click on this
      // the user then sees other rows being updated without becoming invisible
      Utils.addToolTip(statusSpan, "Click to refresh");
    }

    const jobs = pData.return[0];

    // update all running jobs
    for(const k in jobs)
    {
      const job = jobs[k];

      // then add the operational statistics
      let statusText = "";
      if(job.Running && job.Running.length > 0)
        statusText = statusText + ", " + job.Running.length + " running";
      if(job.Returned && job.Returned.length > 0)
        statusText = statusText + ", " + job.Returned.length + " returned";

      const statusSpan = this.pageElement.querySelector("table.jobs td#" + Utils.getIdFromJobId(k) + " span.status");
      // the field may not (yet) be on the screen
      if(!statusSpan) continue;

      statusSpan.innerText = "";
      statusSpan.appendChild(Utils.createJobStatusSpan(k));
      statusSpan.appendChild(document.createTextNode(statusText.substring(2)));

      Utils.addToolTip(statusSpan, "Click to refresh");
    }
  }

  _addJob(pContainer, job) {
    const tr = document.createElement("tr");

    const td = Route._createTd("", "");
    td.id = Utils.getIdFromJobId(job.id);

    let targetText = TargetType.makeTargetText(job["Target-type"], job.Target);
    const maxTextLength = 50;
    if(targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + "...";
    }
    const targetDiv = Route._createDiv("target", targetText);
    td.appendChild(targetDiv);

    const functionText = job.Function;
    const functionDiv = Route._createDiv("function", functionText);
    td.appendChild(functionDiv);

    const statusSpan = Route._createSpan("status", "loading...");
    statusSpan.classList.add("no-status");
    /* effectively also the whole column, but it does not look like a column on screen */
    statusSpan.addEventListener("click", pClickEvent => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no-status");
      statusSpan.innerText = "loading...";
      this._startRunningJobs();
      pClickEvent.stopPropagation();
    });
    td.appendChild(statusSpan);

    const startTimeText = Output.dateTimeStr(job.StartTime);
    const startTimeDiv = Route._createDiv("time", startTimeText);
    td.appendChild(startTimeDiv);

    tr.appendChild(td);

    const menu = new DropDownMenu(tr);
    this._addMenuItemShowDetails(menu, job);
    this._addMenuItemUpdateStatus(menu, statusSpan);

    pContainer.appendChild(tr);

    tr.addEventListener("click", pClickEvent =>
      window.location.assign("/job?id=" + encodeURIComponent(job.id))
    );
  }

  _addMenuItemShowDetails(pMenu, job) {
    pMenu.addMenuItem("Show&nbsp;details", function(pClickEvent) {
      window.location.assign("/job?id=" + encodeURIComponent(job.id));
    }.bind(this));
  }

  _addMenuItemUpdateStatus(pMenu, statusSpan) {
    pMenu.addMenuItem("Update&nbsp;status", function(pClickEvent) {
      statusSpan.classList.add("no-status");
      statusSpan.innerText = "loading...";
      this._startRunningJobs();
    }.bind(this));
  }

  _startRunningJobs() {
    const myThis = this;

    this.router.api.getRunnerJobsActive().then(pData => {
      myThis._handleRunnerJobsActive(pData);
    }, pData => {
      myThis._handleRunnerJobsActive(JSON.stringify(pData));
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

  _copyAddress(pClickEvent) {
    const target = pClickEvent.target;
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(target.firstChild);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();

    Utils.addToolTip(target, "Copied!");

    pClickEvent.stopPropagation();
  }

  _restoreClickToCopy(pMouseEvent) {
    const target = pMouseEvent.target;
    Utils.addToolTip(target, "Click to copy");
  }

  static showErrorRowInstead(pTable, pData) {

    if(pData === null) {
      // not an error, but also nothing to show
      return true;
    }

    if(typeof pData === "object") {
      // not an error
      return false;
    }

    const td = Route._createTd("", "");
    td.colSpan = 99;
    const span = Route._createSpan("", "(error)");
    Utils.addToolTip(span, pData);
    td.appendChild(span);

    const tr = document.createElement("tr");
    tr.appendChild(td);

    pTable.appendChild(tr);

    // hide the "(loading)" message
    const msgDiv = pTable.parentElement.parentElement.querySelector(".msg");
    if(msgDiv !== null) msgDiv.style.display = "none";

    return true;
  }
}
