import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {Route} from './Route.js';
import {TargetType} from '../TargetType.js';
import {Utils} from '../Utils.js';

export class JobRoute extends Route {

  constructor(router) {
    super("^[\/]job$", "Job", "#page-job", "", router);
    this._handleRunnerJobsListJob = this._handleRunnerJobsListJob.bind(this);
    this._handleRunnerJobsActive = this._handleRunnerJobsActive.bind(this);
  }

  onShow() {
    const myThis = this;

    const id = decodeURIComponent(Utils.getQueryParam("id"));

    const runnerJobsListJobPromise = this.router.api.getRunnerJobsListJob(id);
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    runnerJobsListJobPromise.then(pData => {
      myThis._handleRunnerJobsListJob(pData, id);
      runnerJobsActivePromise.then(pData => {
        myThis._handleRunnerJobsActive(id, pData);
      }, pData => {
        myThis._handleRunnerJobsActive(id, JSON.stringify(pData));
      });
    }, pData => {
      myThis._handleRunnerJobsListJob(JSON.stringify(pData), id);
    });
  }

  _isResultOk(result) {
    if(!result.success) return false;
    if(result.retcode !== 0) return false;
    return true;
  }

  static updateOutputFilter(output, txt) {
    // remove highlighting before re-comparing
    // as it affects the texts
    const hilitor = new Hilitor(output);
    hilitor.remove();

    // find text
    txt = txt.toUpperCase();
    for(const div of output.querySelectorAll("div")) {
      if(div.classList.contains("nohide")) continue;
      if(Utils.hasTextContent(div, txt))
        div.classList.remove("no-filter-match");
      else
        div.classList.add("no-filter-match");
    }

    // show the result
    hilitor.setMatchType("open");
    hilitor.setEndRegExp(/^$/);
    hilitor.setBreakRegExp(/^$/);

    // turn the text into a regexp
    let pattern = "";
    for(const chr of txt) {
      if((chr >= 'A' && chr <= 'Z') || (chr >= '0' && chr <= '9'))
        pattern += chr;
      else
        pattern += "\\" + chr;
    }

    hilitor.apply(pattern);
  }

  static hideShowOutputSearchBar(startElement) {
    // remove all highlights
    const hilitor = new Hilitor(startElement);
    hilitor.remove();

    // show all output
    const allFM = startElement.querySelectorAll(".no-filter-match");
    for(const fm of allFM)
      fm.classList.remove("no-filter-match");

    // hide/show search box
    const input = startElement.parentElement.querySelector("input.filter-text");
    input.onkeyup = ev => {
      if(ev.key === "Escape") {
        JobRoute.updateOutputFilter(startElement, "");
        JobRoute.hideShowOutputSearchBar(startElement);
        return;
      }
    };
    input.oninput = ev => {
      JobRoute.updateOutputFilter(startElement, input.value);
    };

    if(input.style.display === "none") {
      JobRoute.updateOutputFilter(startElement, input.value);
      input.style.display = "";
    } else {
      JobRoute.updateOutputFilter(startElement, "");
      input.style.display = "none";
    }
    input.focus();
  }

  _handleRunnerJobsListJob(pData, pJobId) {
    const myThis = this;

    const output = this.getPageElement().querySelector(".output");

    document.querySelector("#job-button-close").addEventListener("click", _ => {
      window.history.back();
    });

    const searchButton = this.getPageElement().querySelector("span.search");
    searchButton.addEventListener("click", evt => {
      JobRoute.hideShowOutputSearchBar(output);
    });

    if(typeof pData !== "object") {
      output.innerText = "";
      Utils.addErrorToTableCell(output, pData);
      this.getPageElement().querySelector(".function").innerText = "ERROR";
      return;
    }

    const info = pData.return[0];

    if(info.Error) {
      output.innerText = info.Error + " (" + pJobId + ")";
      this.getPageElement().querySelector(".function").innerText = "ERROR";
      this.getPageElement().querySelector(".time").innerText = Output.dateTimeStr(info.StartTime);
      return;
    }

    output.innerText = "";

    // use same formatter as direct commands
    const argumentsText = this._decodeArgumentsText(info.Arguments);
    const commandText = info.Function + argumentsText;
    const menuSection = this.getPageElement().querySelector(".job-menu");
    const menu = new DropDownMenu(menuSection);

    // 1: re-run with original target pattern
    this._addMenuItemRerunJob(menu, info, commandText);

    // 2: re-run list of minions
    this._addMenuItemRerunJobOnAllMinionsWhenNeeded(menu, info, commandText);

    // 3: re-run all failed (error+timeout)
    this._addMenuItemRerunJobOnUnsuccessfulMinionsWhenNeeded(menu, info, commandText);

    // 4: re-run all failed (error)
    this._addMenuItemRerunJobOnFailedMinionsWhenNeeded(menu, info, commandText);

    // 5: re-run all failed (timeout)
    this._addMenuItemRerunJobOnNonRespondingMinionsWhenNeeded(menu, info, commandText);

    // 6: kill with original target pattern
    this._addMenuItemTerminateJob(menu, info, pJobId);
    this._addMenuItemKillJob(menu, info, pJobId);
    this._addMenuItemSignalJob(menu, info, pJobId);

    const functionText = commandText + " on " +
      TargetType.makeTargetText(info["Target-type"], info.Target);
    this.getPageElement().querySelector(".function").innerText = functionText;

    this.getPageElement().querySelector(".time").innerText = Output.dateTimeStr(info.StartTime);

    let minions = ["WHEEL"];
    if(info.Minions) minions = info.Minions;
    let initialStatus = "(loading)";
    if(Object.keys(info.Result).length === info.Minions.length) {
      // we have all the results
      // that means we are done
      // don't wait for RunnerJobsActive to also tell us that we are done
      // RunnerJobsActive remains running and will overwrite with the same
      initialStatus = "done";
      this.terminateJobMenuItem.style.display = "none";
      this.killJobMenuItem.style.display = "none";
      this.signalJobMenuItem.style.display = "none";
    }
    Output.addResponseOutput(output, pJobId, minions, info.Result, info.Function, initialStatus);

    // replace any jobid
    // Don't do this with output.innerHTML as there are already
    // event handlers in place, whicgh the will be removed
    const patJid = Output.getPatEmbeddedJid();
    const elements = output.querySelectorAll(".minion-output");
    for(const element of elements) {
      let html = element.innerHTML;
      html = html.replace(patJid, "<a class='linkjid' id='linkjid\$&'>\$&</a>");
      element.innerHTML = html;
    }

    const links = output.querySelectorAll(".linkjid");
    for(const link of links) {
      const linkToJid = link.id.replace("linkjid", "");

      if(linkToJid === pJobId) {
        link.classList.add("disabled");
        Utils.addToolTip(link, "this job");
      }
      else
      {
        link.addEventListener("click", evt => {
          window.location.assign("job?id=" + linkToJid);
        });
      }

      // no longer needed
      link.removeAttribute("id");
      link.classList.remove("linkjid");
      if(!link.classList.length) link.removeAttribute("class");
    }
  }

  _addMenuItemRerunJob(pMenu, info, commandText) {
    // 2011 = NON-BREAKING HYPHEN
    pMenu.addMenuItem("Re&#x2011;run&nbsp;job...", function(evt) {
      this._runFullCommand(evt, info["Target-type"], info.Target, commandText);
    }.bind(this));
  }

  _addMenuItemRerunJobOnAllMinionsWhenNeeded(pMenu, info, commandText) {
    if(!info.Minions) return;

    let minionList = "";
    for(const m of info.Minions) {
      minionList += "," + m;
    }

    // suppress an empty list
    if(!minionList) return;

    // suppress a trivial case
    if(minionList === "," + info.Minions[0]) return;

    const lst = minionList.substring(1);
    // 2011 = NON-BREAKING HYPHEN
    pMenu.addMenuItem("Re&#x2011;run&nbsp;job&nbsp;on&nbsp;all&nbsp;minions...", function(evt) {
      this._runFullCommand(evt, "list", lst, commandText);
    }.bind(this));
  }

  _addMenuItemRerunJobOnUnsuccessfulMinionsWhenNeeded(pMenu, info, commandText) {
    if(!info.Minions) return;

    let minionList = "";
    let has1 = false, has2 = false;
    for(const m of info.Minions) {
      if(!(m in info.Result)) has1 = true;
      if(m in info.Result && !this._isResultOk(info.Result[m])) has2 = true;
      if(!(m in info.Result) || !this._isResultOk(info.Result[m])) {
        minionList += "," + m;
      }
    }

    // suppress an empty list
    if(!minionList) return;

    // only when we have both types in the list
    // otherwise the #4 or #5 is sufficient
    if(!has1 || !has2) return;

    const lst = minionList.substring(1);
    // 2011 = NON-BREAKING HYPHEN
    pMenu.addMenuItem("Re&#x2011;run&nbsp;job&nbsp;on&nbsp;unsuccessful&nbsp;minions...", function(evt) {
      this._runFullCommand(evt, "list", lst, commandText);
    }.bind(this));
  }

  _addMenuItemRerunJobOnFailedMinionsWhenNeeded(pMenu, info, commandText) {
    if(!info.Minions) return;

    let minionList = "";
    for(const m of info.Minions) {
      if(m in info.Result && !this._isResultOk(info.Result[m])) {
        minionList += "," + m;
      }
    }

    // suppress an empty list
    if(!minionList) return;

    const lst = minionList.substring(1);
    // 2011 = NON-BREAKING HYPHEN
    pMenu.addMenuItem("Re&#x2011;run&nbsp;job&nbsp;on&nbsp;failed&nbsp;minions...", function(evt) {
      this._runFullCommand(evt, "list", lst, commandText);
    }.bind(this));
  }

  _addMenuItemRerunJobOnNonRespondingMinionsWhenNeeded(pMenu, info, commandText) {
    if(!info.Minions) return;

    let minionList = "";
    for(const m of info.Minions) {
      if(!(m in info.Result)) {
        minionList += "," + m;
      }
    }

    // suppress an empty list
    if(!minionList) return;

    const lst = minionList.substring(1);
    // 2011 = NON-BREAKING HYPHEN
    pMenu.addMenuItem("Re&#x2011;run&nbsp;job&nbsp;on&nbsp;non&nbsp;responding&nbsp;minions...", function(evt) {
      this._runFullCommand(evt, "list", lst, commandText);
    }.bind(this));
  }

  _addMenuItemTerminateJob(pMenu, info, pJobId) {
    this.terminateJobMenuItem = pMenu.addMenuItem("Terminate&nbsp;job...", function(evt) {
      this._runFullCommand(evt, info["Target-type"], info.Target, "saltutil.term_job " + pJobId);
    }.bind(this));
  }

  _addMenuItemKillJob(pMenu, info, pJobId) {
    this.killJobMenuItem = pMenu.addMenuItem("Kill&nbsp;job...", function(evt) {
      this._runFullCommand(evt, info["Target-type"], info.Target, "saltutil.kill_job " + pJobId);
    }.bind(this));
  }

  _addMenuItemSignalJob(pMenu, info, pJobId) {
    this.signalJobMenuItem = pMenu.addMenuItem("Signal&nbsp;job...", function(evt) {
      this._runFullCommand(evt, info["Target-type"], info.Target, "saltutil.signal_job " + pJobId + " signal=<signalnumber>");
    }.bind(this));
  }

  _handleRunnerJobsActive(id, pData) {
    const summaryJobsActiveSpan = this.getPageElement().querySelector("pre.output span#summary-jobs-active");
    if(!summaryJobsActiveSpan) return;

    if(typeof pData !== "object") {
      summaryJobsActiveSpan.innerText = "(error)";
      Utils.addToolTip(summaryJobsActiveSpan, pData);
      return;
    }

    const info = pData.return[0][id];

    // when the job is already completely done, nothing is returned
    if(!info) {
      summaryJobsActiveSpan.innerText = "done";
      if(this.terminateJobMenuItem) {
        // nothing left to terminate
        this.terminateJobMenuItem.style.display = "none";
      }
      if(this.killJobMenuItem) {
        // nothing left to kill
        this.killJobMenuItem.style.display = "none";
      }
      if(this.signalJobMenuItem) {
        // nothing left to signal
        this.signalJobMenuItem.style.display = "none";
      }
      return;
    }

    summaryJobsActiveSpan.innerText = info.Running.length + " active";

    // update the minion details
    for(const minionInfo of info.Running) {
      // each minionInfo is like {'minion': pid}
      for(const minionId in minionInfo) {
        const pid = minionInfo[minionId];
        const noResponseSpan = this.getPageElement().querySelector("pre.output div#" + Utils.getIdFromMinionId(minionId) + " span.noresponse");
        if(!noResponseSpan) continue;

        // show that this minion is still active on the request
        noResponseSpan.innerText = "(active) ";

        const linkPsProcInfo = document.createElement("a");
        linkPsProcInfo.innerText = "info";
        linkPsProcInfo.addEventListener("click", evt => {
          this._runFullCommand(evt, "list", minionId, "ps.proc_info " + pid);
        });
        noResponseSpan.appendChild(linkPsProcInfo);

        noResponseSpan.appendChild(document.createTextNode(" "));

        const linkPsTermPid = document.createElement("a");
        linkPsTermPid.innerText = "term";
        linkPsTermPid.addEventListener("click", evt => {
          this._runFullCommand(evt, "list", minionId, "ps.kill_pid " + pid + " signal=15");
        });
        noResponseSpan.appendChild(linkPsTermPid);

        noResponseSpan.appendChild(document.createTextNode(" "));

        const linkPsKillPid = document.createElement("a");
        linkPsKillPid.innerText = "kill";
        linkPsKillPid.addEventListener("click", evt => {
          this._runFullCommand(evt, "list", minionId, "ps.kill_pid " + pid + " signal=9");
        });
        noResponseSpan.appendChild(linkPsKillPid);

        noResponseSpan.appendChild(document.createTextNode(" "));

        const linkPsSignalPid = document.createElement("a");
        linkPsSignalPid.innerText = "signal";
        linkPsSignalPid.addEventListener("click", evt => {
          this._runFullCommand(evt, "list", minionId, "ps.kill_pid " + pid + " signal=<signalnumber>");
        });
        noResponseSpan.appendChild(linkPsSignalPid);

        noResponseSpan.classList.remove("noresponse");
        noResponseSpan.classList.add("active");
      }
    }
  }
}
