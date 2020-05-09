import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class GrainsRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]grains$", "Grains", "#page-grains", "#button-grains", pRouter);

    this._handleGrainsWheelKeyListAll = this._handleGrainsWheelKeyListAll.bind(this);
    this.updateMinion = this.updateMinion.bind(this);

    // collect the list of displayed minions
    let previewGrainsText = window.sessionStorage.getItem("preview_grains");
    if(!previewGrainsText || previewGrainsText === "undefined") {
      previewGrainsText = "[]";
    }
    this._previewGrains = JSON.parse(previewGrainsText);
    if(!Array.isArray(this._previewGrains)) {
      this._previewGrains = [ ];
    }
    // add the preview columns
    const tr = this.pageElement.querySelector("#page-grains thead tr");
    for(let i = 0; i < this._previewGrains.length; i++) {
      const th = document.createElement("th");
      th.innerText = this._previewGrains[i];
      tr.appendChild(th);
    }

    // The new columns are not yet sortable, make sure they are.
    // First destroy all the default sorting handlers.
    // A (deep)copy of an element does not copy its handlers.
    const oldHead = this.pageElement.querySelector("#page-grains table thead");
    const newHead = oldHead.cloneNode(true);
    oldHead.parentNode.replaceChild(newHead, oldHead);
    sorttable.makeSortable(newHead.parentNode);

    Utils.makeTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(pWheelKeyListAllData => {
      myThis._handleGrainsWheelKeyListAll(pWheelKeyListAllData);
      localGrainsItemsPromise.then(pLocalGrainsItemsData => {
        myThis.updateMinions(pLocalGrainsItemsData);
      }, pLocalGrainsItemsMsg => {
        const localGrainsItemsData = {"return":[{}]};
        for(const k of pWheelKeyListAllData.return[0].data.return.minions)
          localGrainsItemsData.return[0][k] = JSON.stringify(pLocalGrainsItemsMsg);
        myThis.updateMinions(localGrainsItemsData);
      });
    }, pWheelKeyListAllMsg => {
      myThis._handleGrainsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
    });

    runnerJobsListJobsPromise.then(pRunnerJobsListJobsData => {
      myThis.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then(pRunnerJobsActiveData => {
        myThis.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, pRunnerJobsActiveMsg => {
        myThis.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, pRunnerJobsListJobsMsg => {
      myThis.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    }); 
  }

  _handleGrainsWheelKeyListAll(pWheelKeyListAllData) {
    const table = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(table, pWheelKeyListAllData)) return;

    const keys = pWheelKeyListAllData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for(const minionId of minionIds) {
      this.addMinion(table, minionId, 1 + this._previewGrains.length);

      // preliminary dropdown menu
      const minionTr = table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemShowGrains(menu, minionId);

      for(let i = 0; i < this._previewGrains.length; i++) {
        minionTr.appendChild(Route.createTd("", ""));
      }

      minionTr.addEventListener("click", pClickEvent =>
        window.location.assign("grainsminion?minionid=" + encodeURIComponent(minionId))
      );
    }

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msgDiv.innerText = txt;
  }

  updateOfflineMinion(pContainer, pMinionId, pMinionTxt) {
    super.updateOfflineMinion(pContainer, pMinionId, pMinionTxt);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Route.createTd("saltversion", ""));
    minionTr.appendChild(Route.createTd("os", ""));
    minionTr.appendChild(Route.createTd("graininfo", ""));
    minionTr.appendChild(Route.createTd("run-command-button", ""));
    for(let i = 0; i < this._previewGrains.length; i++) {
      minionTr.appendChild(Route.createTd("", ""));
    }
  }

  updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    if(typeof pMinionData === "object") {
      const cnt = Object.keys(pMinionData).length;
      const grainInfoText = cnt + " grains";
      const grainInfoTd = Route.createTd("graininfo", grainInfoText);
      grainInfoTd.setAttribute("sorttable_customkey", cnt);
      minionTr.appendChild(grainInfoTd);
    } else {
      const grainInfoTd = Route.createTd("", "");
      Utils.addErrorToTableCell(grainInfoTd, pMinionData);
      minionTr.appendChild(grainInfoTd);
    }

    const menu = new DropDownMenu(minionTr);
    this._addMenuItemShowGrains(menu, pMinionId);

    // add the preview columns
    for(let i = 0; i < this._previewGrains.length; i++) {
      const td = Route.createTd("", "");
      const grainName = this._previewGrains[i];
      if(typeof pMinionData === "object") {
        if(grainName.startsWith("$")) {
          // it is a json path
          const obj = jsonPath(pMinionData, grainName);
          if(Array.isArray(obj)) {
            td.innerText = Output.formatObject(obj[0]);
            td.classList.add("grain-value");
          }
        } else {
          // a plain grain-name or a path in the grains.get style
          const grainNames = grainName.split(":");
          let obj = pMinionData;
          for(const gn of grainNames) {
            if(obj) {
              obj = obj[gn];
            }
          }
          if(obj) {
            td.innerText = Output.formatObject(obj);
            td.classList.add("grain-value");
          }
        }
      } else {
        Utils.addErrorToTableCell(td, pMinionData);
      }
      minionTr.appendChild(td);
    }

    minionTr.addEventListener("click", pClickEvent =>
      window.location.assign("grainsminion?minionid=" + encodeURIComponent(pMinionId))
    );
  }

  _addMenuItemShowGrains(pMenu, pMinionId) {
    pMenu.addMenuItem("Show&nbsp;grains", function(pClickEvent) {
      window.location.assign("grainsminion?minionid=" + encodeURIComponent(pMinionId));
    }.bind(this));
  }
}
