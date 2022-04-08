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
      this.setCategoriesTitle(templates);
      this.showCategoriesColumn(templates);
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

  setCategoriesTitle (templates) {
    const categoryTh = this.table.querySelectorAll("th")[1];
    const keys = Object.keys(templates);
    for (const key of keys) {
      const template = templates[key];
      const categories = TemplatesPanel.getTemplateCategories(template);
      if (categories.length > 1) {
        categoryTh.innerText = "Categories";
      }
    }
  }

  showCategoriesColumn (templates) {
    const keys = Object.keys(templates);
    for (const key of keys) {
      const template = templates[key];
      const categories = TemplatesPanel.getTemplateCategories(template);
      if (categories.length > 1 || categories.length > 0 && categories[0] !== undefined) {
        const categoryColumn = this.table.querySelectorAll("col")[1];
        // show the categories column only when a category was filled in somewhere
        // and it is not the only category
        categoryColumn.removeAttribute("style");
        return;
      }
    }
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

    return categories;
  }

  _addTemplate (pTemplateName, template) {
    const tr = document.createElement("tr");

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
