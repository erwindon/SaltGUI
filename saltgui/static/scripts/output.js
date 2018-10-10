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

  // format a JSON object
  // based on an initial indentation and an indentation increment
  // default initial indentation is ""
  static formatJSON(value, indentLevel=0) {

    // indent each level with 2 spaces
    const indentStep = 2;

    if(value === undefined) {
      // JSON.stringify does not return a string for this
      // but again a value undefined
      return "undefined";
    }

    if(typeof value !== "object") {
      // a simple type
      // leave that to the builtin function
      return JSON.stringify(value);
    }

    if(value === null) {
      // null is an object, but not really
      // leave that to the builtin function
      return JSON.stringify(value);
    }

    if(Array.isArray(value)) {
      // an array
      // put each element on its own line
      let str = "[";
      let separator = "";
      for(const elem of value) {
        str += separator + "\n" + " ".repeat(indentLevel + indentStep) +
          Output.formatJSON(elem, indentLevel + indentStep);
        separator = ",";
      }
      if(value.length === 0) {
        // show the brackets for an empty array a bit wider apart
        str += " ";
      } else {
        str += "\n" + " ".repeat(indentLevel);
      }
      str += "]";
      return str;
    }

    // regular object
    // put each name+value on its own line
    const keys = Object.keys(value);
    let str = "{";
    let separator = "";
    for (const [key, val] of Object.entries(value).sort()) {
      str += separator + "\n" + " ".repeat(indentLevel + indentStep) + "\"" + key + "\": " +
        Output.formatJSON(val, indentLevel + indentStep);
      separator = ",";
    }
    if(Object.keys(value).length === 0) {
      // show the brackets for an empty object a bit wider apart
      str += " ";
    } else {
      str += "\n" + " ".repeat(indentLevel);
    }
    str += "}";
    return str;
  }

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

  // compose the host/minion-name label that is shown with each response
  static getHostnameHtml(hostname, extraClasses) {
    return "<span class='hostname" + extraClasses + "'>" + hostname + "</span>:";
  }

  // reduce the search key to match the data in the response
  static reduceFilterKey(filterKey) {
    if(filterKey === "wheel") {
      return "";
    }
    if (filterKey.startsWith("wheel.")) {
      // strip the prefix "wheel."
      return filterKey.substring(6);
    }

    if(filterKey === "runners") {
      return "";
    }
    if (filterKey.startsWith("runners.")) {
      // strip the prefix "runners."
      return filterKey.substring(8);
    }

    return filterKey;
  }


  // test whether the returned data matches the requested data
  static isDocuKeyMatch(key, filterKey) {

    // no filter is always OK
    if(!filterKey) return true;

    // an exact match is great
    if(key === filterKey) return true;

    // a true prefix is also ok
    if(key.startsWith(filterKey + ".")) return true;

    // no match
    return false;
  }


  // we only treat output as documentation output when it sticks to strict rules
  // all minions must return strings
  // and when its key matches the requested documentation
  // empty values are allowed due to errors in the documentation
  static isDocumentationOutput(response, command) {

    let result = false;

    // reduce the search key to match the data in the response
    command = Output.reduceFilterKey(command);

    for(const hostname of Object.keys(response)) {

      const output = response[hostname];

      if(!output) {
        // some commands do not have help-text
        // e.g. wheel.key.get_key
        continue;
      }

      if(typeof output !== 'object') {
        // strange --> no documentation object
        return false;
      }

      // arrays are also objects,
      // but not what we are looking for
      if(Array.isArray(output)) {
        return false;
      }

      for(const key of Object.keys(output)) {
        // e.g. for "test.rand_str"
        if(output[key] === null) {
          continue;
        }

        // but otherwise it must be a (documentation)string
        if(typeof output[key] !== 'string') {
          return false;
        }

        // is this what we were looking for?
        if(Output.isDocuKeyMatch(key, command)) {
          result = true;
        }
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
    // i.e. remove the prefixes for "wheel" and "runners"
    filterKey = Output.reduceFilterKey(filterKey);

    let selectedMinion = null;
    for(const hostname of Object.keys(response)) {

      // When we already found the documentation ignore all others
      if(selectedMinion) {
        delete response[hostname];
        continue;
      }

      // make sure it is an object (instead of e.g. "false" for an offline minion)
      // when it is not, the whole entry is ignored
      if(!response[hostname] || typeof response[hostname] !== "object") {
        delete response[hostname];
        continue;
      }

      // make sure that the entry matches with the requested command or prefix
      // that's always the case for SYS.DOC output, but not for RUNNERS.DOC.RUNNER
      // and/or RUNNERS.DOC.WHEEL.
      const hostResponse = response[hostname];
      for(const key of Object.keys(hostResponse)) {

        // is this what we were looking for?
        if(!Output.isDocuKeyMatch(key, filterKey)) {
          // no match, ignore the whole entry
          delete hostResponse[key];
        }
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
      const savedDocumentation = response[selectedMinion];
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
    for(const hostname of Object.keys(response)) {

      const hostResponse = response[hostname];

      for(const key of Object.keys(hostResponse).sort()) {

        let out = hostResponse[key];
        if(out === null) continue;
        out = out.trimRight();

        // internal links: remove the ".. rubric::" prefix
        // e.g. in "sys.doc state.apply"
        out = out.replace(/[.][.] rubric:: */g, "");

        // internal links: remove prefixes like ":mod:" and ":py:func:"
        // e.g. in "sys.doc state.apply"
        out = out.replace(/(:[a-z_]*)*:`/g, "`");

        // internal links: remove link indicators in highlighted text
        // e.g. in "sys.doc state.apply"
        out = out.replace(/[ \n]*<[^`]*>`/gm, "`");

        // turn text into html
        // e.g. in "sys.doc cmd.run"
        out = out.replace(/&/g, "&amp;");

        // turn text into html
        // e.g. in "sys.doc state.template"
        out = out.replace(/</g, "&lt;");

        // turn text into html
        // e.g. in "sys.doc state.template"
        out = out.replace(/>/g, "&gt;");

        // external links
        // e.g. in "sys.doc pkg.install"
        while(out.includes(".. _")) {
          // take only a line containing ".. _"
          const reference = out.
            replace(/^(.|\n|\r)*[.][.] _/m, "").
            replace(/(\n|\r)(.|\n|\r)*$/m, "");
          const words = reference.split(": ");
          if(words.length !== 2) { console.log("words", words); break; }
          const link = words[0];
          const target = words[1];
          // add link to all references
          while(out.includes(link + "_")) {
            out = out.replace(
              link + "_",
              "<a href='" + target + "' target='_blank'>" + link + "</a>");
          }
          // remove the item from the link table
          out = out.replace(".. _" + reference, "");
        }

        // replace ``......``
        // e.g. in "sys.doc state.apply"
        out = out.replace(/``([^`]*)``/g, "<span style='background-color: #575757'>$1</span>");

        // replace `......`
        // e.g. in "sys.doc state.apply"
        out = out.replace(/`([^`]*)`/g, "<span style='color: yellow'>$1</span>");

        // remove whitespace at end of lines
        out = out.replace(/  *\n/gm, "");

        // remove duplicate empty lines (usually due to previous rule)
        out = out.replace(/\n\n\n*/gm, "\n\n");

        outputContainer.innerHTML +=
          `<span class='hostname'>${key}</span>:<br>` +
          '<pre style="height: initial; overflow-y: initial;">' + out + '</pre>';
      }
    }
  }

  static isHighStateOutput(command) {
    if(command === 'state.apply') return true;
    if(command === 'state.highstate') return true;
    return false;
  }

  static getDurationClause(millis) {
    if(millis === 1) {
      return `${millis} millisecond`;
    }
    if(millis < 1000) {
      return `${millis} milliseconds`;
    }
    if(millis === 1000) {
      return `${millis/1000} second`;
    }
    return `${millis/1000} seconds`;
  }

  static addHighStateOutput(hostname, outputContainer, hostResponse) {

    let anyFailures = false;
    for(const [key, task] of Object.entries(hostResponse)) {
      if(!task.result) anyFailures = true;
    }

    let html;
    if(anyFailures) {
      html = Output.getHostnameHtml(hostname, " failure");
    } else {
      html = Output.getHostnameHtml(hostname, "");
    }

    // The tasks are in an (unordered) object with uninteresting keys
    // convert it to an array that is in execution order
    // first put all the values in an array
    const tasks = [];
    Object.keys(hostResponse).forEach(
      function(taskKey) { tasks.push(hostResponse[taskKey]); }
    );
    // then sort the array
    tasks.sort(function(a, b) { return a.__run_num__ - b.__run_num__; } );

    const indent = "&nbsp;&nbsp;&nbsp;&nbsp;";

    let succeeded = 0;
    let failed = 0;
    let total_millis = 0;
    for(let task of tasks) {

      if(task.result) {
        // 2714 == HEAVY CHECK MARK
        html += "</br><span style='color:green'>&#x2714;</span> ";
        succeeded += 1;
      } else {
        // 2718 = HEAVY BALLOT X
        html += "</br><span style='color:red'>&#x2718;</span> ";
        failed += 1;
      }

      if(task.name) {
        html += task.name;
      } else {
        // make sure that the checkbox/ballot-x is on a reasonable line
        html += "(anonymous task)";
      }

      if(task.__id__ && task.__id__ !== task.name) {
        html += " id=" + task.__id__;
      }

      if(task.__sls__) {
        html += " (from " + task.__sls__.replace(".", "/") + ".sls)";
      }

      const components = task.___key___.split("_|-");
      html += "</br>" + indent + "Function is " + components[0] + "." + components[3];

      if(task.comment) {
        html += "</br>" + indent + task.comment;
      }

      if(task.changes) {
        for(const key of Object.keys(task.changes).sort()) {
          const change = task.changes[key];
          // 9658 = BLACK RIGHT-POINTING POINTER
          // don't use arrows here, these are higher than a regular
          // text-line and disturb the text-flow
          html += "</br>" + indent + key + ": " +
            JSON.stringify(change.old) + " &#9658; " + JSON.stringify(change.new);
        }
      }

      if(task.hasOwnProperty('duration')) {
        const millis = Math.round(task.duration);
        total_millis += millis;
        if(millis >= 10) {
          // anything below 10ms is not worth reporting
          // report only the "slow" jobs
          // it still counts for the grand total thought
          html += "</br>" + indent + "Duration " + Output.getDurationClause(millis);
        }
      }

      // show any unknown attribute of a task
      for(const [key, item] of Object.entries(task)) {
        if(key === "___key___") continue; // ignored, generated by us
        if(key === "__id__") continue; // handled
        if(key === "__sls__") continue; // handled
        if(key === "__run_num__") continue; // handled, not shown
        if(key === "changes") continue; // handled
        if(key === "comment") continue; // handled
        if(key === "duration") continue; // handled
        if(key === "host") continue; // ignored, same as host
        if(key === "name") continue; // handled
        if(key === "result") continue; // handled
        if(key === "start_time") continue; // ignored
        html += "</br>" + indent + key + " = " + JSON.stringify(item);
      }
    }

    if(succeeded || failed) {
      let line = "";

      if(succeeded) line += ", " + succeeded + " succeeded";

      if(failed) line += ", " + failed + " failed";

      if(failed && succeeded) line += ", " + (succeeded + failed) + " total";

      line += ", " + Output.getDurationClause(total_millis);

      html += "</br>" + line.substring(2);
    }

    html += "</br>";

    outputContainer.innerHTML += html;
  }

  // this is the default output form
  // just format the returned objects
  static addNormalOutput(hostname, outputContainer, hostResponse) {

    if (typeof hostResponse === 'object') {
      // salt output is a json object
      // let's format it nicely here
      hostResponse = JSON.stringify(hostResponse, null, 2);
    } else if (typeof hostResponse === 'string') {
      // Or when it is text, strip trailing whitespace
      hostResponse = hostResponse.replace(/[ \r\n]+$/g, "");
    }

    outputContainer.innerHTML +=
      Output.getHostnameHtml(hostname, "") + " " + hostResponse + "<br>";
  }


  // the orchestrator for the output
  // determines what format should be used and uses that
  static addResponseOutput(outputContainer, response, command) {

    // remove old content
    outputContainer.innerHTML = "";

    // reformat runner/wheel output into regular output
    response = Output.addVirtualMinion(response, command);

    if(typeof response === "string") {
      // do not format a string as an object
      outputContainer.innerText = response;
      return;
    }

    if(typeof response !== "object" || Array.isArray(response)) {
      outputContainer.innerText = JSON.stringify(response);
      return;
    }

    // it might be documentation
    const commandArg = command.trim().replace(/^[a-z.]* */i, "");
    const isDocumentationOutput = Output.isDocumentationOutput(response, commandArg);
    if(isDocumentationOutput) {
      Output.reduceDocumentationOutput(response, commandArg, commandArg);
      Output.addDocumentationOutput(outputContainer, response);
      return;
    }

    // for all other types we consider the output per minion
    // this is more generic and it simplifies the handlers
    for(const hostname of Object.keys(response).sort()) {

      const hostResponse = response[hostname];

      if(typeof hostResponse === "string") {
        // do not format a string as an object
        outputContainer.innerHTML +=
          Output.getHostnameHtml(hostname, "") +
          " " +
          hostResponse +
          "</br>";
        continue;
      }

      if(typeof hostResponse !== "object" || Array.isArray(hostResponse)) {
        outputContainer.innerHTML +=
          Output.getHostnameHtml(hostname, "") +
          " " +
          JSON.stringify(hostResponse) +
          "</br>";
        continue;
      }

      // it might be highstate output
      const commandCmd = command.trim().replace(/ .*/, "");
      const isHighStateOutput = Output.isHighStateOutput(commandCmd);
      if(isHighStateOutput) {
        Output.addHighStateOutput(hostname, outputContainer, hostResponse);
        continue;
      }

      // nothing special? then it is normal output
      Output.addNormalOutput(hostname, outputContainer, hostResponse);
    }
  }

}

// for unit tests
if(typeof module !== "undefined") module.exports = Output;
