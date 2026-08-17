/* global describe it */

import {CommandBox} from "../../saltgui/static/scripts/CommandBox.js";
import {assert} from "chai";

describe("Unittests for CommandBox.js", () => {

  describe("_getReadOnlyPanels", () => {
    it("test returns array of read-only panels", () => {
      const result = CommandBox._getReadOnlyPanels();
      assert.isArray(result);
      assert.deepEqual(result, ["events", "options", "reactors", "stats", "templates"]);
    });
  });

  describe("_getScreenModifyingCommands", () => {
    it("test returns object mapping commands to affected pages", () => {
      const result = CommandBox._getScreenModifyingCommands();
      assert.isObject(result);
      assert.isArray(result["beacons.add"]);
      assert.deepEqual(result["beacons.add"], ["beacons", "beacons-minion"]);
    });

    it("test contains wildcard commands that affect all pages", () => {
      const result = CommandBox._getScreenModifyingCommands();
      assert.isArray(result["schedule.run_job"]);
      assert.deepEqual(result["schedule.run_job"], ["*"]);
      assert.isArray(result["state.apply"]);
      assert.deepEqual(result["state.apply"], ["*"]);
    });

    it("test contains multiple command to page mappings", () => {
      const result = CommandBox._getScreenModifyingCommands();
      assert.isArray(result["saltutil.kill_job"]);
      assert.deepEqual(result["saltutil.kill_job"], ["job", "jobs", "issues"]);
    });
  });

  describe("_templateCatMenuItemTitle", () => {
    it("test with undefined category not selected", () => {
      CommandBox.templateTmplMenu = {_templateCategory: null};
      const result = CommandBox._templateCatMenuItemTitle(undefined);
      assert.equal(result, "(undefined)");
    });

    it("test with null category not selected", () => {
      CommandBox.templateTmplMenu = {_templateCategory: "something"};
      const result = CommandBox._templateCatMenuItemTitle(null);
      assert.equal(result, "(all)");
    });

    it("test with normal category", () => {
      CommandBox.templateTmplMenu = {_templateCategory: "other"};
      const result = CommandBox._templateCatMenuItemTitle("mycategory");
      assert.equal(result, "mycategory");
    });

    it("test with selected undefined category shows circle marker", () => {
      CommandBox.templateTmplMenu = {_templateCategory: undefined};
      const result = CommandBox._templateCatMenuItemTitle(undefined);
      assert.include(result, "●");
      assert.include(result, "(undefined)");
    });

    it("test with selected category shows circle marker", () => {
      CommandBox.templateTmplMenu = {_templateCategory: "selected"};
      const result = CommandBox._templateCatMenuItemTitle("selected");
      assert.include(result, "●");
      assert.include(result, "selected");
    });
  });

  describe("_templateTmplMenuItemTitle", () => {
    it("test with all categories selected returns template", () => {
      CommandBox.templateTmplMenu = {_templateCategory: null};
      const template = {description: "My Template", key: "t"};
      const result = CommandBox._templateTmplMenuItemTitle(template);
      assert.include(result, "My Template");
      assert.include(result, "[t]");
    });

    it("test with no category selected filters uncategorized templates", () => {
      CommandBox.templateTmplMenu = {_templateCategory: undefined};
      const template = {category: undefined, description: "No Cat", key: null};
      const result = CommandBox._templateTmplMenuItemTitle(template);
      assert.include(result, "No Cat");
    });

    it("test with no category selected excludes categorized templates", () => {
      CommandBox.templateTmplMenu = {_templateCategory: undefined};
      const template = {category: "prod", description: "With Cat", key: null};
      const result = CommandBox._templateTmplMenuItemTitle(template);
      assert.isNull(result);
    });

    it("test with matching single category returns template", () => {
      CommandBox.templateTmplMenu = {_templateCategory: "prod"};
      const template = {category: "prod", description: "Prod Template", key: "p"};
      const result = CommandBox._templateTmplMenuItemTitle(template);
      assert.include(result, "Prod Template");
      assert.include(result, "[p]");
    });

    it("test with non-matching single category returns null", () => {
      CommandBox.templateTmplMenu = {_templateCategory: "prod"};
      const template = {category: "dev", description: "Dev Template", key: "d"};
      const result = CommandBox._templateTmplMenuItemTitle(template);
      assert.isNull(result);
    });

    it("test with matching category in list returns template", () => {
      CommandBox.templateTmplMenu = {_templateCategory: "staging"};
      const template = {categories: ["dev", "staging", "prod"], description: "Multi Cat", key: "m"};
      const result = CommandBox._templateTmplMenuItemTitle(template);
      assert.include(result, "Multi Cat");
      assert.include(result, "[m]");
    });

    it("test with non-matching category in list returns null", () => {
      CommandBox.templateTmplMenu = {_templateCategory: "test"};
      const template = {categories: ["dev", "staging", "prod"], description: "Multi Cat", key: "m"};
      const result = CommandBox._templateTmplMenuItemTitle(template);
      assert.isNull(result);
    });

    it("test with no keyboard shortcut omits brackets", () => {
      CommandBox.templateTmplMenu = {_templateCategory: null};
      const template = {description: "No Shortcut", key: null};
      const result = CommandBox._templateTmplMenuItemTitle(template);
      assert.equal(result, "No Shortcut");
    });
  });

});
