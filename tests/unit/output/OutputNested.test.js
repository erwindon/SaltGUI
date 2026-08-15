/* global describe it */

import {Character} from "../../../saltgui/static/scripts/Character.js";
import {OutputNested} from "../../../saltgui/static/scripts/output/OutputNested.js";
import {assert} from "chai";

Character.init();

describe("Unittests for output/OutputNested.js", () => {

  describe("formatNESTED", () => {
    it("test with various input types", () => {

      let outputData, result;

      outputData = null;
      result = OutputNested.formatNESTED(outputData);
      assert.equal(result, "None");

      outputData = undefined;
      result = OutputNested.formatNESTED(outputData);
      assert.equal(result, "undefined");

      outputData = 123;
      result = OutputNested.formatNESTED(outputData);
      assert.equal(result, "123");

      outputData = "txt";
      result = OutputNested.formatNESTED(outputData);
      assert.equal(result, "txt");

      outputData = ["txt1\ntxt2\ntxt3"];
      result = OutputNested.formatNESTED(outputData);
      // 00A0 = NO-BREAK SPACE
      assert.equal(result, "-\u00A0txt1\n  txt2\n  txt3");

      outputData = [];
      result = OutputNested.formatNESTED(outputData);
      assert.equal(result, "");

      outputData = [1];
      result = OutputNested.formatNESTED(outputData);
      // 00A0 = NO-BREAK SPACE
      assert.equal(result, "-\u00A01");

      outputData = [1, 2, 3, 4, 5];
      result = OutputNested.formatNESTED(outputData);
      // 00A0 = NO-BREAK SPACE
      assert.equal(result,
        "-\u00A01\n" +
      "-\u00A02\n" +
      "-\u00A03\n" +
      "-\u00A04\n" +
      "-\u00A05");

      outputData = [{"a": 1}, {"a": 1}, [1, 2], 7, {"a": ""}, {"a": null}];
      result = OutputNested.formatNESTED(outputData);
      // 00A0 = NO-BREAK SPACE
      assert.equal(result,
        "|_\n" +
      "  ----------\n" +
      "  a:\n" +
      "      1\n" +
      "|_\n" +
      "  ----------\n" +
      "  a:\n" +
      "      1\n" +
      "|_\n" +
      "  -\u00A01\n" +
      "  -\u00A02\n" +
      "-\u00A07\n" +
      "|_\n" +
      "  ----------\n" +
      "  a:\n" +
      "|_\n" +
      "  ----------\n" +
      "  a:");

      outputData = {};
      result = OutputNested.formatNESTED(outputData);
      assert.equal(result, "");

      // unordered input
      /* eslint-disable sort-keys */
      outputData = {"a": 11, "c": 22, "b": 33};
      /* eslint-enable sort-keys */
      result = OutputNested.formatNESTED(outputData);
      // ordered output
      assert.equal(result,
        "a:\n" +
      "    11\n" +
      "b:\n" +
      "    33\n" +
      "c:\n" +
      "    22");

      // a more complex object, unordered input
      /* eslint-disable sort-keys */
      outputData = {"ip6_interfaces": {"lo": ["::1"], "eth0": ["fe80::20d:3aff:fe38:576b"]}};
      /* eslint-enable sort-keys */
      result = OutputNested.formatNESTED(outputData);
      // ordered output
      // 00A0 = NO-BREAK SPACE
      assert.equal(result,
        "ip6_interfaces:\n" +
      "    ----------\n" +
      "    eth0:\n" +
      "        -\u00A0fe80::20d:3aff:fe38:576b\n" +
      "    lo:\n" +
      "        -\u00A0::1");
    });
  });

});
