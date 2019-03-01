/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./tests/unit/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./saltgui/static/scripts/CommandLineParser.js":
/*!*****************************************************!*\
  !*** ./saltgui/static/scripts/CommandLineParser.js ***!
  \*****************************************************/
/*! exports provided: CommandLineParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommandLineParser", function() { return CommandLineParser; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
var patNull = /^(None|null|Null|NULL)$/;
var patBooleanFalse = /^(false|False|FALSE)$/;
var patBooleanTrue = /^(true|True|TRUE)$/;
var patJid = /^[2-9][0-9][0-9][0-9][01][0-9][0-3][0-9][0-2][0-9][0-5][0-9][0-5][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/;
var patInteger = /^((0)|([-+]?[1-9][0-9]*))$/;
var patFloat = /^([-+]?(([0-9]+)|([0-9]+[.][0-9]*)|([0-9]*[.][0-9]+))([eE][-+]?[0-9]+)?)$/;
var CommandLineParser =
/*#__PURE__*/
function () {
  function CommandLineParser() {
    _classCallCheck(this, CommandLineParser);
  }

  _createClass(CommandLineParser, [{
    key: "parse",
    value: function parse(toRun, args, params) {
      // just in case the user typed some extra whitespace
      // at the start of the line
      toRun = toRun.trim();

      while (toRun.length > 0) {
        var name = null;
        var firstSpaceChar = toRun.indexOf(" ");
        if (firstSpaceChar < 0) firstSpaceChar = toRun.length;
        var firstEqualSign = toRun.indexOf("=");

        if (firstEqualSign >= 0 && firstEqualSign < firstSpaceChar) {
          // we have the name of a named parameter
          name = toRun.substr(0, firstEqualSign);
          toRun = toRun.substr(firstEqualSign + 1);

          if (toRun === "" || toRun[0] === " ") {
            return "Must have value for named parameter '" + name + "'";
          }
        } // Determine whether the JSON string starts with a known
        // character for a JSON type


        var endChar = undefined;
        var objType = undefined;

        if (toRun[0] === "{") {
          endChar = "}";
          objType = "dictionary";
        } else if (toRun[0] === "[") {
          endChar = "]";
          objType = "array";
        } else if (toRun[0] === "\"") {
          // note that json does not support single-quoted strings
          endChar = "\"";
          objType = "double-quoted-string";
        }

        var value = void 0;

        if (endChar && objType) {
          // The string starts with a character for a known JSON type
          var p = 1;

          while (true) {
            // Try until the next closing character
            var n = toRun.indexOf(endChar, p);

            if (n < 0) {
              return "No valid " + objType + " found";
            } // parse what we have found so far
            // the string ends with a closing character
            // but that may not be enough, e.g. "{a:{}"


            var s = toRun.substring(0, n + 1);

            try {
              value = JSON.parse(s);
            } catch (err) {
              // the string that we tried to parse is not valid json
              // continue to add more text from the input
              p = n + 1;
              continue;
            } // the first part of the string is valid JSON


            n = n + 1;

            if (n < toRun.length && toRun[n] !== " ") {
              return "Valid " + objType + ", but followed by text:" + toRun.substring(n) + "...";
            } // valid JSON and not followed by strange characters


            toRun = toRun.substring(n);
            break;
          }
        } else {
          // everything else is a string (without quotes)
          // when we are done, we'll see whether it actually is a number
          // or any of the known constants
          var str = "";

          while (toRun.length > 0 && toRun[0] !== " ") {
            str += toRun[0];
            toRun = toRun.substring(1);
          } // try to find whether the string is actually a known constant
          // or integer or float


          if (patNull.test(str)) {
            value = null;
          } else if (patBooleanFalse.test(str)) {
            value = false;
          } else if (patBooleanTrue.test(str)) {
            value = true;
          } else if (patJid.test(str)) {
            // jids look like numbers but must be strings
            value = str;
          } else if (patInteger.test(str)) {
            value = parseInt(str);
          } else if (patFloat.test(str)) {
            value = parseFloat(str);

            if (!isFinite(value)) {
              return "Numeric argument has overflowed or is infinity";
            }
          } else {
            value = str;
          }
        }

        if (name !== null) {
          // named parameter
          params[name] = value;
        } else {
          // anonymous parameter
          args.push(value);
        } // ignore the whitespace before the next part


        toRun = toRun.trim();
      } // succesfull (no error message return)


      return null;
    }
  }]);

  return CommandLineParser;
}();

/***/ }),

/***/ "./saltgui/static/scripts/output/Output.js":
/*!*************************************************!*\
  !*** ./saltgui/static/scripts/output/Output.js ***!
  \*************************************************/
/*! exports provided: Output */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return Output; });
/* harmony import */ var _OutputDocumentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OutputDocumentation */ "./saltgui/static/scripts/output/OutputDocumentation.js");
/* harmony import */ var _OutputHighstate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OutputHighstate */ "./saltgui/static/scripts/output/OutputHighstate.js");
/* harmony import */ var _OutputJson__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OutputJson */ "./saltgui/static/scripts/output/OutputJson.js");
/* harmony import */ var _OutputNested__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./OutputNested */ "./saltgui/static/scripts/output/OutputNested.js");
/* harmony import */ var _OutputSaltGuiHighstate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./OutputSaltGuiHighstate */ "./saltgui/static/scripts/output/OutputSaltGuiHighstate.js");
/* harmony import */ var _OutputYaml__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./OutputYaml */ "./saltgui/static/scripts/output/OutputYaml.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






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

var Output =
/*#__PURE__*/
function () {
  function Output() {
    _classCallCheck(this, Output);
  }

  _createClass(Output, null, [{
    key: "isOutputFormatAllowed",
    value: function isOutputFormatAllowed(requestedOutputFormat) {
      var supportedOutputFormats = null; // window.localStorage is not defined during unit testing

      if (window.localStorage) supportedOutputFormats = window.localStorage.getItem("output_formats");
      if (supportedOutputFormats === "undefined") supportedOutputFormats = null;
      if (supportedOutputFormats === null) supportedOutputFormats = "doc,saltguihighstate,json";
      return supportedOutputFormats.includes(requestedOutputFormat);
    } // Re-organize the output to let it appear as if the output comes
    // from a single node called "RUNNER" or "MASTER".
    // This way all responses are organized by minion

  }, {
    key: "addVirtualMinion",
    value: function addVirtualMinion(response, command) {
      if (command.startsWith("runners.")) {
        // Add a new level in the object
        return {
          "RUNNER": response
        };
      }

      if (command.startsWith("wheel.")) {
        // Add a new level in the object
        return {
          "WHEEL": response
        };
      } // otherwise return the original


      return response;
    } // compose the host/minion-name label that is shown with each response

  }, {
    key: "getHostnameHtml",
    value: function getHostnameHtml(hostname) {
      var extraClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var span = document.createElement("span");
      span.classList.add("hostname");
      if (extraClass) span.classList.add(extraClass);
      span.innerText = hostname;
      return span;
    } // the output is only text
    // note: do not return a text-node

  }, {
    key: "getTextOutput",
    value: function getTextOutput(hostResponse) {
      // strip trailing whitespace
      hostResponse = hostResponse.replace(/[ \r\n]+$/g, ""); // replace all returned JIDs to links
      // typically found in the output of an async job
      // patJid is defined in scripts/parsecmdline.js

      if (hostResponse.match(patJid)) {
        var a = document.createElement("a");
        a.href = "/job?id=" + encodeURIComponent(hostResponse);
        a.innerText = hostResponse;
        return a;
      } // all regular text


      var span = document.createElement("span");
      span.innerText = hostResponse;
      return span;
    } // format an object in the preferred style

  }, {
    key: "formatObject",
    value: function formatObject(obj) {
      if (Output.isOutputFormatAllowed("json")) {
        return _OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(obj);
      }

      if (Output.isOutputFormatAllowed("yaml")) {
        return _OutputYaml__WEBPACK_IMPORTED_MODULE_5__["OutputYaml"].formatYAML(obj);
      }

      if (Output.isOutputFormatAllowed("nested")) {
        return _OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(obj);
      } // when nothing is allowed, JSON is always allowed


      return _OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(obj);
    } // this is the default output form
    // just format the returned objects
    // note: do not return a text-node

  }, {
    key: "getNormalOutput",
    value: function getNormalOutput(hostResponse) {
      var content = Output.formatObject(hostResponse);
      var element = document.createElement(content.includes("\n") ? "div" : "span");
      element.innerText = content;
      return element;
    }
  }, {
    key: "hasProperties",
    value: function hasProperties(obj, props) {
      if (!obj || _typeof(obj) !== "object") {
        return false;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var prop = _step.value;

          if (!obj.hasOwnProperty(prop)) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    }
  }, {
    key: "isAsyncOutput",
    value: function isAsyncOutput(response) {
      var keys = Object.keys(response);
      if (keys.length !== 2) return false;
      keys = keys.sort();
      if (keys[0] !== "jid") return false;
      if (keys[1] !== "minions") return false;
      return true;
    } // reformat a date-time string
    // supported formats:
    // (time) 19:05:01.561754
    // (datetime) 2019, Jan 26 19:05:22.808348
    // current action is (only):
    // - reduce the number of digits for the fractional seconds

  }, {
    key: "dateTimeStr",
    value: function dateTimeStr(str) {
      // no available setting, then return the original
      var datetime_fraction_digits_str = window.localStorage.getItem("datetime_fraction_digits");
      if (datetime_fraction_digits_str === null) return str; // setting is not a number, return the original

      var datetime_fraction_digits_nr = Number.parseInt(datetime_fraction_digits_str);
      if (isNaN(datetime_fraction_digits_nr)) return str; // stick to the min/max values without complaining

      if (datetime_fraction_digits_nr < 0) datetime_fraction_digits_nr = 0;
      if (datetime_fraction_digits_nr > 6) datetime_fraction_digits_nr = 6; // find the fractional part (assume only one '.' in the string)

      var dotPos = str.indexOf(".");
      if (dotPos < 0) return str; // with no digits, also remove the dot

      if (datetime_fraction_digits_nr === 0) dotPos -= 1;
      return str.substring(0, dotPos + datetime_fraction_digits_nr + 1);
    } // the orchestrator for the output
    // determines what format should be used and uses that

  }, {
    key: "addResponseOutput",
    value: function addResponseOutput(outputContainer, minions, response, command) {
      // remove old content
      outputContainer.innerText = ""; // reformat runner/wheel output into regular output

      response = Output.addVirtualMinion(response, command);

      if (typeof response === "string") {
        // do not format a string as an object
        outputContainer.innerText = response;
        return;
      }

      if (_typeof(response) !== "object" || Array.isArray(response)) {
        outputContainer.innerText = Output.formatObject(response);
        return;
      } // it might be documentation


      var commandArg = command.trim().replace(/^[a-z.]* */i, "");
      var isDocumentationOutput = _OutputDocumentation__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(Output, response, commandArg);

      if (isDocumentationOutput) {
        _OutputDocumentation__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].reduceDocumentationOutput(response, commandArg, commandArg);
        _OutputDocumentation__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].addDocumentationOutput(outputContainer, response);
        return;
      }

      var allDiv = document.createElement("div");

      if (!command.startsWith("runners.") && !command.startsWith("wheel.") && !Output.isAsyncOutput(response)) {
        // runners/wheel responses are not per minion
        // Do not produce a #response line for async-start confirmation
        var span = document.createElement("span");
        var cntResponses = Object.keys(response).length;
        var cntMinions = minions.length;
        var txt;

        if (cntResponses === 1) {
          txt = cntResponses + " response";
        } else {
          txt = cntResponses + " responses";
        }

        if (cntMinions !== cntResponses) {
          txt = txt + ", " + (cntMinions - cntResponses) + " no response";
        }

        if (cntResponses > 0 && cntMinions !== cntResponses) {
          txt = txt + ", " + cntMinions + " total";
        } // some room for the triangle


        txt = txt + " ";
        span.innerText = txt;
        allDiv.appendChild(span);
      }

      var masterTriangle = document.createElement("span");
      masterTriangle.innerText = "\u25BD";
      masterTriangle.style = "cursor: pointer";
      allDiv.appendChild(masterTriangle);
      outputContainer.appendChild(allDiv);
      masterTriangle.addEventListener("click", function (_) {
        // 25B7 = WHITE RIGHT-POINTING TRIANGLE
        // 25BD = WHITE DOWN-POINTING TRIANGLE
        if (masterTriangle.innerText !== "\u25BD") {
          masterTriangle.innerText = "\u25BD";
        } else {
          masterTriangle.innerText = "\u25B7";
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = outputContainer.childNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var div = _step2.value;
            // only click on items that are collapsible
            var childs = div.getElementsByClassName("triangle");
            if (childs.length !== 1) continue; // do not collapse the "all" item again

            var tr = childs[0];
            if (tr === masterTriangle) continue; // only click on items that are not already the same as "all"

            if (tr.innerText === masterTriangle.innerText) continue; // (un)collapse the minion

            var evt = new MouseEvent("click", {});
            tr.dispatchEvent(evt);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      });
      var nrMultiLineBlocks = 0; // for all other types we consider the output per minion
      // this is more generic and it simplifies the handlers

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop = function _loop() {
          var hostname = _step3.value;
          var isSuccess = true;
          var retCode = 0;
          var hostResponse = response[hostname];

          if (Output.hasProperties(hostResponse, ["retcode", "return", "success"])) {
            hostResponse = hostResponse.return;
          } else if (command.startsWith("runner.") && hostResponse && hostResponse.hasOwnProperty("return")) {
            hostResponse = hostResponse.return.return;
          }

          var hostOutput = null;
          var hostMultiLine = null;
          var fndRepresentation = false; // the standard label is the hostname,
          // future: colored based on the successflag
          // future: colored based on the retcode

          var hostClass = "host_success";
          if (!isSuccess) hostClass = "host_failure";
          if (!response.hasOwnProperty(hostname)) hostClass = "host_noresponse";
          var hostLabel = Output.getHostnameHtml(hostname, hostClass);

          if (!fndRepresentation && !response.hasOwnProperty(hostname)) {
            hostOutput = Output.getTextOutput("(no response)");
            fndRepresentation = true;
          }

          if (!fndRepresentation && typeof hostResponse === "string") {
            hostOutput = Output.getTextOutput(hostResponse);
            hostMultiLine = hostResponse.includes("\n");
            fndRepresentation = true;
          }

          if (!fndRepresentation && _typeof(hostResponse) !== "object") {
            hostOutput = Output.getNormalOutput(hostResponse);
            hostMultiLine = false;
            fndRepresentation = true;
          } // null is an object, but treat it separatelly


          if (!fndRepresentation && hostResponse === null) {
            hostOutput = Output.getNormalOutput(hostResponse);
            hostMultiLine = false;
            fndRepresentation = true;
          } // an array is an object, but treat it separatelly


          if (!fndRepresentation && Array.isArray(hostResponse)) {
            hostOutput = Output.getNormalOutput(hostResponse);
            hostMultiLine = hostResponse.length > 0;
            fndRepresentation = true;
          } // it might be highstate output


          var commandCmd = command.trim().replace(/ .*/, "");
          var isHighStateOutput = _OutputHighstate__WEBPACK_IMPORTED_MODULE_1__["OutputHighstate"].isHighStateOutput(commandCmd, hostResponse); // enhanced highstate display

          if (!fndRepresentation && isHighStateOutput && Output.isOutputFormatAllowed("saltguihighstate")) {
            hostLabel = _OutputSaltGuiHighstate__WEBPACK_IMPORTED_MODULE_4__["OutputSaltGuiHighstate"].getHighStateLabel(hostname, hostResponse);
            hostOutput = _OutputSaltGuiHighstate__WEBPACK_IMPORTED_MODULE_4__["OutputSaltGuiHighstate"].getHighStateOutput(hostResponse);
            hostMultiLine = true;
            fndRepresentation = true;
          } // regular highstate display


          if (!fndRepresentation && isHighStateOutput && Output.isOutputFormatAllowed("highstate")) {
            hostLabel = _OutputHighstate__WEBPACK_IMPORTED_MODULE_1__["OutputHighstate"].getHighStateLabel(hostname, hostResponse);
            hostOutput = _OutputHighstate__WEBPACK_IMPORTED_MODULE_1__["OutputHighstate"].getHighStateOutput(hostResponse);
            hostMultiLine = true;
            fndRepresentation = true;
          } // nothing special? then it is normal output


          if (!fndRepresentation) {
            hostOutput = Output.getNormalOutput(hostResponse);
            hostMultiLine = Object.keys(hostResponse).length > 0;
          } // one response does not need to be collapsible


          var cnt = Object.keys(response).length;

          if (cnt === 1) {
            hostMultiLine = false;
          }

          if (hostMultiLine) nrMultiLineBlocks += 1; // compose the actual output

          var div = document.createElement("div");
          div.append(hostLabel);
          div.appendChild(document.createTextNode(": ")); // multiple line, collapsible
          // 25B7 = WHITE RIGHT-POINTING TRIANGLE
          // 25BD = WHITE DOWN-POINTING TRIANGLE

          var triangle = null;

          if (hostMultiLine) {
            triangle = document.createElement("span");
            triangle.innerText = "\u25BD";
            triangle.style = "cursor: pointer";
            triangle.classList.add("triangle");
            div.appendChild(triangle);
            div.appendChild(document.createElement("br"));
            triangle.addEventListener("click", function (_) {
              // 25B7 = WHITE RIGHT-POINTING TRIANGLE
              // 25BD = WHITE DOWN-POINTING TRIANGLE
              if (triangle.innerText !== "\u25BD") {
                triangle.innerText = "\u25BD";
                hostOutput.style.display = "";
              } else {
                triangle.innerText = "\u25B7";
                hostOutput.style.display = "none";
              }
            });
          }

          div.append(hostOutput);
          outputContainer.append(div);
        };

        for (var _iterator3 = minions.sort()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (nrMultiLineBlocks <= 1) {
        // No collapsible elements, hide the master
        // Also hide with 1 collapsible element
        masterTriangle.style.display = "none";
      }
    }
  }]);

  return Output;
}();

/***/ }),

/***/ "./saltgui/static/scripts/output/OutputDocumentation.js":
/*!**************************************************************!*\
  !*** ./saltgui/static/scripts/output/OutputDocumentation.js ***!
  \**************************************************************/
/*! exports provided: OutputDocumentation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputDocumentation", function() { return OutputDocumentation; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OutputDocumentation =
/*#__PURE__*/
function () {
  function OutputDocumentation() {
    _classCallCheck(this, OutputDocumentation);
  }

  _createClass(OutputDocumentation, null, [{
    key: "isDocuKeyMatch",
    // test whether the returned data matches the requested data
    value: function isDocuKeyMatch(key, filterKey) {
      // no filter is always OK
      if (!filterKey) return true; // an exact match is great

      if (key === filterKey) return true; // a true prefix is also ok

      if (key.startsWith(filterKey + ".")) return true; // no match

      return false;
    } // we only treat output as documentation output when it sticks to strict rules
    // all minions must return strings
    // and when its key matches the requested documentation
    // empty values are allowed due to errors in the documentation
    // 'output' is needed like this to prevent an error during testing

  }, {
    key: "isDocumentationOutput",
    value: function isDocumentationOutput(output, response, command) {
      if (!output.isOutputFormatAllowed("doc")) return false;
      var result = false; // reduce the search key to match the data in the response

      command = OutputDocumentation.reduceFilterKey(command);

      var _arr = Object.keys(response);

      for (var _i = 0; _i < _arr.length; _i++) {
        var hostname = _arr[_i];
        var _output = response[hostname];

        if (!_output) {
          // some commands do not have help-text
          // e.g. wheel.key.get_key
          continue;
        }

        if (_typeof(_output) !== "object") {
          // strange --> no documentation object
          return false;
        } // arrays are also objects,
        // but not what we are looking for


        if (Array.isArray(_output)) {
          return false;
        }

        var _arr2 = Object.keys(_output);

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var key = _arr2[_i2];

          // e.g. for "test.rand_str"
          if (_output[key] === null) {
            continue;
          } // but otherwise it must be a (documentation)string


          if (typeof _output[key] !== "string") {
            return false;
          } // is this what we were looking for?


          if (OutputDocumentation.isDocuKeyMatch(key, command)) {
            result = true;
          }
        }
      }

      return result;
    } // reduce the search key to match the data in the response

  }, {
    key: "reduceFilterKey",
    value: function reduceFilterKey(filterKey) {
      if (filterKey === "wheel") {
        return "";
      }

      if (filterKey.startsWith("wheel.")) {
        // strip the prefix "wheel."
        return filterKey.substring(6);
      }

      if (filterKey === "runners") {
        return "";
      }

      if (filterKey.startsWith("runners.")) {
        // strip the prefix "runners."
        return filterKey.substring(8);
      }

      return filterKey;
    } // documentation is requested from all targetted minions
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

  }, {
    key: "reduceDocumentationOutput",
    value: function reduceDocumentationOutput(response, visualKey, filterKey) {
      if (!response || _typeof(response) !== "object") {
        // strange --> don't try to fix anything
        return;
      } // reduce the search key to match the data in the response
      // i.e. remove the prefixes for "wheel" and "runners"


      filterKey = OutputDocumentation.reduceFilterKey(filterKey);
      var selectedMinion = null;

      var _arr3 = Object.keys(response);

      for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
        var hostname = _arr3[_i3];

        // When we already found the documentation ignore all others
        if (selectedMinion) {
          delete response[hostname];
          continue;
        } // make sure it is an object (instead of e.g. "false" for an offline minion)
        // when it is not, the whole entry is ignored


        if (!response[hostname] || _typeof(response[hostname]) !== "object") {
          delete response[hostname];
          continue;
        } // make sure that the entry matches with the requested command or prefix
        // that's always the case for SYS.DOC output, but not for RUNNERS.DOC.RUNNER
        // and/or RUNNERS.DOC.WHEEL.


        var hostResponse = response[hostname];

        var _arr4 = Object.keys(hostResponse);

        for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
          var key = _arr4[_i4];

          // is this what we were looking for?
          if (!OutputDocumentation.isDocuKeyMatch(key, filterKey)) {
            // no match, ignore the whole entry
            delete hostResponse[key];
          }
        } // no documentation present (or left) on this minion?
        // then discard the result of this minion


        if (Object.keys(hostResponse).length === 0) {
          delete response[hostname];
          continue;
        } // we have found documentation output
        // mark all other documentation for discarding


        selectedMinion = hostname;
      }

      if (selectedMinion) {
        // basically rename the key
        var savedDocumentation = response[selectedMinion];
        delete response[selectedMinion];
        response[visualKey] = savedDocumentation;
      } else {
        // prepare a dummy response when no documentation could be found
        // otherwise leave all documentation responses organized by minion
        response["dummy"] = {};
        response["dummy"][visualKey] = "no documentation found";
      }
    } // add the output of a documentation command to the display

  }, {
    key: "addDocumentationOutput",
    value: function addDocumentationOutput(outputContainer, response) {
      // we expect no hostnames present
      // as it should have been reduced already
      var _arr5 = Object.keys(response);

      for (var _i5 = 0; _i5 < _arr5.length; _i5++) {
        var hostname = _arr5[_i5];
        var hostResponse = response[hostname];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(hostResponse).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;
            var out = hostResponse[key];
            if (out === null) continue;
            out = out.trimRight(); // internal links: remove the ".. rubric::" prefix
            // e.g. in "sys.doc state.apply"

            out = out.replace(/[.][.] rubric:: */g, ""); // internal links: remove prefixes like ":mod:" and ":py:func:"
            // e.g. in "sys.doc state.apply"

            out = out.replace(/(:[a-z_]*)*:`/g, "`"); // internal links: remove link indicators in highlighted text
            // e.g. in "sys.doc state.apply"

            out = out.replace(/[ \n]*<[^`]*>`/gm, "`"); // turn text into html
            // e.g. in "sys.doc cmd.run"

            out = out.replace(/&/g, "&amp;"); // turn text into html
            // e.g. in "sys.doc state.template"

            out = out.replace(/</g, "&lt;"); // turn text into html
            // e.g. in "sys.doc state.template"

            out = out.replace(/>/g, "&gt;"); // external links
            // e.g. in "sys.doc pkg.install"

            while (out.includes(".. _")) {
              // take only a line containing ".. _"
              var reference = out.replace(/^(.|\n|\r)*[.][.] _/m, "").replace(/(\n|\r)(.|\n|\r)*$/m, "");
              var words = reference.split(": ");

              if (words.length !== 2) {
                console.log("words", words);
                break;
              }

              var link = words[0];
              var target = words[1]; // add link to all references

              while (out.includes(link + "_")) {
                out = out.replace(link + "_", "<a href='" + target + "' target='_blank'>" + link + "</a>");
              } // remove the item from the link table


              out = out.replace(".. _" + reference, "");
            } // replace ``......``
            // e.g. in "sys.doc state.apply"


            out = out.replace(/``([^`]*)``/g, "<span style='background-color: #575757'>$1</span>"); // replace `......`
            // e.g. in "sys.doc state.apply"

            out = out.replace(/`([^`]*)`/g, "<span style='color: yellow'>$1</span>"); // remove whitespace at end of lines

            out = out.replace(/  *\n/gm, ""); // remove duplicate empty lines (usually due to previous rule)

            out = out.replace(/\n\n\n*/gm, "\n\n");
            outputContainer.innerHTML += "<div><span class='hostname'>" + key + "</span>:</br><pre style='height: initial; overflow-y: initial;'>" + out + "</pre></div>";
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }]);

  return OutputDocumentation;
}();

/***/ }),

/***/ "./saltgui/static/scripts/output/OutputHighstate.js":
/*!**********************************************************!*\
  !*** ./saltgui/static/scripts/output/OutputHighstate.js ***!
  \**********************************************************/
/*! exports provided: OutputHighstate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputHighstate", function() { return OutputHighstate; });
/* harmony import */ var _Output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Output */ "./saltgui/static/scripts/output/Output.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var OutputHighstate =
/*#__PURE__*/
function () {
  function OutputHighstate() {
    _classCallCheck(this, OutputHighstate);
  }

  _createClass(OutputHighstate, null, [{
    key: "isHighStateOutput",
    value: function isHighStateOutput(command, response) {
      if (!_Output__WEBPACK_IMPORTED_MODULE_0__["Output"].isOutputFormatAllowed("highstate")) return false;
      if (_typeof(response) !== "object") return false;
      if (Array.isArray(response)) return false;
      if (command !== "state.apply" && command !== "state.highstate") return false;

      var _arr = Object.keys(response);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];
        var components = key.split("_|-");
        if (components.length !== 4) return false;
      }

      return true;
    }
  }, {
    key: "getDurationClause",
    value: function getDurationClause(millis) {
      if (millis === 1) {
        return "".concat(millis, " millisecond");
      }

      if (millis < 1000) {
        return "".concat(millis, " milliseconds");
      }

      if (millis === 1000) {
        return "".concat(millis / 1000, " second");
      }

      return "".concat(millis / 1000, " seconds");
    }
  }, {
    key: "getHighStateLabel",
    value: function getHighStateLabel(hostname, hostResponse) {
      var anyFailures = false;
      var anySkips = false; // do not use Object.entries, that is not supported by the test framework

      var _arr2 = Object.keys(hostResponse);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var key = _arr2[_i2];
        var task = hostResponse[key];
        if (task.result === null) anySkips = true;else if (!task.result) anyFailures = true;
      }

      if (anyFailures) {
        return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_failure");
      }

      if (anySkips) {
        return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_skips");
      }

      return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_success");
    }
  }, {
    key: "getHighStateOutput",
    value: function getHighStateOutput(hostResponse) {
      // The tasks are in an (unordered) object with uninteresting keys
      // convert it to an array that is in execution order
      // first put all the values in an array
      var tasks = [];
      Object.keys(hostResponse).forEach(function (taskKey) {
        hostResponse[taskKey].___key___ = taskKey;
        tasks.push(hostResponse[taskKey]);
      }); // then sort the array

      tasks.sort(function (a, b) {
        return a.__run_num__ - b.__run_num__;
      });
      var indent = "    ";
      var div = document.createElement("div");
      var succeeded = 0;
      var failed = 0;
      var skipped = 0;
      var total_millis = 0;
      var changes = 0;

      for (var _i3 = 0; _i3 < tasks.length; _i3++) {
        var task = tasks[_i3];
        var taskDiv = document.createElement("div");
        var span = document.createElement("span");

        if (task.result === null) {
          // 2714 = HEAVY CHECK MARK
          span.style.color = "yellow";
          span.innerText = "\u2714";
          skipped += 1;
        } else if (task.result) {
          // 2714 = HEAVY CHECK MARK
          span.style.color = "green";
          span.innerText = "\u2714";
          succeeded += 1;
        } else {
          // 2718 = HEAVY BALLOT X
          span.style.color = "red";
          span.innerText = "\u2718";
          failed += 1;
        }

        taskDiv.append(span);
        taskDiv.append(document.createTextNode(" "));

        if (task.name) {
          taskDiv.append(document.createTextNode(task.name));
        } else {
          // make sure that the checkbox/ballot-x is on a reasonable line
          // also for the next "from" clause (if any)
          taskDiv.append(document.createTextNode("(anonymous task)"));
        }

        if (task.__id__ && task.__id__ !== task.name) {
          taskDiv.append(document.createTextNode(" id=" + encodeURIComponent(task.__id__)));
        }

        if (task.__sls__) {
          taskDiv.append(document.createTextNode(" (from " + task.__sls__.replace(".", "/") + ".sls)"));
        }

        var components = task.___key___.split("_|-");

        taskDiv.append(document.createElement("br"));
        taskDiv.append(document.createTextNode(indent + "Function is " + components[0] + "." + components[3]));

        if (task.comment) {
          taskDiv.append(document.createElement("br"));
          var txt = task.comment; // trim extra whitespace

          txt = txt.replace(/[ \r\n]+$/g, ""); // indent extra lines

          txt = txt.replace(/[\n]+/g, "\n" + indent);
          taskDiv.append(document.createTextNode(indent + txt));
        }

        if (task.hasOwnProperty("changes")) {
          if (_typeof(task.changes) !== "object" || Array.isArray(task.changes)) {
            taskDiv.append(document.createElement("br"));
            taskDiv.append(document.createTextNode(indent + JSON.stringify(task.changes)));
          } else {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = Object.keys(task.changes).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;
                changes = changes + 1;
                var change = task.changes[key]; // 25BA = BLACK RIGHT-POINTING POINTER
                // don't use arrows here, these are higher than a regular
                // text-line and disturb the text-flow

                if (typeof change === "string" && change.includes("\n")) {
                  taskDiv.append(document.createElement("br")); // show multi-line text as a separate block

                  taskDiv.append(document.createTextNode(indent + key + ":"));
                  var lines = change.trim().split("\n");
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var _line = _step2.value;
                      taskDiv.append(document.createElement("br"));
                      taskDiv.append(document.createTextNode("      " + _line));
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                        _iterator2.return();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
                  }
                } else if (_typeof(change) !== "object" || Array.isArray(task.change)) {
                  // show all other non-objects in a simple way
                  taskDiv.append(document.createElement("br"));
                  taskDiv.append(document.createTextNode(indent + key + ": " + JSON.stringify(change)));
                } else {
                  // treat old->new first
                  if (change.hasOwnProperty("old") && change.hasOwnProperty("new")) {
                    taskDiv.append(document.createElement("br")); // place changes on one line

                    taskDiv.append(document.createTextNode(indent + key + ": " + JSON.stringify(change.old) + " \u25BA " + JSON.stringify(change.new)));
                    delete change.old;
                    delete change.new;
                  } // then show whatever remains


                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = Object.keys(change).sort()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var taskkey = _step3.value;
                      taskDiv.append(document.createElement("br"));
                      taskDiv.append(document.createTextNode(indent + key + ": " + taskkey + ": " + JSON.stringify(change[taskkey])));
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                        _iterator3.return();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
        }

        if (task.hasOwnProperty("start_time")) {
          taskDiv.append(document.createElement("br"));
          taskDiv.append(document.createTextNode(indent + "Started at " + task.start_time));
        }

        if (task.hasOwnProperty("duration")) {
          var millis = Math.round(task.duration);
          total_millis += millis;

          if (millis >= 10) {
            // anything below 10ms is not worth reporting
            // report only the "slow" jobs
            // it still counts for the grand total thought
            taskDiv.append(document.createElement("br"));
            taskDiv.append(document.createTextNode(indent + "Duration " + OutputHighstate.getDurationClause(millis)));
          }
        } // show any unknown attribute of a task
        // do not use Object.entries, that is not supported by the test framework


        var _arr3 = Object.keys(task);

        for (var _i4 = 0; _i4 < _arr3.length; _i4++) {
          var _key = _arr3[_i4];
          var item = task[_key];
          if (_key === "___key___") continue; // ignored, generated by us

          if (_key === "__id__") continue; // handled

          if (_key === "__sls__") continue; // handled

          if (_key === "__run_num__") continue; // handled, not shown

          if (_key === "changes") continue; // handled

          if (_key === "comment") continue; // handled

          if (_key === "duration") continue; // handled

          if (_key === "host") continue; // ignored, same as host

          if (_key === "name") continue; // handled

          if (_key === "pchanges") continue; // ignored, also ignored by cli

          if (_key === "result") continue; // handled

          if (_key === "start_time") continue; // handled

          taskDiv.append(document.createElement("br"));
          taskDiv.append(document.createTextNode(indent + _key + " = " + JSON.stringify(item)));
        }

        div.append(taskDiv);
      } // add a summary line


      var line = "";
      if (succeeded) line += ", " + succeeded + " succeeded";
      if (skipped) line += ", " + skipped + " skipped";
      if (failed) line += ", " + failed + " failed";
      var total = succeeded + skipped + failed;

      if (total !== succeeded && total !== skipped && total !== failed) {
        line += ", " + (succeeded + skipped + failed) + " total";
      } // note that the number of changes may be higher or lower
      // than the number of tasks. tasks may contribute multiple
      // changes, or tasks may have no changes.


      if (changes === 1) line += ", " + changes + " change";else if (changes) line += ", " + changes + " changes"; // multiple durations and significant?

      if (total > 1 && total_millis >= 10) {
        line += ", " + OutputHighstate.getDurationClause(total_millis);
      }

      if (line) {
        div.append(document.createTextNode(line.substring(2)));
      }

      return div;
    }
  }]);

  return OutputHighstate;
}();

/***/ }),

/***/ "./saltgui/static/scripts/output/OutputJson.js":
/*!*****************************************************!*\
  !*** ./saltgui/static/scripts/output/OutputJson.js ***!
  \*****************************************************/
/*! exports provided: OutputJson */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputJson", function() { return OutputJson; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OutputJson =
/*#__PURE__*/
function () {
  function OutputJson() {
    _classCallCheck(this, OutputJson);
  }

  _createClass(OutputJson, null, [{
    key: "formatSimpleJSON",
    // format an object as JSON
    // returns NULL when it is not a simple object
    // i.e. no multi-line objects, no indentation here
    value: function formatSimpleJSON(value) {
      if (value === null) {
        // null is an object, but not really
        // leave that to the builtin function
        return JSON.stringify(value);
      }

      if (value === undefined) {
        // JSON.stringify does not return a string for this
        // but again a value undefined, we need a string
        return "undefined";
      }

      if (_typeof(value) !== "object") {
        // a simple type
        // leave that to the builtin function
        return JSON.stringify(value);
      }

      if (Array.isArray(value) && value.length === 0) {
        // show the brackets for an empty array a bit wider apart
        return "[ ]";
      }

      if (!Array.isArray(value) && Object.keys(value).length === 0) {
        // show the brackets for an empty object a bit wider apart
        return "{ }";
      }

      return null;
    } // format an object as JSON
    // based on an initial indentation and an indentation increment

  }, {
    key: "formatJSON",
    value: function formatJSON(value) {
      var indentLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // indent each level with 4 spaces
      var indentStep = 4;
      var str = OutputJson.formatSimpleJSON(value);

      if (str !== null) {
        return str;
      }

      if (Array.isArray(value)) {
        // an array
        // put each element on its own line
        str = "[";
        var _separator = "";
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;
            str += _separator + "\n" + " ".repeat(indentLevel + indentStep) + OutputJson.formatJSON(elem, indentLevel + indentStep);
            _separator = ",";
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        str += "\n" + " ".repeat(indentLevel) + "]";
        return str;
      } // regular object
      // put each name+value on its own line


      var keys = Object.keys(value);
      str = "{";
      var separator = ""; // do not use Object.entries, that is not supported by the test framework

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(value).sort()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;
          var item = value[key];
          str += separator + "\n" + " ".repeat(indentLevel + indentStep) + "\"" + key + "\": " + OutputJson.formatJSON(item, indentLevel + indentStep);
          separator = ",";
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      str += "\n" + " ".repeat(indentLevel) + "}";
      return str;
    }
  }]);

  return OutputJson;
}();

/***/ }),

/***/ "./saltgui/static/scripts/output/OutputNested.js":
/*!*******************************************************!*\
  !*** ./saltgui/static/scripts/output/OutputNested.js ***!
  \*******************************************************/
/*! exports provided: OutputNested */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputNested", function() { return OutputNested; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OutputNested =
/*#__PURE__*/
function () {
  function OutputNested() {
    _classCallCheck(this, OutputNested);
  }

  _createClass(OutputNested, null, [{
    key: "ustring",
    // heavily inspired by the implementation for NESTED output
    // as originally implemented in salt/output/nested.py from Salt
    value: function ustring(indent, msg) {
      var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      return " ".repeat(indent) + prefix + msg + suffix;
    }
  }, {
    key: "display",
    value: function display(ret, indent, prefix, out) {
      if (ret === null) {
        out.push(OutputNested.ustring(indent, "None", prefix));
      } else if (ret === undefined) {
        out.push(OutputNested.ustring(indent, "undefined", prefix));
      } else if (typeof ret === "boolean" || typeof ret === "number") {
        out.push(OutputNested.ustring(indent, ret, prefix));
      } else if (typeof ret === "string") {
        var first_line = true;
        ret = ret.replace(/\n$/, "");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = ret.split("\n")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var line = _step.value;
            var line_prefix = prefix;
            if (!first_line) line_prefix = ".".repeat(prefix.length);
            out.push(OutputNested.ustring(indent, line, line_prefix));
            first_line = false;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else if (_typeof(ret) === "object" && Array.isArray(ret)) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = ret[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var ind = _step2.value;

            if (_typeof(ind) === "object"
            /* including array */
            ) {
                out.push(OutputNested.ustring(indent, '|_'));

                var _prefix = void 0;

                if (_typeof(ind) === "object" && !Array.isArray(ind)) _prefix = '';else _prefix = "-\xA0";
                OutputNested.display(ind, indent + 2, _prefix, out);
              } else {
              OutputNested.display(ind, indent, "-\xA0", out);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } else if (_typeof(ret) === "object") {
        if (indent) out.push(OutputNested.ustring(indent, '----------'));
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Object.keys(ret).sort()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;
            var val = ret[key];
            out.push(OutputNested.ustring(indent, key, prefix, ':'));

            if (val !== null && val !== "") {
              OutputNested.display(val, indent + 4, '', out);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }

      return out;
    }
  }, {
    key: "formatNESTED",
    value: function formatNESTED(value) {
      var indentLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var lines = OutputNested.display(value, 0, '', []);
      return lines.join('\n');
    }
  }]);

  return OutputNested;
}();

/***/ }),

/***/ "./saltgui/static/scripts/output/OutputSaltGuiHighstate.js":
/*!*****************************************************************!*\
  !*** ./saltgui/static/scripts/output/OutputSaltGuiHighstate.js ***!
  \*****************************************************************/
/*! exports provided: OutputSaltGuiHighstate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputSaltGuiHighstate", function() { return OutputSaltGuiHighstate; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OutputSaltGuiHighstate =
/*#__PURE__*/
function () {
  function OutputSaltGuiHighstate() {
    _classCallCheck(this, OutputSaltGuiHighstate);
  }

  _createClass(OutputSaltGuiHighstate, null, [{
    key: "getDurationClause",
    // no separate `isHighStateOutput` here
    // the implementation from OutputHighstate is (re)used
    value: function getDurationClause(millis) {
      if (millis === 1) {
        return "".concat(millis, " millisecond");
      }

      if (millis < 1000) {
        return "".concat(millis, " milliseconds");
      }

      if (millis === 1000) {
        return "".concat(millis / 1000, " second");
      }

      return "".concat(millis / 1000, " seconds");
    }
  }, {
    key: "getHighStateLabel",
    value: function getHighStateLabel(hostname, hostResponse) {
      var anyFailures = false;
      var anySkips = false; // do not use Object.entries, that is not supported by the test framework

      var _arr = Object.keys(hostResponse);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];
        var task = hostResponse[key];
        if (task.result === null) anySkips = true;else if (!task.result) anyFailures = true;
      }

      if (anyFailures) {
        return Output.getHostnameHtml(hostname, "host_failure");
      }

      if (anySkips) {
        return Output.getHostnameHtml(hostname, "host_skips");
      }

      return Output.getHostnameHtml(hostname, "host_success");
    }
  }, {
    key: "addChangesInfo",
    value: function addChangesInfo(taskDiv, task, indent) {
      if (!task.hasOwnProperty("changes")) {
        return 0;
      }

      if (_typeof(task.changes) !== "object" || Array.isArray(task.changes)) {
        taskDiv.append(document.createElement("br"));
        taskDiv.append(document.createTextNode(indent + JSON.stringify(task.changes)));
        return 0;
      }

      var changes = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(task.changes).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;
          changes = changes + 1;
          var change = task.changes[key];

          if (typeof change === "string" && change.includes("\n")) {
            taskDiv.append(document.createElement("br")); // show multi-line text as a separate block

            taskDiv.append(document.createTextNode(indent + key + ":"));
            var lines = change.trim().split("\n");
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var line = _step2.value;
                taskDiv.append(document.createElement("br"));
                taskDiv.append(document.createTextNode("      " + line));
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            continue;
          }

          if (Array.isArray(change)) {
            for (var idx in change) {
              var _task = change[idx];
              taskDiv.append(document.createElement("br"));
              taskDiv.append(document.createTextNode(indent + key + "[" + idx + "]: " + JSON.stringify(_task)));
            }

            continue;
          }

          if (_typeof(change) !== "object") {
            // show all other non-objects in a simple way
            taskDiv.append(document.createElement("br"));
            taskDiv.append(document.createTextNode(indent + key + ": " + JSON.stringify(change)));
            continue;
          } // treat old->new first


          if (change.hasOwnProperty("old") && change.hasOwnProperty("new")) {
            taskDiv.append(document.createElement("br")); // place changes on one line
            // 25BA = BLACK RIGHT-POINTING POINTER
            // don't use arrows here, these are higher than a regular
            // text-line and disturb the text-flow

            taskDiv.append(document.createTextNode(indent + key + ": " + JSON.stringify(change.old) + " \u25BA " + JSON.stringify(change.new)));
            delete change.old;
            delete change.new;
          } // then show whatever remains


          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = Object.keys(change).sort()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var taskkey = _step3.value;
              taskDiv.append(document.createElement("br"));
              taskDiv.append(document.createTextNode(indent + key + ": " + taskkey + ": " + JSON.stringify(change[taskkey])));
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "getHighStateOutput",
    value: function getHighStateOutput(hostResponse) {
      // The tasks are in an (unordered) object with uninteresting keys
      // convert it to an array that is in execution order
      // first put all the values in an array
      var tasks = [];
      Object.keys(hostResponse).forEach(function (taskKey) {
        hostResponse[taskKey].___key___ = taskKey;
        tasks.push(hostResponse[taskKey]);
      }); // then sort the array

      tasks.sort(function (a, b) {
        return a.__run_num__ - b.__run_num__;
      });
      var indent = "    ";
      var div = document.createElement("div");
      var succeeded = 0;
      var failed = 0;
      var skipped = 0;
      var total_millis = 0;
      var changes = 0;

      for (var _i2 = 0; _i2 < tasks.length; _i2++) {
        var task = tasks[_i2];
        var taskDiv = document.createElement("div");
        var span = document.createElement("span");

        if (task.result === null) {
          // 2714 = HEAVY CHECK MARK
          span.style.color = "yellow";
          span.innerText = "\u2714";
          skipped += 1;
        } else if (task.result) {
          // 2714 = HEAVY CHECK MARK
          span.style.color = "green";
          span.innerText = "\u2714";
          succeeded += 1;
        } else {
          // 2718 = HEAVY BALLOT X
          span.style.color = "red";
          span.innerText = "\u2718";
          failed += 1;
        }

        taskDiv.append(span);
        taskDiv.append(document.createTextNode(" "));

        if (task.name) {
          taskDiv.append(document.createTextNode(task.name));
        } else {
          // make sure that the checkbox/ballot-x is on a reasonable line
          // also for the next "from" clause (if any)
          taskDiv.append(document.createTextNode("(anonymous task)"));
        }

        if (task.__id__ && task.__id__ !== task.name) {
          taskDiv.append(document.createTextNode(" id=" + encodeURIComponent(task.__id__)));
        }

        if (task.__sls__) {
          taskDiv.append(document.createTextNode(" (from " + task.__sls__.replace(".", "/") + ".sls)"));
        }

        var components = task.___key___.split("_|-");

        taskDiv.append(document.createElement("br"));
        taskDiv.append(document.createTextNode(indent + "Function is " + components[0] + "." + components[3]));

        if (task.comment) {
          taskDiv.append(document.createElement("br"));
          var txt = task.comment; // trim extra whitespace

          txt = txt.replace(/[ \r\n]+$/g, ""); // indent extra lines

          txt = txt.replace(/[\n]+/g, "\n" + indent);
          taskDiv.append(document.createTextNode(indent + txt));
        }

        changes += OutputSaltGuiHighstate.addChangesInfo(taskDiv, task, indent);

        if (task.hasOwnProperty("start_time")) {
          taskDiv.append(document.createElement("br"));
          taskDiv.append(document.createTextNode(indent + "Started at " + Output.dateTimeStr(task.start_time)));
        }

        if (task.hasOwnProperty("duration")) {
          var millis = Math.round(task.duration);
          total_millis += millis;

          if (millis >= 10) {
            // anything below 10ms is not worth reporting
            // report only the "slow" jobs
            // it still counts for the grand total thought
            taskDiv.append(document.createElement("br"));
            taskDiv.append(document.createTextNode(indent + "Duration " + OutputSaltGuiHighstate.getDurationClause(millis)));
          }
        } // show any unknown attribute of a task
        // do not use Object.entries, that is not supported by the test framework


        var _arr2 = Object.keys(task);

        for (var _i3 = 0; _i3 < _arr2.length; _i3++) {
          var key = _arr2[_i3];
          var item = task[key];
          if (key === "___key___") continue; // ignored, generated by us

          if (key === "__id__") continue; // handled

          if (key === "__sls__") continue; // handled

          if (key === "__run_num__") continue; // handled, not shown

          if (key === "changes") continue; // handled

          if (key === "comment") continue; // handled

          if (key === "duration") continue; // handled

          if (key === "host") continue; // ignored, same as host

          if (key === "name") continue; // handled

          if (key === "pchanges") continue; // ignored, also ignored by cli

          if (key === "result") continue; // handled

          if (key === "start_time") continue; // handled

          taskDiv.append(document.createElement("br"));
          taskDiv.append(document.createTextNode(indent + key + " = " + JSON.stringify(item)));
        }

        div.append(taskDiv);
      } // add a summary line


      var line = "";
      if (succeeded) line += ", " + succeeded + " succeeded";
      if (skipped) line += ", " + skipped + " skipped";
      if (failed) line += ", " + failed + " failed";
      var total = succeeded + skipped + failed;

      if (total !== succeeded && total !== skipped && total !== failed) {
        line += ", " + (succeeded + skipped + failed) + " total";
      } // note that the number of changes may be higher or lower
      // than the number of tasks. tasks may contribute multiple
      // changes, or tasks may have no changes.


      if (changes === 1) line += ", " + changes + " change";else if (changes) line += ", " + changes + " changes"; // multiple durations and significant?

      if (total > 1 && total_millis >= 10) {
        line += ", " + OutputSaltGuiHighstate.getDurationClause(total_millis);
      }

      if (line) {
        div.append(document.createTextNode(line.substring(2)));
      }

      return div;
    }
  }]);

  return OutputSaltGuiHighstate;
}();

/***/ }),

/***/ "./saltgui/static/scripts/output/OutputYaml.js":
/*!*****************************************************!*\
  !*** ./saltgui/static/scripts/output/OutputYaml.js ***!
  \*****************************************************/
/*! exports provided: OutputYaml */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputYaml", function() { return OutputYaml; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OutputYaml =
/*#__PURE__*/
function () {
  function OutputYaml() {
    _classCallCheck(this, OutputYaml);
  }

  _createClass(OutputYaml, null, [{
    key: "formatSimpleYAML",
    // format an object as YAML
    // returns NULL when it is not a simple object
    // i.e. no multi-line objects, no indentation here
    value: function formatSimpleYAML(value) {
      if (value === null) {
        return "null";
      }

      if (value === undefined) {
        return "undefined";
      }

      if (typeof value === "boolean") {
        return value ? "true" : "false";
      }

      if (typeof value === "string") {
        var needQuotes = false; // simple number with extra 0's at the start is still a string

        if (value.match(/^0[0-9]+$/)) return value;
        if (!isNaN(Number(value))) needQuotes = true;
        if (value.match(/^$/)) needQuotes = true;
        if (value.match(/^ /)) needQuotes = true;
        if (value.match(/ $/)) needQuotes = true;
        if (value.match(/^@/)) needQuotes = true;
        if (value.match(/^`/)) needQuotes = true;
        if (value.match(/^%/)) needQuotes = true;
        if (!value.match(/^[-a-z0-9_()./:+ ]+$/i)) needQuotes = true;
        if (!needQuotes) return value;
        return "'" + value + "'";
      }

      if (_typeof(value) !== "object") {
        return "" + value;
      }

      if (Array.isArray(value) && value.length === 0) {
        // show the brackets for an empty array a bit wider apart
        return "[ ]";
      }

      if (!Array.isArray(value) && Object.keys(value).length === 0) {
        // show the brackets for an empty object a bit wider apart
        return "{ }";
      }

      return null;
    } // format an object as YAML
    // based on an initial indentation and an indentation increment

  }, {
    key: "formatYAML",
    value: function formatYAML(value) {
      var indentLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // indent each level with this number of spaces
      // note that list items are indented with 2 spaces
      // independently of this setting to match the prefix "- "
      var indentStep = 2;
      var str = OutputYaml.formatSimpleYAML(value);

      if (str !== null) {
        return str;
      }

      if (Array.isArray(value)) {
        var _out = "";
        var _separator = "";
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;
            _out += _separator + "-\xA0" + OutputYaml.formatYAML(item, indentLevel + 2);
            _separator = "\n" + " ".repeat(indentLevel);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return _out;
      } // regular object


      var out = "";
      var separator = "";
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(value).sort()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;
          var _item = value[key];
          out += separator + key + ":";

          var _str = OutputYaml.formatSimpleYAML(_item);

          if (_str !== null) {
            out += " " + _str;
          } else if (Array.isArray(_item)) {
            out += "\n" + " ".repeat(indentLevel) + OutputYaml.formatYAML(_item, indentLevel);
          } else if (_typeof(_item) === "object") {
            out += "\n" + " ".repeat(indentLevel + indentStep) + OutputYaml.formatYAML(_item, indentLevel + indentStep);
          } else {
            out += "x" + OutputYaml.formatYAML(_item, indentLevel + indentStep);
          }

          separator = "\n" + " ".repeat(indentLevel);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return out;
    }
  }]);

  return OutputYaml;
}();

/***/ }),

/***/ "./saltgui/static/scripts/output/index.js":
/*!************************************************!*\
  !*** ./saltgui/static/scripts/output/index.js ***!
  \************************************************/
/*! exports provided: Output, OutputDocumentation, OutputHighstate, OutputJson, OutputNested, OutputSaltGuiHighstate, OutputYaml */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Output */ "./saltgui/static/scripts/output/Output.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"]; });

/* harmony import */ var _OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OutputDocumentation */ "./saltgui/static/scripts/output/OutputDocumentation.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OutputDocumentation", function() { return _OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"]; });

/* harmony import */ var _OutputHighstate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OutputHighstate */ "./saltgui/static/scripts/output/OutputHighstate.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OutputHighstate", function() { return _OutputHighstate__WEBPACK_IMPORTED_MODULE_2__["OutputHighstate"]; });

/* harmony import */ var _OutputJson__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./OutputJson */ "./saltgui/static/scripts/output/OutputJson.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OutputJson", function() { return _OutputJson__WEBPACK_IMPORTED_MODULE_3__["OutputJson"]; });

/* harmony import */ var _OutputNested__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./OutputNested */ "./saltgui/static/scripts/output/OutputNested.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OutputNested", function() { return _OutputNested__WEBPACK_IMPORTED_MODULE_4__["OutputNested"]; });

/* harmony import */ var _OutputSaltGuiHighstate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./OutputSaltGuiHighstate */ "./saltgui/static/scripts/output/OutputSaltGuiHighstate.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OutputSaltGuiHighstate", function() { return _OutputSaltGuiHighstate__WEBPACK_IMPORTED_MODULE_5__["OutputSaltGuiHighstate"]; });

/* harmony import */ var _OutputYaml__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./OutputYaml */ "./saltgui/static/scripts/output/OutputYaml.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OutputYaml", function() { return _OutputYaml__WEBPACK_IMPORTED_MODULE_6__["OutputYaml"]; });









/***/ }),

/***/ "./saltgui/static/scripts/utils.js":
/*!*****************************************!*\
  !*** ./saltgui/static/scripts/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

window.elapsedToString = function (date) {
  try {
    var secondsPassed = new Date().getTime() / 1000 - date.getTime() / 1000;
    if (secondsPassed < 0) return "Magic happened in the future";
    if (secondsPassed < 20) return "A few moments ago";
    if (secondsPassed < 120) return "A few minutes ago";

    if (secondsPassed < 60 * 60) {
      var minutes = Math.round(secondsPassed / 60);
      return minutes + " minute(s) ago";
    }

    if (secondsPassed < 60 * 60 * 24) {
      var hours = Math.round(secondsPassed / 60 / 60);
      return hours + " hour(s) ago";
    }

    if (secondsPassed < 60 * 60 * 24 * 2) {
      return "Yesterday";
    }

    if (secondsPassed < 60 * 60 * 24 * 30) {
      var days = Math.round(secondsPassed / 60 / 60 / 24);
      return days + " days ago";
    }

    return "A long time ago, in a galaxy far, far away";
  } catch (err) {
    //console.error(err);
    return "It did happen, when I don't know";
  }
};

window.createElement = function (type, className, content) {
  var element = document.createElement(type);
  element.classList.add(className);
  if (content !== "") element.innerHTML = content;
  return element;
};

window.getQueryParam = function (name) {
  var vars = [];
  var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = hashes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var hash = _step.value;
      var hashparts = hash.split("=");
      vars.push(hashparts[0]);
      if (hashparts[0] === name) return hashparts[1];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return undefined;
};

window.escape = function (input) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
};

window.makeTargetText = function (targetType, targetPattern) {
  // note that "glob" is the most common case
  // when used from the command-line, that target-type
  // is not even specified.
  // therefore we suppress that one
  // note that due to bug in 2018.3, all finished jobs
  // will be shown as if of type "list"
  // therefore we suppress that one
  var returnText = "";

  if (targetType !== "glob" && targetType !== "list") {
    returnText = targetType + " ";
  }

  returnText += targetPattern;
  return returnText;
};

/***/ }),

/***/ "./tests/unit sync recursive .js$":
/*!******************************!*\
  !*** ./tests/unit sync .js$ ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./CommandLineParser.test.js": "./tests/unit/CommandLineParser.test.js",
	"./OutputModule.test.js": "./tests/unit/OutputModule.test.js",
	"./index.js": "./tests/unit/index.js",
	"./utils.js": "./tests/unit/utils.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./tests/unit sync recursive .js$";

/***/ }),

/***/ "./tests/unit/CommandLineParser.test.js":
/*!**********************************************!*\
  !*** ./tests/unit/CommandLineParser.test.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _saltgui_static_scripts_CommandLineParser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../saltgui/static/scripts/CommandLineParser */ "./saltgui/static/scripts/CommandLineParser.js");
var assert = __webpack_require__(/*! chai */ "chai").assert;


describe('Unittests for parsecmdline.js', function () {
  var candidate = new _saltgui_static_scripts_CommandLineParser__WEBPACK_IMPORTED_MODULE_0__["CommandLineParser"]();
  it('test parseCommandLine', function (done) {
    var args = [],
        params = {},
        result; // GENERAL ERROR HANDLING
    // null means: it was all ok

    args = [];
    params = {};
    result = candidate.parse("test", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "test");
    assert.equal(Object.keys(params).length, 0); // broken json will return a readable error message

    args = [];
    params = {};
    result = candidate.parse("{\"test\"", args, params);
    assert.equal(result, "No valid dictionary found"); // GENERAL WHITESPACE HANDLING

    args = [];
    params = {};
    result = candidate.parse(" name=true", args, params);
    assert.isNull(result);
    assert.equal(args.length, 0);
    assert.equal(Object.keys(params).length, 1);
    assert.equal(params.name, true);
    args = [];
    params = {};
    result = candidate.parse("name=true ", args, params);
    assert.isNull(result);
    assert.equal(args.length, 0);
    assert.equal(Object.keys(params).length, 1);
    assert.equal(params.name, true); // NAMED PARAMETERS
    // name-value-pair without value is not ok

    args = [];
    params = {};
    result = candidate.parse("test=", args, params);
    assert.equal(result, "Must have value for named parameter 'test'"); // name-value-pair without value is not ok
    // make sure it does not confuse it with furher parameters

    args = [];
    params = {};
    result = candidate.parse("test= arg2 arg3", args, params);
    assert.equal(result, "Must have value for named parameter 'test'"); // DICTIONARY
    // a regular dictionary

    args = [];
    params = {};
    result = candidate.parse("{\"a\":1}", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.deepEqual(args[0], {
      "a": 1
    });
    assert.equal(Object.keys(params).length, 0); // a broken dictionary

    args = [];
    params = {};
    result = candidate.parse("{\"a}\":1", args, params);
    assert.equal(result, "No valid dictionary found"); // a regular dictionary with } in its name
    // test that the parser is not confused

    args = [];
    params = {};
    result = candidate.parse("{\"a}\":1}", args, params);
    assert.equal(result, null); // a regular dictionary with } after its value

    args = [];
    params = {};
    result = candidate.parse("{\"a}\":1}}", args, params);
    assert.equal(result, "Valid dictionary, but followed by text:}..."); // ARRAYS
    // a simple array

    args = [];
    params = {};
    result = candidate.parse("[1,2]", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.deepEqual(args[0], [1, 2]);
    assert.equal(Object.keys(params).length, 0); // a simple array that is not closed

    args = [];
    params = {};
    result = candidate.parse("[1,2", args, params);
    assert.equal(result, "No valid array found"); // STRINGS WITHOUT QUOTES
    // a simple string

    args = [];
    params = {};
    result = candidate.parse("string", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "string");
    assert.equal(Object.keys(params).length, 0); // a number that looks like a jobid

    args = [];
    params = {};
    result = candidate.parse("20180820003411338317", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "20180820003411338317");
    assert.equal(Object.keys(params).length, 0); // DOUBLE-QUOTED-STRINGS
    // a simple string

    args = [];
    params = {};
    result = candidate.parse("\"string\"", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "string");
    assert.equal(Object.keys(params).length, 0); // an unclosed string

    args = [];
    params = {};
    result = candidate.parse("\"string", args, params);
    assert.equal(result, "No valid double-quoted-string found"); // SINGLE-QUOTED-STRINGS (never supported!)
    // a single-quoted string is not supported
    // it evalueates as a string (the whole thing)

    args = [];
    params = {};
    result = candidate.parse("\'string\'", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], "\'string\'");
    assert.equal(Object.keys(params).length, 0); // a single-quoted string is not supported
    // it evalueates as a string (the whole thing)
    // even when that looks rediculous

    args = [];
    params = {};
    result = candidate.parse("\'string", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], "\'string");
    assert.equal(Object.keys(params).length, 0); // INTEGER

    args = [];
    params = {};
    result = candidate.parse("0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0); // an integer that almost looks like a jobid, but one digit less

    args = [];
    params = {};
    result = candidate.parse("2018082000341133831", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 2018082000341133831);
    assert.equal(Object.keys(params).length, 0); // an integer that almost looks like a jobid, but one digit more

    args = [];
    params = {};
    result = candidate.parse("201808200034113383170", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 201808200034113383170);
    assert.equal(Object.keys(params).length, 0); // an integer that almost looks like a jobid, just not a true date-time

    args = [];
    params = {};
    result = candidate.parse("20182820003411338317", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 20182820003411338317);
    assert.equal(Object.keys(params).length, 0); // FLOAT

    args = [];
    params = {};
    result = candidate.parse("0.", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse(".0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("0.0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0.0);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("0.0.0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "0.0.0");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse(".", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], ".");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("-1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], -1e99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("+1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("1e-99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e-99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("1e+99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("1e999", args, params);
    assert.equal(result, "Numeric argument has overflowed or is infinity"); // NULL

    args = [];
    params = {};
    result = candidate.parse("null", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("Null", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("NULL", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("NUll", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NUll");
    assert.equal(Object.keys(params).length, 0); // NONE

    args = [];
    params = {};
    result = candidate.parse("none", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "none");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("None", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("NONE", args, params); // GENERAL WHITESPACE HANDLING

    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NONE");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("NOne", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NOne");
    assert.equal(Object.keys(params).length, 0); // BOOLEAN

    args = [];
    params = {};
    result = candidate.parse("true", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("True", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("TRUE", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("TRue", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "TRue");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("false", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("False", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("FALSE", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = candidate.parse("FAlse", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "FAlse");
    assert.equal(Object.keys(params).length, 0);
    done();
  });
});

/***/ }),

/***/ "./tests/unit/OutputModule.test.js":
/*!*****************************************!*\
  !*** ./tests/unit/OutputModule.test.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../saltgui/static/scripts/output */ "./saltgui/static/scripts/output/index.js");
var assert = __webpack_require__(/*! chai */ "chai").assert;


describe('Unittests for output.js', function () {
  it('test formatJSON', function (done) {
    var outputData, result;
    outputData = null;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "null");
    outputData = undefined;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "undefined");
    outputData = 123;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "123");
    outputData = "txt";
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "\"txt\"");
    outputData = [];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "[ ]");
    outputData = [1];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "[\n" + "    1\n" + "]");
    outputData = [1, 2, 3, 4, 5];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "[\n" + "    1,\n" + "    2,\n" + "    3,\n" + "    4,\n" + "    5\n" + "]");
    outputData = {};
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "{ }"); // unordered input

    outputData = {
      "a": 11,
      "c": 22,
      "b": 33
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData); // ordered output

    assert.equal(result, "{\n" + "    \"a\": 11,\n" + "    \"b\": 33,\n" + "    \"c\": 22\n" + "}"); // a more complex object, unordered input

    outputData = {
      "ip6_interfaces": {
        "lo": ["::1"],
        "eth0": ["fe80::20d:3aff:fe38:576b"]
      }
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputJson"].formatJSON(outputData); // ordered output

    assert.equal(result, "{\n" + "    \"ip6_interfaces\": {\n" + "        \"eth0\": [\n" + "            \"fe80::20d:3aff:fe38:576b\"\n" + "        ],\n" + "        \"lo\": [\n" + "            \"::1\"\n" + "        ]\n" + "    }\n" + "}");
    done();
  });
  it('test formatYAML', function (done) {
    var outputData, result;
    outputData = null;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "null");
    outputData = undefined;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "undefined");
    outputData = 123;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "123");
    outputData = "txt";
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "txt");
    outputData = [];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "[ ]");
    outputData = [1];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "-\xA01");
    outputData = [1, 2, 3, 4, 5];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "-\xA01\n" + "-\xA02\n" + "-\xA03\n" + "-\xA04\n" + "-\xA05");
    outputData = {};
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "{ }"); // unordered input

    outputData = {
      "a": 11,
      "c": 22,
      "b": 33
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData); // ordered output

    assert.equal(result, "a: 11\n" + "b: 33\n" + "c: 22"); // a more complex object, unordered input

    outputData = {
      "ip6_interfaces": {
        "lo": ["::1"],
        "eth0": ["fe80::20d:3aff:fe38:576b"]
      }
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputYaml"].formatYAML(outputData); // ordered output

    assert.equal(result, "ip6_interfaces:\n" + "  eth0:\n" + "  -\xA0fe80::20d:3aff:fe38:576b\n" + "  lo:\n" + "  -\xA0::1");
    done();
  });
  it('test formatNESTED', function (done) {
    var outputData, result;
    outputData = null;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "None");
    outputData = undefined;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "undefined");
    outputData = 123;
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "123");
    outputData = "txt";
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "txt");
    outputData = [];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "");
    outputData = [1];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "-\xA01");
    outputData = [1, 2, 3, 4, 5];
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "-\xA01\n" + "-\xA02\n" + "-\xA03\n" + "-\xA04\n" + "-\xA05");
    outputData = {};
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, ""); // unordered input

    outputData = {
      "a": 11,
      "c": 22,
      "b": 33
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData); // ordered output

    assert.equal(result, "a:\n" + "    11\n" + "b:\n" + "    33\n" + "c:\n" + "    22"); // a more complex object, unordered input

    outputData = {
      "ip6_interfaces": {
        "lo": ["::1"],
        "eth0": ["fe80::20d:3aff:fe38:576b"]
      }
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputNested"].formatNESTED(outputData); // ordered output

    assert.equal(result, "ip6_interfaces:\n" + "    ----------\n" + "    eth0:\n" + "        -\xA0fe80::20d:3aff:fe38:576b\n" + "    lo:\n" + "        -\xA0::1");
    done();
  });
  it('test isDocumentationOutput', function (done) {
    var outputData, result; // ok, normal documentation case

    outputData = {
      "host1": {
        "keyword": "explanation"
      }
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isTrue(result); // wrong, does not match requested documentation

    outputData = {
      "host1": {
        "keyword": "explanation"
      }
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "another");
    assert.isFalse(result); // wrong, no resulting documentation

    outputData = {
      "host1": {
        "keyword": null
      }
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // wrong, value is not text

    outputData = {
      "host1": {
        "keyword": 123
      }
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // wrong, returned structure is not a dict

    outputData = {
      "host1": ["something"]
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // wrong, returned structure is not a dict

    outputData = {
      "host1": 123
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // wrong, returned structure is not a dict

    outputData = {
      "host1": "hello"
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // first host ignored, second host ok

    outputData = {
      "host1": null,
      "host2": {
        "keyword": "explanation"
      }
    };
    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isTrue(result);
    done();
  });
  it('test isDocuKeyMatch', function (done) {
    var result; // all documentation

    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocuKeyMatch("anything", null);
    assert.isTrue(result); // all documentation

    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocuKeyMatch("anything", "");
    assert.isTrue(result); // match one word

    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocuKeyMatch("foo.bar", "foo");
    assert.isTrue(result); // match two words

    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocuKeyMatch("foo.bar", "foo.bar");
    assert.isTrue(result); // wrong match

    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocuKeyMatch("foo", "bar");
    assert.isFalse(result); // wrong match (even though text prefix)

    result = _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocuKeyMatch("food", "foo");
    assert.isFalse(result);
    done();
  });
  it('test reduceDocumentationOutput', function (done) {
    var out; // normal case, hostname replaced by search key

    out = {
      "host1": {
        "topic": "explanation"
      }
    };
    _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {
      "DUMMY": {
        "topic": "explanation"
      }
    }); // removed irrelevant documentation parts

    out = {
      "host1": {
        "topic": "explanation",
        "othertopic": "otherexplanation"
      }
    };
    _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {
      "DUMMY": {
        "topic": "explanation"
      }
    }); // removed hosts with same answer

    out = {
      "host1": {
        "topic": "explanation"
      },
      "host2": {
        "topic": "explanation"
      }
    };
    _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {
      "DUMMY": {
        "topic": "explanation"
      }
    }); // ignore hosts with incorrectly formatted answer

    out = {
      "host1": null,
      "host2": {
        "topic": "explanation"
      }
    };
    _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {
      "DUMMY": {
        "topic": "explanation"
      }
    }); // ignore hosts with incorrectly formatted answer

    out = {
      "host1": 123,
      "host2": {
        "topic": "explanation"
      }
    };
    _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {
      "DUMMY": {
        "topic": "explanation"
      }
    });
    done();
  });
  it('test documentation external link conversion', function (done) {
    // external links will be converted to html
    var container = {
      "innerHTML": ""
    };
    var output = {
      "host1": {
        "pkg.install": "`systemd-run(1)`_\n .. _`systemd-run(1)`: https://www.freedesktop.org/software/systemd/man/systemd-run.html"
      }
    };
    _saltgui_static_scripts_output__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].addDocumentationOutput(container, output);
    assert.isTrue(container.innerHTML.includes("<a href='https://www.freedesktop.org/software/systemd/man/systemd-run.html' target='_blank'><span style='color: yellow'>systemd-run(1)</span></a>"));
    done();
  });
});

/***/ }),

/***/ "./tests/unit/index.js":
/*!*****************************!*\
  !*** ./tests/unit/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var context = __webpack_require__("./tests/unit sync recursive .js$");

context.keys().forEach(context);
module.exports = context;

/***/ }),

/***/ "./tests/unit/utils.js":
/*!*****************************!*\
  !*** ./tests/unit/utils.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! chai */ "chai").assert; // create a global window so we can unittest the window.<x> functions


if (!global.window) global.window = new Object({});

__webpack_require__(/*! ../../saltgui/static/scripts/utils */ "./saltgui/static/scripts/utils.js");

describe('Unittests for utils.js', function () {
  it('test elapsedToString with valid values', function (done) {
    var now = new Date();
    var result;
    result = window.elapsedToString(now);
    assert.equal(result, "A few moments ago");
    now.setSeconds(now.getSeconds() - 110);
    result = window.elapsedToString(now);
    assert.equal(result, "A few minutes ago");
    now.setMinutes(now.getMinutes() - 1);
    result = window.elapsedToString(now);
    assert.equal(result, "3 minute(s) ago");
    now.setHours(now.getHours() - 1);
    result = window.elapsedToString(now);
    assert.equal(result, "1 hour(s) ago");
    now.setHours(now.getHours() - 1);
    result = window.elapsedToString(now);
    assert.equal(result, "2 hour(s) ago");
    now.setHours(now.getHours() - 24);
    result = window.elapsedToString(now);
    assert.equal(result, "Yesterday");
    now.setHours(now.getHours() - 240);
    result = window.elapsedToString(now);
    assert.equal(result, "11 days ago");
    now.setHours(now.getHours() - 2400);
    result = window.elapsedToString(now);
    assert.equal(result, "A long time ago, in a galaxy far, far away");
    done();
  });
  it('test elapsedToString with invalid values', function (done) {
    var now = new Date();
    var result; // a time in the future?

    now.setSeconds(now.getSeconds() + 110);
    result = window.elapsedToString(now);
    assert.equal(result, "Magic happened in the future"); // and something which is not a date at all

    result = window.elapsedToString("I'm not a date");
    assert.equal(result, "It did happen, when I don't know");
    done();
  });
  it('test makeTargetText', function (done) {
    var result; // list of target-types from:
    // https://docs.saltstack.com/en/latest/ref/clients/index.html#salt.client.LocalClient.cmd
    // glob - Bash glob completion - Default

    result = window.makeTargetText("glob", "*");
    assert.equal(result, "*"); // pcre - Perl style regular expression

    result = window.makeTargetText("pcre", ".*");
    assert.equal(result, "pcre .*"); // list - Python list of hosts

    result = window.makeTargetText("list", "a,b,c");
    assert.equal(result, "a,b,c"); // grain - Match based on a grain comparison

    result = window.makeTargetText("grain", "os:*");
    assert.equal(result, "grain os:*"); // grain_pcre - Grain comparison with a regex

    result = window.makeTargetText("grain_pcre", "os:.*");
    assert.equal(result, "grain_pcre os:.*"); // pillar - Pillar data comparison

    result = window.makeTargetText("pillar", "p1:*");
    assert.equal(result, "pillar p1:*"); // pillar_pcre - Pillar data comparison with a regex

    result = window.makeTargetText("pillar_pcre", "p1:.*");
    assert.equal(result, "pillar_pcre p1:.*"); // nodegroup - Match on nodegroup

    result = window.makeTargetText("nodegroup", "ng3");
    assert.equal(result, "nodegroup ng3"); // range - Use a Range server for matching

    result = window.makeTargetText("range", "a-z");
    assert.equal(result, "range a-z"); // compound - Pass a compound match string

    result = window.makeTargetText("compound", "webserv* and G@os:Debian or E@web-dc1-srv.*");
    assert.equal(result, "compound webserv* and G@os:Debian or E@web-dc1-srv.*"); // ipcidr - Match based on Subnet (CIDR notation) or IPv4 address.

    result = window.makeTargetText("ipcidr", "10.0.0.0/24");
    assert.equal(result, "ipcidr 10.0.0.0/24");
    done();
  });
});

/***/ }),

/***/ "chai":
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ })

/******/ });
//# sourceMappingURL=tests.bundle.js.map