import {Character} from "../Character.js";

export class OutputYaml {

  // format an object as YAML
  // returns NULL when it is not a simple object
  // i.e. no multi-line objects, no indentation here
  static _formatSimpleYAML (pValue) {

    if (pValue === null) {
      return "null";
    }

    if (pValue === undefined) {
      return "undefined";
    }

    if (typeof pValue === "boolean") {
      return pValue ? "true" : "false";
    }

    if (typeof pValue === "string") {
      let needQuotes = false;

      // simple number with extra 0's at the start is still a string
      if (pValue.match(/^0[0-9]+$/)) {
        needQuotes = true;
      }

      if (!isNaN(Number(pValue))) {
        needQuotes = true;
      }

      if (pValue.match(/^$/)) {
        needQuotes = true;
      }

      if (pValue.match(/^ /)) {
        needQuotes = true;
      }
      if (pValue.match(/ $/)) {
        needQuotes = true;
      }

      if (pValue.match(/^@/)) {
        needQuotes = true;
      }
      if (pValue.match(/^`/)) {
        needQuotes = true;
      }
      if (pValue.match(/'/)) {
        needQuotes = true;
      }
      if (pValue.match(/^%/)) {
        needQuotes = true;
      }

      if (!pValue.match(/^[-a-z0-9_()./:+ ]+$/i)) {
        needQuotes = true;
      }

      if (!needQuotes) {
        return pValue;
      }
      return "'" + pValue.replace(/'/g, "\\'") + "'";
    }

    if (typeof pValue !== "object") {
      return String(pValue);
    }

    if (Array.isArray(pValue) && pValue.length === 0) {
      // show the brackets for an empty array a bit wider apart
      return "[ ]";
    }

    if (!Array.isArray(pValue) && Object.keys(pValue).length === 0) {
      // show the brackets for an empty object a bit wider apart
      return "{ }";
    }

    return null;
  }

  // format an object as YAML
  // based on an initial indentation and an indentation increment
  static formatYAML (pValue, pIndentLevel = 0) {

    // indent each level with this number of spaces
    // note that list items are indented with 2 spaces
    // independently of this setting to match the prefix "- "
    const indentStep = 2;

    const str = OutputYaml._formatSimpleYAML(pValue);
    if (str !== null) {
      return str;
    }

    if (Array.isArray(pValue)) {
      let aOut = "";
      let aSeparator = "";
      for (const item of pValue) {
        aOut += aSeparator + "-" + Character.NO_BREAK_SPACE + OutputYaml.formatYAML(item, pIndentLevel + 2);
        aSeparator = "\n" + " ".repeat(pIndentLevel);
      }
      return aOut;
    }

    // regular object
    let oOut = "";
    let oSeparator = "";
    const sortedKeys = Object.keys(pValue).sort((aa, bb) => aa.localeCompare(bb, "en", {"numeric": true}));
    for (const key of sortedKeys) {
      const item = pValue[key];
      oOut += oSeparator + key + ":";
      const systr = OutputYaml._formatSimpleYAML(item);
      if (systr !== null) {
        oOut += " " + systr;
      } else if (Array.isArray(item)) {
        oOut += "\n" + " ".repeat(pIndentLevel) + OutputYaml.formatYAML(item, pIndentLevel);
      } else if (typeof item === "object") {
        oOut += "\n" + " ".repeat(pIndentLevel + indentStep) + OutputYaml.formatYAML(item, pIndentLevel + indentStep);
      } else {
        /* istanbul ignore next */
        oOut += "x" + OutputYaml.formatYAML(item, pIndentLevel + indentStep);
      }
      oSeparator = "\n" + " ".repeat(pIndentLevel);
    }
    return oOut;
  }

}
