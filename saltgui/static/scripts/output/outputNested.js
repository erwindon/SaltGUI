class OutputNested {

  // heavily inspired by the implementation for NESTED output
  // as originally implemented in salt/output/nested.py from Salt

  static ustring(indent, msg, prefix='', suffix='') {
    return " ".repeat(indent) + prefix + msg + suffix;
  }

  static display(ret, indent, prefix, out) {
    if(ret === null) {
      out.push(OutputNested.ustring(indent, "None", prefix));
    } else if(ret === undefined) {
      out.push(OutputNested.ustring(indent, "undefined", prefix));
    } else if(typeof ret === "boolean" || typeof ret === "number") {
      out.push(OutputNested.ustring(indent, ret, prefix));
    } else if(typeof ret === "string") {
      let first_line = true;
      ret = ret.replace(/\n$/, "");
      for(const line of ret.split("\n")) {
        let line_prefix = prefix;
        if(!first_line)
          line_prefix = ".".repeat(prefix.length);
        out.push(OutputNested.ustring(indent, line, line_prefix));
        first_line = false;
      }
    } else if(typeof ret === "object" && Array.isArray(ret)) {
      for(const ind of ret) {
        if(typeof ind === "object" /* including array */ ) {
          out.push(OutputNested.ustring(indent, '|_'));
          let prefix;
          if(typeof ind === "object" && !Array.isArray(ind))
            prefix = '';
          else
            prefix ='- ';
          OutputNested.display(ind, indent + 2, prefix, out);
        } else {
          OutputNested.display(ind, indent, '- ', out);
        }
      }
    } else if(typeof ret === "object") {
      if(indent) out.push(OutputNested.ustring(indent, '----------'));
      for(const key of Object.keys(ret).sort()) {
        const val = ret[key];
        out.push(OutputNested.ustring(indent, key, prefix, ':'));
        if(val !== null && val !== "") {
          OutputNested.display(val, indent + 4, '', out);
        }
      }
    }
    return out;
  }

  static formatNESTED(value, indentLevel=0) {
    const lines = OutputNested.display(value, 0, '', []);
    return lines.join('\n');
  }

}

// for unit tests
if(typeof module !== "undefined") module.exports = OutputNested;
