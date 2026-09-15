/* global describe it */

import {Character} from "../../saltgui/static/scripts/Character.js";
import {CommandBox} from "../../saltgui/static/scripts/CommandBox.js";
import {assert} from "chai";

Character.init();

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

  describe("_validateCommandField", () => {
    it("test empty command returns no error", () => {
      const result = CommandBox._validateCommandField("");
      assert.isArray(result.errors);
      assert.isArray(result.warnings);
      assert.equal(result.errors.length, 0);
      assert.equal(result.warnings.length, 0);
    });

    it("test unterminated double quote returns error", () => {
      const result = CommandBox._validateCommandField("\"hello");
      assert.isArray(result.errors);
      assert.include(result.errors[0], "No valid double-quoted-string found");
    });

    it("test terminated double quotes returns no error", () => {
      const result = CommandBox._validateCommandField("\"hello\"");
      assert.equal(result.errors.length, 0);
    });

    it("test sexagesimal out of range returns error", () => {
      const result = CommandBox._validateCommandField("cmd 1:99");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("Sexagesimal")));
    });

    it("test valid sexagesimal returns no error", () => {
      const result = CommandBox._validateCommandField("cmd 1:30");
      assert.equal(result.errors.length, 0);
    });

    it("test 64-bit overflow returns warning with original argument", () => {
      const result = CommandBox._validateCommandField("cmd 99999999999999999999");
      assert.isArray(result.warnings);
      assert.isTrue(result.warnings.some(wrn => wrn.includes("exceeds integer range") && wrn.includes("in: 99999999999999999999") && !wrn.startsWith("number")));
    });

    it("test valid number returns no warning", () => {
      const result = CommandBox._validateCommandField("cmd 123");
      assert.equal(result.warnings.length, 0);
    });

    it("test empty command returns no error", () => {
      const result = CommandBox._validateCommandField("");
      assert.isArray(result.errors);
      assert.isEmpty(result.errors);
    });

    it("test first unnamed argument as hexadecimal number returns error", () => {
      const result = CommandBox._validateCommandField("0xFF arg");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("must be a string") && err.includes("(number)")));
    });

    it("test first unnamed argument as binary number returns error", () => {
      const result = CommandBox._validateCommandField("0b1010");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("must be a string") && err.includes("(number)")));
    });

    it("test first unnamed argument as octal number returns error", () => {
      const result = CommandBox._validateCommandField("010");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("must be a string") && err.includes("(number)")));
    });

    it("test first unnamed argument as decimal number returns error", () => {
      const result = CommandBox._validateCommandField("123 arg");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("must be a string") && err.includes("(number)")));
    });

    it("test first unnamed argument as quoted string returns no error", () => {
      const result = CommandBox._validateCommandField("\"0xFF\"");
      assert.equal(result.errors.length, 0);
    });

    it("test runner instead of runners returns error", () => {
      const result = CommandBox._validateCommandField("runner.test");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("Runner commands must be prefixed with 'runners.'")));
    });

    it("test wheel command with unnamed parameter returns error", () => {
      const result = CommandBox._validateCommandField("wheel.key.accept minion1");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("Wheel commands can only take named parameters")));
    });

    it("test wheel command with only named parameters returns no error", () => {
      const result = CommandBox._validateCommandField("wheel.key.accept match=minion1");
      assert.equal(result.errors.length, 0);
    });

    it("test named parameter without value returns error", () => {
      const result = CommandBox._validateCommandField("cmd x=");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("Must have value for named parameter")));
    });

    it("test duplicate named parameter returns error", () => {
      const result = CommandBox._validateCommandField("cmd x=1 x=2");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("Duplicate named variable")));
    });

    it("test unfilled placeholder returns error", () => {
      const result = CommandBox._validateCommandField("cmd <param>");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("Must fill in all placeholders")));
    });

    it("test invalid dictionary returns error", () => {
      const result = CommandBox._validateCommandField("cmd {\"a}\":1");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("No valid dictionary found")));
    });

    it("test invalid array returns error", () => {
      const result = CommandBox._validateCommandField("cmd [1,2");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("No valid array found")));
    });

    it("test dictionary followed by text returns error", () => {
      const result = CommandBox._validateCommandField("cmd {\"a\":1}extra");
      assert.isArray(result.errors);
      assert.isTrue(result.errors.some(err => err.includes("Valid dictionary, but followed by text")));
    });

    it("test valid named parameter returns no error", () => {
      const result = CommandBox._validateCommandField("cmd x=5");
      assert.equal(result.errors.length, 0);
    });

    it("test valid dictionary returns no error", () => {
      const result = CommandBox._validateCommandField("cmd {\"a\":1}");
      assert.equal(result.errors.length, 0);
    });

    it("test valid array returns no error", () => {
      const result = CommandBox._validateCommandField("cmd [1,2,3]");
      assert.equal(result.errors.length, 0);
    });
  });

  describe("_displayValidationOutput", () => {
    it("test displays errors with error icon", () => {
      const mockOutput = {innerText: ""};
      const validationResult = {
        errors: ["Error 1", "Error 2"],
        warnings: []
      };
      CommandBox._displayValidationOutput(validationResult, mockOutput);
      assert.include(mockOutput.innerText, Character.NO_ENTRY_SIGN + " Error 1");
      assert.include(mockOutput.innerText, Character.NO_ENTRY_SIGN + " Error 2");
    });

    it("test displays warnings with warning icon", () => {
      const mockOutput = {innerText: ""};
      const validationResult = {
        errors: [],
        warnings: ["Warning 1", "Warning 2"]
      };
      CommandBox._displayValidationOutput(validationResult, mockOutput);
      assert.include(mockOutput.innerText, Character.WARNING_SIGN + " Warning 1");
      assert.include(mockOutput.innerText, Character.WARNING_SIGN + " Warning 2");
    });

    it("test displays both errors and warnings with icons", () => {
      const mockOutput = {innerText: ""};
      const validationResult = {
        errors: ["Error 1"],
        warnings: ["Warning 1"]
      };
      CommandBox._displayValidationOutput(validationResult, mockOutput);
      assert.include(mockOutput.innerText, Character.NO_ENTRY_SIGN + " Error 1");
      assert.include(mockOutput.innerText, Character.WARNING_SIGN + " Warning 1");
    });

    it("test displays errors before warnings", () => {
      const mockOutput = {innerText: ""};
      const validationResult = {
        errors: ["Error 1"],
        warnings: ["Warning 1"]
      };
      CommandBox._displayValidationOutput(validationResult, mockOutput);
      const errorIndex = mockOutput.innerText.indexOf(Character.NO_ENTRY_SIGN);
      const warningIndex = mockOutput.innerText.indexOf(Character.WARNING_SIGN);
      assert.isTrue(errorIndex < warningIndex);
    });
  });

});
