/* global document */

import {DropDownMenu} from "../DropDown.js";
import {Panel} from "./Panel.js";
import {Router} from "../Router.js";
import {Utils} from "../Utils.js";

export class TemplatesPanel extends Panel {

  constructor () {
    super("templates");

    this.addTitle("Templates");
    this.addSearchButton();
    this.addTable(["Name", "@Category", "Description", "Target", "Command", "-menu-"]);
    this.setTableSortable("Name", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const wheelConfigValuesPromise = this.api.getWheelConfigValues();

    wheelConfigValuesPromise.then((pWheelConfigValuesData) => {
      this._handleTemplatesWheelConfigValues(pWheelConfigValuesData);
      return true;
    }, (pWheelConfigValuesMsg) => {
      this._handleTemplatesWheelConfigValues(JSON.stringify(pWheelConfigValuesMsg));
      return false;
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
      Router.updateMainMenu();
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

    let categories = [];
    const categoryColumn = this.table.querySelectorAll("col")[1];
    if (template.category && typeof template.category === "string") {
      categories = [template.category];
    } else if (typeof template.categories === "object" && Array.isArray(template.categories)) {
      for (const category of template.categories) {
        if (typeof category === "string") {
          categories.push(category);
        }
      }
    }
    if (categories.length) {
      // show the categories column only when a category was filled in somewhere
      categoryColumn.removeAttribute("style");
    }
    const categoryTh = this.table.querySelectorAll("th")[1];
    if (categories.length > 1) {
      categoryTh.innerText = "Categories";
    }
    tr.appendChild(Utils.createTd("category", categories.join("\n")));

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

    const menu = new DropDownMenu(tr, true);
    this._addMenuItemApplyTemplate(menu, targetType, target, command);

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", (pClickEvent) => {
      this.runCommand(targetType, target, command);
      pClickEvent.stopPropagation();
    });
  }

  _addMenuItemApplyTemplate (pMenu, pTargetType, target, pCommand) {
    pMenu.addMenuItem("Apply template...", () => {
      this.runCommand(pTargetType, target, pCommand);
    });
  }
}
