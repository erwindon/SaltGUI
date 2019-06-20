export class OutputJson {

  // format an object as JSON
  // returns NULL when it is not a simple object
  // i.e. no multi-line objects, no indentation here
  static formatSimpleJSON(value) {

    if(value === null) {
      // null is an object, but not really
      // leave that to the builtin function
      return JSON.stringify(value);
    }

    if(value === undefined) {
      // JSON.stringify does not return a string for this
      // but again a value undefined, we need a string
      return "undefined";
    }

    if(typeof value !== "object") {
      // a simple type
      // leave that to the builtin function
      return JSON.stringify(value);
    }

    if(Array.isArray(value) && value.length === 0) {
      // show the brackets for an empty array a bit wider apart
      return "[ ]";
    }

    if(Array.isArray(value) && value.length === 1 && typeof value[0] !== "object") {
      // show the brackets for a simple array a bit wider apart
      return "[ " + JSON.stringify(value[0]) + " ]";
    }

    if(!Array.isArray(value) && Object.keys(value).length === 0) {
      // show the brackets for an empty object a bit wider apart
      return "{ }";
    }

    // do not use Object.values as eslint does understand that
    if(!Array.isArray(value) && Object.keys(value).length === 1 && typeof value[Object.keys(value)[0]] !== "object") {
      // show the brackets for a simple object a bit wider apart
      return "{ " + JSON.stringify(Object.keys(value)[0]) + ": " + JSON.stringify(value[Object.keys(value)[0]]) + " }";
    }

    return null;
  }

  // format an object as JSON
  // based on an initial indentation and an indentation increment
  static formatJSON(value, indentLevel=0) {

    // indent each level with 4 spaces
    const indentStep = 4;

    let str = OutputJson.formatSimpleJSON(value);
    if(str !== null) {
      return str;
    }

    if(Array.isArray(value)) {
      // an array
      // put each element on its own line
      str = "[";
      let separator = "";
      for(const elem of value) {
        str += separator + "\n" + " ".repeat(indentLevel + indentStep) +
          OutputJson.formatJSON(elem, indentLevel + indentStep);
        separator = ",";
      }
      str += "\n" + " ".repeat(indentLevel) + "]";
      return str;
    }

    // regular object
    // put each name+value on its own line
    const keys = Object.keys(value);
    str = "{";
    let separator = "";
    // do not use Object.entries, that is not supported by the test framework
    for(const key of Object.keys(value).sort()) {
      const item = value[key];
      str += separator + "\n" + " ".repeat(indentLevel + indentStep) + "\"" + key + "\": " +
        OutputJson.formatJSON(item, indentLevel + indentStep);
      separator = ",";
    }
    str += "\n" + " ".repeat(indentLevel) + "}";
    return str;
  }

}
