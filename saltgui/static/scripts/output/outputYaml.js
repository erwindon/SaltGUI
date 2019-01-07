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
      if(value.match(/^$/)) needQuotes = true;
      if(!value.match(/^[-a-z0-9_()@./:+ ]+$/i)) needQuotes = true;
      if(value.match(/^ /)) needQuotes = true;
      if(value.match(/ $/)) needQuotes = true;
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
  static formatYAML(value, indentLevel=0, prefix="") {

    // indent each level with 4 spaces
    const indentStep = 4;

    const str = OutputYaml.formatSimpleYAML(value);
    if(str !== null) {
      return prefix + str;
    }

    if(Array.isArray(value)) {
      let out = "";
      let separator = "";
      for(const item of value) {
        out += separator + " ".repeat(indentLevel);
        if(typeof item === "object") {
          out += " ".repeat(indentLevel) + "|_\n";
          if(Array.isArray(item)) {
            out += OutputYaml.formatYAML(item, indentLevel + indentStep, "y- ");
          } else {
            out += OutputYaml.formatYAML(item, indentLevel + indentStep, "x");
          }
        } else {
//return "{{{" + JSON.stringify(indentLevel) + "}}}";
          out += OutputYaml.formatYAML(item, indentLevel, "- ");
        }
        separator = "\n";
      }
      return out;
    }

    // regular object
    let out = "";
    let separator = "";
    for(const key of Object.keys(value).sort()) {
      const item = value[key];
      out += separator;
      if(typeof item !== "object") {
        out += " ".repeat(indentLevel) + prefix +  key + ":";
        if(item !== null) {
          out += " " + OutputYaml.formatYAML(item, 0, "");
        }
      } else {
        out += " ".repeat(indentLevel) + prefix +  key + ":\n";
        if(item !== null && item !== "") {
          out += OutputYaml.formatYAML(item, indentLevel + indentStep, "");
        }
      }
      separator = "\n";
    }
    return out;
  }

}

// for unit tests
if(typeof module !== "undefined") module.exports = OutputYaml;
