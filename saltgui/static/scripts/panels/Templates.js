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
    this.addTable(["Name", "@Category", "Location", "Description", "Target", "Command", "-menu-"], "data-list-templates");
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

    const staticTemplatesJsonPromise = this.api.getStaticTemplatesJson();

    staticTemplatesJsonPromise.then((pStaticTemplatesJson) => {
      this._handleStaticTemplatesJson(pStaticTemplatesJson);
      return true;
    }, (pStaticTemplatesMsg) => {
      this._handleStaticTemplatesJson(JSON.stringify(pStaticTemplatesMsg));
      return false;
    });

    /* eslint-disable compat/compat */
    /* Promise.all is not supported in op_mini all, IE 11 */
    const allPromise = Promise.all([wheelConfigValuesPromise, staticTemplatesJsonPromise]);
    /* eslint-enable compat/compat */
    allPromise.then(() => {
      this._showTemplates();
    });
  }

  _handleTemplatesWheelConfigValues (pWheelConfigValuesData) {
    if (this.showErrorRowInstead(pWheelConfigValuesData)) {
      return;
    }

    const masterTemplates = pWheelConfigValuesData.return[0].data.return.saltgui_templates;
    if (!masterTemplates) {
      return;
    }

    Utils.setStorageItem("session", "templates_master", JSON.stringify(masterTemplates));
  }


  _handleStaticTemplatesJson (pStaticTemplatesJson) {
    if (this.showErrorRowInstead(pStaticTemplatesJson)) {
      return;
    }

    if (!pStaticTemplatesJson) {
      return;
    }

    Utils.setStorageItem("session", "templates_json", JSON.stringify(pStaticTemplatesJson));
  }

  _showTemplates () {
    const masterTemplatesTxt = Utils.getStorageItem("session", "templates_master", "{}");
    const masterTemplates = JSON.parse(masterTemplatesTxt);
    const masterKeys = Object.keys(masterTemplates);
    for (const key of masterKeys) {
      const template = masterTemplates[key];
      this._addTemplate("master", key, template);
    }

    const saltTemplatesTxt = Utils.getStorageItem("session", "templates_json", "{}");
    const saltTemplates = JSON.parse(saltTemplatesTxt);
    const saltTemplatesKeys = Object.keys(saltTemplates).sort();
    for (const key of saltTemplatesKeys) {
      const template = saltTemplates[key];
      this._addTemplate("salt-templates.json", key, template);
    }

    const totalKeys = masterKeys.length + saltTemplatesKeys.length;
    let txt = Utils.txtZeroOneMany(totalKeys,
      "No templates", "{0} template", "{0} templates");
    if (masterKeys.length !== totalKeys) {
      txt += Utils.txtZeroOneMany(masterKeys.length,
        "", ", {0} template in master", ", {0} templates in master");
    }
    if (saltTemplatesKeys.length !== totalKeys) {
      txt += Utils.txtZeroOneMany(saltTemplatesKeys.length,
        "", ", {0} template in salt-templates.json", ", {0} templates in salt-templates.json");
    }
    this.setMsg(txt);

    // cannot join the arrays because there might be duplicate keys
    // const allTemplates = Object.assign({}, masterTemplates, saltTemplates);

    this.setCategoriesTitle(masterTemplates, saltTemplates);
    this.showCategoriesColumn(masterTemplates, saltTemplates);
    TemplatesPanel.getTemplatesCategories(masterTemplates, saltTemplates);

    Router.updateMainMenu();

    this.setTableSortable("Name", "asc");
  }

  setCategoriesTitle (pMasterTemplates, pSaltTemplates) {
    const categoryTh = this.table.querySelectorAll("th")[1];

    let maxCategories = 0;

    const masterKeys = Object.keys(pMasterTemplates);
    for (const key of masterKeys) {
      const template = pMasterTemplates[key];
      const categories = TemplatesPanel.getTemplateCategories(template);
      maxCategories = Math.max(maxCategories, categories.length);
    }

    const saltKeys = Object.keys(pSaltTemplates);
    for (const key of saltKeys) {
      const template = pSaltTemplates[key];
      const categories = TemplatesPanel.getTemplateCategories(template);
      maxCategories = Math.max(maxCategories, categories.length);
    }

    if (maxCategories > 1) {
      categoryTh.innerText = "Categories";
    }
  }

  showCategoriesColumn (pMasterTemplates, pSaltTemplates) {
    let showCategoriesColumn = false;

    const masterKeys = Object.keys(pMasterTemplates);
    for (const key of masterKeys) {
      const template = pMasterTemplates[key];
      const categories = TemplatesPanel.getTemplateCategories(template);
      if (categories.length > 1 || categories.length > 0 && categories[0] !== undefined) {
        showCategoriesColumn = true;
      }
    }

    const saltKeys = Object.keys(pSaltTemplates);
    for (const key of saltKeys) {
      const template = pSaltTemplates[key];
      const categories = TemplatesPanel.getTemplateCategories(template);
      if (categories.length > 1 || categories.length > 0 && categories[0] !== undefined) {
        showCategoriesColumn = true;
      }
    }

    if (showCategoriesColumn) {
      const categoryColumn = this.table.querySelectorAll("col")[1];
      // show the categories column only when a category was filled in somewhere
      // and it is not the only category
      categoryColumn.removeAttribute("style");
    }
  }

  static getTemplateCategories (pTemplate) {
    const categories = [];
    if (pTemplate.category && typeof pTemplate.category === "string") {
      categories.push(pTemplate.category);
    } else if (typeof pTemplate.categories === "object" && Array.isArray(pTemplate.categories)) {
      for (const category of pTemplate.categories) {
        if (typeof category === "string") {
          categories.push(category);
        }
      }
    } else {
      categories.push(undefined);
    }
    return categories;
  }

  static getTemplatesCategories (pMasterTemplates, pSaltTemplates) {
    let categories = [];

    const masterKeys = Object.keys(pMasterTemplates);
    for (const key of masterKeys) {
      const template = pMasterTemplates[key];
      categories = categories.concat(TemplatesPanel.getTemplateCategories(template));
    }

    const saltKeys = Object.keys(pSaltTemplates);
    for (const key of saltKeys) {
      const template = pSaltTemplates[key];
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
      const option = document.createElement("option");
      option.value = category;
      lov.appendChild(option);
    }

    return categories;
  }

  _addTemplate (pLocation, pTemplateName, template) {
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
