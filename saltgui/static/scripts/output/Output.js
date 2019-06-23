import {OutputDocumentation} from './OutputDocumentation.js';
import {OutputHighstate} from './OutputHighstate.js';
import {OutputJson} from './OutputJson.js';
import {OutputNested} from './OutputNested.js';
import {OutputSaltGuiHighstate} from './OutputSaltGuiHighstate.js';
import {OutputYaml} from './OutputYaml.js';
import {ParseCommandLine} from '../ParseCommandLine.js';
import {Route} from '../routes/Route.js';
import {Utils} from '../Utils.js';

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
    let w = null;
    try { w = window; } catch(error) { /* void */ }
    if(w && w.localStorage) supportedOutputFormats = w.localStorage.getItem("output_formats");
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

  static getPatEmbeddedJid() {
    return /[2-9][0-9][0-9][0-9][01][0-9][0-3][0-9][0-2][0-9][0-5][0-9][0-5][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/g;
  }

  // the output is only text
  // note: do not return a text-node
  static getTextOutput(hostResponse) {
    // strip trailing whitespace
    hostResponse = hostResponse.replace(/[ \r\n]+$/g, "");

    // replace all returned JIDs to links
    // typically found in the output of an async job
    if(hostResponse.match(ParseCommandLine.getPatJid())) {
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
    const element = document.createElement(Utils.isMultiLineString(content) ? "div" : "span");
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

  // add the status summary
  static addHighStateSummary(div, pMinionId, pTasks) {

    let nr = 0;

    for(const task of pTasks) {

      nr += 1;

      // 25CF = BLACK CIRCLE
      const span = Route._createSpan("", "\u25CF");

      let txt = task.name;
      if(task.__id__ && task.__id__ !== task.name) {
        txt += "\n" + task.__id__;
      }
      if(task.__sls__) {
        txt += "\n" + task.__sls__.replace(/[.]/g, "/") + ".sls";
      }

      let nrChanges = 0;
      if(!task.changes) {
        //txt += "\nno changes";
      } else if(typeof task.changes !== "object") {
        nrChanges = 1;
        txt += "\n'changes' has type " + typeof task.changes;
      } else if(Array.isArray(task.changes)) {
        nrChanges = task.changes.length;
        txt += "\n'changes' is an array";
        txt += Utils.txtZeroOneMany(nrChanges, "", "\n" + nrChanges + " change", "\n" + nrChanges + " changes");
      } else {
        nrChanges = Object.keys(task.changes).length;
        txt += Utils.txtZeroOneMany(nrChanges, "", "\n" + nrChanges + " change", "\n" + nrChanges + " changes");
      }
  
      if(task.result === null) {
        span.classList.add("task_skipped");
      } else if(!task.result) {
        span.classList.add("task_failure");
      } else {
        span.classList.add("task_success");
      }
      if(nrChanges) {
        span.classList.add("task_changes");
      }

      for(const key in task) {
        if(key === "___key___") continue;
        if(key === "__id__") continue;
        if(key === "__jid__") continue;
        if(key === "__orchestration__") continue;
        if(key === "__run_num__") continue;
        if(key === "__sls__") continue;
        if(key === "_stamp") continue;
        if(key === "changes") continue;
        if(key === "comment") continue;
        if(key === "duration") continue;
        if(key === "fun") continue;
        if(key === "id") continue;
        if(key === "jid") continue;
        if(key === "name") continue;
        if(key === "pchanges") continue;
        if(key === "return") continue;
        if(key === "skip_watch") continue;
        if(key === "start_time") continue;
        if(key === "success") continue;
        // skip trivial info: result = true
        if(key === "result" && task[key]) continue;
        txt += "\n" + key + " = ";
        if(typeof task.changes === "object")
          txt += JSON.stringify(task[key]);
        else
          txt += task[key];
      }

      const myNr = nr;
      span.addEventListener("click", _ => {

        // show the output, it might be hidden
        const triangle = div.querySelector("span.triangle");
        // 25BD = WHITE DOWN-POINTING TRIANGLE
        triangle.innerText = "\u25bd";
        const outputDiv = div.querySelector("div");
        outputDiv.style.display = "";

        const showId = Utils.getIdFromMinionId(pMinionId + "." + myNr);
        const element = div.querySelector("#" + showId);

        // show where the information is
        element.classList.add("highlight-task");
        setTimeout(_ => { 
          element.classList.remove("highlight-task");
          if(!element.classList.length) element.removeAttribute("class");
        }, 1000);

        // behavior: smooth is ok, the destination is nearby
        // block: since block is below our summary, nearest is equivalent to end
        element.scrollIntoView({behavior: "smooth", block: "nearest"});
      });

      Utils.addToolTip(span, txt);

      div.append(span);
    }
  }


  // the orchestrator for the output
  // determines what format should be used and uses that
  static addResponseOutput(outputContainer, pJobId, minions, response, command, initialStatus) {

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
    const isDocumentationOutput = OutputDocumentation.isDocumentationOutput(response, commandArg);
    if(isDocumentationOutput) {
      OutputDocumentation.reduceDocumentationOutput(response, commandArg, commandArg);
      OutputDocumentation.addDocumentationOutput(outputContainer, response);
      return;
    }

    const allDiv = document.createElement("div");
    allDiv.classList.add("nohide");

    if(!command.startsWith("runners.") &&
       !command.startsWith("wheel.") &&
       !Output.isAsyncOutput(response)) {
      // runners/wheel responses are not per minion
      // Do not produce a #response line for async-start confirmation

      // for the result of jobs.active
      const summaryJobsActiveSpan = document.createElement("span");
      summaryJobsActiveSpan.id = "summary_jobsactive";
      summaryJobsActiveSpan.innerText = initialStatus;

      // for the result of jobs.list_job
      const summaryJobsListJobSpan = document.createElement("span");
      summaryJobsListJobSpan.id = "summary_listjob";

      const cntResponses = Object.keys(response).length;
      const cntMinions = minions.length;

      let txt = ", ";

      txt += Utils.txtZeroOneMany(cntResponses,
        "no responses", "{0} response", "{0} responses");

      const summary = { };
      for(const minion in response) {
        const result = response[minion];
        // when full_return is not used, the result is simpler
        if(result === null) continue;
        if(typeof result !== "object") continue;
        if(!("success" in result)) continue;
        // use keys that can conveniently be sorted
        const key = (result.success ? "0-" : "1-") + result.retcode;
        if(!summary.hasOwnProperty(key)) summary[key] = 0;
        summary[key] += 1;
      }

      const keys = Object.keys(summary).sort();
      for(const key of keys) {
        txt += ", ";
        if(key.startsWith("0-")) {
          txt += Utils.txtZeroOneMany(summary[key],
            "", "{0} success", "{0} successes");
        } else { // if(key.startsWith("1-"))
          txt += Utils.txtZeroOneMany(summary[key],
            "", "{0} failure", "{0} failures");
        }
        if(key !== "0-0") {
          // don't show the retcode for real success
          txt += "(" + key.substr(2) + ")";
        }
      }

      txt += Utils.txtZeroOneMany(cntMinions - cntResponses,
        "", ", {0} no response", ", {0} no responses");

      if(cntResponses > 0 && cntMinions !== cntResponses) {
        txt = txt + ", " + cntMinions + " total";
      }

      // some room for the triangle
      txt = txt + " ";

      allDiv.appendChild(summaryJobsActiveSpan);

      summaryJobsListJobSpan.innerText = txt;
      allDiv.appendChild(summaryJobsListJobSpan);
    }

    const masterTriangle = document.createElement("span");
    // 25BD = WHITE DOWN-POINTING TRIANGLE
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

      let isSuccess = true;
      let retCode = 0;

      let hostResponse = response[hostname];
      if(Output.hasProperties(hostResponse, ["retcode", "return", "success"])) {
        isSuccess = hostResponse.success;
        retCode = hostResponse.retcode;
        hostResponse = hostResponse.return;
      }
      else if(command.startsWith("runner.") && hostResponse && hostResponse.hasOwnProperty("return")) {
        hostResponse = hostResponse.return.return;
      }

      let hostOutput = null;
      let hostMultiLine = false;
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
        hostOutput.classList.add("noresponse");
        fndRepresentation = true;
      }

      if(!fndRepresentation && typeof hostResponse === "string") {
        hostOutput = Output.getTextOutput(hostResponse);
        hostMultiLine = Utils.isMultiLineString(hostResponse);
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
        hostMultiLine = hostOutput.tagName === "DIV";
        fndRepresentation = true;
      }

      // it might be highstate output
      const commandCmd = command.trim().replace(/ .*/, "");
      const isHighStateOutput = OutputHighstate.isHighStateOutput(commandCmd, hostResponse);

      const tasks = [];
      if(isHighStateOutput) {
        // The tasks are in an (unordered) object with uninteresting keys
        // convert it to an array that is in execution order
        // first put all the values in an array
        Object.keys(hostResponse).forEach(
          function(taskKey) {
            hostResponse[taskKey].___key___ = taskKey;
            tasks.push(hostResponse[taskKey]);
          }
        );
        // then sort the array
        tasks.sort(function(a, b) { return a.__run_num__ - b.__run_num__; } );
      }

      let addHighStateSummaryFlag = false;
      // enhanced highstate display
      if(!fndRepresentation && isHighStateOutput && Output.isOutputFormatAllowed("saltguihighstate")) {
        hostLabel = OutputSaltGuiHighstate.getHighStateLabel(hostname, hostResponse);
        hostOutput = OutputSaltGuiHighstate.getHighStateOutput(hostname, pJobId, tasks);
        hostMultiLine = true;
        fndRepresentation = true;
        addHighStateSummaryFlag = true;
      }
      // regular highstate display
      if(!fndRepresentation && isHighStateOutput && Output.isOutputFormatAllowed("highstate")) {
        hostLabel = OutputHighstate.getHighStateLabel(hostname, hostResponse);
        hostOutput = OutputHighstate.getHighStateOutput(hostname, tasks);
        hostMultiLine = true;
        fndRepresentation = true;
        addHighStateSummaryFlag = true;
      }

      // nothing special? then it is normal output
      if(!fndRepresentation) {
        hostOutput = Output.getNormalOutput(hostResponse);
        if(hostOutput.tagName === "DIV") {
          hostMultiLine = true;
        } else if(typeof hostOutput === "string" && Utils.isMultiLineString(hostOutput)) {
          hostMultiLine = true;
        }
      }

      if(hostMultiLine) nrMultiLineBlocks += 1;

      // compose the actual output
      const div = document.createElement("div");
      div.id = Utils.getIdFromMinionId(hostname);

      div.append(hostLabel);

      div.appendChild(document.createTextNode(": "));

      if(addHighStateSummaryFlag) {
        // showing the summary is more important
        // than hiding a useless open/close indicator
        hostMultiLine = true;
      }

      // multiple line, collapsible
      // 25B7 = WHITE RIGHT-POINTING TRIANGLE
      // 25BD = WHITE DOWN-POINTING TRIANGLE
      let triangle = null;
      if(hostMultiLine) {
        triangle = document.createElement("span");
        triangle.innerText = "\u25bd";
        triangle.style = "cursor: pointer";
        triangle.classList.add("triangle");
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
        div.appendChild(triangle);

        if(addHighStateSummaryFlag) {
          div.appendChild(document.createTextNode(" "));
          Output.addHighStateSummary(div, hostname, tasks);
        }

        div.appendChild(document.createElement("br"));
      }

      // move back to the top of the host, that makes
      // it easier to select the next highstate part
      // or just collapse it and see the next minion
      if(isHighStateOutput) {
        hostOutput.addEventListener("click", _ => {
          div.scrollIntoView({behavior: "smooth", block: "start"});
        });
      }

      hostOutput.classList.add("minion-output");
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
