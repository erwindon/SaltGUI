import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class GrainsMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]grainsminion$", "Grains", "#page_grainsminion", "#button_grains", router);

    this._handleLocalGrainsItems = this._handleLocalGrainsItems.bind(this);

    this.page_element.querySelector("#button_close_grainsminion").addEventListener("click", _ => {
      this.router.goTo("/grains");
    });
  }

  onShow() {
    const myThis = this;

    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    const title = document.getElementById("grainsminion_title");
    title.innerText = "Grains on " + minion;

    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(minion);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localGrainsItemsPromise.then(data => {
      myThis._handleLocalGrainsItems(data, minion);
    }, data => {
      myThis._handleLocalGrainsItems(JSON.stringify(data), minion);
    });

    runnerJobsListJobsPromise.then(data => {
      myThis._handleRunnerJobsListJobs(data);
      runnerJobsActivePromise.then(data => {
        myThis._handleRunnerJobsActive(data);
      }, data => {
        myThis._handleRunnerJobsActive(JSON.stringify(data));
      });
    }, data => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(data));
    }); 
  }

  _handleLocalGrainsItems(data, minion) {
    const page = document.getElementById("grainsminion_page");
    const menu = new DropDownMenu(page);
    this._addMenuItemAddGrain(menu, minion);
    this._addMenuItemRefreshGrains(menu, minion);

    const container = document.getElementById("grainsminion_list");

    // new menu's are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    const title = document.getElementById("grainsminion_title");
    page.insertBefore(menu.menuDropdown, title.nextSibling);

    if(PageRoute.showErrorRowInstead(container.tBodies[0], data)) return;

    const grains = data.return[0][minion];

    if(grains === undefined) {
      const noGrainsMsg = Route._createDiv("msg", "Unknown minion '" + minion + "'");
      container.tBodies[0].appendChild(noGrainsMsg);
      return;
    }
    if(grains === false) {
      const noGrainsMsg = Route._createDiv("msg", "Minion '" + minion + "' did not answer");
      container.tBodies[0].appendChild(noGrainsMsg);
      return;
    }

    const keys = Object.keys(grains).sort();
    for(const k of keys) {
      const grain = document.createElement('tr');

      const name = Route._createTd("grain_name", k);
      grain.appendChild(name);

      const grain_value = Output.formatObject(grains[k]);

      const menu = new DropDownMenu(grain);
      this._addMenuItemEditGrain(menu, minion, k, grains);
      this._addMenuItemAddValueWhenNeeded(menu, minion, k, grain_value);
      this._addMenuItemDeleteKey(menu, minion, k);
      this._addMenuItemDeleteValue(menu, minion, k);

      // menu comes before this data on purpose
      const value = Route._createTd("grain_value", grain_value);
      grain.appendChild(value);

      container.tBodies[0].appendChild(grain);

      grain.addEventListener("click", evt => this._runCommand(evt, minion, "grains.setval \"" + k + "\" " + JSON.stringify(grains[k])));
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msg = this.page_element.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(keys.length,
      "No grains", "{0} grain", "{0} grains");
    msg.innerText = txt;
  }

  _addMenuItemAddGrain(menu, minion) {
    menu.addMenuItem("Add&nbsp;grain...", function(evt) {
      // use placeholders for name and value
      this._runCommand(evt, minion, "grains.setval <name> <value>");
    }.bind(this));
  }

  _addMenuItemRefreshGrains(menu, minion) {
    menu.addMenuItem("Refresh&nbsp;grains...", function(evt) {
      this._runCommand(evt, minion, "saltutil.refresh_grains");
    }.bind(this));
  }

  _addMenuItemEditGrain(menu, minion, key, grains) {
    menu.addMenuItem("Edit&nbsp;grain...", function(evt) {
      this._runCommand(evt, minion,
        "grains.setval \"" + key + "\" " + JSON.stringify(grains[key]));
    }.bind(this));
  }

  _addMenuItemAddValueWhenNeeded(menu, minion, key, grain_value) {
    if(!grain_value.startsWith("[")) {
      return;
    }
    menu.addMenuItem("Add&nbsp;value...", function(evt) {
      this._runCommand(evt, minion, "grains.append \"" + key + "\" <value>");
    }.bind(this));
  }

  _addMenuItemDeleteKey(menu, minion, key) {
    menu.addMenuItem("Delete&nbsp;key...", function(evt) {
      this._runCommand(evt, minion, "grains.delkey \"" + key + "\"");
    }.bind(this));
  }

  _addMenuItemDeleteValue(menu, minion, key) {
    menu.addMenuItem("Delete&nbsp;value...", function(evt) {
      this._runCommand(evt, minion, "grains.delval \"" + key + "\"");
    }.bind(this));
  }
}
