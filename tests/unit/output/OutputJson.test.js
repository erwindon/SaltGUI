/* global describe it */

import {OutputJson} from "../../../saltgui/static/scripts/output/OutputJson.js";
import {assert} from "chai";

describe("Unittests for output/OutputJson.js", () => {

  describe("formatJSON", () => {
    it("test with various input types", () => {

      let outputData, result;

      outputData = null;
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "null");

      outputData = undefined;
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "undefined");

      outputData = 123;
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "123");

      outputData = true;
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "true");

      outputData = "txt";
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "\"txt\"");

      outputData = [];
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "[ ]");

      outputData = [1];
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "[ 1 ]");

      outputData = [1, 2];
      result = OutputJson.formatJSON(outputData);
      assert.equal(result,
        "[\n" +
      "    1,\n" +
      "    2\n" +
      "]");

      outputData = [1, 2, 3, 4, 5];
      result = OutputJson.formatJSON(outputData);
      assert.equal(result,
        "[\n" +
      "    1,\n" +
      "    2,\n" +
      "    3,\n" +
      "    4,\n" +
      "    5\n" +
      "]");

      outputData = {};
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "{ }");

      outputData = {"a": 11};
      result = OutputJson.formatJSON(outputData);
      assert.equal(result, "{ \"a\": 11 }");

      // unordered input
      /* eslint-disable sort-keys */
      outputData = {"a": 11, "c": 22, "b": 33};
      /* eslint-enable sort-keys */
      result = OutputJson.formatJSON(outputData);
      // ordered output
      assert.equal(result,
        "{\n" +
      "    \"a\": 11,\n" +
      "    \"b\": 33,\n" +
      "    \"c\": 22\n" +
      "}");

      // a more complex object, unordered input
      /* eslint-disable sort-keys */
      outputData = {"ip6_interfaces": {"lo": ["::1"], "eth0": ["fe80::20d:3aff:fe38:576b"]}};
      /* eslint-enable sort-keys */
      result = OutputJson.formatJSON(outputData);
      // ordered output
      assert.equal(result,
        "{\n" +
      "    \"ip6_interfaces\": {\n" +
      "        \"eth0\": [ \"fe80::20d:3aff:fe38:576b\" ],\n" +
      "        \"lo\": [ \"::1\" ]\n" +
      "    }\n" +
      "}");
    });
  });

});
