/* global document setTimeout window */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {Utils} from "../Utils.js";

export class Issues {

  constructor () {
    this.issuesData = new Map();
  }

  onGetIssues (pPanel, pTitle) {
    this.api = pPanel.api;

    const msg = Utils.createDiv("msg", "(loading info for " + pTitle + ")");
    pPanel.msg2.appendChild(msg);

    return msg;
  }

  removeCategory (pCatName) {
    this.issuesData.delete(pCatName);
  }

  removeIssue (pCatName, pIssueName) {
    const cat = this.issuesData.get(pCatName);
    if (cat) {
      cat.delete(pIssueName);
    }
  }

  addIssue (pCatName, pIssueName) {
    if (!this.issuesData.has(pCatName)) {
      this.issuesData.set(pCatName, new Map());
    }
    const cat = this.issuesData.get(pCatName);

    // only create new issue if it doesn't exist yet
    if (!cat.has(pIssueName)) {
      cat.set(pIssueName, {
        commands: [],
        errorMsg: null,
        message: "",
        navigations: [],
        urls: []
      });
    }

    return cat.get(pIssueName);
  }

  _removeAndCreateNewIssue (pCatName, pIssueName) {
    // remove a previous incarnation of the same issue
    this.removeIssue(pCatName, pIssueName);
    return this.addIssue(pCatName, pIssueName);
  }

  setIssueMsg (pCatName, pIssueName, pTitle) {
    const issueData = this.addIssue(pCatName, pIssueName);
    issueData.message = pTitle;
  }

  setIssueErr (pCatName, pIssueName, pErrorMsg) {
    const issueData = this.addIssue(pCatName, pIssueName);
    issueData.errorMsg = pErrorMsg;
  }

  addIssueCmd (pCatName, pIssueName, pTitle, pTarget, pCommand) {
    const issueData = this.addIssue(pCatName, pIssueName);
    issueData.commands.push({command: pCommand, target: pTarget, title: pTitle});
  }

  addIssueNav (pCatName, pIssueName, pPage, pArgs, pLocationId = null) {
    const issueData = this.addIssue(pCatName, pIssueName);
    const nav = {args: pArgs, page: pPage};
    if (pLocationId) {
      nav.locationId = pLocationId;
    }
    issueData.navigations.push(nav);
  }

  addIssueUrl (pCatName, pIssueName, pTitle, pUrl) {
    const issueData = this.addIssue(pCatName, pIssueName);
    issueData.urls.push({title: pTitle, url: pUrl});
  }

  readyCategory (pPanel, pCatName, pMsg) {

    // remove the "loading info..." message
    if (pMsg?.parentElement) {
      pMsg.remove();
    }

    this._renderCategory(pPanel, pCatName);

    // remove the corresponding issueData now that it's been rendered
    this.removeCategory(pCatName);

    pPanel.issuesStatus = Utils.txtZeroOneMany(
      pPanel.table.tBodies[0].children.length,
      "No issues", "{0} issue", "{0} issues");
    pPanel.updateFooter();

    // any category still loading?
    if (pPanel.msg2.childNodes.length > 0) {
      // not yet
      return;
    }

    pPanel.setTableSortable("Description", "asc");
  }

  _renderCategory (pPanel, pCatName) {
    const categoryData = this.issuesData.get(pCatName);
    if (!categoryData) {
      return;
    }

    for (const [issueName, issueData] of categoryData) {
      const key = pCatName + "-" + issueName;
      if (!pPanel.existingIssueKeys.has(key)) {
        Issues._renderIssue(pPanel, pCatName, issueName, issueData);
        pPanel.existingIssueKeys.add(key);
      }
    }
  }

  static _navigateAndOptionalScroll (pRouter, pNav, pClickEvent) {
    pRouter.goTo(pNav.page, pNav.args, undefined, pClickEvent);
    if (pNav.locationId) {
      setTimeout(() => {
        const elem = document.getElementById(pNav.locationId);
        if (elem) {
          elem.scrollIntoView({behavior: "smooth"});
        }
      }, 100);
    }
  }

  static _renderIssue (pPanel, pCatName, pIssueName, pIssueData) {
    const theTr = Utils.createTr();

    const menu = new DropDownMenu(theTr, "smaller");
    theTr.menu = menu;

    const descTd = Utils.createTd();
    const descSpan = Utils.createSpan("desc");
    descSpan.innerText = pIssueData.message;
    descTd.appendChild(descSpan);
    theTr.appendChild(descTd);

    theTr.myCatName = pCatName;
    theTr.myIssueName = pIssueName;
    theTr.panel = pPanel;

    // Add error tooltip if present
    if (pIssueData.errorMsg) {
      Utils.addToolTip(descSpan, pIssueData.errorMsg);
    }

    // Add command menu items and click handlers
    let hasClick = false;
    for (const cmd of pIssueData.commands) {
      menu.addMenuItem(cmd.title + "...", () => {
        theTr.panel.runCommand("", cmd.target, cmd.command);
      });
      hasClick = true;
    }

    // Add navigation menu items and click handlers
    for (const nav of pIssueData.navigations) {
      let title;
      if (nav.page.endsWith("-minion")) {
        // when unclear, add "for this minion" to title
        title = "Go to " + nav.page.replace("-minion", "") + " page";
      } else {
        title = "Go to " + nav.page + " page";
      }
      menu.addMenuItem(title, (pClickEvent) => {
        Issues._navigateAndOptionalScroll(theTr.panel.router, nav, pClickEvent);
      });
      hasClick = true;
    }

    // Add URL menu items and click handlers
    for (const url of pIssueData.urls) {
      const title = "Go to " + url.title + " " + Character.HEAVY_NORTH_EAST_ARROW;
      menu.addMenuItem(title, (pClickEvent) => {
        window.open(url.url, "_blank");
        pClickEvent.stopPropagation();
      });
      hasClick = true;
    }

    // Add click event to row if there are any menu items
    if (hasClick) {
      let clickHandled = false;
      theTr.addEventListener("click", (pClickEvent) => {
        if (!clickHandled) {
          // default action: execute first command or navigate
          if (pIssueData.commands.length > 0) {
            const cmd = pIssueData.commands[0];
            theTr.panel.runCommand("", cmd.target, cmd.command);
          } else if (pIssueData.navigations.length > 0) {
            Issues._navigateAndOptionalScroll(theTr.panel.router, pIssueData.navigations[0], pClickEvent);
          } else if (pIssueData.urls.length > 0) {
            window.open(pIssueData.urls[0].url, "_blank");
          }
          clickHandled = true;
        }
        pClickEvent.stopPropagation();
      });
    }

    pPanel.table.tBodies[0].appendChild(theTr);
  }
}
