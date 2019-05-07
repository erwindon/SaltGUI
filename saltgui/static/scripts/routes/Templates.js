import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class TemplatesRoute extends PageRoute {

  constructor(router) {
    super("^[\/]templates$", "Templates", "#page_templates", "#button_templates", router);

    this._handleWheelConfigValues = this._handleWheelConfigValues.bind(this);
    this._applyTemplate = this._applyTemplate.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelConfigValuesPromise = this.router.api.getWheelConfigValues();
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelConfigValuesPromise.then(data => {
      myThis._handleWheelConfigValues(data);
    }, data => {
      myThis._handleWheelConfigValues(JSON.stringify(data));
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

  _handleWheelConfigValues(data) {
    const container = this.getPageElement().querySelector(".templates");

    if(PageRoute.showErrorRowInstead(container, data)) return;

    // should we update it or just use from cache (see commandbox) ?
    const templates = data.return[0].data.return.saltgui_templates;
    window.localStorage.setItem("templates", JSON.stringify(templates));
    const keys = Object.keys(templates).sort();
    for(const key of keys) {
      const template = templates[key];
      this._addTemplate(container, key, template);
    }

    Utils.showTableSortable(this.getPageElement(), "templates");
  }

  _addTemplate(container, name, template) {
    const tr = document.createElement("tr");

    tr.appendChild(Route._createTd("name", name));

    // calculate description
    const description = template["description"];
    if(!description) {
      tr.appendChild(Route._createTd("description value_none", "(none)"));
    } else {
      tr.appendChild(Route._createTd("description", description));
    }

    // calculate targettype
    const targettype = template["targettype"];
    // calculate target
    const target = template["target"];
    if(!targettype && !target) {
      tr.appendChild(Route._createTd("target value_none", "(none)"));
    } else if(/* targettype && */ !target) {
      tr.appendChild(Route._createTd("target", targettype));
    } else if(!targettype /* && target */) {
      tr.appendChild(Route._createTd("target", target));
    } else {
      tr.appendChild(Route._createTd("target", targettype + " " + target));
    }

    // calculate command
    const command = template["command"];
    if(!command) {
      tr.appendChild(Route._createTd("command value_none", "(none)"));
    } else {
      tr.appendChild(Route._createTd("command", command));
    }

    const menu = new DropDownMenu(tr);
    menu.addMenuItem("Apply&nbsp;template...", function(evt) {
      this._applyTemplate(evt, targettype, target, command);
    }.bind(this));

    container.tBodies[0].appendChild(tr);

    tr.addEventListener("click", evt => this._applyTemplate(evt, targettype, target, command));
  }

  _applyTemplate(evt, targettype, target, command) {
    this._runFullCommand(evt, targettype, target, command);
  }

}
