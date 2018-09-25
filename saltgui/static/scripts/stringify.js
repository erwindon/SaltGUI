class Stringify {

  // format a JSON object
  // currently using the builtin function
  // with small improvement for empty dict or array
  static format(a) {

    // first use a simple flat format
    let txt = JSON.stringify(a);

    if(txt === "[]") {
      // show the brackets a bit wider apart
      // no support for nested occurances yet
      txt = "[&nbsp;]";
    }
    else if(txt === "{}") {
      // show the brackets a bit wider apart
      // no support for nested occurances yet
      txt = "{&nbsp;}";
    }
    else {
      // use a multi-line format with indentation
      txt = JSON.stringify(a, null, "  ");
    }

    return txt;
  }

}

// for unit tests
if(typeof module !== "undefined") module.exports = Stringify;
