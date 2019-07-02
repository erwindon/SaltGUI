import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class GrainsRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]grains$", "Grains", "#page-grains", "#button-grains", pRouter);

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._updateMinion = this._updateMinion.bind(this);

    // collect the list of displayed minions
    let previewGrainsText = window.localStorage.getItem("preview_grains");
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
    // First detroy all the default sorting handlers.
    // A (deep)copy of a minionTr does not copy its handlers.
    const oldHead = this.pageElement.querySelector("#page-grains table thead");
    const newHead = oldHead.cloneNode(true);
    oldHead.parentNode.replaceChild(newHead, oldHead);
    // Now re-start sorting logic.
    sorttable.makeSortable(this.pageElement.querySelector("#page-grains table"));
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(pData1 => {
      myThis._handleWheelKeyListAll(pData1);
      localGrainsItemsPromise.then(pData => {
        myThis._updateMinions(pData);
      }, pData2 => {
        const pData = {"return":[{}]};
        for(const k of pData1.return[0].data.return.minions)
          pData.return[0][k] = JSON.stringify(pData2);
        myThis._updateMinions(pData);
      });
    }, pData => {
      myThis._handleWheelKeyListAll(JSON.stringify(pData));
    });

    runnerJobsListJobsPromise.then(pData => {
      myThis._handleRunnerJobsListJobs(pData);
      runnerJobsActivePromise.then(pData => {
        myThis._handleRunnerJobsActive(pData);
      }, pData => {
        myThis._handleRunnerJobsActive(JSON.stringify(pData));
      });
    }, pData => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(pData));
    }); 
  }

  _handleWheelKeyListAll(pData) {
    const table = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(table, pData)) return;

    const keys = pData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for(const minionId of minionIds) {
      this._addMinion(table, minionId, 1 + this._previewGrains.length);

      // preliminary dropdown menu
      const minionTr = table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemShowGrains(menu, minionId);

      for(let i = 0; i < this._previewGrains.length; i++) {
        minionTr.appendChild(Route._createTd("", ""));
      }

      minionTr.addEventListener("click", pClickEvent =>
        window.location.assign("grainsminion?minionid=" + encodeURIComponent(minionId))
      );
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msgDiv.innerText = txt;
  }

  _updateOfflineMinion(pContainer, pMinionId) {
    super._updateOfflineMinion(pContainer, pMinionId);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Route._createTd("saltversion", ""));
    minionTr.appendChild(Route._createTd("os", ""));
    minionTr.appendChild(Route._createTd("graininfo", ""));
    minionTr.appendChild(Route._createTd("run-command-button", ""));
    for(let i = 0; i < this._previewGrains.length; i++) {
      minionTr.appendChild(Route._createTd("", ""));
    }
  }

  _updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains) {
    super._updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    if(typeof pMinionData === "object") {
      const cnt = Object.keys(pMinionData).length;
      const grainInfoText = cnt + " grains";
      const grainInfoTd = Route._createTd("graininfo", grainInfoText);
      grainInfoTd.setAttribute("sorttable_customkey", cnt);
      minionTr.appendChild(grainInfoTd);
    } else {
      const grainInfoTd = Route._createTd("", "");
      Utils.addErrorToTableCell(grainInfoTd, pMinionData);
      minionTr.appendChild(grainInfoTd);
    }

    const menu = new DropDownMenu(minionTr);
    this._addMenuItemShowGrains(menu, pMinionId);

    // add the preview columns
    for(let i = 0; i < this._previewGrains.length; i++) {
      const td = Route._createTd("", "");
      const grainName = this._previewGrains[i];
      if(typeof pMinionData === "object") {
        if(grainName in pMinionData) {
          td.innerText = Output.formatObject(pMinionData[grainName]);
          td.classList.add("grain-value");
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
