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

    wheelKeyListAllPromise.then(pWheelKeyListAllData => {
      myThis._handleMinionsWheelKeyListAll(pWheelKeyListAllData);
      localGrainsItemsPromise.then(pLocalGrainsItemsData => {
        myThis.updateMinions(pLocalGrainsItemsData);
      }, pLocalGrainsItemsMsg => {
        const localGrainsItemsData = {"return":[{}]};
        if(pWheelKeyListAllData)
          for(const k of pWheelKeyListAllData.return[0].data.return.minions)
            localGrainsItemsData.return[0][k] = JSON.stringify(pLocalGrainsItemsMsg);
        myThis.updateMinions(localGrainsItemsData);
      });
    }, pWheelKeyListAllMsg => {
      myThis._handleMinionsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
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

  _handleMinionsWheelKeyListAll(pWheelKeyListAll) {
    const table = this.getPageElement().querySelector("#minions");

    if(PageRoute.showErrorRowInstead(table, pWheelKeyListAll)) return;

    const keys = pWheelKeyListAll.return[0].data.return;

    const minionIds = keys.minions.sort();
    for(const minionId of minionIds) {
      this.addMinion(table, minionId, 1);

      // preliminary dropdown menu
      const minionTr = table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemStateApply(menu, minionId);
      this._addMenuItemStateApplyTest(menu, minionId);

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
    this._addMenuItemStateApplyTest(menu, pMinionId);

    minionTr.addEventListener("click", pClickEvent =>
      this.runCommand(pClickEvent, pMinionId, "state.apply")
    );
  }

  _addMenuItemStateApply(pMenu, pMinionId) {
    pMenu.addMenuItem("Apply&nbsp;state...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "state.apply");
    }.bind(this));
  }

  _addMenuItemStateApplyTest(pMenu, pMinionId) {
    pMenu.addMenuItem("Test&nbsp;state...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "state.apply test=True");
    }.bind(this));
  }
}
