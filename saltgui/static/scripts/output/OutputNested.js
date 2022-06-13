import {Character} from "../Character.js";

export class OutputNested {

  // heavily inspired by the implementation for NESTED output
  // as originally implemented in salt/output/nested.py from Salt

  static _ustring (pIndent, pTxt, pPrefix = "", pSuffix = "") {
    return " ".repeat(pIndent) + pPrefix + pTxt + pSuffix;
  }

  static display (pValue, pIndent, pPrefix, pOutArray) {
    if (pValue === null) {
      pOutArray.push(OutputNested._ustring(pIndent, "None", pPrefix));
    } else if (pValue === undefined) {
      pOutArray.push(OutputNested._ustring(pIndent, "undefined", pPrefix));
    } else if (typeof pValue === "boolean" || typeof pValue === "number") {
      pOutArray.push(OutputNested._ustring(pIndent, pValue, pPrefix));
    } else if (typeof pValue === "string") {
      let isFirstLine = true;
      pValue = pValue.replace(/\n$/, "");
      for (const line of pValue.split("\n")) {
        let linePrefix = pPrefix;
        if (!isFirstLine) {
          linePrefix = " ".repeat(pPrefix.length);
        }
        pOutArray.push(OutputNested._ustring(pIndent, line, linePrefix));
        isFirstLine = false;
      }
    } else if (typeof pValue === "object" && Array.isArray(pValue)) {
      for (const ind of pValue) {
        if (typeof ind === "object") {
          // including array
          pOutArray.push(OutputNested._ustring(pIndent, "|_"));
          let prefix;
          if (Array.isArray(ind)) {
            prefix = "-" + Character.NO_BREAK_SPACE;
          } else {
            prefix = "";
          }
          OutputNested.display(ind, pIndent + 2, prefix, pOutArray);
        } else {
          OutputNested.display(ind, pIndent, "-" + Character.NO_BREAK_SPACE, pOutArray);
        }
      }
    } else if (typeof pValue === "object") {
      if (pIndent) {
        pOutArray.push(OutputNested._ustring(pIndent, "----------"));
      }
      const sortedKeys = Object.keys(pValue).sort((aa, bb) => aa.localeCompare(bb, "en", {"numeric": true}));
      for (const key of sortedKeys) {
        const val = pValue[key];
        pOutArray.push(OutputNested._ustring(pIndent, key, pPrefix, ":"));
        if (val === null) {
          // VOID
        } else if (val === "") {
          // VOID
        } else {
          OutputNested.display(val, pIndent + 4, "", pOutArray);
        }
      }
    }
    return pOutArray;
  }

  static formatNESTED (pValue, pIndentLevel = 0) {
    const lines = OutputNested.display(pValue, pIndentLevel, "", []);
    return lines.join("\n");
  }

}
