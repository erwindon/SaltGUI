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
      myThis._handleLocalGrainsItems(data);
    }, data => {
      myThis._handleLocalGrainsItems(JSON.stringify(data));
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

  _handleLocalGrainsItems(data) {
    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    const container = document.getElementById("grainsminion_list");

    while(container.tBodies[0].rows.length > 0) {
      container.tBodies[0].deleteRow(0);
    }

    const gmp = document.getElementById("grainsminion_page");
    const menu = new DropDownMenu(gmp);
    menu.addMenuItem("Add&nbsp;grain...", function(evt) {
      // use placeholders for name and value
      this._runCommand(evt, minion, "grains.setval <name> <value>");
    }.bind(this));
    menu.addMenuItem("Refresh&nbsp;grains...", function(evt) {
      this._runCommand(evt, minion, "saltutil.refresh_grains");
    }.bind(this));

    // new menu's are always added at the bottom of the div
    // fix that by re-adding the minion list
    gmp.appendChild(container);

    if(PageRoute.showErrorRowInstead(container.tBodies[0], data)) return;

    const grains = data.return[0][minion];

    const keys = Object.keys(grains).sort();
    for(const k of keys) {
      const grain = document.createElement('tr');

      const name = Route._createTd("grain_name", k);
      grain.appendChild(name);

      const grain_value = Output.formatObject(grains[k]);

      const menu = new DropDownMenu(grain);
      menu.addMenuItem("Edit&nbsp;grain...", function(evt) {
        this._runCommand(evt, minion, "grains.setval \"" + k + "\" " + JSON.stringify(grains[k]));
      }.bind(this));
      if(grain_value.startsWith("[")) {
        menu.addMenuItem("Add&nbsp;value...", function(evt) {
          this._runCommand(evt, minion, "grains.append \"" + k + "\" <value>");
        }.bind(this));
      }
      menu.addMenuItem("Delete&nbsp;key...", function(evt) {
        this._runCommand(evt, minion, "grains.delkey \"" + k + "\"");
      }.bind(this));
      menu.addMenuItem("Delete&nbsp;value...", function(evt) {
        this._runCommand(evt, minion, "grains.delval \"" + k + "\"");
      }.bind(this));

      // menu comes before this data on purpose
      const value = Route._createTd("grain_value", grain_value);
      grain.appendChild(value);

      container.tBodies[0].appendChild(grain);

      grain.addEventListener("click", evt => this._runCommand(evt, minion, "grains.setval \"" + k + "\" " + JSON.stringify(grains[k])));
    }

    Utils.showTableSortable(this.getPageElement(), "grains");
  }
}
