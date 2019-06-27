import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class TemplatesRoute extends PageRoute {

  constructor(router) {
    super("^[\/]templates$", "Templates", "#page-templates", "#button-templates", router);

    this._handleWheelConfigValues = this._handleWheelConfigValues.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelConfigValuesPromise = this.router.api.getWheelConfigValues();
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelConfigValuesPromise.then(pData => {
      myThis._handleWheelConfigValues(pData);
    }, pData => {
      myThis._handleWheelConfigValues(JSON.stringify(pData));
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

  _handleWheelConfigValues(pData) {
    const container = this.getPageElement().querySelector(".templates");

    if(PageRoute.showErrorRowInstead(container, pData)) return;

    // should we update it or just use from cache (see commandbox) ?
    const templates = pData.return[0].data.return.saltgui_templates;
    window.localStorage.setItem("templates", JSON.stringify(templates));
    const keys = Object.keys(templates).sort();
    for(const key of keys) {
      const template = templates[key];
      this._addTemplate(container, key, template);
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msg = this.pageElement.querySelector("div.templates-list .msg");
    const txt = Utils.txtZeroOneMany(keys.length,
      "No templates", "{0} template", "{0} templates");
    msg.innerText = txt;
  }

  _addTemplate(pContainer, name, template) {
    const tr = document.createElement("tr");

    tr.appendChild(Route._createTd("name", name));

    // calculate description
    const description = template["description"];
    if(!description) {
      tr.appendChild(Route._createTd("description value-none", "(none)"));
    } else {
      tr.appendChild(Route._createTd("description", description));
    }

    // calculate targettype
    const targettype = template["targettype"];
    // calculate target
    const target = template["target"];
    if(!targettype && !target) {
      tr.appendChild(Route._createTd("target value-none", "(none)"));
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
      tr.appendChild(Route._createTd("command value-none", "(none)"));
    } else {
      tr.appendChild(Route._createTd("command", command));
    }

    const menu = new DropDownMenu(tr);
    this._addMenuItemApplyTemplate(menu, targettype, target, command);

    pContainer.tBodies[0].appendChild(tr);

    tr.addEventListener("click", evt => this._runFullCommand(evt, targettype, target, command));
  }

  _addMenuItemApplyTemplate(pMenu, targettype, target, command) {
    pMenu.addMenuItem("Apply&nbsp;template...", function(evt) {
      this._runFullCommand(evt, targettype, target, command);
    }.bind(this));
  }
}
