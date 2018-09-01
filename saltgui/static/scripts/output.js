// Functions to turn responses from the salt system into visual information
// The following variations exist:
// A) documentation output
//    one of the responsing nodes is selected
//    all other nodes are then ignored
// B) state output
//    TODO
// C) error output
//    the response is formatted as text
// D) other output
//    the response is formatted as json text
//
// Additionally the following preparations may be needed:
// 1) Output from WHEEL functions
//    This output is re-organized to let it appear as if the output comes
//    from a single node called "master".
// 2) Output from RUNNERS functions
//    This output is re-organized to let it appear as if the output comes
//    from a single node called "master".


class Output {

  // Re-organize the output to let it appear as if the output comes
  // from a single node called "RUNNER" or "MASTER".
  // This way all responses are organized by minion
  static addVirtualMinion(response, command) {

    if(command.startsWith("runners.")) {
      // Add a new level in the object
      return { "RUNNER": response };
    }

    if(command.startsWith("wheel.")) {
      // Add a new level in the object
      return { "WHEEL": response };
    }

    // otherwise return the original
    return response;
  }


  // we only treat output as documentation output when it sticks to strict rules
  // all minions must return strings
  // empty values are allowed due to errors in the documentation
  static isDocumentationOutput(response) {

    let result = false;

    for(let hostname of Object.keys(response)) {

      var output = response[hostname];

      if(!output) {
        // some commands do not have help-text
        // e.g. wheel.key.get_key
        continue;
      }

      if(typeof output !== 'object') {
        // strange --> no documentation object
        return false;
      }

      for(let key of Object.keys(output)) {
        // e.g. for "test.rand_str"
        if(output[key] === null)
          continue;

        // but otherwise it must be a (documentation)string
        if(typeof output[key] !== 'string') {
          return false;
        }

        result = true;
      }
    }

    return result;
  }

  // documentation is requested from all targetted minions
  // these all return roughly the same output
  // it is a big waste of screen lines to show the output for each minion
  // so the output is reduced to the output from a single minion only
  // this is exactly what the salt commandline also does
  // Parameters:
  //   response: the data returned from all minions
  //   visualKey: the name under which the result must be visualized
  //              this replaces the traditional minion-name
  //   filterKey: the prefix (or the full command) that the documentation
  //              was requested for. The internal functions for WHEEL and
  //              RUNNERS always return all documentation in that category
  //              thus that response must be reduced.
  static reduceDocumentationOutput(response, visualKey, filterKey) {
    if(!response || typeof response !== "object") {
      // strange --> don't try to fix anything
      return;
    }

    // reduce the search key to match the data in the response
    if(filterKey === "wheel") {
      filterKey = "";
    } else if (filterKey.startsWith("wheel.")) {
      filterKey = filterKey.substring(6);
    } else if(filterKey === "runners") {
      filterKey = "";
    } else if (filterKey.startsWith("runners.")) {
      filterKey = filterKey.substring(8);
    }

    let selectedMinion = null;
    for(let hostname of Object.keys(response)) {

      // When we already found the documentation ignore all others
      if(selectedMinion) {
        delete response[hostname];
        continue;
      }

      // make sure it is an object (instead of e.g. "false" for an offline minion)
      // when it is not, the whole entry is ignored
      if(typeof response[hostname] !== "object") {
        delete response[hostname];
        continue;
      }

      // make sure that the entry matches with the requested command or prefix
      // that's always the case for SYS.DOC output, but not for RUNNERS.DOC.RUNNER
      // and/or RUNNERS.DOC.WHEEL.
      let hostResponse = response[hostname];
      for(let key of Object.keys(hostResponse)) {

        // an exact match is great
        if(key === filterKey) continue;

        // a true prefix is also ok
        if(!filterKey || key.startsWith(filterKey + ".")) continue;

        // no match, ignore the whole entry
        delete hostResponse[key];
      }

      // no documentation present (or left) on this minion?
      // then discard the result of this minion
      if(Object.keys(hostResponse).length === 0) {
        delete response[hostname];
        continue;
      }

      // we have found documentation output
      // mark all other documentation for discarding
      selectedMinion = hostname;
    }

    if(selectedMinion) {
      // basically rename the key
      let savedDocumentation = response[selectedMinion];
      delete response[selectedMinion];
      response[visualKey] = savedDocumentation;
    } else {
      // prepare a dummy response when no documentation could be found
      // otherwise leave all documentation responses organized by minion
      response["dummy"] = { };
      response["dummy"][visualKey] = "no documentation found";
    }
  }

  // add the output of a documentation command to the display
  static addDocumentationOutput(outputContainer, response) {
    // we expect no hostnames present
    // as it should have been reduced already
    for(let hostname of Object.keys(response)) {
      let hostResponse = response[hostname];
      for(let key of Object.keys(hostResponse).sort()) {
        let out = hostResponse[key];
        if(out === null) continue;
        // the output is already pre-ed
        out = out.replace(/\n[ \t]*<[\/]?pre>[ \t]*\n/g, "\n");
        // turn text into html
        out = out.replace(/&/g, "&amp;");
        out = out.replace(/</g, "&lt;");
        out = out.replace(/>/g, "&gt;");
        // replace ``......``
        out = out.replace(/``([^`]*)``/g, "<span style='background-color: #575757'>$1</span>");
        out = out.trimEnd();
        outputContainer.innerHTML +=
          `<span class='hostname'>${key}</span>:<br>` +
          '<pre style="height: initial; overflow-y: initial;">' + out + '</pre>';
      }
    }
  }


  // this is the default output form
  // just format the returned objects
  static addNormalOutput(outputContainer, response) {

    for(let hostname of Object.keys(response).sort()) {
      let hostResponse = response[hostname];

      if (typeof hostResponse === 'object') {
        // when you do a state.apply for example you get a json response.
        // let's format it nicely here
        hostResponse = JSON.stringify(hostResponse, null, 2);
      } else if (typeof hostResponse === 'string') {
        // Or when it is text, strip trailing whitespace
        hostResponse = hostResponse.replace(/[ \r\n]+$/g, "");
      }

      outputContainer.innerHTML +=
        `<span class='hostname'>${hostname}</span>: ${hostResponse}<br>`;
    }
  }


  // show an error
  // we do not assume any organisation of the data
  static addErrorOutput(outputContainer, response) {
    outputContainer.innerText = response;
  }


  // the orchestrator for the output
  // determines what format should be used and uses that
  static addOutput(outputContainer, response, command) {

    // remove old content
    outputContainer.innerHTML = "";

    if(typeof response === "string") {
      Output.addErrorOutput(outputContainer, response);
      return;
    }

    // reformat runner/wheel output into regular output
    response = Output.addVirtualMinion(response, command);

    // it might be documentation
    let isDocumentationOutput = Output.isDocumentationOutput(response);
    if(isDocumentationOutput) {
      command = command.trim().replace(/^[a-z.]* */i, "");
      Output.reduceDocumentationOutput(response, command, command);
      Output.addDocumentationOutput(outputContainer, response);
      return;
    }

    // nothing special? then it is normal output
    Output.addNormalOutput(outputContainer, response);
  }

}

// for unit tests
if(typeof module !== "undefined") module.exports = Output;
