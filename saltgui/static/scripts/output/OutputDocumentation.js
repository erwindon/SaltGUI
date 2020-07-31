/* global console */

import {Output} from "./Output.js";

export class OutputDocumentation {

  // test whether the returned data matches the requested data
  static _isDocuKeyMatch (pKey, pFilterKey) {

    // no filter is always OK
    if (!pFilterKey) {
      return true;
    }

    // an exact match is great
    if (pKey === pFilterKey) {
      return true;
    }

    // a true prefix is also ok
    if (pKey.startsWith(pFilterKey + ".")) {
      return true;
    }

    // no match
    return false;
  }


  // we only treat output as documentation output when it sticks to strict rules
  // all minions must return strings
  // and when its key matches the requested documentation
  // empty values are allowed due to errors in the documentation
  // 'output' is needed like this to prevent an error during testing
  static isDocumentationOutput (pResponse, pCommand) {

    if (!Output.isOutputFormatAllowed("doc")) {
      return false;
    }

    let result = false;

    // reduce the search key to match the data in the response
    pCommand = OutputDocumentation._reduceFilterKey(pCommand);

    for (const minionId of Object.keys(pResponse)) {

      const output = pResponse[minionId];

      if (!output) {
        // some commands do not have help-text
        // e.g. wheel.key.get_key
        continue;
      }

      if (typeof output !== "object") {
        // strange --> no documentation object
        return false;
      }

      // arrays are also objects,
      // but not what we are looking for
      if (Array.isArray(output)) {
        return false;
      }

      for (const key of Object.keys(output)) {
        // e.g. for "test.rand_str"
        if (output[key] === null) {
          continue;
        }

        // but otherwise it must be a (documentation)string
        if (typeof output[key] !== "string") {
          return false;
        }

        // is this what we were looking for?
        if (OutputDocumentation._isDocuKeyMatch(key, pCommand)) {
          result = true;
        }
      }
    }

    return result;
  }


  // reduce the search key to match the data in the response
  static _reduceFilterKey (pFilterKey) {
    if (pFilterKey === "wheel") {
      return "";
    }
    if (pFilterKey.startsWith("wheel.")) {
      // strip the prefix "wheel."
      return pFilterKey.substring(6);
    }

    if (pFilterKey === "runners") {
      return "";
    }
    if (pFilterKey.startsWith("runners.")) {
      // strip the prefix "runners."
      return pFilterKey.substring(8);
    }

    return pFilterKey;
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
  static reduceDocumentationOutput (pResponse, pVisualKey, pFilterKey) {
    if (!pResponse || typeof pResponse !== "object") {
      // strange --> don't try to fix anything
      return;
    }

    // reduce the search key to match the data in the response
    // i.e. remove the prefixes for "wheel" and "runners"
    pFilterKey = OutputDocumentation._reduceFilterKey(pFilterKey);

    let selectedMinion = null;
    for (const minionId of Object.keys(pResponse)) {

      // When we already found the documentation ignore all others
      if (selectedMinion) {
        delete pResponse[minionId];
        continue;
      }

      // make sure it is an object (instead of e.g. "false" for an offline minion)
      // when it is not, the whole entry is ignored
      if (!pResponse[minionId] || typeof pResponse[minionId] !== "object") {
        delete pResponse[minionId];
        continue;
      }

      // make sure that the entry matches with the requested command or prefix
      // that's always the case for SYS.DOC output, but not for RUNNERS.DOC.RUNNER
      // and/or RUNNERS.DOC.WHEEL.
      const minionResponse = pResponse[minionId];
      for (const key of Object.keys(minionResponse)) {

        // is this what we were looking for?
        if (!OutputDocumentation._isDocuKeyMatch(key, pFilterKey)) {
          // no match, ignore the whole entry
          delete minionResponse[key];
        }
      }

      // no documentation present (or left) on this minion?
      // then discard the result of this minion
      if (Object.keys(minionResponse).length === 0) {
        delete pResponse[minionId];
        continue;
      }

      // we have found documentation output
      // mark all other documentation for discarding
      selectedMinion = minionId;
    }

    if (selectedMinion) {
      // basically rename the key
      const savedDocumentation = pResponse[selectedMinion];
      delete pResponse[selectedMinion];
      pResponse[pVisualKey] = savedDocumentation;
    } else {
      // prepare a dummy response when no documentation could be found
      // otherwise leave all documentation responses organized by minion
      pResponse["dummy"] = {};
      pResponse["dummy"][pVisualKey] = "no documentation found";
    }
  }

  // add the output of a documentation command to the display
  static addDocumentationOutput (pOutputContainer, pResponse) {

    // we expect no minionIds present
    // as it should have been reduced already
    for (const minionId of Object.keys(pResponse)) {

      const minionResponse = pResponse[minionId];

      for (const key of Object.keys(minionResponse).sort()) {

        let out = minionResponse[key];
        if (out === null) {
          continue;
        }
        out = out.trimRight();

        // internal links: remove the ".. rubric::" prefix
        // e.g. in "sys.doc state.apply"
        out = out.replace(/[.][.] rubric:: */g, "");

        // internal links: remove prefixes like ":mod:" and ":py:func:"
        // e.g. in "sys.doc state.apply"
        out = out.replace(/(?::[a-z_]*)*:`/g, "`");

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
        while (out.includes(".. _")) {
          // take only a line containing ".. _"
          const reference = out.
            replace(/^(?:.|\n|\r)*[.][.] _/m, "").
            replace(/(?:\n|\r)(?:.|\n|\r)*$/m, "");
          const words = reference.split(": ");
          if (words.length !== 2) {
            console.log("words", words);
            break;
          }
          const link = words[0];
          const target = words[1];
          // add link to all references
          while (out.includes(link + "_")) {
            out = out.replace(
              link + "_",
              "<a href='" + target + "' target='_blank'>" + link + "</a>");
          }
          // remove the item from the link table
          out = out.replace(".. _" + reference, "");
        }

        // replace ``......``
        // e.g. in "sys.doc state.apply"
        /* eslint-disable prefer-named-capture-group */
        out = out.replace(/``([^`]*)``/g, "<span style='background-color: #575757'>$1</span>");
        /* eslint-enable prefer-named-capture-group */

        // replace `......`
        // e.g. in "sys.doc state.apply"
        /* eslint-disable prefer-named-capture-group */
        out = out.replace(/`([^`]*)`/g, "<span style='color: yellow'>$1</span>");
        /* eslint-enable prefer-named-capture-group */

        // remove whitespace at end of lines
        out = out.replace(/  *\n/gm, "");

        // remove duplicate empty lines (usually due to previous rule)
        out = out.replace(/\n\n\n*/gm, "\n\n");

        pOutputContainer.innerHTML +=
          "<div><span class='minion-id'>" + key + "</span>:</br><pre style='height: initial; overflow-y: initial;'>" + out + "</pre></div>";
      }
    }
  }

}
