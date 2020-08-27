/* global document */

import {DropDownMenu} from "../DropDown.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class TemplatesPanel extends Panel {

  constructor () {
    super("templates");

    this.addTitle("Templates");
    this.addSearchButton();
    this.addTable(["Name", "Description", "Target", "Command", "-menu-"]);
    this.setTableSortable("Name", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const wheelConfigValuesPromise = this.api.getWheelConfigValues();

    wheelConfigValuesPromise.then((pWheelConfigValuesData) => {
      this._handleTemplatesWheelConfigValues(pWheelConfigValuesData);
    }, (pWheelConfigValuesMsg) => {
      this._handleTemplatesWheelConfigValues(JSON.stringify(pWheelConfigValuesMsg));
    });
  }

  _handleTemplatesWheelConfigValues (pWheelConfigValuesData) {
    if (this.showErrorRowInstead(pWheelConfigValuesData)) {
      return;
    }

    // should we update it or just use from cache (see commandbox) ?
    let templates = pWheelConfigValuesData.return[0].data.return.saltgui_templates;
    if (templates) {
      Utils.setStorageItem("session", "templates", JSON.stringify(templates));
    } else {
      templates = {};
    }
    const keys = Object.keys(templates).sort();
    for (const key of keys) {
      const template = templates[key];
      this._addTemplate(key, template);
    }

    const txt = Utils.txtZeroOneMany(keys.length,
      "No templates", "{0} template", "{0} templates");
    this.setMsg(txt);
  }

  _addTemplate (pTemplateName, template) {
    const tr = document.createElement("tr");

    tr.appendChild(Utils.createTd("name", pTemplateName));

    // calculate description
    const description = template["description"];
    if (description) {
      tr.appendChild(Utils.createTd("description", description));
    } else {
      tr.appendChild(Utils.createTd("description value-none", "(none)"));
    }

    // calculate targettype
    const targetType = template["targettype"];
    // calculate target
    const target = template["target"];
    if (!targetType && !target) {
      tr.appendChild(Utils.createTd("target value-none", "(none)"));
    } else if (!target) {
      // implies: targetType is not empty
      tr.appendChild(Utils.createTd("target", targetType));
    } else if (targetType) {
      // implies: both are not empty
      tr.appendChild(Utils.createTd("target", targetType + " " + target));
    } else {
      // implies: target is not empty
      tr.appendChild(Utils.createTd("target", target));
    }

    // calculate command
    const command = template["command"];
    if (command) {
      tr.appendChild(Utils.createTd("command", command));
    } else {
      tr.appendChild(Utils.createTd("command value-none", "(none)"));
    }

    const menu = new DropDownMenu(tr);
    this._addMenuItemApplyTemplate(menu, targetType, target, command);

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", (pClickEvent) => {
      this.runFullCommand(pClickEvent, targetType, target, command);
    });
  }

  _addMenuItemApplyTemplate (pMenu, pTargetType, target, pCommand) {
    pMenu.addMenuItem("Apply&nbsp;template...", (pClickEvent) => {
      this.runFullCommand(pClickEvent, pTargetType, target, pCommand);
    });
  }
}
