/* global describe it */

import {OutputDocumentation} from "../../../saltgui/static/scripts/output/OutputDocumentation.js";
import {assert} from "chai";

describe("Unittests for output/OutputDocumentation.js", () => {

  describe("isDocumentationOutput", () => {
    it("test with normal documentation case", () => {
      const outputData = {"host1": {"keyword": "explanation"}};
      const result = OutputDocumentation.isDocumentationOutput(outputData, "sys.doc", "keyword");
      assert.isTrue(result);
    });

    it("test does not match requested documentation", () => {
      const outputData = {"host1": {"keyword": "explanation"}};
      const result = OutputDocumentation.isDocumentationOutput(outputData, "sys.doc", "another");
      assert.isFalse(result);
    });

    it("test with null documentation", () => {
      const outputData = {"host1": {"keyword": null}};
      const result = OutputDocumentation.isDocumentationOutput(outputData, "sys.doc", "keyword");
      assert.isFalse(result);
    });

    it("test with non-text value", () => {
      const outputData = {"host1": {"keyword": 123}};
      const result = OutputDocumentation.isDocumentationOutput(outputData, "sys.doc", "keyword");
      assert.isFalse(result);
    });

    it("test with array instead of dict", () => {
      const outputData = {"host1": ["something"]};
      const result = OutputDocumentation.isDocumentationOutput(outputData, "sys.doc", "keyword");
      assert.isFalse(result);
    });

    it("test with number instead of dict", () => {
      const outputData = {"host1": 123};
      const result = OutputDocumentation.isDocumentationOutput(outputData, "sys.doc", "keyword");
      assert.isFalse(result);
    });

    it("test with string instead of dict", () => {
      const outputData = {"host1": "hello"};
      const result = OutputDocumentation.isDocumentationOutput(outputData, "sys.doc", "keyword");
      assert.isFalse(result);
    });

    it("test with multiple hosts where second is ok", () => {
      const outputData = {"host1": null, "host2": {"keyword": "explanation"}};
      const result = OutputDocumentation.isDocumentationOutput(outputData, "sys.doc", "keyword");
      assert.isTrue(result);
    });
  });

  describe("isDocuKeyMatch", () => {
    it("test with null match (all documentation)", () => {
      const result = OutputDocumentation.isDocuKeyMatch("anything", null);
      assert.isTrue(result);
    });

    it("test with empty string match (all documentation)", () => {
      const result = OutputDocumentation.isDocuKeyMatch("anything", "");
      assert.isTrue(result);
    });

    it("test match one word", () => {
      const result = OutputDocumentation.isDocuKeyMatch("foo.bar", "foo");
      assert.isTrue(result);
    });

    it("test match two words", () => {
      const result = OutputDocumentation.isDocuKeyMatch("foo.bar", "foo.bar");
      assert.isTrue(result);
    });

    it("test wrong match", () => {
      const result = OutputDocumentation.isDocuKeyMatch("foo", "bar");
      assert.isFalse(result);
    });

    it("test text prefix does not match", () => {
      const result = OutputDocumentation.isDocuKeyMatch("food", "foo");
      assert.isFalse(result);
    });
  });

  describe("reduceDocumentationOutput", () => {
    it("test hostname replaced by search key", () => {
      const out = {"host1": {"topic": "explanation"}};
      OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
      assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});
    });

    it("test removed irrelevant documentation parts", () => {
      const out = {"host1": {"topic": "explanation", "zothertopic": "otherexplanation"}};
      OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
      assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});
    });

    it("test removed hosts with same answer", () => {
      const out = {"host1": {"topic": "explanation"}, "host2": {"topic": "explanation"}};
      OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
      assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});
    });

    it("test ignore hosts with null answer", () => {
      const out = {"host1": null, "host2": {"topic": "explanation"}};
      OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
      assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});
    });

    it("test ignore hosts with number answer", () => {
      const out = {"host1": 123, "host2": {"topic": "explanation"}};
      OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
      assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});
    });

    it("test no valid answers from any host", () => {
      const out = {"host1": 123, "host2": 321};
      OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
      assert.deepEqual(out, {"dummy": {"DUMMY": "no documentation found"}});
    });
  });

  describe("addDocumentationOutput", () => {
    it("test external link conversion", () => {
      const container = {"innerHTML": ""};
      const output = {"host1": {"pkg.install": "`systemd-run(1)`_\n .. _`systemd-run(1)`: https://www.freedesktop.org/software/systemd/man/systemd-run.html"}};
      OutputDocumentation.addDocumentationOutput(container, output);
      assert.isTrue(
        container.innerHTML.includes(
          "<a href='https://www.freedesktop.org/software/systemd/man/systemd-run.html' target='_blank' rel='noopener'><span style='color: yellow'>systemd-run(1)</span></a>"));
    });
  });

});
