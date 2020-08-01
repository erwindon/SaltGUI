/* global config document window */

import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Route} from "./Route.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

export class PageRoute extends Route {

  constructor (pPath, pPageName, pPageSelector, pMenuItemSelector, pRouter) {
    super(pPath, pPageName, pPageSelector, pMenuItemSelector, pRouter);

    this.handleRunnerJobsActive = this.handleRunnerJobsActive.bind(this);
    this.startRunningJobs = this.startRunningJobs.bind(this);
    this.handleRunnerJobsListJobs = this.handleRunnerJobsListJobs.bind(this);
    this.updateMinions = this.updateMinions.bind(this);
  }

  updateMinions (pTableId, pData) {
    if (!pData) {
      return;
    }

    const minions = pData.return[0];

    const table = document.getElementById(pTableId);
    const minionIds = Object.keys(minions).sort();

    const minionsDict = JSON.parse(Utils.getStorageItem("session", "minions-txt"));

    // save for the autocompletion
    // This callback will also be called after LOGOUT due to the regular error handling
    // Do not store the information in that case
    if (Utils.getStorageItem("session", "token")) {
      Utils.setStorageItem("session", "minions", JSON.stringify(minionIds));
    }

    let cntOnline = 0;
    let cntOffline = 0;
    for (const minionId of minionIds) {
      const minionInfo = minions[minionId];

      // minions can be offline, then the info will be false
      if (minionInfo === false) {
        this.updateOfflineMinion(table, minionId, minionsDict);
        cntOffline += 1;
      } else {
        this.updateMinion(table, minionInfo, minionId, minions);
        cntOnline += 1;
      }
    }

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    let txt = Utils.txtZeroOneMany(minionIds.length, "No minions", "{0} minion", "{0} minions");
    if (cntOnline !== minionIds.length) {
      txt += ", " + Utils.txtZeroOneMany(cntOnline, "none online", "{0} online", "{0} online");
    }
    if (cntOffline > 0) {
      txt += ", " + Utils.txtZeroOneMany(cntOffline, "none offline", "{0} offline", "{0} offline");
    }
    msgDiv.innerText = txt;
  }

  getElement (pContainer, id) {
    let minionTr = pContainer.querySelector("#" + id);

    if (minionTr === null) {
      // minion not found on screen...
      // construct a basic element that can be updated
      minionTr = document.createElement("tr");
      minionTr.id = id;
      pContainer.querySelector("tbody").appendChild(minionTr);
    }

    // remove existing content
    while (minionTr.firstChild) {
      minionTr.removeChild(minionTr.firstChild);
    }

    return minionTr;
  }

  updateOfflineMinion (pContainer, pMinionId, pMinionsDict) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route.createTd("minion-id", pMinionId));

    const offlineSpan = Route.createSpan("status", "offline");
    // add an opinion when we have one
    if (pMinionId in pMinionsDict) {
      if (pMinionsDict[pMinionId] === "true") {
        Utils.addToolTip(offlineSpan, "Minion is offline\nIs the host running and is the salt-minion installed and started?\nUpdate file 'minions.txt' when needed", "bottom-left");
        offlineSpan.style.color = "red";
      } else {
        Utils.addToolTip(offlineSpan, "Minion is offline\nSince it is reported as inactive in file 'minions.txt', that should be OK", "bottom-left");
      }
    }
    offlineSpan.classList.add("offline");
    const offlineTd = Route.createTd("", "");
    offlineTd.appendChild(offlineSpan);
    minionTr.appendChild(offlineTd);
  }

  _getIpNumberPrefixes (pAllMinionsGrains) {
    // First we gather all (resonable) prefixes
    // Only use byte-boundaries for networks
    // Must match a subnet of A, B or C network
    const prefixes = {};
    for (const minionId in pAllMinionsGrains) {
      const grains = pAllMinionsGrains[minionId];
      if (!grains.fqdn_ip4) {
        continue;
      }
      if (!Array.isArray(grains.fqdn_ip4)) {
        continue;
      }
      for (const ip of grains.fqdn_ip4) {
        const parts = ip.split(".");
        if (ip.startsWith("10.")) {
          prefixes[parts[0] + "."] = true;
        }
        if (ip.startsWith("10.") ||
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
    for (const prefix in prefixes) {
      for (const minionId in pAllMinionsGrains) {
        let cnt = 0;
        const grains = pAllMinionsGrains[minionId];
        if (!grains.fqdn_ip4) {
          continue;
        }
        if (!Array.isArray(grains.fqdn_ip4)) {
          continue;
        }
        for (const ip of grains.fqdn_ip4) {
          if (!ip.startsWith(prefix)) {
            continue;
          }
          cnt += 1;
        }
        // multiple or unused?
        //    then it is not a suitable subnet
        if (cnt !== 1) {
          prefixes[prefix] = false;
          break;
        }
      }
    }

    // actually remove the unused prefixes
    for (const prefix in prefixes) {
      if (!prefixes[prefix]) {
        delete prefixes[prefix];
      }
    }

    return prefixes;
  }

  _getBestIpNumber (pMinionData, prefixes) {
    if (!pMinionData) {
      return null;
    }
    const ipv4 = pMinionData.fqdn_ip4;
    if (!ipv4) {
      return null;
    }
    // either a string or something strange
    if (!Array.isArray(ipv4)) {
      return ipv4;
    }

    // so, it is an array

    // get the public IP number (if any)
    for (const ipv4Number of ipv4) {
      // See https://nl.wikipedia.org/wiki/RFC_1918
      // local = 127.0.0.0/8
      if (ipv4Number.startsWith("127.")) {
        continue;
      }
      // private A = 10.0.0.0/8
      if (ipv4Number.startsWith("10.")) {
        continue;
      }
      // private B = 172.16.0.0/20
      /* eslint-disable curly */
      if (ipv4Number.startsWith("172.16.")) continue;
      if (ipv4Number.startsWith("172.17.")) continue;
      if (ipv4Number.startsWith("172.18.")) continue;
      if (ipv4Number.startsWith("172.19.")) continue;
      if (ipv4Number.startsWith("172.20.")) continue;
      if (ipv4Number.startsWith("172.21.")) continue;
      if (ipv4Number.startsWith("172.22.")) continue;
      if (ipv4Number.startsWith("172.23.")) continue;
      if (ipv4Number.startsWith("172.24.")) continue;
      if (ipv4Number.startsWith("172.25.")) continue;
      if (ipv4Number.startsWith("172.26.")) continue;
      if (ipv4Number.startsWith("172.27.")) continue;
      if (ipv4Number.startsWith("172.28.")) continue;
      if (ipv4Number.startsWith("172.29.")) continue;
      if (ipv4Number.startsWith("172.30.")) continue;
      if (ipv4Number.startsWith("172.31.")) continue;
      /* eslint-enable curly */
      // private C = 192.168.0.0/16
      if (ipv4Number.startsWith("192.168.")) {
        continue;
      }
      // not a local/private address, therefore it is public
      return ipv4Number;
    }

    // No public IP was found
    // Use a common prefix in all available IP numbers
    // get the private IP number (if any)
    // when it matches one of the common prefixes
    for (const prefix in prefixes) {
      for (const ipv4Number of ipv4) {
        if (ipv4Number.startsWith(prefix)) {
          return ipv4Number;
        }
      }
    }

    // no luck...
    // try again, but without the restrictions
    for (const ipv4Number of ipv4) {
      // C = 192.168.x.x
      if (ipv4Number.startsWith("192.168.")) {
        return ipv4Number;
      }
    }
    for (const ipv4Number of ipv4) {
      // B = 172.16.0.0 .. 172.31.255.255
      // never mind the sub-ranges
      if (ipv4Number.startsWith("172.")) {
        return ipv4Number;
      }
    }
    for (const ipv4Number of ipv4) {
      // A = 10.x.x.x
      if (ipv4Number.startsWith("10.")) {
        return ipv4Number;
      }
    }

    // just pick the first one, should then be a local address (127.x.x.x)
    return ipv4[0];
  }

  updateMinion (pContainer, pMinionData, pMinionId, prefixes) {

    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route.createTd("minion-id", pMinionId));

    const ipv4 = this._getBestIpNumber(pMinionData, prefixes);
    if (ipv4) {
      const addressTd = Route.createTd("status", "");
      const addressSpan = Route.createSpan("status2", ipv4);
      addressTd.appendChild(addressSpan);
      // ipnumbers do not sort well, reformat into something sortable
      const ipv4parts = ipv4.split(".");
      let sorttableCustomkey = "";
      if (ipv4parts.length === 4) {
        // never mind adding '.'; this is only a sort-key
        for (let i = 0; i < 4; i++) {
          sorttableCustomkey += ipv4parts[i].padStart(3, "0");
        }
        addressTd.setAttribute("sorttable_customkey", sorttableCustomkey);
      }
      addressTd.classList.add("address");
      addressTd.setAttribute("tabindex", -1);
      addressSpan.addEventListener("click", (pClickEvent) => {
        this._copyAddress(addressSpan);
        pClickEvent.stopPropagation();
      });
      addressSpan.addEventListener("mouseout", () => {
        this._restoreClickToCopy(addressSpan);
      });
      Utils.addToolTip(addressSpan, "Click to copy");
      minionTr.appendChild(addressTd);
    } else {
      const accepted = Route.createTd("status", "accepted");
      accepted.classList.add("accepted");
      minionTr.appendChild(accepted);
    }

    let saltversion = "---";
    if (typeof pMinionData === "string") {
      saltversion = "";
    } else if (pMinionData && pMinionData.saltversion) {
      saltversion = pMinionData.saltversion;
    }
    if (pMinionData) {
      const td = Route.createTd("", "");
      const span = Route.createSpan("saltversion", saltversion);
      td.appendChild(span);
      if (typeof pMinionData === "string") {
        Utils.addErrorToTableCell(td, pMinionData);
      }
      minionTr.appendChild(td);
    }

    let os = "---";
    if (typeof pMinionData === "string") {
      os = "";
    } else if (pMinionData && pMinionData.os && pMinionData.osrelease) {
      os = pMinionData.os + " " + pMinionData.osrelease;
    } else if (pMinionData && pMinionData.os) {
      os = pMinionData.os;
    }
    if (pMinionData) {
      const td = Route.createTd("os", os);
      if (typeof pMinionData === "string") {
        Utils.addErrorToTableCell(td, pMinionData);
      }
      if (pMinionData.os && typeof pMinionData !== "string") {
        const img = document.createElement("img");
        img.setAttribute("src", config.NAV_URL + "/static/images/os-" + pMinionData.os.replace(" ", "-").toLowerCase() + ".png");
        img.classList.add("osimage");
        td.prepend(img);
      }
      minionTr.appendChild(td);
    }
  }

  addMinion (pContainer, pMinionId, freeColumns = 0) {

    let minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    if (minionTr !== null) {
      // minion already on screen...
      return;
    }

    minionTr = document.createElement("tr");
    minionTr.id = Utils.getIdFromMinionId(pMinionId);

    minionTr.appendChild(Route.createTd("minion-id", pMinionId));

    const minionTd = Route.createTd("status", "accepted");
    minionTd.classList.add("accepted");
    minionTr.appendChild(minionTd);

    minionTr.appendChild(Route.createTd("os", "loading..."));

    // fill out the number of columns to that of the header
    while (minionTr.cells.length < pContainer.tHead.rows[0].cells.length - freeColumns) {
      minionTr.appendChild(Route.createTd("", ""));
    }

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addNone (pContainer) {
    const tr = document.createElement("tr");
    const td = Route.createTd("minion-id", "none");
    td.setAttribute("colspan", pContainer.rows[0].cells.length);
    tr.appendChild(td);
    pContainer.appendChild(tr);
  }

  handleRunnerJobsListJobs (pData, pMaxNumberOfJobs = 7) {
    const jobContainer = this.getPageElement().querySelector(".jobs tbody");

    const msgDiv = this.getPageElement().querySelector(".job-list .msg");
    if (PageRoute.showErrorRowInstead(jobContainer, pData, msgDiv)) {
      return;
    }

    const jobs = this._jobsToArray(pData.return[0]);
    this._sortJobs(jobs);

    // collect the list of hidden minions
    const hideJobsText = Utils.getStorageItem("session", "hide_jobs", "[]");
    this._hideJobs = JSON.parse(hideJobsText);
    if (!Array.isArray(this._hideJobs)) {
      this._hideJobs = [];
    }
    // collect the list of hidden minions
    const showJobsText = Utils.getStorageItem("session", "show_jobs", "[]");
    this._showJobs = JSON.parse(showJobsText);
    if (!Array.isArray(this._showJobs)) {
      this._showJobs = [];
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
    this._hideJobs.push("test.version");
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
    for (const job of jobs) {

      if (!this._hideJobs.includes(job.Function) ||
         this._showJobs.includes(job.Function)) {
        numberOfJobsEligible += 1;
      } else if (pMaxNumberOfJobs !== 99999) {
        continue;
      }

      // Add only <pMaxNumberOfJobs> most recent jobs
      if (numberOfJobsShown >= pMaxNumberOfJobs) {
        continue;
      }

      // Note that "Jobs" has a specialized version
      this.addJob(jobContainer, job);

      numberOfJobsShown += 1;
    }

    let txt = Utils.txtZeroOneMany(numberOfJobsShown,
      "No jobs shown", "{0} job shown", "{0} jobs shown");
    txt += Utils.txtZeroOneMany(numberOfJobsEligible,
      "", ", {0} job eligible", ", {0} jobs eligible");
    txt += Utils.txtZeroOneMany(numberOfJobsPresent,
      "", ", {0} job present", ", {0} jobs present");
    msgDiv.innerText = txt;
  }

  handleRunnerJobsActive (pData) {

    if (!pData) {
      return;
    }

    if (typeof pData !== "object") {
      const tbody = this.pageElement.querySelector("table.jobs tbody");
      for (const tr of tbody.rows) {
        const statusSpan = tr.querySelector("span.status");
        if (!statusSpan) {
          continue;
        }
        statusSpan.classList.remove("no-status");
        statusSpan.innerText = "(error)";
        // we show the tooltip here so that the user is invited to click on this
        // the user then sees other rows being updated without becoming invisible
        Utils.addToolTip(statusSpan, pData, "bottom-left");
      }
      return;
    }

    // mark all jobs as done, then re-update the running jobs
    const tbody = this.pageElement.querySelector("table.jobs tbody");
    for (const tr of tbody.rows) {
      const statusSpan = tr.querySelector("span.status");
      if (!statusSpan) {
        continue;
      }
      statusSpan.classList.remove("no-status");
      statusSpan.innerText = "done";
      // we show the tooltip here so that the user is invited to click on this
      // the user then sees other rows being updated without becoming invisible
      Utils.addToolTip(statusSpan, "Click to refresh", "bottom-left");
    }

    const jobs = pData.return[0];

    // update all running jobs
    for (const jobId in jobs) {
      const job = jobs[jobId];

      // then add the operational statistics
      let statusText = "";
      if (job.Running && job.Running.length > 0) {
        statusText = statusText + ", " + job.Running.length + " running";
      }
      if (job.Returned && job.Returned.length > 0) {
        statusText = statusText + ", " + job.Returned.length + " returned";
      }

      const statusSpan = this.pageElement.querySelector("table.jobs td#" + Utils.getIdFromJobId(jobId) + " span.status");
      // the field may not (yet) be on the screen
      if (!statusSpan) {
        continue;
      }

      statusSpan.innerText = "";
      statusSpan.appendChild(Utils.createJobStatusSpan(jobId));
      statusSpan.appendChild(document.createTextNode(statusText.substring(2)));

      Utils.addToolTip(statusSpan, "Click to refresh", "bottom-left");
    }
  }

  addJob (pContainer, job) {
    const tr = document.createElement("tr");

    const td = Route.createTd("", "");
    td.id = Utils.getIdFromJobId(job.id);

    let targetText = TargetType.makeTargetText(job["Target-type"], job.Target);
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + "...";
    }
    const targetDiv = Route.createDiv("target", targetText);
    td.appendChild(targetDiv);

    const functionText = job.Function;
    const functionDiv = Route.createDiv("function", functionText);
    td.appendChild(functionDiv);

    const statusSpan = Route.createSpan("status", "loading...");
    statusSpan.classList.add("no-status");
    // effectively also the whole column, but it does not look like a column on screen
    statusSpan.addEventListener("click", (pClickEvent) => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no-status");
      statusSpan.innerText = "loading...";
      this.startRunningJobs();
      pClickEvent.stopPropagation();
    });
    td.appendChild(statusSpan);

    const startTimeText = Output.dateTimeStr(job.StartTime);
    const startTimeDiv = Route.createDiv("time", startTimeText);
    td.appendChild(startTimeDiv);

    tr.appendChild(td);

    const menu = new DropDownMenu(tr);
    this._addPageMenuItemShowDetails(menu, job);
    this._addPageMenuItemUpdateStatus(menu, statusSpan);

    pContainer.appendChild(tr);

    tr.addEventListener("click", () => {
      window.location.assign(config.NAV_URL + "/job?id=" + encodeURIComponent(job.id));
    });
  }

  _addPageMenuItemShowDetails (pMenu, job) {
    pMenu.addMenuItem("Show&nbsp;details", () => {
      window.location.assign(config.NAV_URL + "/job?id=" + encodeURIComponent(job.id));
    });
  }

  _addPageMenuItemUpdateStatus (pMenu, statusSpan) {
    pMenu.addMenuItem("Update&nbsp;status", () => {
      statusSpan.classList.add("no-status");
      statusSpan.innerText = "loading...";
      this.startRunningJobs();
    });
  }

  startRunningJobs () {
    const that = this;

    this.router.api.getRunnerJobsActive().then((pRunnerJobsActiveData) => {
      that.handleRunnerJobsActive(pRunnerJobsActiveData);
    }, (pRunnerJobsActiveMsg) => {
      that.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
    });
  }

  _jobsToArray (jobs) {
    const keys = Object.keys(jobs);
    const newArray = [];

    for (const key of keys) {
      const job = jobs[key];
      job.id = key;
      newArray.push(job);
    }

    return newArray;
  }

  _sortJobs (jobs) {
    jobs.sort((aa, bb) => {
      // The id is already a string value based on the date,
      // let's use it to sort the jobs
      /* eslint-disable curly */
      if (aa.id < bb.id) return 1;
      if (aa.id > bb.id) return -1;
      /* eslint-enable curly */
      return 0;
    });
  }

  _copyAddress (pTarget) {
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(pTarget.firstChild);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();

    Utils.addToolTip(pTarget, "Copied!");
  }

  _restoreClickToCopy (pTarget) {
    Utils.addToolTip(pTarget, "Click to copy");
  }

  static showErrorRowInstead (pTable, pData, pMsgDiv) {

    if (pData === null) {
      // not an error, but also nothing to show
      return true;
    }

    if (typeof pData === "object") {
      // not an error
      return false;
    }

    const td = Route.createTd("", "");
    td.colSpan = 99;
    const span = Route.createSpan("", "(error)");
    Utils.addToolTip(span, pData, "bottom-left");
    td.appendChild(span);

    const tr = document.createElement("tr");
    tr.appendChild(td);

    pTable.appendChild(tr);

    // hide the "(loading)" message
    if (pMsgDiv !== null) {
      pMsgDiv.style.display = "none";
    }

    return true;
  }

  loadMinionsTxt () {
    const staticMinionsTxtPromise = this.router.api.getStaticMinionsTxt();

    staticMinionsTxtPromise.then((pStaticMinionsTxt) => {
      if (pStaticMinionsTxt) {
        const lines = pStaticMinionsTxt.
          trim().
          split(/\r?\n/).
          filter((item) => !item.startsWith("#"));
        const minions = {};
        for (const line of lines) {
          const fields = line.split("\t");
          if (fields.length === 1) {
            minions[fields[0]] = "true";
          } else {
            minions[fields[0]] = fields[1];
          }
        }
        Utils.setStorageItem("session", "minions-txt", JSON.stringify(minions));
      } else {
        Utils.setStorageItem("session", "minions-txt", "{}");
      }
    }, () => {
      Utils.setStorageItem("session", "minions-txt", "{}");
    });
  }
}
