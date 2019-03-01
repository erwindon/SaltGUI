import {OutputDocumentation} from './OutputDocumentation';
import {OutputHighstate} from './OutputHighstate';
import {OutputJson} from './OutputJson';
import {OutputNested} from './OutputNested';
import {OutputSaltGuiHighstate} from './OutputSaltGuiHighstate';
import {OutputYaml} from './OutputYaml';

// Functions to turn responses from the salt system into visual information
// The following variations exist:
// A) documentation output
//    one of the responsing nodes is selected
//    all other nodes are then ignored
// B) state output
//    the response is formatted as a list of tasks
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

export class Output {

  static isOutputFormatAllowed(requestedOutputFormat) {
    let supportedOutputFormats = null;
    // window.localStorage is not defined during unit testing
    if(window.localStorage) supportedOutputFormats = window.localStorage.getItem("output_formats");
    if(supportedOutputFormats === "undefined") supportedOutputFormats = null;
    if(supportedOutputFormats === null) supportedOutputFormats = "doc,saltguihighstate,json";
    return supportedOutputFormats.includes(requestedOutputFormat);
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
  static getHostnameHtml(hostname, extraClass="") {
    const span = document.createElement("span");
    span.classList.add("hostname");
    if(extraClass) span.classList.add(extraClass);
    span.innerText = hostname;
    return span;
  }

  // the output is only text
  // note: do not return a text-node
  static getTextOutput(hostResponse) {
    // strip trailing whitespace
    hostResponse = hostResponse.replace(/[ \r\n]+$/g, "");

    // replace all returned JIDs to links
    // typically found in the output of an async job
    // patJid is defined in scripts/parsecmdline.js
    if(hostResponse.match(patJid)) {
      const a = document.createElement("a");
      a.href = "/job?id=" + encodeURIComponent(hostResponse);
      a.innerText = hostResponse;
      return a;
    }

    // all regular text
    const span = document.createElement("span");
    span.innerText = hostResponse;
    return span;
  }


  // format an object in the preferred style
  static formatObject(obj) {
    if(Output.isOutputFormatAllowed("json")) {
      return OutputJson.formatJSON(obj);
    }

    if(Output.isOutputFormatAllowed("yaml")) {
      return OutputYaml.formatYAML(obj);
    }

    if(Output.isOutputFormatAllowed("nested")) {
      return OutputNested.formatNESTED(obj);
    }

    // when nothing is allowed, JSON is always allowed
    return OutputJson.formatJSON(obj);
  }


  // this is the default output form
  // just format the returned objects
  // note: do not return a text-node
  static getNormalOutput(hostResponse) {
    const content = Output.formatObject(hostResponse);
    const element = document.createElement(content.includes("\n") ? "div" : "span");
    element.innerText = content;
    return element;
  }


  static hasProperties(obj, props) {
    if(!obj || typeof obj !== "object") {
      return false;
    }
    for(const prop of props) {
      if(!obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }


  static isAsyncOutput(response) {
    let keys = Object.keys(response);
    if(keys.length !== 2) return false;
    keys = keys.sort();
    if(keys[0] !== "jid") return false;
    if(keys[1] !== "minions") return false;
    return true;
  }


  // reformat a date-time string
  // supported formats:
  // (time) 19:05:01.561754
  // (datetime) 2019, Jan 26 19:05:22.808348
  // current action is (only):
  // - reduce the number of digits for the fractional seconds
  static dateTimeStr(str) {

    // no available setting, then return the original
    const datetime_fraction_digits_str = window.localStorage.getItem("datetime_fraction_digits");
    if(datetime_fraction_digits_str === null) return str;

    // setting is not a number, return the original
    let datetime_fraction_digits_nr = Number.parseInt(datetime_fraction_digits_str);
    if(isNaN(datetime_fraction_digits_nr)) return str;

    // stick to the min/max values without complaining
    if(datetime_fraction_digits_nr < 0) datetime_fraction_digits_nr = 0;
    if(datetime_fraction_digits_nr > 6) datetime_fraction_digits_nr = 6;

    // find the fractional part (assume only one '.' in the string)
    let dotPos = str.indexOf(".");
    if(dotPos < 0) return str;

    // with no digits, also remove the dot
    if(datetime_fraction_digits_nr === 0) dotPos -= 1;

    return str.substring(0, dotPos + datetime_fraction_digits_nr + 1);
  }


  // the orchestrator for the output
  // determines what format should be used and uses that
  static addResponseOutput(outputContainer, minions, response, command) {

    // remove old content
    outputContainer.innerText = "";

    // reformat runner/wheel output into regular output
    response = Output.addVirtualMinion(response, command);

    if(typeof response === "string") {
      // do not format a string as an object
      outputContainer.innerText = response;
      return;
    }

    if(typeof response !== "object" || Array.isArray(response)) {
      outputContainer.innerText = Output.formatObject(response);
      return;
    }

    // it might be documentation
    const commandArg = command.trim().replace(/^[a-z.]* */i, "");
    const isDocumentationOutput = OutputDocumentation.isDocumentationOutput(Output, response, commandArg);
    if(isDocumentationOutput) {
      OutputDocumentation.reduceDocumentationOutput(response, commandArg, commandArg);
      OutputDocumentation.addDocumentationOutput(outputContainer, response);
      return;
    }

    const allDiv = document.createElement("div");

    if(!command.startsWith("runners.") &&
       !command.startsWith("wheel.") &&
       !Output.isAsyncOutput(response)) {
      // runners/wheel responses are not per minion
      // Do not produce a #response line for async-start confirmation
      const span = document.createElement("span");

      const cntResponses = Object.keys(response).length;
      const cntMinions = minions.length;

      let txt;

      if(cntResponses === 1) {
        txt = cntResponses + " response";
      } else {
        txt = cntResponses + " responses";
      }

      if(cntMinions !== cntResponses) {
        txt = txt + ", " + (cntMinions - cntResponses) + " no response";
      }

      if(cntResponses > 0 && cntMinions !== cntResponses) {
        txt = txt + ", " + cntMinions + " total";
      }

      // some room for the triangle
      txt = txt + " ";

      span.innerText = txt;
      allDiv.appendChild(span);
    }

    const masterTriangle = document.createElement("span");
    masterTriangle.innerText = "\u25bd";
    masterTriangle.style = "cursor: pointer";
    allDiv.appendChild(masterTriangle);

    outputContainer.appendChild(allDiv);

    masterTriangle.addEventListener("click", _ => {
      // 25B7 = WHITE RIGHT-POINTING TRIANGLE
      // 25BD = WHITE DOWN-POINTING TRIANGLE
      if(masterTriangle.innerText !== "\u25bd") {
        masterTriangle.innerText = "\u25bd";
      } else {
        masterTriangle.innerText = "\u25b7";
      }

      for(const div of outputContainer.childNodes) {
        // only click on items that are collapsible
        const childs = div.getElementsByClassName("triangle");
        if(childs.length !== 1) continue;
        // do not collapse the "all" item again
        const tr = childs[0];
        if(tr === masterTriangle) continue;
        // only click on items that are not already the same as "all"
        if(tr.innerText === masterTriangle.innerText) continue;
        // (un)collapse the minion
        const evt = new MouseEvent("click", {});
        tr.dispatchEvent(evt);
      }
    });

    let nrMultiLineBlocks = 0;

    // for all other types we consider the output per minion
    // this is more generic and it simplifies the handlers
    for(const hostname of minions.sort()) {

      const isSuccess = true;
      const retCode = 0;

      let hostResponse = response[hostname];
      if(Output.hasProperties(hostResponse, ["retcode", "return", "success"])) {
        hostResponse = hostResponse.return;
      }
      else if(command.startsWith("runner.") && hostResponse && hostResponse.hasOwnProperty("return")) {
        hostResponse = hostResponse.return.return;
      }

      let hostOutput = null;
      let hostMultiLine = null;
      let fndRepresentation = false;

      // the standard label is the hostname,
      // future: colored based on the successflag
      // future: colored based on the retcode
      let hostClass = "host_success";
      if(!isSuccess) hostClass = "host_failure";
      if(!response.hasOwnProperty(hostname)) hostClass = "host_noresponse";
      let hostLabel = Output.getHostnameHtml(hostname, hostClass);

      if(!fndRepresentation && !response.hasOwnProperty(hostname)) {
        hostOutput = Output.getTextOutput("(no response)");
        fndRepresentation = true;
      }

      if(!fndRepresentation && typeof hostResponse === "string") {
        hostOutput = Output.getTextOutput(hostResponse);
        hostMultiLine = hostResponse.includes("\n");
        fndRepresentation = true;
      }

      if(!fndRepresentation && typeof hostResponse !== "object") {
        hostOutput = Output.getNormalOutput(hostResponse);
        hostMultiLine = false;
        fndRepresentation = true;
      }

      // null is an object, but treat it separatelly
      if(!fndRepresentation && hostResponse === null) {
        hostOutput = Output.getNormalOutput(hostResponse);
        hostMultiLine = false;
        fndRepresentation = true;
      }

      // an array is an object, but treat it separatelly
      if(!fndRepresentation && Array.isArray(hostResponse)) {
        hostOutput = Output.getNormalOutput(hostResponse);
        hostMultiLine = hostResponse.length > 0;
        fndRepresentation = true;
      }

      // it might be highstate output
      const commandCmd = command.trim().replace(/ .*/, "");
      const isHighStateOutput = OutputHighstate.isHighStateOutput(commandCmd, hostResponse);
      // enhanced highstate display
      if(!fndRepresentation && isHighStateOutput && Output.isOutputFormatAllowed("saltguihighstate")) {
        hostLabel = OutputSaltGuiHighstate.getHighStateLabel(hostname, hostResponse);
        hostOutput = OutputSaltGuiHighstate.getHighStateOutput(hostResponse);
        hostMultiLine = true;
        fndRepresentation = true;
      }
      // regular highstate display
      if(!fndRepresentation && isHighStateOutput && Output.isOutputFormatAllowed("highstate")) {
        hostLabel = OutputHighstate.getHighStateLabel(hostname, hostResponse);
        hostOutput = OutputHighstate.getHighStateOutput(hostResponse);
        hostMultiLine = true;
        fndRepresentation = true;
      }

      // nothing special? then it is normal output
      if(!fndRepresentation) {
        hostOutput = Output.getNormalOutput(hostResponse);
        hostMultiLine = Object.keys(hostResponse).length > 0;
      }

      // one response does not need to be collapsible
      const cnt = Object.keys(response).length;
      if(cnt === 1) {
        hostMultiLine = false;
      }

      if(hostMultiLine) nrMultiLineBlocks += 1;

      // compose the actual output
      const div = document.createElement("div");

      div.append(hostLabel);

      div.appendChild(document.createTextNode(": "));

      // multiple line, collapsible
      // 25B7 = WHITE RIGHT-POINTING TRIANGLE
      // 25BD = WHITE DOWN-POINTING TRIANGLE
      let triangle = null;
      if(hostMultiLine) {
        triangle = document.createElement("span");
        triangle.innerText = "\u25bd";
        triangle.style = "cursor: pointer";
        triangle.classList.add("triangle");
        div.appendChild(triangle);
        div.appendChild(document.createElement("br"));

        triangle.addEventListener("click", _ => {
          // 25B7 = WHITE RIGHT-POINTING TRIANGLE
          // 25BD = WHITE DOWN-POINTING TRIANGLE
          if(triangle.innerText !== "\u25bd") {
            triangle.innerText = "\u25bd";
            hostOutput.style.display = "";
          } else {
            triangle.innerText = "\u25b7";
            hostOutput.style.display = "none";
          }
        });
      }

      div.append(hostOutput);

      outputContainer.append(div);
    }

    if(nrMultiLineBlocks <= 1) {
      // No collapsible elements, hide the master
      // Also hide with 1 collapsible element
      masterTriangle.style.display = "none";
    }

  }
}