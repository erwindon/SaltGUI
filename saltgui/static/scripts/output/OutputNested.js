export class OutputNested {

  // heavily inspired by the implementation for NESTED output
  // as originally implemented in salt/output/nested.py from Salt

  static ustring(pIndent, msg, prefix='', suffix='') {
    return " ".repeat(pIndent) + prefix + msg + suffix;
  }

  static display(ret, pIndent, prefix, out) {
    if(ret === null) {
      out.push(OutputNested.ustring(pIndent, "None", prefix));
    } else if(ret === undefined) {
      out.push(OutputNested.ustring(pIndent, "undefined", prefix));
    } else if(typeof ret === "boolean" || typeof ret === "number") {
      out.push(OutputNested.ustring(pIndent, ret, prefix));
    } else if(typeof ret === "string") {
      let first_line = true;
      ret = ret.replace(/\n$/, "");
      for(const line of ret.split("\n")) {
        let line_prefix = prefix;
        if(!first_line)
          line_prefix = " ".repeat(prefix.length);
        out.push(OutputNested.ustring(pIndent, line, line_prefix));
        first_line = false;
      }
    } else if(typeof ret === "object" && Array.isArray(ret)) {
      for(const ind of ret) {
        if(typeof ind === "object" /* including array */ ) {
          out.push(OutputNested.ustring(pIndent, '|_'));
          let prefix;
          if(!Array.isArray(ind))
            prefix = '';
          else
            prefix ='-\u00A0';
          OutputNested.display(ind, pIndent + 2, prefix, out);
        } else {
          OutputNested.display(ind, pIndent, '-\u00A0', out);
        }
      }
    } else if(typeof ret === "object") {
      if(pIndent) out.push(OutputNested.ustring(pIndent, '----------'));
      for(const key of Object.keys(ret).sort()) {
        const val = ret[key];
        out.push(OutputNested.ustring(pIndent, key, prefix, ':'));
        if(val === null) {
          // VOID
        } else if(val === "") {
          // VOID
        } else {
          OutputNested.display(val, pIndent + 4, '', out);
        }
      }
    }
    return out;
  }

  static formatNESTED(pValue, pIndentLevel=0) {
    const lines = OutputNested.display(pValue, pIndentLevel, '', []);
    return lines.join('\n');
  }

}
