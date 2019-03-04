// Function to parse a commandline
// The line is broken into individual tokens
// Each token that is recognized as a JS type will get that type
// Otherwise the token is considered to be a string
// name-value pairs in the form "name=value" are added to the "params" dictionary
// other parameters are added to the "args" array
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


// note that "none" is not case-insensitive, but "null" is
const patNull = /^(None|null|Null|NULL)$/;

const patBooleanFalse = /^(false|False|FALSE)$/;
const patBooleanTrue = /^(true|True|TRUE)$/;

const patJid = /^[2-9][0-9][0-9][0-9][01][0-9][0-3][0-9][0-2][0-9][0-5][0-9][0-5][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/;

const patInteger = /^((0)|([-+]?[1-9][0-9]*))$/;

const patFloat = /^([-+]?(([0-9]+)|([0-9]+[.][0-9]*)|([0-9]*[.][0-9]+))([eE][-+]?[0-9]+)?)$/;


window.parseCommandLine = function(toRun, args, params) {
  // just in case the user typed some extra whitespace
  // at the start of the line
  toRun = toRun.trim();

  while(toRun.length > 0)
  {
    let name = null;

    let firstSpaceChar = toRun.indexOf(" ");
    if(firstSpaceChar < 0)
      firstSpaceChar = toRun.length;
    const firstEqualSign = toRun.indexOf("=");
    if(firstEqualSign >= 0 && firstEqualSign < firstSpaceChar) {
      // we have the name of a named parameter
      name = toRun.substr(0, firstEqualSign);
      toRun = toRun.substr(firstEqualSign + 1);
      if(toRun === "" || toRun[0] === " ") {
        return "Must have value for named parameter '" + name + "'";
      }
    }

    // Determine whether the JSON string starts with a known
    // character for a JSON type
    let endChar = undefined;
    let objType = undefined;
    if(toRun[0] === "{") {
      endChar = "}";
      objType = "dictionary";
    } else if(toRun[0] === "[") {
      endChar = "]";
      objType = "array";
    } else if(toRun[0] === "\"") {
      // note that json does not support single-quoted strings
      endChar = "\"";
      objType = "double-quoted-string";
    }

    let value;
    if(endChar && objType) {
      // The string starts with a character for a known JSON type
      let p = 1;
      while(true) {
        // Try until the next closing character
        let n = toRun.indexOf(endChar, p);
        if(n < 0) {
          return "No valid " + objType + " found";
        }

        // parse what we have found so far
        // the string ends with a closing character
        // but that may not be enough, e.g. "{a:{}"
        const s = toRun.substring(0, n + 1);
        try {
          value = JSON.parse(s);
        }
        catch(err) {
          // the string that we tried to parse is not valid json
          // continue to add more text from the input
          p = n + 1;
          continue;
        }

        // the first part of the string is valid JSON
        n = n + 1;
        if(n < toRun.length && toRun[n] !== " ") {
          return "Valid " + objType + ", but followed by text:" + toRun.substring(n) + "...";
        }

        // valid JSON and not followed by strange characters
        toRun = toRun.substring(n);
        break;
      }
    } else {
      // everything else is a string (without quotes)
      // when we are done, we'll see whether it actually is a number
      // or any of the known constants
      let str = "";
      while(toRun.length > 0 && toRun[0] !== " ") {
        str += toRun[0];
        toRun = toRun.substring(1);
      }

      // try to find whether the string is actually a known constant
      // or integer or float
      if(patNull.test(str)) {
        value = null;
      } else if(patBooleanFalse.test(str)) {
        value = false;
      } else if(patBooleanTrue.test(str)) {
        value = true;
      } else if(patJid.test(str)) {
        // jids look like numbers but must be strings
        value = str;
      } else if(patInteger.test(str)) {
        value = parseInt(str);
      } else if(patFloat.test(str)) {
        value = parseFloat(str);
        if(!isFinite(value)) {
          return "Numeric argument has overflowed or is infinity";
        }
      } else {
        value = str;
      }
    }

    if(name !== null) {
      // named parameter
      params[name] = value;
    } else {
      // anonymous parameter
      args.push(value);
    }

    // ignore the whitespace before the next part
    toRun = toRun.trim();
  }

  // succesfull (no error message return)
  return null;
};
