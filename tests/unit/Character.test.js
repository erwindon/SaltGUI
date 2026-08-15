/* global describe it */

import {Character} from "../../saltgui/static/scripts/Character.js";
import {assert} from "chai";

Character.init();

describe("Unittests for Character.js", () => {

  describe("buttonInText", () => {
    it("test with text", () => {
      const result = Character.buttonInText("Click me");
      assert.equal(result, "<span style=\"background-color:#eee; color:black\">&nbsp;Click me&nbsp;</span>");
    });

    it("test with empty string", () => {
      const result = Character.buttonInText("");
      assert.equal(result, "<span style=\"background-color:#eee; color:black\">&nbsp;&nbsp;</span>");
    });
  });

});
