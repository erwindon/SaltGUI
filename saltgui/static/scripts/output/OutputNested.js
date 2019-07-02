export class OutputNested {

  // heavily inspired by the implementation for NESTED output
  // as originally implemented in salt/output/nested.py from Salt

  static ustring(pIndent, pTxt, pPrefix='', pSuffix='') {
    return " ".repeat(pIndent) + pPrefix + pTxt + pSuffix;
  }

  static display(pValue, pIndent, pPrefix, pOutArray) {
    if(pValue === null) {
      pOutArray.push(OutputNested.ustring(pIndent, "None", pPrefix));
    } else if(pValue === undefined) {
      pOutArray.push(OutputNested.ustring(pIndent, "undefined", pPrefix));
    } else if(typeof pValue === "boolean" || typeof pValue === "number") {
      pOutArray.push(OutputNested.ustring(pIndent, pValue, pPrefix));
    } else if(typeof pValue === "string") {
      let first_line = true;
      pValue = pValue.replace(/\n$/, "");
      for(const line of pValue.split("\n")) {
        let line_prefix = pPrefix;
        if(!first_line)
          line_prefix = " ".repeat(pPrefix.length);
        pOutArray.push(OutputNested.ustring(pIndent, line, line_prefix));
        first_line = false;
      }
    } else if(typeof pValue === "object" && Array.isArray(pValue)) {
      for(const ind of pValue) {
        if(typeof ind === "object" /* including array */ ) {
          pOutArray.push(OutputNested.ustring(pIndent, '|_'));
          let prefix;
          if(!Array.isArray(ind))
            prefix = '';
          else
            prefix ='-\u00A0';
          OutputNested.display(ind, pIndent + 2, prefix, pOutArray);
        } else {
          OutputNested.display(ind, pIndent, '-\u00A0', pOutArray);
        }
      }
    } else if(typeof pValue === "object") {
      if(pIndent) pOutArray.push(OutputNested.ustring(pIndent, '----------'));
      for(const key of Object.keys(pValue).sort()) {
        const val = pValue[key];
        pOutArray.push(OutputNested.ustring(pIndent, key, pPrefix, ':'));
        if(val === null) {
          // VOID
        } else if(val === "") {
          // VOID
        } else {
          OutputNested.display(val, pIndent + 4, '', pOutArray);
        }
      }
    }
    return pOutArray;
  }

  static formatNESTED(pValue, pIndentLevel=0) {
    const lines = OutputNested.display(pValue, pIndentLevel, '', []);
    return lines.join('\n');
  }

}
