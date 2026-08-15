/* global describe it */

import {OutputYaml} from "../../../saltgui/static/scripts/output/OutputYaml.js";
import {assert} from "chai";

describe("Unittests for output/OutputYaml.js", () => {

  describe("formatYAML", () => {
    it("test with various input types", () => {

      let outputData, result;

      outputData = null;
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "null");

      outputData = undefined;
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "undefined");

      outputData = false;
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "false");

      outputData = 123;
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "123");

      outputData = "txt";
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "txt");

      outputData = "@txt";
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "'@txt'");

      outputData = "`txt";
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "'`txt'");

      outputData = "%txt";
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "'%txt'");

      outputData = "it's";
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "'it\\'s'");

      outputData = " ";
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "' '");

      outputData = "0123";
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "'0123'");

      outputData = "";
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "''");

      outputData = [];
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "[ ]");

      outputData = [1];
      result = OutputYaml.formatYAML(outputData);
      // 00A0 = NO-BREAK SPACE
      assert.equal(result, "- 1");

      outputData = [1, 2, 3, 4, 5];
      result = OutputYaml.formatYAML(outputData);
      // 00A0 = NO-BREAK SPACE
      assert.equal(result,
        "- 1\n" +
      "- 2\n" +
      "- 3\n" +
      "- 4\n" +
      "- 5");

      outputData = {};
      result = OutputYaml.formatYAML(outputData);
      assert.equal(result, "{ }");

      // unordered input
      /* eslint-disable sort-keys */
      outputData = {"a": 11, "c": 22, "b": null};
      /* eslint-enable sort-keys */
      result = OutputYaml.formatYAML(outputData);
      // ordered output
      assert.equal(result,
        "a: 11\n" +
      "b: null\n" +
      "c: 22");

      // a more complex object, unordered input
      /* eslint-disable sort-keys */
      outputData = {"ip6_interfaces": {"lo": ["::1"], "eth0": ["fe80::20d:3aff:fe38:576b"]}};
      /* eslint-enable sort-keys */
      result = OutputYaml.formatYAML(outputData);
      // ordered output
      // 00A0 = NO-BREAK SPACE
      assert.equal(result,
        "ip6_interfaces:\n" +
      "  eth0:\n" +
      "  - fe80::20d:3aff:fe38:576b\n" +
      "  lo:\n" +
      "  - ::1");
    });
  });

});
