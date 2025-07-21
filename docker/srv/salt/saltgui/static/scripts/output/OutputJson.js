export class OutputJson {

  // format an object as JSON
  // returns NULL when it is not a simple object
  // i.e. no multi-line objects, no indentation here
  static _formatSimpleJSON (pValue) {

    if (pValue === null) {
      // null is an object, but not really
      // leave that to the builtin function
      return JSON.stringify(pValue);
    }

    if (pValue === undefined) {
      // JSON.stringify does not return a string for this
      // but again a value undefined, we need a string
      return "undefined";
    }

    if (typeof pValue === "string") {
      // JSON.stringify does not handle this properly
      // as it may leave numeric-text unquoted
      return "\"" + pValue.replace(/["\\]/g, "\\$&") + "\"";
    }

    if (typeof pValue !== "object") {
      // any other simple type
      // leave that to the builtin function
      return JSON.stringify(pValue);
    }

    if (Array.isArray(pValue) && pValue.length === 0) {
      // show the brackets for an empty array a bit wider apart
      return "[ ]";
    }

    if (Array.isArray(pValue) && pValue.length === 1 && typeof pValue[0] !== "object") {
      // show the brackets for a simple array a bit wider apart
      return "[ " + JSON.stringify(pValue[0]) + " ]";
    }

    if (!Array.isArray(pValue) && Object.keys(pValue).length === 0) {
      // show the brackets for an empty object a bit wider apart
      return "{ }";
    }

    // do not use Object.values as eslint does understand that because it is ES8/2017
    if (!Array.isArray(pValue) && Object.keys(pValue).length === 1 && typeof pValue[Object.keys(pValue)[0]] !== "object") {
      // show the brackets for a simple object a bit wider apart
      return "{ " + JSON.stringify(Object.keys(pValue)[0]) + ": " + JSON.stringify(pValue[Object.keys(pValue)[0]]) + " }";
    }

    return null;
  }

  // format an object as JSON
  // based on an initial indentation and an indentation increment
  static formatJSON (pValue, pIndentLevel = 0) {

    // indent each level with 4 spaces
    const indentStep = 4;

    let str = OutputJson._formatSimpleJSON(pValue);
    if (str !== null) {
      return str;
    }

    if (Array.isArray(pValue)) {
      // an array
      // put each element on its own line
      str = "[";
      let aSeparator = "";
      for (const elem of pValue) {
        str += aSeparator + "\n" + " ".repeat(pIndentLevel + indentStep) +
          OutputJson.formatJSON(elem, pIndentLevel + indentStep);
        aSeparator = ",";
      }
      str += "\n" + " ".repeat(pIndentLevel) + "]";
      return str;
    }

    // regular object
    // put each name+value on its own line
    str = "{";
    let oSeparator = "";
    // do not use Object.entries, that is not supported by the test framework as it is ES8/2017
    const sortedKeys = Object.keys(pValue).sort((aa, bb) => aa.localeCompare(bb, "en", {"numeric": true}));
    for (const key of sortedKeys) {
      const item = pValue[key];
      str += oSeparator + "\n" + " ".repeat(pIndentLevel + indentStep) + JSON.stringify(key) + ": " +
        OutputJson.formatJSON(item, pIndentLevel + indentStep);
      oSeparator = ",";
    }
    str += "\n" + " ".repeat(pIndentLevel) + "}";
    return str;
  }

}
