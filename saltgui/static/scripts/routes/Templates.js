import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class TemplatesRoute extends PageRoute {

  constructor(pRouter) {
    super("templates", "Templates", "#page-templates", "#button-templates", pRouter);

    this._handleTemplatesWheelConfigValues = this._handleTemplatesWheelConfigValues.bind(this);

    Utils.makeTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());
  }

  onShow() {
    const myThis = this;

    const wheelConfigValuesPromise = this.router.api.getWheelConfigValues();
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelConfigValuesPromise.then(pWheelConfigValuesData => {
      myThis._handleTemplatesWheelConfigValues(pWheelConfigValuesData);
    }, pWheelConfigValuesMsg => {
      myThis._handleTemplatesWheelConfigValues(JSON.stringify(pWheelConfigValuesMsg));
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

  _handleTemplatesWheelConfigValues(pWheelConfigValuesData) {
    const container = this.getPageElement().querySelector(".templates");

    if(PageRoute.showErrorRowInstead(container, pWheelConfigValuesData)) return;

    // should we update it or just use from cache (see commandbox) ?
    let templates = pWheelConfigValuesData.return[0].data.return.saltgui_templates;
    if(templates)
      Utils.setStorageItem("session", "templates", JSON.stringify(templates));
    else
      templates = { };
    const keys = Object.keys(templates).sort();
    for(const key of keys) {
      const template = templates[key];
      this._addTemplate(container, key, template);
    }

    const msgDiv = this.pageElement.querySelector("div.templates-list .msg");
    const txt = Utils.txtZeroOneMany(keys.length,
      "No templates", "{0} template", "{0} templates");
    msgDiv.innerText = txt;
  }

  _addTemplate(pContainer, pTemplateName, template) {
    const tr = document.createElement("tr");

    tr.appendChild(Route.createTd("name", pTemplateName));

    // calculate description
    const description = template["description"];
    if(!description) {
      tr.appendChild(Route.createTd("description value-none", "(none)"));
    } else {
      tr.appendChild(Route.createTd("description", description));
    }

    // calculate targettype
    const targetType = template["targettype"];
    // calculate target
    const target = template["target"];
    if(!targetType && !target) {
      tr.appendChild(Route.createTd("target value-none", "(none)"));
    } else if(/* targetType && */ !target) {
      tr.appendChild(Route.createTd("target", targetType));
    } else if(!targetType /* && target */) {
      tr.appendChild(Route.createTd("target", target));
    } else {
      tr.appendChild(Route.createTd("target", targetType + " " + target));
    }

    // calculate command
    const command = template["command"];
    if(!command) {
      tr.appendChild(Route.createTd("command value-none", "(none)"));
    } else {
      tr.appendChild(Route.createTd("command", command));
    }

    const menu = new DropDownMenu(tr);
    this._addMenuItemApplyTemplate(menu, targetType, target, command);

    pContainer.tBodies[0].appendChild(tr);

    tr.addEventListener("click", pClickEvent =>
      this.runFullCommand(pClickEvent, targetType, target, command)
    );
  }

  _addMenuItemApplyTemplate(pMenu, pTargetType, target, pCommand) {
    pMenu.addMenuItem("Apply&nbsp;template...", function(pClickEvent) {
      this.runFullCommand(pClickEvent, pTargetType, target, pCommand);
    }.bind(this));
  }
}
