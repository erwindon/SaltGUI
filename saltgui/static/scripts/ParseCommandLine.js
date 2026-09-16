// Function to parse a commandline
// The line is broken into individual tokens
// Each token that is recognized as a JS type will get that type
// Otherwise the token is considered to be a string
// name-value pairs in the form "name=value" are added to the "argsObject" dictionary
// other parameters are added to the "argsArray" array
// e.g.:
//   test "1 2 3" 4 x=7 {"a":1, "b":2}
// is a command line of 5 tokens
//   string: "test"
//   string: "1 2 3"
//   number: 4
//   number: 7
//   dictionary: {"a":1, "b": 2}
// the array will be filled with 4 elements
// the dictionary will be filled with one element named "x"

import {Character} from "./Character.js";
import {Utils} from "./Utils.js";

export class ParseCommandLine {

  static getPatJid () {
    return /^[2-9]\d\d\d[01]\d[0-3]\d[0-2]\d[0-5]\d[0-5]\d\d\d\d\d\d\d$/;
  }

  static getCommandFromCommandLine (pCommandLine) {
    const tokenArray = [];
    const argsArray = [];
    const argsObject = {};
    ParseCommandLine.parseCommandLine(pCommandLine, tokenArray, argsArray, argsObject);
    return argsArray[0];
  }

  static parseCommandLine (pToRun, pTokenArray, pArgsArray, pArgsObject) {
    // just in case the user typed some extra whitespace
    // at the start of the line
    pToRun = pToRun.trim();

    while (pToRun.length > 0) {
      let name = null;
      const paramResult = ParseCommandLine._extractNamedParameter(pToRun);
      if (paramResult.error) {
        return paramResult.error;
      }
      name = paramResult.name;
      pToRun = paramResult.pToRun;

      const placeholderResult = ParseCommandLine._checkPlaceholder(pToRun);
      if (placeholderResult.error) {
        return placeholderResult.error;
      }

      const jsonType = ParseCommandLine._detectJsonType(pToRun);
      const parseResult = jsonType.endChar && jsonType.objType
        ? ParseCommandLine._parseJsonValue(pToRun, jsonType)
        : ParseCommandLine._parseStringValue(pToRun);
      if (parseResult.error) {
        return parseResult.error;
      }

      const { value, remaining, token } = parseResult;
      pToRun = remaining;

      const addResult = ParseCommandLine._addArgumentToCollections(name, token, value, pTokenArray, pArgsArray, pArgsObject);
      if (addResult.error) {
        return addResult.error;
      }

      // ignore the whitespace before the next part
      pToRun = pToRun.trim();
    }

    // succesfull (no error message return)
    return null;
  }

  static _extractNamedParameter (pToRun) {
    let name = null;
    let toRun = pToRun;

    let firstSpaceChar = toRun.indexOf(" ");
    if (firstSpaceChar < 0) {
      firstSpaceChar = toRun.length;
    }
    const firstEqualSign = toRun.indexOf("=");
    if (firstEqualSign >= 0 && firstEqualSign < firstSpaceChar) {
      // we have the name of a named parameter
      name = toRun.substring(0, firstEqualSign);
      toRun = toRun.substring(firstEqualSign + 1);
      if (toRun === "" || toRun[0] === " ") {
        return { error: "Must have value for named parameter\nin: " + name + "=" };
      }
    }

    return { error: null, name, pToRun: toRun };
  }

  static _checkPlaceholder (pToRun) {
    const patPlaceHolder = /^<[a-z]+>/;
    if (patPlaceHolder.test(pToRun)) {
      const placeHolder = pToRun.replace(/>.*/, ">");
      return { error: "Must fill in all placeholders\ne.g. " + placeHolder };
    }
    return { error: null };
  }

  static _detectJsonType (pToRun) {
    // Determine whether the JSON string starts with a known
    // character for a JSON type
    if (pToRun[0] === "{") {
      return { beginChar: "{", endChar: "}", objType: "dictionary" };
    } else if (pToRun[0] === "[") {
      return { beginChar: "[", endChar: "]", objType: "array" };
    } else if (pToRun.startsWith("\"\"\"")) {
      return { beginChar: "\"\"\"", endChar: "\"\"\"", objType: "triple-quoted-string" };
    } else if (pToRun[0] === "\"") {
      // note that json does not support single-quoted strings
      return { beginChar: "\"", endChar: "\"", objType: "double-quoted-string" };
    }
    return { endChar: null, objType: null };
  }

  static _parseJsonValue (pToRun, pJsonType) {
    // The string starts with a character for a known JSON type
    const { beginChar, endChar, objType } = pJsonType;
    let charPos = beginChar.length;

    for (;;) {
      // Try until the next closing character
      let endCharPos = pToRun.indexOf(endChar, charPos);
      if (endCharPos < 0) {
        const extraInfo = ParseCommandLine._getJsonErrorInfo(objType);
        const problematicToken = Utils.truncateString(pToRun, 50);
        return { error: "No valid " + objType + " found" + extraInfo + "\nin: " + problematicToken };
      }

      // parse what we have found so far
      // the string ends with a closing character
      // but that may not be enough, e.g. "{a:{}"
      const parseAttempt = ParseCommandLine._attemptJsonParse(pToRun, beginChar, endCharPos, endChar, objType);
      if (parseAttempt === null) {
        // JSON parsing failed, try again with more text
        charPos = endCharPos + 1;
        continue;
      }

      if (parseAttempt.isFatal) {
        // valid JSON but followed by other text - return error immediately
        return parseAttempt;
      }

      // successful parse
      return parseAttempt;
    }
  }

  static _getJsonErrorInfo (pObjType) {
    if (pObjType === "dictionary") {
      return ", a valid example is: {\"key\": value}";
    } else if (pObjType === "array") {
      return ", a valid example is: [1, 2, 3]";
    }
    return "";
  }

  static _attemptJsonParse (pToRun, pBeginChar, pEndCharPos, pEndChar, pObjType) {
    let value;
    try {
      if (pObjType === "triple-quoted-string") {
        value = pToRun.substring(pBeginChar.length, pEndCharPos);
      } else {
        const fndStr = pToRun.substring(0, pEndCharPos + pEndChar.length);
        value = JSON.parse(fndStr);
      }
    } catch (err) { // eslint-disable-line no-unused-vars
      // the string that we tried to parse is not valid json
      // continue to add more text from the input
      return null;
    }

    // the first part of the string is valid JSON
    let endCharPos = pEndCharPos + pEndChar.length;
    if (endCharPos < pToRun.length && pToRun[endCharPos] !== " ") {
      const validPart = Utils.truncateString(pToRun.substring(0, endCharPos), 50);
      const extraText = Utils.truncateString(pToRun.substring(endCharPos), 50);
      return { error: "Valid " + pObjType + ", but followed by extra text\n" + pObjType + ": " + validPart + "\nextra: " + extraText, isFatal: true };
    }

    // valid JSON and not followed by strange characters
    const newToRun = pToRun.substring(endCharPos);
    const token = pToRun.substring(0, endCharPos);
    return { error: null, remaining: newToRun, token, value };
  }

  static _parseStringValue (pToRun) {
    // everything else is a string (without quotes)
    // when we are done, we'll see whether it actually is a number
    // or any of the known constants
    let str = "";
    let toRun = pToRun;
    while (toRun.length > 0 && toRun[0] !== " ") {
      str += toRun[0];
      toRun = toRun.substring(1);
    }

    const conversionResult = ParseCommandLine._convertStringToValue(str);
    if (conversionResult.error) {
      return { error: conversionResult.error };
    }
    const result = { error: null, remaining: toRun, token: str, value: conversionResult.value };
    if (conversionResult.warning) {
      result.warning = conversionResult.warning;
    }
    return result;
  }

  static _convertStringToValue (pStr) {
    // try to find whether the string is actually a known constant
    // or integer or float
    const patNull = /^(?:None|null|Null|NULL)$/;
    const patBooleanFalse = /^(?:false|False|FALSE)$/;
    const patBooleanTrue = /^(?:true|True|TRUE)$/;
    const patHexadecimal = /^[-+]?0[xX][0-9a-fA-F]+$/;
    const patBinary = /^[-+]?0[bB][01]+$/;
    const patOctal = /^[-+]?0[0-7]+$/;
    const patSexagesimal = /^[-+]?\d+(?::\d+)+$/;
    const patInteger = /^(?:(?:0)|(?:[-+]?[1-9]\d*))$/;
    const patFloat = /^[-+]?(?:\d+[.]?\d*|[.]\d+)(?:[eE][-+]?\d+)?$/; // NOSONAR S8786

    if (patNull.test(pStr)) {
      return { value: null };
    } else if (patBooleanFalse.test(pStr)) {
      return { value: false };
    } else if (patBooleanTrue.test(pStr)) {
      return { value: true };
    } else if (ParseCommandLine.getPatJid().test(pStr)) {
      // jobIds look like numbers but must be strings
      return { value: pStr };
    } else if (patHexadecimal.test(pStr)) {
      const result = ParseCommandLine._parseHexadecimal(pStr);
      return result;
    } else if (patBinary.test(pStr)) {
      const result = ParseCommandLine._parseBinary(pStr);
      return result;
    } else if (patOctal.test(pStr)) {
      const result = ParseCommandLine._parseOctal(pStr);
      return result;
    } else if (patSexagesimal.test(pStr)) {
      const result = ParseCommandLine._parseSexagesimal(pStr);
      return result;
    } else if (patInteger.test(pStr)) {
      const result = ParseCommandLine._parseDecimalInteger(pStr);
      return result;
    } else if (patFloat.test(pStr)) {
      const value = Number.parseFloat(pStr);
      if (!Number.isFinite(value)) {
        return { error: "Numeric argument has overflowed or is infinity" };
      }
      return { value };
    } else {
      return { value: pStr };
    }
  }

  static _check64BitRange (pValue) {
    const min = -0x8000000000000000n;
    const max = 0x7FFFFFFFFFFFFFFFn;
    const bigValue = BigInt(pValue);
    if (bigValue < min || bigValue > max) {
      return { isValid: false, warning: "Argument exceeds integer range, it will likely be sent as string" };
    }
    return { isValid: true };
  }

  static _parseHexadecimal (pStr) {
    const hasNegativeSign = pStr[0] === "-";
    let cleanStr = pStr;
    if (pStr[0] === "-" || pStr[0] === "+") {
      cleanStr = pStr.substring(1);
    }
    cleanStr = cleanStr.substring(2);
    const value = Number.parseInt(cleanStr, 16) * (hasNegativeSign ? -1 : 1);
    const rangeCheck = ParseCommandLine._check64BitRange(value);
    if (!rangeCheck.isValid) {
      return { value, warning: rangeCheck.warning };
    }
    return { value };
  }

  static _parseBinary (pStr) {
    const hasNegativeSign = pStr[0] === "-";
    let cleanStr = pStr;
    if (pStr[0] === "-" || pStr[0] === "+") {
      cleanStr = pStr.substring(1);
    }
    cleanStr = cleanStr.substring(2);
    const value = Number.parseInt(cleanStr, 2) * (hasNegativeSign ? -1 : 1);
    const rangeCheck = ParseCommandLine._check64BitRange(value);
    if (!rangeCheck.isValid) {
      return { value, warning: rangeCheck.warning };
    }
    return { value };
  }

  static _parseOctal (pStr) {
    const hasNegativeSign = pStr[0] === "-";
    let cleanStr = pStr;
    if (pStr[0] === "-" || pStr[0] === "+") {
      cleanStr = pStr.substring(1);
    }
    cleanStr = cleanStr.substring(1);
    const value = Number.parseInt(cleanStr, 8) * (hasNegativeSign ? -1 : 1);
    const rangeCheck = ParseCommandLine._check64BitRange(value);
    const warning = "Octal numbers are supported here, but usually not in 'salt'";
    if (!rangeCheck.isValid) {
      return { value, warning: rangeCheck.warning };
    }
    return { value, warning };
  }

  static _parseSexagesimal (pStr) {
    const sign = pStr[0] === "-" ? -1 : 1;
    const cleanStr = pStr.replace(/^[-+]/, "");
    const parts = cleanStr.split(":");

    // Validate: first part can be any integer, rest must be 0-59
    for (let i = 1; i < parts.length; i++) {
      const num = Number.parseInt(parts[i], 10);
      if (num < 0 || num > 59) {
        return { error: "Sexagesimal component out of range (must be 0-59 after first component)\nin: " + pStr };
      }
    }

    // Calculate the value: treat as mixed-radix base-60
    let value = 0;
    const baseMultipliers = [];
    for (let i = 0; i < parts.length; i++) {
      baseMultipliers.push(Math.pow(60, parts.length - 1 - i));
    }

    for (let i = 0; i < parts.length; i++) {
      value += Number.parseInt(parts[i], 10) * baseMultipliers[i];
    }

    value = value * sign;
    const rangeCheck = ParseCommandLine._check64BitRange(value);
    if (!rangeCheck.isValid) {
      return { value, warning: rangeCheck.warning };
    }
    return { value };
  }

  static _parseDecimalInteger (pStr) {
    const value = Number.parseInt(pStr, 10);
    const rangeCheck = ParseCommandLine._check64BitRange(value);
    if (!rangeCheck.isValid) {
      return { value, warning: rangeCheck.warning };
    }
    return { value };
  }

  static _addArgumentToCollections (pName, pToken, pValue, pTokenArray, pArgsArray, pArgsObject) {
    if (pName === null) {
      // anonymous parameter
      pTokenArray.push(pToken);
      pArgsArray.push(pValue);
    } else if (pName in pArgsObject) {
      // named parameter which already exists
      return { error: "Duplicate named variable\nin: " + pName };
    } else {
      // named parameter
      pArgsObject[pName] = pValue;
    }
    return { error: null };
  }

  static formatErrorMessage (pMessage) {
    return pMessage.replaceAll("\n", "\n" + Character.NO_BREAK_SPACE.repeat(5));
  }
}
