/* global */

import {DropDownMenu} from "../DropDown.js";
import {Utils} from "../Utils.js";

export class Issues {

  static removeCategory (pPanel, pCatName) {
    const rows = pPanel.table.tBodies[0].childNodes;
    for (const tr of rows) {
      if (tr.myCatName === pCatName) {
        tr.parentNode.removeChild(tr);
      }
    }
    pPanel.updateFooter();
  }

  static removeIssue (pPanel, pCatName, pIssueName) {
    const rows = pPanel.table.tBodies[0].childNodes;
    for (const tr of rows) {
      if (tr.myCatName === pCatName && tr.myIssueName === pIssueName) {
        tr.parentNode.removeChild(tr);
      }
    }
    pPanel.updateFooter();
  }

  static addIssue (pPanel, pCatName, pIssueName) {

    // remove a previous incarnation of the same issue
    Issues.removeIssue(pPanel, pCatName, pIssueName);

    const theTr = document.createElement("tr");

    // const keyTd = document.createElement("td");
    // keyTd.innerText = pCatName + "-" + pIssueName;
    // keyTd.classList.add("key");
    // theTr.appendChild(keyTd);

    const menu = new DropDownMenu(theTr, true);
    theTr.menu = menu;

    const descTd = document.createElement("td");
    const descSpan = document.createElement("span");
    descSpan.classList.add("desc");
    descTd.appendChild(descSpan);
    theTr.appendChild(descTd);

    theTr.myCatName = pCatName;
    theTr.myIssueName = pIssueName;
    theTr.panel = pPanel;

    pPanel.table.tBodies[0].appendChild(theTr);

    pPanel.updateFooter();

    return theTr;
  }

  static addIssueMsg (pTr, pTitle) {
    const desc = pTr.querySelector("td .desc");
    desc.innerText = pTitle;
  }

  static addIssueErr (pTr, pErrorMsg) {
    const desc = pTr.querySelector("td .desc");
    Utils.addToolTip(desc, pErrorMsg);
  }

  static addIssueCmd (pTr, pTitle, pTarget, pCommand) {
    pTr.menu.addMenuItem(pTitle + "...", () => {
      pTr.panel.runCommand("", pTarget, pCommand);
    });

    if (pTr.hasClick !== true) {
      pTr.addEventListener("click", (ClickEvent) => {
        pTr.panel.runCommand("", pTarget, pCommand);
        ClickEvent.stopPropagation();
      });
    }
    pTr.hasClick = true;
  }

  static addIssueNav (pTr, pPage, pArgs) {
    let title;
    if (pPage.endsWith("-minion")) {
      // when unclear, add "for this minion" to title
      title = "Go to " + pPage.replace("-minion", "") + " page";
    } else {
      title = "Go to " + pPage + " page";
    }
    pTr.menu.addMenuItem(title, () => {
      pTr.panel.router.goTo(pPage, pArgs);
    });

    if (pTr.hasClick !== true) {
      pTr.addEventListener("click", (ClickEvent) => {
        pTr.panel.router.goTo(pPage, pArgs);
        ClickEvent.stopPropagation();
      });
    }
    pTr.hasClick = true;
  }
}
