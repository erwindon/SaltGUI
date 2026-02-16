/* global */

import {DropDownMenuCmd} from "../DropDownCmd.js";
import {Panel} from "./Panel.js";
import {Router} from "../Router.js";
import {Utils} from "../Utils.js";

export class TemplatesPanel extends Panel {

  constructor () {
    super("templates");

    this.addTitle("Templates");
    this.addSearchButton();
    this.addTable(["-menu-", "Name", "Category", "Key", "Description", "Target", "Command"], "data-list-templates");
    this.setTableSortable("Name", "asc");
    this.setTableClickable("cmd");
    this.addMsg();
  }

  onShow () {
    const wheelConfigValuesPromise = this.api.getWheelConfigValues();

    this.nrTemplates = 0;

    wheelConfigValuesPromise.then((pWheelConfigValuesData) => {
      this._handleTemplatesWheelConfigValues(pWheelConfigValuesData);
      this.hideColumn("Category");
      this.hideColumn("Key");
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
    this.nrTemplates = Object.keys(templates).length;

    if (templates) {
      Utils.setStorageItem("session", "templates", JSON.stringify(templates));
      TemplatesPanel.getTemplatesCategories(templates);
      Router.updateMainMenu();
    } else {
      templates = {};
    }
    const keys = Object.keys(templates).sort();
    for (const key of keys) {
      const template = templates[key];
      this._addTemplate(key, template);
    }

    this.updateFooter();
  }

  updateFooter () {
    const txt = Utils.txtZeroOneMany(this.nrTemplates,
      "No templates", "{0} template", "{0} templates");
    this.setMsg(txt);
  }

  static getTemplateCategories (template) {
    const categories = [];
    if (template.category && typeof template.category === "string") {
      categories.push(template.category);
    } else if (typeof template.categories === "object" && Array.isArray(template.categories)) {
      for (const category of template.categories) {
        if (typeof category === "string") {
          categories.push(category);
        }
      }
    } else {
      categories.push(undefined);
    }
    return categories;
  }

  static getTemplatesCategories (templates) {
    let categories = [];
    const keys = Object.keys(templates);
    for (const key of keys) {
    // make unique
      const template = templates[key];
      categories = categories.concat(TemplatesPanel.getTemplateCategories(template));
    }
    // make unique
    categories = categories.filter((element, index, array) => array.indexOf(element) === index);
    // make sorted, thx https://stackoverflow.com/questions/29829205/sort-an-array-so-that-null-values-always-come-last
    categories.sort((aa, bb) => (bb === null) - (aa === null) || +Number(aa > bb) || -Number(aa < bb));

    const lov = document.getElementById("data-list-templates");
    // remove any previous lov-entries
    lov.innerHTML = "";
    for (const category of categories) {
      if (!category) {
        continue;
      }
      // e.g. <option value="denied">
      const option = Utils.createElem("option");
      option.value = category;
      lov.appendChild(option);
    }

    return categories;
  }

  _addTemplate (pTemplateName, template) {
    const tr = Utils.createTr();

    const menu = new DropDownMenuCmd(tr, "smaller");

    tr.appendChild(Utils.createTd("name", pTemplateName));

    const categories = TemplatesPanel.getTemplateCategories(template);
    let categoryTd;
    if (categories.length > 1 || categories[0] !== undefined) {
      categoryTd = Utils.createTd("category", categories.join("\n"));
    } else {
      categoryTd = Utils.createTd("category", "(none)");
      categoryTd.className = "value-none";
    }
    tr.appendChild(categoryTd);

    // calculate key
    const key = template["key"];
    if (key) {
      tr.appendChild(Utils.createTd("", key));
    } else {
      tr.appendChild(Utils.createTd("value-none", "(none)"));
    }

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

    this._addMenuItemApplyTemplate(menu, targetType, target, command);

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", (pClickEvent) => {
      this.runCommand(targetType, target, command);
      pClickEvent.stopPropagation();
    });
  }

  _addMenuItemApplyTemplate (pMenu, pTargetType, target, pCommand) {
    pMenu.addMenuItemCmd("Apply template...", () => {
      this.runCommand(pTargetType, target, pCommand);
    });
  }
}
