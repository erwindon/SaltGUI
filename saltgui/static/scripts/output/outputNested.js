class OutputNested {

  // format an object as NESTED
  // returns NULL when it is not a simple object
  // i.e. no multi-line objects, no indentation here
  static formatSimpleNESTED(value) {

    if(value === null) {
      return "None";
    }

    if(value === undefined) {
      return "undefined";
    }

    if(typeof value === "boolean") {
      return value ? "True" : "False";
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

  // format an object as NESTED
  // based on an initial indentation and an indentation increment
  static formatNESTED(value, indentLevel=0, prefix="") {

    // indent each level with 4 spaces
    const indentStep = 4;

    const str = OutputNested.formatSimpleNESTED(value);
    if(str !== null) {
      return prefix + str;
    }

    if(Array.isArray(value)) {
      let out = "";
      let cnt = 0;
      for(const item of value) {
        if(cnt > 0) out += "\n" + " ".repeat(indentLevel);
        if(typeof item === "object") {
          out += "|_\n" + " ".repeat(indentLevel);
          if(Array.isArray(item)) {
            out += "  " + OutputNested.formatNESTED(item, indentLevel + 2, "- ");
          } else {
            out += "  " + OutputNested.formatNESTED(item, indentLevel + 2);
          }
        } else {
          out += OutputNested.formatNESTED(item, indentLevel + 2, "- ");
        }
        cnt = cnt + 1;
      }
      return out;
    }

    // regular object
    let out = "";
    let cnt = 0;
    if(indentLevel) out += " ".repeat(indentLevel - indentStep) + "----------\n" + " ".repeat(indentLevel);
    for(const key of Object.keys(value).sort()) {
      const item = value[key];
      if(cnt > 0) out += "\n" + " ".repeat(indentLevel);
      out += prefix + key + ":";
      if(item !== null) {
        out += "\n" + " ".repeat(indentLevel + indentStep) + OutputNested.formatNESTED(item, indentLevel + indentStep, "");
      }
      cnt += 1;
    }
    return out;
  }

}

// for unit tests
if(typeof module !== "undefined") module.exports = OutputNested;
