import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class MinionsRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]$", "Minions", "#page-minions", "#button-minions", pRouter);

    this._handleMinionsWheelKeyListAll = this._handleMinionsWheelKeyListAll.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(pData1 => {
      myThis._handleMinionsWheelKeyListAll(pData1);
      localGrainsItemsPromise.then(pData => {
        myThis.updateMinions(pData);
      }, pData2 => {
        const pData = {"return":[{}]};
        if(pData1)
          for(const k of pData1.return[0].data.return.minions)
            pData.return[0][k] = JSON.stringify(pData2);
        myThis.updateMinions(pData);
      });
    }, pData => {
      myThis._handleMinionsWheelKeyListAll(JSON.stringify(pData));
    });

    runnerJobsListJobsPromise.then(pData => {
      myThis.handleRunnerJobsListJobs(pData);
      runnerJobsActivePromise.then(pData => {
        myThis.handleRunnerJobsActive(pData);
      }, pData => {
        myThis.handleRunnerJobsActive(JSON.stringify(pData));
      });
    }, pData => {
      myThis.handleRunnerJobsListJobs(JSON.stringify(pData));
    }); 
  }

  _handleMinionsWheelKeyListAll(pData) {
    const table = this.getPageElement().querySelector("#minions");

    if(PageRoute.showErrorRowInstead(table, pData)) return;

    const keys = pData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for(const minionId of minionIds) {
      this.addMinion(table, minionId, 1);

      // preliminary dropdown menu
      const minionTr = table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemStateApply(menu, minionId);

      minionTr.addEventListener("click", pClickEvent =>
        this.runCommand(pClickEvent, minionId, "state.apply")
      );
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msgDiv.innerText = txt;
  }

  updateOfflineMinion(pContainer, pMinionId) {
    super.updateOfflineMinion(pContainer, pMinionId);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Route.createTd("saltversion", ""));
    minionTr.appendChild(Route.createTd("os", ""));
    minionTr.appendChild(Route.createTd("run-command-button", ""));
  }

  updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemStateApply(menu, pMinionId);

    minionTr.addEventListener("click", pClickEvent =>
      this.runCommand(pClickEvent, pMinionId, "state.apply")
    );
  }

  _addMenuItemStateApply(pMenu, pMinionId) {
    pMenu.addMenuItem("Apply&nbsp;state...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "state.apply");
    }.bind(this));
  }
}
