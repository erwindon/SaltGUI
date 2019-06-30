import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class MinionsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]$", "Minions", "#page-minions", "#button-minions", router);

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();
    //we need these functions to populate the dropdown boxes
    const wheelConfigValuesPromise = this.router.api.getWheelConfigValues();

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

    //we need these functions to populate the dropdown boxes
    wheelConfigValuesPromise.then(pData => {
      myThis._handleWheelConfigValues(pData);
    }, pData => {
      // never mind
    });
  }

  _handleWheelConfigValues(pData) {
    // store for later use

    const templates = pData.return[0].data.return.saltgui_templates;
    window.localStorage.setItem("templates", JSON.stringify(templates));

    const public_pillars = pData.return[0].data.return.saltgui_public_pillars;
    window.localStorage.setItem("public_pillars", JSON.stringify(public_pillars));

    const preview_grains = pData.return[0].data.return.saltgui_preview_grains;
    window.localStorage.setItem("preview_grains", JSON.stringify(preview_grains));

    const hide_jobs = pData.return[0].data.return.saltgui_hide_jobs;
    window.localStorage.setItem("hide_jobs", JSON.stringify(hide_jobs));
    const show_jobs = pData.return[0].data.return.saltgui_show_jobs;
    window.localStorage.setItem("show_jobs", JSON.stringify(show_jobs));

    let nodegroups = pData.return[0].data.return.nodegroups;
    if(!nodegroups) nodegroups = {};
    window.localStorage.setItem("nodegroups", JSON.stringify(nodegroups));

    const output_formats = pData.return[0].data.return.saltgui_output_formats;
    window.localStorage.setItem("output_formats", JSON.stringify(output_formats));

    const datetime_fraction_digits = pData.return[0].data.return.saltgui_datetime_fraction_digits;
    window.localStorage.setItem("datetime_fraction_digits", JSON.stringify(datetime_fraction_digits));

    const tooltip_mode = pData.return[0].data.return.saltgui_tooltip_mode;
    window.localStorage.setItem("tooltip_mode", tooltip_mode);
  }

  _handleWheelKeyListAll(pData) {
    const list = this.getPageElement().querySelector("#minions");

    if(PageRoute.showErrorRowInstead(list, pData)) return;

    const keys = pData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for(const minionId of minionIds) {
      this._addMinion(list, minionId, 1);

      // preliminary dropdown menu
      const minionTr = list.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemStateApply(menu, minionId);

      minionTr.addEventListener("click", evt =>
        this._runCommand(evt, minionId, "state.apply")
      );
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msg = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msg.innerText = txt;
  }

  _updateOfflineMinion(pContainer, pMinionId) {
    super._updateOfflineMinion(pContainer, pMinionId);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Route._createTd("saltversion", ""));
    minionTr.appendChild(Route._createTd("os", ""));
    minionTr.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains) {
    super._updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemStateApply(menu, pMinionId);

    minionTr.addEventListener("click", evt => this._runCommand(evt, pMinionId, "state.apply"));
  }

  _addMenuItemStateApply(pMenu, pMinionId) {
    pMenu.addMenuItem("Apply&nbsp;state...", function(evt) {
      this._runCommand(evt, pMinionId, "state.apply");
    }.bind(this));
  }
}
