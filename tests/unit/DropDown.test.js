/* global describe it */

import {DropDownMenu} from "../../saltgui/static/scripts/DropDown.js";
import {Character} from "../../saltgui/static/scripts/Character.js";
import {assert} from "chai";

Character.init();

describe("Unittests for DropDown.js", () => {

  describe("_sanitizeMenuItemTitle", () => {
    it("test with simple text", () => {
      const result = DropDownMenu._sanitizeMenuItemTitle("Simple");
      assert.equal(result, "Simple");
    });

    it("test with spaces replaced by NO_BREAK_SPACE", () => {
      const result = DropDownMenu._sanitizeMenuItemTitle("hello world");
      assert.equal(result, "hello" + Character.NO_BREAK_SPACE + "world");
    });

    it("test with hyphens replaced by NON_BREAKING_HYPHEN", () => {
      const result = DropDownMenu._sanitizeMenuItemTitle("hello-world");
      assert.equal(result, "hello" + Character.NON_BREAKING_HYPHEN + "world");
    });

    it("test with ellipsis replaced by HORIZONTAL_ELLIPSIS", () => {
      const result = DropDownMenu._sanitizeMenuItemTitle("loading...");
      assert.equal(result, "loading" + Character.HORIZONTAL_ELLIPSIS);
    });

    it("test with multiple replacements", () => {
      const result = DropDownMenu._sanitizeMenuItemTitle("hello - world...");
      assert.equal(result, "hello" + Character.NO_BREAK_SPACE + Character.NON_BREAKING_HYPHEN + Character.NO_BREAK_SPACE + "world" + Character.HORIZONTAL_ELLIPSIS);
    });
  });

});
