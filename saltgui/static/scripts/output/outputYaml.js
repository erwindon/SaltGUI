class OutputYaml {

  // format an object as YAML
  // returns NULL when it is not a simple object
  // i.e. no multi-line objects, no indentation here
  static formatSimpleYAML(value) {

    if(value === null) {
      return "null";
    }

    if(value === undefined) {
      return "undefined";
    }

    if(typeof value === "boolean") {
      return value ? "true" : "false";
    }

    if(typeof value === "string") {
      let needQuotes = false;

      // simple number with extra 0's at the start is still a string
      if(value.match(/^0[0-9]+$/)) return value;

      if(!isNaN(Number(value))) needQuotes = true;

      if(value.match(/^$/)) needQuotes = true;

      if(value.match(/^ /)) needQuotes = true;
      if(value.match(/ $/)) needQuotes = true;

      if(value.match(/^@/)) needQuotes = true;
      if(value.match(/^`/)) needQuotes = true;
      if(value.match(/^%/)) needQuotes = true;

      if(!value.match(/^[-a-z0-9_()./:+ ]+$/i)) needQuotes = true;

      if(!needQuotes) return value;
      return "'" + value + "'";
    }

    if(typeof value !== "object") {
      return "" + value;
    }

    if(Array.isArray(value) && value.length === 0) {
      // show the brackets for an empty array a bit wider apart
      return "[ ]";
    }

    if(!Array.isArray(value) && Object.keys(value).length === 0) {
      // show the brackets for an empty object a bit wider apart
      return "{ }";
    }

    return null;
  }

  // format an object as YAML
  // based on an initial indentation and an indentation increment
  static formatYAML(value, indentLevel=0) {

    // indent each level with this number of spaces
    // note that list items are indented with 2 spaces
    // independently of this setting to match the prefix "- "
    const indentStep = 2;

    const str = OutputYaml.formatSimpleYAML(value);
    if(str !== null) {
      return str;
    }

    if(Array.isArray(value)) {
      let out = "";
      let separator = "";
      for(const item of value) {
        out += separator + "-&nbsp;" + OutputYaml.formatYAML(item, indentLevel + 2);
        separator = "\n" + " ".repeat(indentLevel);
      }
      return out;
    }

    // regular object
    let out = "";
    let separator = "";
    for(const key of Object.keys(value).sort()) {
      const item = value[key];
      out += separator + key + ":";
      const str = OutputYaml.formatSimpleYAML(item);
      if(str !== null) {
        out += " " + str;
      } else if(Array.isArray(item)) {
        out += "\n" + " ".repeat(indentLevel) + OutputYaml.formatYAML(item, indentLevel);
      } else if(typeof item === "object") {
        out += "\n" + " ".repeat(indentLevel + indentStep) + OutputYaml.formatYAML(item, indentLevel + indentStep);
      } else {
        out += "x" + OutputYaml.formatYAML(item, indentLevel + indentStep);
      }
      separator = "\n" + " ".repeat(indentLevel);
    }
    return out;
  }

}

// for unit tests
if(typeof module !== "undefined") module.exports = OutputYaml;
