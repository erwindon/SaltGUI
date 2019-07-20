import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class GrainsMinionRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]grainsminion$", "Grains", "#page-grains-minion", "#button-grains", pRouter);

    this._handleLocalGrainsItems = this._handleLocalGrainsItems.bind(this);

    const closeButton = this.pageElement.querySelector("#grains-minion-button-close");
    closeButton.addEventListener("click", pClickEvent =>
      this.router.goTo("/grains")
    );
  }

  onShow() {
    const myThis = this;

    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    const titleElement = document.getElementById("grains-minion-title");
    titleElement.innerText = "Grains on " + minionId;

    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(minionId);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localGrainsItemsPromise.then(pData => {
      myThis._handleLocalGrainsItems(pData, minionId);
    }, pData => {
      myThis._handleLocalGrainsItems(JSON.stringify(pData), minionId);
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

  _handleLocalGrainsItems(pData, pMinionId) {
    const panel = document.getElementById("grains-minion-panel");
    const menu = new DropDownMenu(panel);
    this._addMenuItemGrainsSetValAdd(menu, pMinionId);
    this._addMenuItemSaltUtilRefreshGrains(menu, pMinionId);

    const container = document.getElementById("grains-minion-list");

    // new menus are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    const titleElement = document.getElementById("grains-minion-title");
    panel.insertBefore(menu.menuDropdown, titleElement.nextSibling);

    if(PageRoute.showErrorRowInstead(container.tBodies[0], pData)) return;

    const grains = pData.return[0][pMinionId];

    if(grains === undefined) {
      const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
      msgDiv.innerText = "Unknown minion '" + pMinionId + "'";
      return;
    }
    if(grains === false) {
      const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
      msgDiv.innerText = "Minion '" + pMinionId + "' did not answer";
      return;
    }

    const grainNames = Object.keys(grains).sort();
    for(const grainName of grainNames) {
      const grainTr = document.createElement('tr');

      const grainNameTd = Route.createTd("grain-name", grainName);
      grainTr.appendChild(grainNameTd);

      const grainValue = Output.formatObject(grains[grainName]);

      const menu = new DropDownMenu(grainTr);
      this._addMenuItemGrainsSetValUpdate(menu, pMinionId, grainName, grains);
      this._addMenuItemGrainsAppendWhenNeeded(menu, pMinionId, grainName, grainValue);
      this._addMenuItemGrainsDelKey(menu, pMinionId, grainName);
      this._addMenuItemGrainsDelVal(menu, pMinionId, grainName);

      // menu comes before this data on purpose
      const grainValueTd = Route.createTd("grain-value", grainValue);
      grainTr.appendChild(grainValueTd);

      container.tBodies[0].appendChild(grainTr);

      grainTr.addEventListener("click", pClickEvent =>
        this.runCommand(pClickEvent, pMinionId, "grains.setval \"" + grainName + "\" " + JSON.stringify(grains[grainName]))
      );
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(grainNames.length,
      "No grains", "{0} grain", "{0} grains");
    msgDiv.innerText = txt;
  }

  _addMenuItemGrainsSetValAdd(pMenu, pMinionId) {
    pMenu.addMenuItem("Add&nbsp;grain...", function(pClickEvent) {
      // use placeholders for name and value
      this.runCommand(pClickEvent, pMinionId, "grains.setval <name> <value>");
    }.bind(this));
  }

  _addMenuItemSaltUtilRefreshGrains(pMenu, pMinionId) {
    pMenu.addMenuItem("Refresh&nbsp;grains...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "saltutil.refresh_grains");
    }.bind(this));
  }

  _addMenuItemGrainsSetValUpdate(pMenu, pMinionId, key, grains) {
    pMenu.addMenuItem("Edit&nbsp;grain...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId,
        "grains.setval \"" + key + "\" " + JSON.stringify(grains[key]));
    }.bind(this));
  }

  _addMenuItemGrainsAppendWhenNeeded(pMenu, pMinionId, key, pGrainValue) {
    if(!pGrainValue.startsWith("[")) {
      return;
    }
    pMenu.addMenuItem("Add&nbsp;value...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "grains.append \"" + key + "\" <value>");
    }.bind(this));
  }

  _addMenuItemGrainsDelKey(pMenu, pMinionId, key) {
    pMenu.addMenuItem("Delete&nbsp;key...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "grains.delkey \"" + key + "\"");
    }.bind(this));
  }

  _addMenuItemGrainsDelVal(pMenu, pMinionId, key) {
    pMenu.addMenuItem("Delete&nbsp;value...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "grains.delval \"" + key + "\"");
    }.bind(this));
  }
}
