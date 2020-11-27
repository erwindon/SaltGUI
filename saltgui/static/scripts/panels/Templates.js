/* global document */

import {CommandBox} from "../CommandBox.js";
import {DropDownMenu} from "../DropDown.js";
import {Panel} from "./Panel.js";
import {Router} from "../Router.js";
import {Utils} from "../Utils.js";

export class TemplatesPanel extends Panel {

  constructor () {
    super("templates");

    this.addTitle("Templates");
    this.addSearchButton();
    this.addTable(["Name", "Location", "Description", "Target", "Command", "-menu-"]);
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
    let masterTemplates = pWheelConfigValuesData.return[0].data.return.saltgui_templates;
    if (masterTemplates) {
      Utils.setStorageItem("session", "templates", JSON.stringify(masterTemplates));
      Router.updateMainMenu();
    } else {
      masterTemplates = {};
    }

    const masterKeys = Object.keys(masterTemplates).sort();
    for (const key of masterKeys) {
      const template = masterTemplates[key];
      this._addTemplate("master", key, template);
    }

    const totalKeys = masterKeys.length;
    let txt = Utils.txtZeroOneMany(totalKeys,
      "No templates", "{0} template", "{0} templates");
    if (masterKeys.length > 0 && masterKeys.length !== totalKeys) {
      txt += Utils.txtZeroOneMany(masterKeys.length,
        "", ", {0} master template", ", {0} master templates");
    }
    this.setMsg(txt);
  }

  _addTemplate (pLocation, pTemplateName, template) {
    const tr = document.createElement("tr");

    tr.appendChild(Utils.createTd("name", pTemplateName));

    tr.appendChild(Utils.createTd("location", pLocation));

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
    if (pLocation === "local") {
      this._addMenuItemEditTemplate(menu, pTemplateName, description, targetType, target, command);
      this._addMenuItemDeleteTemplate(menu, pTemplateName);
    }

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", (pClickEvent) => {
      this.runCommand(targetType, target, command);
      pClickEvent.stopPropagation();
    });
  }

  _addMenuItemApplyTemplate (pMenu, pTargetType, pTarget, pCommand) {
    pMenu.addMenuItem("Apply template...", () => {
      this.runCommand(pTargetType, pTarget, pCommand);
    });
  }

  _addMenuItemEditTemplate (pMenu, pName, pDescription, pTargetType, pTarget, pCommand) {
    pMenu.addMenuItem("Edit template...", () => {
      const cmdArr = ["#template.save", "name=", pName, "targettype=", pTargetType, "target=", pTarget, "command=", pCommand, "description=", pDescription];
      this.runCommand(null, null, cmdArr);
    });
  }

  _addMenuItemDeleteTemplate (pMenu, pName) {
    pMenu.addMenuItem("Delete template...", () => {
      const cmdArr = ["#template.delete", "name=", pName];
      this.runCommand(null, null, cmdArr);
    });
  }

  static runDelete (pArgs) {
    const localTemplatesText = Utils.getStorageItem("local", "templates", "{}");
    const localTemplates = JSON.parse(localTemplatesText);
    const name = pArgs.name;
    if (name === undefined) {
      CommandBox._showError("Missing parameter 'name=...'");
      return;
    }
    if (!(name in localTemplates)) {
      CommandBox._showError("Unknown local template '" + name + "'");
      return;
    }
    delete localTemplates[name];
    Utils.setStorageItem("local", "templates", JSON.stringify(localTemplates));
    CommandBox.refreshOnClose = true;
    CommandBox.onRunReturn("Deleted local template '" + name + "'", "");
  }

  static runSave (pArgs) {
    const localTemplatesText = Utils.getStorageItem("local", "templates", "{}");
    const localTemplates = JSON.parse(localTemplatesText);
    const name = pArgs.name;
    if (name === undefined) {
      CommandBox._showError("Missing parameter 'name=...'");
      return;
    }
    const template = {};
    for (const key of ["targettype", "target", "command", "description"]) {
      if (key in pArgs) {
        template[key] = pArgs[key];
      }
    }
    localTemplates[name] = template;
    Utils.setStorageItem("local", "templates", JSON.stringify(localTemplates));
    CommandBox.refreshOnClose = true;
    CommandBox.onRunReturn("Saved local template '" + name + "'", "");

    // revert to the command that the user was saving
    CommandBox._applyTemplate(template);
  }
}
