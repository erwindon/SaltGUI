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
        return pValue;
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
      if (pValue.match(/^%/)) {
        needQuotes = true;
      }

      if (!pValue.match(/^[-a-z0-9_()./:+ ]+$/i)) {
        needQuotes = true;
      }

      if (!needQuotes) {
        return pValue;
      }
      return "'" + pValue + "'";
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
      let out = "";
      let separator = "";
      for (const item of pValue) {
        // 00A0 = NO-BREAK SPACE
        out += separator + "-\u00A0" + OutputYaml.formatYAML(item, pIndentLevel + 2);
        separator = "\n" + " ".repeat(pIndentLevel);
      }
      return out;
    }

    // regular object
    let out = "";
    let separator = "";
    for (const key of Object.keys(pValue).sort()) {
      const item = pValue[key];
      out += separator + key + ":";
      const systr = OutputYaml._formatSimpleYAML(item);
      if (systr !== null) {
        out += " " + systr;
      } else if (Array.isArray(item)) {
        out += "\n" + " ".repeat(pIndentLevel) + OutputYaml.formatYAML(item, pIndentLevel);
      } else if (typeof item === "object") {
        out += "\n" + " ".repeat(pIndentLevel + indentStep) + OutputYaml.formatYAML(item, pIndentLevel + indentStep);
      } else {
        /* istanbul ignore next */
        out += "x" + OutputYaml.formatYAML(item, pIndentLevel + indentStep);
      }
      separator = "\n" + " ".repeat(pIndentLevel);
    }
    return out;
  }

}
