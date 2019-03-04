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

/***/ "./saltgui/static/scripts/ParseCommandLine.js":
/*!****************************************************!*\
  !*** ./saltgui/static/scripts/ParseCommandLine.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var cov_248w92trph = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/ParseCommandLine.js";
  var hash = "68c24b3a36bcf5e4b0e7e720db0d6b673cc9dff9";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/ParseCommandLine.js",
    statementMap: {
      "0": {
        start: {
          line: 20,
          column: 16
        },
        end: {
          line: 20,
          column: 41
        }
      },
      "1": {
        start: {
          line: 22,
          column: 24
        },
        end: {
          line: 22,
          column: 47
        }
      },
      "2": {
        start: {
          line: 23,
          column: 23
        },
        end: {
          line: 23,
          column: 43
        }
      },
      "3": {
        start: {
          line: 25,
          column: 15
        },
        end: {
          line: 25,
          column: 118
        }
      },
      "4": {
        start: {
          line: 27,
          column: 19
        },
        end: {
          line: 27,
          column: 47
        }
      },
      "5": {
        start: {
          line: 29,
          column: 17
        },
        end: {
          line: 29,
          column: 92
        }
      },
      "6": {
        start: {
          line: 32,
          column: 0
        },
        end: {
          line: 152,
          column: 2
        }
      },
      "7": {
        start: {
          line: 35,
          column: 2
        },
        end: {
          line: 35,
          column: 23
        }
      },
      "8": {
        start: {
          line: 37,
          column: 2
        },
        end: {
          line: 148,
          column: 3
        }
      },
      "9": {
        start: {
          line: 39,
          column: 15
        },
        end: {
          line: 39,
          column: 19
        }
      },
      "10": {
        start: {
          line: 41,
          column: 25
        },
        end: {
          line: 41,
          column: 43
        }
      },
      "11": {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 43,
          column: 36
        }
      },
      "12": {
        start: {
          line: 43,
          column: 6
        },
        end: {
          line: 43,
          column: 36
        }
      },
      "13": {
        start: {
          line: 44,
          column: 27
        },
        end: {
          line: 44,
          column: 45
        }
      },
      "14": {
        start: {
          line: 45,
          column: 4
        },
        end: {
          line: 52,
          column: 5
        }
      },
      "15": {
        start: {
          line: 47,
          column: 6
        },
        end: {
          line: 47,
          column: 45
        }
      },
      "16": {
        start: {
          line: 48,
          column: 6
        },
        end: {
          line: 48,
          column: 47
        }
      },
      "17": {
        start: {
          line: 49,
          column: 6
        },
        end: {
          line: 51,
          column: 7
        }
      },
      "18": {
        start: {
          line: 50,
          column: 8
        },
        end: {
          line: 50,
          column: 68
        }
      },
      "19": {
        start: {
          line: 56,
          column: 18
        },
        end: {
          line: 56,
          column: 27
        }
      },
      "20": {
        start: {
          line: 57,
          column: 18
        },
        end: {
          line: 57,
          column: 27
        }
      },
      "21": {
        start: {
          line: 58,
          column: 4
        },
        end: {
          line: 68,
          column: 5
        }
      },
      "22": {
        start: {
          line: 59,
          column: 6
        },
        end: {
          line: 59,
          column: 20
        }
      },
      "23": {
        start: {
          line: 60,
          column: 6
        },
        end: {
          line: 60,
          column: 29
        }
      },
      "24": {
        start: {
          line: 61,
          column: 11
        },
        end: {
          line: 68,
          column: 5
        }
      },
      "25": {
        start: {
          line: 62,
          column: 6
        },
        end: {
          line: 62,
          column: 20
        }
      },
      "26": {
        start: {
          line: 63,
          column: 6
        },
        end: {
          line: 63,
          column: 24
        }
      },
      "27": {
        start: {
          line: 64,
          column: 11
        },
        end: {
          line: 68,
          column: 5
        }
      },
      "28": {
        start: {
          line: 66,
          column: 6
        },
        end: {
          line: 66,
          column: 21
        }
      },
      "29": {
        start: {
          line: 67,
          column: 6
        },
        end: {
          line: 67,
          column: 39
        }
      },
      "30": {
        start: {
          line: 71,
          column: 4
        },
        end: {
          line: 136,
          column: 5
        }
      },
      "31": {
        start: {
          line: 73,
          column: 14
        },
        end: {
          line: 73,
          column: 15
        }
      },
      "32": {
        start: {
          line: 74,
          column: 6
        },
        end: {
          line: 104,
          column: 7
        }
      },
      "33": {
        start: {
          line: 76,
          column: 16
        },
        end: {
          line: 76,
          column: 41
        }
      },
      "34": {
        start: {
          line: 77,
          column: 8
        },
        end: {
          line: 79,
          column: 9
        }
      },
      "35": {
        start: {
          line: 78,
          column: 10
        },
        end: {
          line: 78,
          column: 50
        }
      },
      "36": {
        start: {
          line: 84,
          column: 18
        },
        end: {
          line: 84,
          column: 43
        }
      },
      "37": {
        start: {
          line: 85,
          column: 8
        },
        end: {
          line: 93,
          column: 9
        }
      },
      "38": {
        start: {
          line: 86,
          column: 10
        },
        end: {
          line: 86,
          column: 32
        }
      },
      "39": {
        start: {
          line: 91,
          column: 10
        },
        end: {
          line: 91,
          column: 20
        }
      },
      "40": {
        start: {
          line: 92,
          column: 10
        },
        end: {
          line: 92,
          column: 19
        }
      },
      "41": {
        start: {
          line: 96,
          column: 8
        },
        end: {
          line: 96,
          column: 18
        }
      },
      "42": {
        start: {
          line: 97,
          column: 8
        },
        end: {
          line: 99,
          column: 9
        }
      },
      "43": {
        start: {
          line: 98,
          column: 10
        },
        end: {
          line: 98,
          column: 93
        }
      },
      "44": {
        start: {
          line: 102,
          column: 8
        },
        end: {
          line: 102,
          column: 35
        }
      },
      "45": {
        start: {
          line: 103,
          column: 8
        },
        end: {
          line: 103,
          column: 14
        }
      },
      "46": {
        start: {
          line: 109,
          column: 16
        },
        end: {
          line: 109,
          column: 18
        }
      },
      "47": {
        start: {
          line: 110,
          column: 6
        },
        end: {
          line: 113,
          column: 7
        }
      },
      "48": {
        start: {
          line: 111,
          column: 8
        },
        end: {
          line: 111,
          column: 24
        }
      },
      "49": {
        start: {
          line: 112,
          column: 8
        },
        end: {
          line: 112,
          column: 35
        }
      },
      "50": {
        start: {
          line: 117,
          column: 6
        },
        end: {
          line: 135,
          column: 7
        }
      },
      "51": {
        start: {
          line: 118,
          column: 8
        },
        end: {
          line: 118,
          column: 21
        }
      },
      "52": {
        start: {
          line: 119,
          column: 13
        },
        end: {
          line: 135,
          column: 7
        }
      },
      "53": {
        start: {
          line: 120,
          column: 8
        },
        end: {
          line: 120,
          column: 22
        }
      },
      "54": {
        start: {
          line: 121,
          column: 13
        },
        end: {
          line: 135,
          column: 7
        }
      },
      "55": {
        start: {
          line: 122,
          column: 8
        },
        end: {
          line: 122,
          column: 21
        }
      },
      "56": {
        start: {
          line: 123,
          column: 13
        },
        end: {
          line: 135,
          column: 7
        }
      },
      "57": {
        start: {
          line: 125,
          column: 8
        },
        end: {
          line: 125,
          column: 20
        }
      },
      "58": {
        start: {
          line: 126,
          column: 13
        },
        end: {
          line: 135,
          column: 7
        }
      },
      "59": {
        start: {
          line: 127,
          column: 8
        },
        end: {
          line: 127,
          column: 30
        }
      },
      "60": {
        start: {
          line: 128,
          column: 13
        },
        end: {
          line: 135,
          column: 7
        }
      },
      "61": {
        start: {
          line: 129,
          column: 8
        },
        end: {
          line: 129,
          column: 32
        }
      },
      "62": {
        start: {
          line: 130,
          column: 8
        },
        end: {
          line: 132,
          column: 9
        }
      },
      "63": {
        start: {
          line: 131,
          column: 10
        },
        end: {
          line: 131,
          column: 66
        }
      },
      "64": {
        start: {
          line: 134,
          column: 8
        },
        end: {
          line: 134,
          column: 20
        }
      },
      "65": {
        start: {
          line: 138,
          column: 4
        },
        end: {
          line: 144,
          column: 5
        }
      },
      "66": {
        start: {
          line: 140,
          column: 6
        },
        end: {
          line: 140,
          column: 27
        }
      },
      "67": {
        start: {
          line: 143,
          column: 6
        },
        end: {
          line: 143,
          column: 23
        }
      },
      "68": {
        start: {
          line: 147,
          column: 4
        },
        end: {
          line: 147,
          column: 25
        }
      },
      "69": {
        start: {
          line: 151,
          column: 2
        },
        end: {
          line: 151,
          column: 14
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 32,
            column: 26
          },
          end: {
            line: 32,
            column: 27
          }
        },
        loc: {
          start: {
            line: 32,
            column: 56
          },
          end: {
            line: 152,
            column: 1
          }
        },
        line: 32
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 42,
            column: 4
          },
          end: {
            line: 43,
            column: 36
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 42,
            column: 4
          },
          end: {
            line: 43,
            column: 36
          }
        }, {
          start: {
            line: 42,
            column: 4
          },
          end: {
            line: 43,
            column: 36
          }
        }],
        line: 42
      },
      "1": {
        loc: {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 52,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 52,
            column: 5
          }
        }, {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 52,
            column: 5
          }
        }],
        line: 45
      },
      "2": {
        loc: {
          start: {
            line: 45,
            column: 7
          },
          end: {
            line: 45,
            column: 61
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 45,
            column: 7
          },
          end: {
            line: 45,
            column: 26
          }
        }, {
          start: {
            line: 45,
            column: 30
          },
          end: {
            line: 45,
            column: 61
          }
        }],
        line: 45
      },
      "3": {
        loc: {
          start: {
            line: 49,
            column: 6
          },
          end: {
            line: 51,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 49,
            column: 6
          },
          end: {
            line: 51,
            column: 7
          }
        }, {
          start: {
            line: 49,
            column: 6
          },
          end: {
            line: 51,
            column: 7
          }
        }],
        line: 49
      },
      "4": {
        loc: {
          start: {
            line: 49,
            column: 9
          },
          end: {
            line: 49,
            column: 41
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 49,
            column: 9
          },
          end: {
            line: 49,
            column: 21
          }
        }, {
          start: {
            line: 49,
            column: 25
          },
          end: {
            line: 49,
            column: 41
          }
        }],
        line: 49
      },
      "5": {
        loc: {
          start: {
            line: 58,
            column: 4
          },
          end: {
            line: 68,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 58,
            column: 4
          },
          end: {
            line: 68,
            column: 5
          }
        }, {
          start: {
            line: 58,
            column: 4
          },
          end: {
            line: 68,
            column: 5
          }
        }],
        line: 58
      },
      "6": {
        loc: {
          start: {
            line: 61,
            column: 11
          },
          end: {
            line: 68,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 61,
            column: 11
          },
          end: {
            line: 68,
            column: 5
          }
        }, {
          start: {
            line: 61,
            column: 11
          },
          end: {
            line: 68,
            column: 5
          }
        }],
        line: 61
      },
      "7": {
        loc: {
          start: {
            line: 64,
            column: 11
          },
          end: {
            line: 68,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 64,
            column: 11
          },
          end: {
            line: 68,
            column: 5
          }
        }, {
          start: {
            line: 64,
            column: 11
          },
          end: {
            line: 68,
            column: 5
          }
        }],
        line: 64
      },
      "8": {
        loc: {
          start: {
            line: 71,
            column: 4
          },
          end: {
            line: 136,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 71,
            column: 4
          },
          end: {
            line: 136,
            column: 5
          }
        }, {
          start: {
            line: 71,
            column: 4
          },
          end: {
            line: 136,
            column: 5
          }
        }],
        line: 71
      },
      "9": {
        loc: {
          start: {
            line: 71,
            column: 7
          },
          end: {
            line: 71,
            column: 25
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 71,
            column: 7
          },
          end: {
            line: 71,
            column: 14
          }
        }, {
          start: {
            line: 71,
            column: 18
          },
          end: {
            line: 71,
            column: 25
          }
        }],
        line: 71
      },
      "10": {
        loc: {
          start: {
            line: 77,
            column: 8
          },
          end: {
            line: 79,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 77,
            column: 8
          },
          end: {
            line: 79,
            column: 9
          }
        }, {
          start: {
            line: 77,
            column: 8
          },
          end: {
            line: 79,
            column: 9
          }
        }],
        line: 77
      },
      "11": {
        loc: {
          start: {
            line: 97,
            column: 8
          },
          end: {
            line: 99,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 97,
            column: 8
          },
          end: {
            line: 99,
            column: 9
          }
        }, {
          start: {
            line: 97,
            column: 8
          },
          end: {
            line: 99,
            column: 9
          }
        }],
        line: 97
      },
      "12": {
        loc: {
          start: {
            line: 97,
            column: 11
          },
          end: {
            line: 97,
            column: 47
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 97,
            column: 11
          },
          end: {
            line: 97,
            column: 27
          }
        }, {
          start: {
            line: 97,
            column: 31
          },
          end: {
            line: 97,
            column: 47
          }
        }],
        line: 97
      },
      "13": {
        loc: {
          start: {
            line: 110,
            column: 12
          },
          end: {
            line: 110,
            column: 48
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 110,
            column: 12
          },
          end: {
            line: 110,
            column: 28
          }
        }, {
          start: {
            line: 110,
            column: 32
          },
          end: {
            line: 110,
            column: 48
          }
        }],
        line: 110
      },
      "14": {
        loc: {
          start: {
            line: 117,
            column: 6
          },
          end: {
            line: 135,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 117,
            column: 6
          },
          end: {
            line: 135,
            column: 7
          }
        }, {
          start: {
            line: 117,
            column: 6
          },
          end: {
            line: 135,
            column: 7
          }
        }],
        line: 117
      },
      "15": {
        loc: {
          start: {
            line: 119,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 119,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }, {
          start: {
            line: 119,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }],
        line: 119
      },
      "16": {
        loc: {
          start: {
            line: 121,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 121,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }, {
          start: {
            line: 121,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }],
        line: 121
      },
      "17": {
        loc: {
          start: {
            line: 123,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 123,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }, {
          start: {
            line: 123,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }],
        line: 123
      },
      "18": {
        loc: {
          start: {
            line: 126,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 126,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }, {
          start: {
            line: 126,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }],
        line: 126
      },
      "19": {
        loc: {
          start: {
            line: 128,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 128,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }, {
          start: {
            line: 128,
            column: 13
          },
          end: {
            line: 135,
            column: 7
          }
        }],
        line: 128
      },
      "20": {
        loc: {
          start: {
            line: 130,
            column: 8
          },
          end: {
            line: 132,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 130,
            column: 8
          },
          end: {
            line: 132,
            column: 9
          }
        }, {
          start: {
            line: 130,
            column: 8
          },
          end: {
            line: 132,
            column: 9
          }
        }],
        line: 130
      },
      "21": {
        loc: {
          start: {
            line: 138,
            column: 4
          },
          end: {
            line: 144,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 138,
            column: 4
          },
          end: {
            line: 144,
            column: 5
          }
        }, {
          start: {
            line: 138,
            column: 4
          },
          end: {
            line: 144,
            column: 5
          }
        }],
        line: 138
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0,
      "60": 0,
      "61": 0,
      "62": 0,
      "63": 0,
      "64": 0,
      "65": 0,
      "66": 0,
      "67": 0,
      "68": 0,
      "69": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0, 0],
      "18": [0, 0],
      "19": [0, 0],
      "20": [0, 0],
      "21": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

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
var patNull = (cov_248w92trph.s[0]++, /^(None|null|Null|NULL)$/);
var patBooleanFalse = (cov_248w92trph.s[1]++, /^(false|False|FALSE)$/);
var patBooleanTrue = (cov_248w92trph.s[2]++, /^(true|True|TRUE)$/);
var patJid = (cov_248w92trph.s[3]++, /^[2-9][0-9][0-9][0-9][01][0-9][0-3][0-9][0-2][0-9][0-5][0-9][0-5][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/);
var patInteger = (cov_248w92trph.s[4]++, /^((0)|([-+]?[1-9][0-9]*))$/);
var patFloat = (cov_248w92trph.s[5]++, /^([-+]?(([0-9]+)|([0-9]+[.][0-9]*)|([0-9]*[.][0-9]+))([eE][-+]?[0-9]+)?)$/);
cov_248w92trph.s[6]++;

window.parseCommandLine = function (toRun, args, params) {
  cov_248w92trph.f[0]++;
  cov_248w92trph.s[7]++;
  // just in case the user typed some extra whitespace
  // at the start of the line
  toRun = toRun.trim();
  cov_248w92trph.s[8]++;

  while (toRun.length > 0) {
    var name = (cov_248w92trph.s[9]++, null);
    var firstSpaceChar = (cov_248w92trph.s[10]++, toRun.indexOf(" "));
    cov_248w92trph.s[11]++;

    if (firstSpaceChar < 0) {
      cov_248w92trph.b[0][0]++;
      cov_248w92trph.s[12]++;
      firstSpaceChar = toRun.length;
    } else {
      cov_248w92trph.b[0][1]++;
    }

    var firstEqualSign = (cov_248w92trph.s[13]++, toRun.indexOf("="));
    cov_248w92trph.s[14]++;

    if ((cov_248w92trph.b[2][0]++, firstEqualSign >= 0) && (cov_248w92trph.b[2][1]++, firstEqualSign < firstSpaceChar)) {
      cov_248w92trph.b[1][0]++;
      cov_248w92trph.s[15]++;
      // we have the name of a named parameter
      name = toRun.substr(0, firstEqualSign);
      cov_248w92trph.s[16]++;
      toRun = toRun.substr(firstEqualSign + 1);
      cov_248w92trph.s[17]++;

      if ((cov_248w92trph.b[4][0]++, toRun === "") || (cov_248w92trph.b[4][1]++, toRun[0] === " ")) {
        cov_248w92trph.b[3][0]++;
        cov_248w92trph.s[18]++;
        return "Must have value for named parameter '" + name + "'";
      } else {
        cov_248w92trph.b[3][1]++;
      }
    } else {
      cov_248w92trph.b[1][1]++;
    } // Determine whether the JSON string starts with a known
    // character for a JSON type


    var endChar = (cov_248w92trph.s[19]++, undefined);
    var objType = (cov_248w92trph.s[20]++, undefined);
    cov_248w92trph.s[21]++;

    if (toRun[0] === "{") {
      cov_248w92trph.b[5][0]++;
      cov_248w92trph.s[22]++;
      endChar = "}";
      cov_248w92trph.s[23]++;
      objType = "dictionary";
    } else {
      cov_248w92trph.b[5][1]++;
      cov_248w92trph.s[24]++;

      if (toRun[0] === "[") {
        cov_248w92trph.b[6][0]++;
        cov_248w92trph.s[25]++;
        endChar = "]";
        cov_248w92trph.s[26]++;
        objType = "array";
      } else {
        cov_248w92trph.b[6][1]++;
        cov_248w92trph.s[27]++;

        if (toRun[0] === "\"") {
          cov_248w92trph.b[7][0]++;
          cov_248w92trph.s[28]++;
          // note that json does not support single-quoted strings
          endChar = "\"";
          cov_248w92trph.s[29]++;
          objType = "double-quoted-string";
        } else {
          cov_248w92trph.b[7][1]++;
        }
      }
    }

    var value = void 0;
    cov_248w92trph.s[30]++;

    if ((cov_248w92trph.b[9][0]++, endChar) && (cov_248w92trph.b[9][1]++, objType)) {
      cov_248w92trph.b[8][0]++;
      // The string starts with a character for a known JSON type
      var p = (cov_248w92trph.s[31]++, 1);
      cov_248w92trph.s[32]++;

      while (true) {
        // Try until the next closing character
        var n = (cov_248w92trph.s[33]++, toRun.indexOf(endChar, p));
        cov_248w92trph.s[34]++;

        if (n < 0) {
          cov_248w92trph.b[10][0]++;
          cov_248w92trph.s[35]++;
          return "No valid " + objType + " found";
        } else {
          cov_248w92trph.b[10][1]++;
        } // parse what we have found so far
        // the string ends with a closing character
        // but that may not be enough, e.g. "{a:{}"


        var s = (cov_248w92trph.s[36]++, toRun.substring(0, n + 1));
        cov_248w92trph.s[37]++;

        try {
          cov_248w92trph.s[38]++;
          value = JSON.parse(s);
        } catch (err) {
          cov_248w92trph.s[39]++;
          // the string that we tried to parse is not valid json
          // continue to add more text from the input
          p = n + 1;
          cov_248w92trph.s[40]++;
          continue;
        } // the first part of the string is valid JSON


        cov_248w92trph.s[41]++;
        n = n + 1;
        cov_248w92trph.s[42]++;

        if ((cov_248w92trph.b[12][0]++, n < toRun.length) && (cov_248w92trph.b[12][1]++, toRun[n] !== " ")) {
          cov_248w92trph.b[11][0]++;
          cov_248w92trph.s[43]++;
          return "Valid " + objType + ", but followed by text:" + toRun.substring(n) + "...";
        } else {
          cov_248w92trph.b[11][1]++;
        } // valid JSON and not followed by strange characters


        cov_248w92trph.s[44]++;
        toRun = toRun.substring(n);
        cov_248w92trph.s[45]++;
        break;
      }
    } else {
      cov_248w92trph.b[8][1]++;
      // everything else is a string (without quotes)
      // when we are done, we'll see whether it actually is a number
      // or any of the known constants
      var str = (cov_248w92trph.s[46]++, "");
      cov_248w92trph.s[47]++;

      while ((cov_248w92trph.b[13][0]++, toRun.length > 0) && (cov_248w92trph.b[13][1]++, toRun[0] !== " ")) {
        cov_248w92trph.s[48]++;
        str += toRun[0];
        cov_248w92trph.s[49]++;
        toRun = toRun.substring(1);
      } // try to find whether the string is actually a known constant
      // or integer or float


      cov_248w92trph.s[50]++;

      if (patNull.test(str)) {
        cov_248w92trph.b[14][0]++;
        cov_248w92trph.s[51]++;
        value = null;
      } else {
        cov_248w92trph.b[14][1]++;
        cov_248w92trph.s[52]++;

        if (patBooleanFalse.test(str)) {
          cov_248w92trph.b[15][0]++;
          cov_248w92trph.s[53]++;
          value = false;
        } else {
          cov_248w92trph.b[15][1]++;
          cov_248w92trph.s[54]++;

          if (patBooleanTrue.test(str)) {
            cov_248w92trph.b[16][0]++;
            cov_248w92trph.s[55]++;
            value = true;
          } else {
            cov_248w92trph.b[16][1]++;
            cov_248w92trph.s[56]++;

            if (patJid.test(str)) {
              cov_248w92trph.b[17][0]++;
              cov_248w92trph.s[57]++;
              // jids look like numbers but must be strings
              value = str;
            } else {
              cov_248w92trph.b[17][1]++;
              cov_248w92trph.s[58]++;

              if (patInteger.test(str)) {
                cov_248w92trph.b[18][0]++;
                cov_248w92trph.s[59]++;
                value = parseInt(str);
              } else {
                cov_248w92trph.b[18][1]++;
                cov_248w92trph.s[60]++;

                if (patFloat.test(str)) {
                  cov_248w92trph.b[19][0]++;
                  cov_248w92trph.s[61]++;
                  value = parseFloat(str);
                  cov_248w92trph.s[62]++;

                  if (!isFinite(value)) {
                    cov_248w92trph.b[20][0]++;
                    cov_248w92trph.s[63]++;
                    return "Numeric argument has overflowed or is infinity";
                  } else {
                    cov_248w92trph.b[20][1]++;
                  }
                } else {
                  cov_248w92trph.b[19][1]++;
                  cov_248w92trph.s[64]++;
                  value = str;
                }
              }
            }
          }
        }
      }
    }

    cov_248w92trph.s[65]++;

    if (name !== null) {
      cov_248w92trph.b[21][0]++;
      cov_248w92trph.s[66]++;
      // named parameter
      params[name] = value;
    } else {
      cov_248w92trph.b[21][1]++;
      cov_248w92trph.s[67]++;
      // anonymous parameter
      args.push(value);
    } // ignore the whitespace before the next part


    cov_248w92trph.s[68]++;
    toRun = toRun.trim();
  } // succesfull (no error message return)


  cov_248w92trph.s[69]++;
  return null;
};

/***/ }),

/***/ "./saltgui/static/scripts/Utils.js":
/*!*****************************************!*\
  !*** ./saltgui/static/scripts/Utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var cov_tl08g841j = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/Utils.js";
  var hash = "56a015e044b5e44cc7b19ce002c1c607c78dfbc0";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/Utils.js",
    statementMap: {
      "0": {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 34,
          column: 2
        }
      },
      "1": {
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 33,
          column: 3
        }
      },
      "2": {
        start: {
          line: 3,
          column: 26
        },
        end: {
          line: 3,
          column: 81
        }
      },
      "3": {
        start: {
          line: 5,
          column: 4
        },
        end: {
          line: 5,
          column: 64
        }
      },
      "4": {
        start: {
          line: 5,
          column: 26
        },
        end: {
          line: 5,
          column: 64
        }
      },
      "5": {
        start: {
          line: 6,
          column: 4
        },
        end: {
          line: 6,
          column: 54
        }
      },
      "6": {
        start: {
          line: 6,
          column: 27
        },
        end: {
          line: 6,
          column: 54
        }
      },
      "7": {
        start: {
          line: 7,
          column: 4
        },
        end: {
          line: 7,
          column: 55
        }
      },
      "8": {
        start: {
          line: 7,
          column: 28
        },
        end: {
          line: 7,
          column: 55
        }
      },
      "9": {
        start: {
          line: 9,
          column: 4
        },
        end: {
          line: 12,
          column: 5
        }
      },
      "10": {
        start: {
          line: 10,
          column: 22
        },
        end: {
          line: 10,
          column: 52
        }
      },
      "11": {
        start: {
          line: 11,
          column: 6
        },
        end: {
          line: 11,
          column: 40
        }
      },
      "12": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 17,
          column: 5
        }
      },
      "13": {
        start: {
          line: 15,
          column: 20
        },
        end: {
          line: 15,
          column: 55
        }
      },
      "14": {
        start: {
          line: 16,
          column: 6
        },
        end: {
          line: 16,
          column: 36
        }
      },
      "15": {
        start: {
          line: 19,
          column: 4
        },
        end: {
          line: 21,
          column: 5
        }
      },
      "16": {
        start: {
          line: 20,
          column: 6
        },
        end: {
          line: 20,
          column: 25
        }
      },
      "17": {
        start: {
          line: 23,
          column: 4
        },
        end: {
          line: 26,
          column: 5
        }
      },
      "18": {
        start: {
          line: 24,
          column: 19
        },
        end: {
          line: 24,
          column: 59
        }
      },
      "19": {
        start: {
          line: 25,
          column: 6
        },
        end: {
          line: 25,
          column: 32
        }
      },
      "20": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 28,
          column: 56
        }
      },
      "21": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 46
        }
      },
      "22": {
        start: {
          line: 36,
          column: 0
        },
        end: {
          line: 41,
          column: 2
        }
      },
      "23": {
        start: {
          line: 37,
          column: 18
        },
        end: {
          line: 37,
          column: 46
        }
      },
      "24": {
        start: {
          line: 38,
          column: 2
        },
        end: {
          line: 38,
          column: 35
        }
      },
      "25": {
        start: {
          line: 39,
          column: 2
        },
        end: {
          line: 39,
          column: 49
        }
      },
      "26": {
        start: {
          line: 39,
          column: 21
        },
        end: {
          line: 39,
          column: 49
        }
      },
      "27": {
        start: {
          line: 40,
          column: 2
        },
        end: {
          line: 40,
          column: 17
        }
      },
      "28": {
        start: {
          line: 43,
          column: 0
        },
        end: {
          line: 52,
          column: 2
        }
      },
      "29": {
        start: {
          line: 44,
          column: 15
        },
        end: {
          line: 44,
          column: 17
        }
      },
      "30": {
        start: {
          line: 45,
          column: 17
        },
        end: {
          line: 45,
          column: 93
        }
      },
      "31": {
        start: {
          line: 46,
          column: 2
        },
        end: {
          line: 50,
          column: 3
        }
      },
      "32": {
        start: {
          line: 47,
          column: 22
        },
        end: {
          line: 47,
          column: 37
        }
      },
      "33": {
        start: {
          line: 48,
          column: 4
        },
        end: {
          line: 48,
          column: 28
        }
      },
      "34": {
        start: {
          line: 49,
          column: 4
        },
        end: {
          line: 49,
          column: 50
        }
      },
      "35": {
        start: {
          line: 49,
          column: 30
        },
        end: {
          line: 49,
          column: 50
        }
      },
      "36": {
        start: {
          line: 51,
          column: 2
        },
        end: {
          line: 51,
          column: 19
        }
      },
      "37": {
        start: {
          line: 54,
          column: 0
        },
        end: {
          line: 58,
          column: 2
        }
      },
      "38": {
        start: {
          line: 55,
          column: 14
        },
        end: {
          line: 55,
          column: 43
        }
      },
      "39": {
        start: {
          line: 56,
          column: 2
        },
        end: {
          line: 56,
          column: 50
        }
      },
      "40": {
        start: {
          line: 57,
          column: 2
        },
        end: {
          line: 57,
          column: 23
        }
      },
      "41": {
        start: {
          line: 60,
          column: 0
        },
        end: {
          line: 76,
          column: 2
        }
      },
      "42": {
        start: {
          line: 70,
          column: 19
        },
        end: {
          line: 70,
          column: 21
        }
      },
      "43": {
        start: {
          line: 71,
          column: 2
        },
        end: {
          line: 73,
          column: 3
        }
      },
      "44": {
        start: {
          line: 72,
          column: 4
        },
        end: {
          line: 72,
          column: 34
        }
      },
      "45": {
        start: {
          line: 74,
          column: 2
        },
        end: {
          line: 74,
          column: 30
        }
      },
      "46": {
        start: {
          line: 75,
          column: 2
        },
        end: {
          line: 75,
          column: 20
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 1,
            column: 25
          },
          end: {
            line: 1,
            column: 26
          }
        },
        loc: {
          start: {
            line: 1,
            column: 40
          },
          end: {
            line: 34,
            column: 1
          }
        },
        line: 1
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 36,
            column: 23
          },
          end: {
            line: 36,
            column: 24
          }
        },
        loc: {
          start: {
            line: 36,
            column: 58
          },
          end: {
            line: 41,
            column: 1
          }
        },
        line: 36
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 43,
            column: 23
          },
          end: {
            line: 43,
            column: 24
          }
        },
        loc: {
          start: {
            line: 43,
            column: 38
          },
          end: {
            line: 52,
            column: 1
          }
        },
        line: 43
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 54,
            column: 16
          },
          end: {
            line: 54,
            column: 17
          }
        },
        loc: {
          start: {
            line: 54,
            column: 32
          },
          end: {
            line: 58,
            column: 1
          }
        },
        line: 54
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 60,
            column: 24
          },
          end: {
            line: 60,
            column: 25
          }
        },
        loc: {
          start: {
            line: 60,
            column: 60
          },
          end: {
            line: 76,
            column: 1
          }
        },
        line: 60
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 5,
            column: 4
          },
          end: {
            line: 5,
            column: 64
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 5,
            column: 4
          },
          end: {
            line: 5,
            column: 64
          }
        }, {
          start: {
            line: 5,
            column: 4
          },
          end: {
            line: 5,
            column: 64
          }
        }],
        line: 5
      },
      "1": {
        loc: {
          start: {
            line: 6,
            column: 4
          },
          end: {
            line: 6,
            column: 54
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 6,
            column: 4
          },
          end: {
            line: 6,
            column: 54
          }
        }, {
          start: {
            line: 6,
            column: 4
          },
          end: {
            line: 6,
            column: 54
          }
        }],
        line: 6
      },
      "2": {
        loc: {
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 55
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 55
          }
        }, {
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 55
          }
        }],
        line: 7
      },
      "3": {
        loc: {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 12,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 12,
            column: 5
          }
        }, {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 12,
            column: 5
          }
        }],
        line: 9
      },
      "4": {
        loc: {
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 17,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 17,
            column: 5
          }
        }, {
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 17,
            column: 5
          }
        }],
        line: 14
      },
      "5": {
        loc: {
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 21,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 21,
            column: 5
          }
        }, {
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 21,
            column: 5
          }
        }],
        line: 19
      },
      "6": {
        loc: {
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 26,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 26,
            column: 5
          }
        }, {
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 26,
            column: 5
          }
        }],
        line: 23
      },
      "7": {
        loc: {
          start: {
            line: 39,
            column: 2
          },
          end: {
            line: 39,
            column: 49
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 39,
            column: 2
          },
          end: {
            line: 39,
            column: 49
          }
        }, {
          start: {
            line: 39,
            column: 2
          },
          end: {
            line: 39,
            column: 49
          }
        }],
        line: 39
      },
      "8": {
        loc: {
          start: {
            line: 49,
            column: 4
          },
          end: {
            line: 49,
            column: 50
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 49,
            column: 4
          },
          end: {
            line: 49,
            column: 50
          }
        }, {
          start: {
            line: 49,
            column: 4
          },
          end: {
            line: 49,
            column: 50
          }
        }],
        line: 49
      },
      "9": {
        loc: {
          start: {
            line: 71,
            column: 2
          },
          end: {
            line: 73,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 71,
            column: 2
          },
          end: {
            line: 73,
            column: 3
          }
        }, {
          start: {
            line: 71,
            column: 2
          },
          end: {
            line: 73,
            column: 3
          }
        }],
        line: 71
      },
      "10": {
        loc: {
          start: {
            line: 71,
            column: 5
          },
          end: {
            line: 71,
            column: 51
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 71,
            column: 5
          },
          end: {
            line: 71,
            column: 26
          }
        }, {
          start: {
            line: 71,
            column: 30
          },
          end: {
            line: 71,
            column: 51
          }
        }],
        line: 71
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_tl08g841j.s[0]++;

window.elapsedToString = function (date) {
  cov_tl08g841j.f[0]++;
  cov_tl08g841j.s[1]++;

  try {
    var secondsPassed = (cov_tl08g841j.s[2]++, new Date().getTime() / 1000 - date.getTime() / 1000);
    cov_tl08g841j.s[3]++;

    if (secondsPassed < 0) {
      cov_tl08g841j.b[0][0]++;
      cov_tl08g841j.s[4]++;
      return "Magic happened in the future";
    } else {
      cov_tl08g841j.b[0][1]++;
    }

    cov_tl08g841j.s[5]++;

    if (secondsPassed < 20) {
      cov_tl08g841j.b[1][0]++;
      cov_tl08g841j.s[6]++;
      return "A few moments ago";
    } else {
      cov_tl08g841j.b[1][1]++;
    }

    cov_tl08g841j.s[7]++;

    if (secondsPassed < 120) {
      cov_tl08g841j.b[2][0]++;
      cov_tl08g841j.s[8]++;
      return "A few minutes ago";
    } else {
      cov_tl08g841j.b[2][1]++;
    }

    cov_tl08g841j.s[9]++;

    if (secondsPassed < 60 * 60) {
      cov_tl08g841j.b[3][0]++;
      var minutes = (cov_tl08g841j.s[10]++, Math.round(secondsPassed / 60));
      cov_tl08g841j.s[11]++;
      return minutes + " minute(s) ago";
    } else {
      cov_tl08g841j.b[3][1]++;
    }

    cov_tl08g841j.s[12]++;

    if (secondsPassed < 60 * 60 * 24) {
      cov_tl08g841j.b[4][0]++;
      var hours = (cov_tl08g841j.s[13]++, Math.round(secondsPassed / 60 / 60));
      cov_tl08g841j.s[14]++;
      return hours + " hour(s) ago";
    } else {
      cov_tl08g841j.b[4][1]++;
    }

    cov_tl08g841j.s[15]++;

    if (secondsPassed < 60 * 60 * 24 * 2) {
      cov_tl08g841j.b[5][0]++;
      cov_tl08g841j.s[16]++;
      return "Yesterday";
    } else {
      cov_tl08g841j.b[5][1]++;
    }

    cov_tl08g841j.s[17]++;

    if (secondsPassed < 60 * 60 * 24 * 30) {
      cov_tl08g841j.b[6][0]++;
      var days = (cov_tl08g841j.s[18]++, Math.round(secondsPassed / 60 / 60 / 24));
      cov_tl08g841j.s[19]++;
      return days + " days ago";
    } else {
      cov_tl08g841j.b[6][1]++;
    }

    cov_tl08g841j.s[20]++;
    return "A long time ago, in a galaxy far, far away";
  } catch (err) {
    cov_tl08g841j.s[21]++;
    //console.error(err);
    return "It did happen, when I don't know";
  }
};

cov_tl08g841j.s[22]++;

window.createElement = function (type, className, content) {
  cov_tl08g841j.f[1]++;
  var element = (cov_tl08g841j.s[23]++, document.createElement(type));
  cov_tl08g841j.s[24]++;
  element.classList.add(className);
  cov_tl08g841j.s[25]++;

  if (content !== "") {
    cov_tl08g841j.b[7][0]++;
    cov_tl08g841j.s[26]++;
    element.innerHTML = content;
  } else {
    cov_tl08g841j.b[7][1]++;
  }

  cov_tl08g841j.s[27]++;
  return element;
};

cov_tl08g841j.s[28]++;

window.getQueryParam = function (name) {
  cov_tl08g841j.f[2]++;
  var vars = (cov_tl08g841j.s[29]++, []);
  var hashes = (cov_tl08g841j.s[30]++, window.location.href.slice(window.location.href.indexOf("?") + 1).split("&"));
  cov_tl08g841j.s[31]++;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = hashes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var hash = _step.value;
      var hashparts = (cov_tl08g841j.s[32]++, hash.split("="));
      cov_tl08g841j.s[33]++;
      vars.push(hashparts[0]);
      cov_tl08g841j.s[34]++;

      if (hashparts[0] === name) {
        cov_tl08g841j.b[8][0]++;
        cov_tl08g841j.s[35]++;
        return hashparts[1];
      } else {
        cov_tl08g841j.b[8][1]++;
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

  cov_tl08g841j.s[36]++;
  return undefined;
};

cov_tl08g841j.s[37]++;

window.escape = function (input) {
  cov_tl08g841j.f[3]++;
  var div = (cov_tl08g841j.s[38]++, document.createElement("div"));
  cov_tl08g841j.s[39]++;
  div.appendChild(document.createTextNode(input));
  cov_tl08g841j.s[40]++;
  return div.innerHTML;
};

cov_tl08g841j.s[41]++;

window.makeTargetText = function (targetType, targetPattern) {
  cov_tl08g841j.f[4]++;
  // note that "glob" is the most common case
  // when used from the command-line, that target-type
  // is not even specified.
  // therefore we suppress that one
  // note that due to bug in 2018.3, all finished jobs
  // will be shown as if of type "list"
  // therefore we suppress that one
  var returnText = (cov_tl08g841j.s[42]++, "");
  cov_tl08g841j.s[43]++;

  if ((cov_tl08g841j.b[10][0]++, targetType !== "glob") && (cov_tl08g841j.b[10][1]++, targetType !== "list")) {
    cov_tl08g841j.b[9][0]++;
    cov_tl08g841j.s[44]++;
    returnText = targetType + " ";
  } else {
    cov_tl08g841j.b[9][1]++;
  }

  cov_tl08g841j.s[45]++;
  returnText += targetPattern;
  cov_tl08g841j.s[46]++;
  return returnText;
};

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
var cov_htu99tt8w = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/Output.js";
  var hash = "bdab442d4481a57409f0bc77c23c2b006add5c8c";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/Output.js",
    statementMap: {
      "0": {
        start: {
          line: 32,
          column: 33
        },
        end: {
          line: 32,
          column: 37
        }
      },
      "1": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 34,
          column: 99
        }
      },
      "2": {
        start: {
          line: 34,
          column: 28
        },
        end: {
          line: 34,
          column: 99
        }
      },
      "3": {
        start: {
          line: 35,
          column: 4
        },
        end: {
          line: 35,
          column: 77
        }
      },
      "4": {
        start: {
          line: 35,
          column: 47
        },
        end: {
          line: 35,
          column: 77
        }
      },
      "5": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 36,
          column: 93
        }
      },
      "6": {
        start: {
          line: 36,
          column: 40
        },
        end: {
          line: 36,
          column: 93
        }
      },
      "7": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 37,
          column: 66
        }
      },
      "8": {
        start: {
          line: 45,
          column: 4
        },
        end: {
          line: 48,
          column: 5
        }
      },
      "9": {
        start: {
          line: 47,
          column: 6
        },
        end: {
          line: 47,
          column: 36
        }
      },
      "10": {
        start: {
          line: 50,
          column: 4
        },
        end: {
          line: 53,
          column: 5
        }
      },
      "11": {
        start: {
          line: 52,
          column: 6
        },
        end: {
          line: 52,
          column: 35
        }
      },
      "12": {
        start: {
          line: 56,
          column: 4
        },
        end: {
          line: 56,
          column: 20
        }
      },
      "13": {
        start: {
          line: 61,
          column: 17
        },
        end: {
          line: 61,
          column: 47
        }
      },
      "14": {
        start: {
          line: 62,
          column: 4
        },
        end: {
          line: 62,
          column: 35
        }
      },
      "15": {
        start: {
          line: 63,
          column: 4
        },
        end: {
          line: 63,
          column: 50
        }
      },
      "16": {
        start: {
          line: 63,
          column: 19
        },
        end: {
          line: 63,
          column: 50
        }
      },
      "17": {
        start: {
          line: 64,
          column: 4
        },
        end: {
          line: 64,
          column: 30
        }
      },
      "18": {
        start: {
          line: 65,
          column: 4
        },
        end: {
          line: 65,
          column: 16
        }
      },
      "19": {
        start: {
          line: 72,
          column: 4
        },
        end: {
          line: 72,
          column: 58
        }
      },
      "20": {
        start: {
          line: 77,
          column: 4
        },
        end: {
          line: 82,
          column: 5
        }
      },
      "21": {
        start: {
          line: 78,
          column: 16
        },
        end: {
          line: 78,
          column: 43
        }
      },
      "22": {
        start: {
          line: 79,
          column: 6
        },
        end: {
          line: 79,
          column: 61
        }
      },
      "23": {
        start: {
          line: 80,
          column: 6
        },
        end: {
          line: 80,
          column: 33
        }
      },
      "24": {
        start: {
          line: 81,
          column: 6
        },
        end: {
          line: 81,
          column: 15
        }
      },
      "25": {
        start: {
          line: 85,
          column: 17
        },
        end: {
          line: 85,
          column: 47
        }
      },
      "26": {
        start: {
          line: 86,
          column: 4
        },
        end: {
          line: 86,
          column: 34
        }
      },
      "27": {
        start: {
          line: 87,
          column: 4
        },
        end: {
          line: 87,
          column: 16
        }
      },
      "28": {
        start: {
          line: 93,
          column: 4
        },
        end: {
          line: 95,
          column: 5
        }
      },
      "29": {
        start: {
          line: 94,
          column: 6
        },
        end: {
          line: 94,
          column: 40
        }
      },
      "30": {
        start: {
          line: 97,
          column: 4
        },
        end: {
          line: 99,
          column: 5
        }
      },
      "31": {
        start: {
          line: 98,
          column: 6
        },
        end: {
          line: 98,
          column: 40
        }
      },
      "32": {
        start: {
          line: 101,
          column: 4
        },
        end: {
          line: 103,
          column: 5
        }
      },
      "33": {
        start: {
          line: 102,
          column: 6
        },
        end: {
          line: 102,
          column: 44
        }
      },
      "34": {
        start: {
          line: 106,
          column: 4
        },
        end: {
          line: 106,
          column: 38
        }
      },
      "35": {
        start: {
          line: 114,
          column: 20
        },
        end: {
          line: 114,
          column: 53
        }
      },
      "36": {
        start: {
          line: 115,
          column: 20
        },
        end: {
          line: 115,
          column: 83
        }
      },
      "37": {
        start: {
          line: 116,
          column: 4
        },
        end: {
          line: 116,
          column: 32
        }
      },
      "38": {
        start: {
          line: 117,
          column: 4
        },
        end: {
          line: 117,
          column: 19
        }
      },
      "39": {
        start: {
          line: 122,
          column: 4
        },
        end: {
          line: 124,
          column: 5
        }
      },
      "40": {
        start: {
          line: 123,
          column: 6
        },
        end: {
          line: 123,
          column: 19
        }
      },
      "41": {
        start: {
          line: 125,
          column: 4
        },
        end: {
          line: 129,
          column: 5
        }
      },
      "42": {
        start: {
          line: 126,
          column: 6
        },
        end: {
          line: 128,
          column: 7
        }
      },
      "43": {
        start: {
          line: 127,
          column: 8
        },
        end: {
          line: 127,
          column: 21
        }
      },
      "44": {
        start: {
          line: 130,
          column: 4
        },
        end: {
          line: 130,
          column: 16
        }
      },
      "45": {
        start: {
          line: 135,
          column: 15
        },
        end: {
          line: 135,
          column: 36
        }
      },
      "46": {
        start: {
          line: 136,
          column: 4
        },
        end: {
          line: 136,
          column: 39
        }
      },
      "47": {
        start: {
          line: 136,
          column: 26
        },
        end: {
          line: 136,
          column: 39
        }
      },
      "48": {
        start: {
          line: 137,
          column: 4
        },
        end: {
          line: 137,
          column: 23
        }
      },
      "49": {
        start: {
          line: 138,
          column: 4
        },
        end: {
          line: 138,
          column: 39
        }
      },
      "50": {
        start: {
          line: 138,
          column: 26
        },
        end: {
          line: 138,
          column: 39
        }
      },
      "51": {
        start: {
          line: 139,
          column: 4
        },
        end: {
          line: 139,
          column: 43
        }
      },
      "52": {
        start: {
          line: 139,
          column: 30
        },
        end: {
          line: 139,
          column: 43
        }
      },
      "53": {
        start: {
          line: 140,
          column: 4
        },
        end: {
          line: 140,
          column: 16
        }
      },
      "54": {
        start: {
          line: 153,
          column: 41
        },
        end: {
          line: 153,
          column: 96
        }
      },
      "55": {
        start: {
          line: 154,
          column: 4
        },
        end: {
          line: 154,
          column: 57
        }
      },
      "56": {
        start: {
          line: 154,
          column: 46
        },
        end: {
          line: 154,
          column: 57
        }
      },
      "57": {
        start: {
          line: 157,
          column: 38
        },
        end: {
          line: 157,
          column: 83
        }
      },
      "58": {
        start: {
          line: 158,
          column: 4
        },
        end: {
          line: 158,
          column: 54
        }
      },
      "59": {
        start: {
          line: 158,
          column: 43
        },
        end: {
          line: 158,
          column: 54
        }
      },
      "60": {
        start: {
          line: 161,
          column: 4
        },
        end: {
          line: 161,
          column: 72
        }
      },
      "61": {
        start: {
          line: 161,
          column: 40
        },
        end: {
          line: 161,
          column: 72
        }
      },
      "62": {
        start: {
          line: 162,
          column: 4
        },
        end: {
          line: 162,
          column: 72
        }
      },
      "63": {
        start: {
          line: 162,
          column: 40
        },
        end: {
          line: 162,
          column: 72
        }
      },
      "64": {
        start: {
          line: 165,
          column: 17
        },
        end: {
          line: 165,
          column: 33
        }
      },
      "65": {
        start: {
          line: 166,
          column: 4
        },
        end: {
          line: 166,
          column: 30
        }
      },
      "66": {
        start: {
          line: 166,
          column: 19
        },
        end: {
          line: 166,
          column: 30
        }
      },
      "67": {
        start: {
          line: 169,
          column: 4
        },
        end: {
          line: 169,
          column: 54
        }
      },
      "68": {
        start: {
          line: 169,
          column: 42
        },
        end: {
          line: 169,
          column: 54
        }
      },
      "69": {
        start: {
          line: 171,
          column: 4
        },
        end: {
          line: 171,
          column: 70
        }
      },
      "70": {
        start: {
          line: 180,
          column: 4
        },
        end: {
          line: 180,
          column: 35
        }
      },
      "71": {
        start: {
          line: 183,
          column: 4
        },
        end: {
          line: 183,
          column: 58
        }
      },
      "72": {
        start: {
          line: 185,
          column: 4
        },
        end: {
          line: 189,
          column: 5
        }
      },
      "73": {
        start: {
          line: 187,
          column: 6
        },
        end: {
          line: 187,
          column: 43
        }
      },
      "74": {
        start: {
          line: 188,
          column: 6
        },
        end: {
          line: 188,
          column: 13
        }
      },
      "75": {
        start: {
          line: 191,
          column: 4
        },
        end: {
          line: 194,
          column: 5
        }
      },
      "76": {
        start: {
          line: 192,
          column: 6
        },
        end: {
          line: 192,
          column: 64
        }
      },
      "77": {
        start: {
          line: 193,
          column: 6
        },
        end: {
          line: 193,
          column: 13
        }
      },
      "78": {
        start: {
          line: 197,
          column: 23
        },
        end: {
          line: 197,
          column: 64
        }
      },
      "79": {
        start: {
          line: 198,
          column: 34
        },
        end: {
          line: 198,
          column: 105
        }
      },
      "80": {
        start: {
          line: 199,
          column: 4
        },
        end: {
          line: 203,
          column: 5
        }
      },
      "81": {
        start: {
          line: 200,
          column: 6
        },
        end: {
          line: 200,
          column: 86
        }
      },
      "82": {
        start: {
          line: 201,
          column: 6
        },
        end: {
          line: 201,
          column: 76
        }
      },
      "83": {
        start: {
          line: 202,
          column: 6
        },
        end: {
          line: 202,
          column: 13
        }
      },
      "84": {
        start: {
          line: 205,
          column: 19
        },
        end: {
          line: 205,
          column: 48
        }
      },
      "85": {
        start: {
          line: 207,
          column: 4
        },
        end: {
          line: 238,
          column: 5
        }
      },
      "86": {
        start: {
          line: 212,
          column: 19
        },
        end: {
          line: 212,
          column: 49
        }
      },
      "87": {
        start: {
          line: 214,
          column: 27
        },
        end: {
          line: 214,
          column: 55
        }
      },
      "88": {
        start: {
          line: 215,
          column: 25
        },
        end: {
          line: 215,
          column: 39
        }
      },
      "89": {
        start: {
          line: 219,
          column: 6
        },
        end: {
          line: 223,
          column: 7
        }
      },
      "90": {
        start: {
          line: 220,
          column: 8
        },
        end: {
          line: 220,
          column: 41
        }
      },
      "91": {
        start: {
          line: 222,
          column: 8
        },
        end: {
          line: 222,
          column: 42
        }
      },
      "92": {
        start: {
          line: 225,
          column: 6
        },
        end: {
          line: 227,
          column: 7
        }
      },
      "93": {
        start: {
          line: 226,
          column: 8
        },
        end: {
          line: 226,
          column: 72
        }
      },
      "94": {
        start: {
          line: 229,
          column: 6
        },
        end: {
          line: 231,
          column: 7
        }
      },
      "95": {
        start: {
          line: 230,
          column: 8
        },
        end: {
          line: 230,
          column: 49
        }
      },
      "96": {
        start: {
          line: 234,
          column: 6
        },
        end: {
          line: 234,
          column: 22
        }
      },
      "97": {
        start: {
          line: 236,
          column: 6
        },
        end: {
          line: 236,
          column: 27
        }
      },
      "98": {
        start: {
          line: 237,
          column: 6
        },
        end: {
          line: 237,
          column: 31
        }
      },
      "99": {
        start: {
          line: 240,
          column: 27
        },
        end: {
          line: 240,
          column: 57
        }
      },
      "100": {
        start: {
          line: 241,
          column: 4
        },
        end: {
          line: 241,
          column: 40
        }
      },
      "101": {
        start: {
          line: 242,
          column: 4
        },
        end: {
          line: 242,
          column: 45
        }
      },
      "102": {
        start: {
          line: 243,
          column: 4
        },
        end: {
          line: 243,
          column: 39
        }
      },
      "103": {
        start: {
          line: 245,
          column: 4
        },
        end: {
          line: 245,
          column: 40
        }
      },
      "104": {
        start: {
          line: 247,
          column: 4
        },
        end: {
          line: 269,
          column: 7
        }
      },
      "105": {
        start: {
          line: 250,
          column: 6
        },
        end: {
          line: 254,
          column: 7
        }
      },
      "106": {
        start: {
          line: 251,
          column: 8
        },
        end: {
          line: 251,
          column: 44
        }
      },
      "107": {
        start: {
          line: 253,
          column: 8
        },
        end: {
          line: 253,
          column: 44
        }
      },
      "108": {
        start: {
          line: 256,
          column: 6
        },
        end: {
          line: 268,
          column: 7
        }
      },
      "109": {
        start: {
          line: 258,
          column: 23
        },
        end: {
          line: 258,
          column: 61
        }
      },
      "110": {
        start: {
          line: 259,
          column: 8
        },
        end: {
          line: 259,
          column: 41
        }
      },
      "111": {
        start: {
          line: 259,
          column: 32
        },
        end: {
          line: 259,
          column: 41
        }
      },
      "112": {
        start: {
          line: 261,
          column: 19
        },
        end: {
          line: 261,
          column: 28
        }
      },
      "113": {
        start: {
          line: 262,
          column: 8
        },
        end: {
          line: 262,
          column: 43
        }
      },
      "114": {
        start: {
          line: 262,
          column: 34
        },
        end: {
          line: 262,
          column: 43
        }
      },
      "115": {
        start: {
          line: 264,
          column: 8
        },
        end: {
          line: 264,
          column: 63
        }
      },
      "116": {
        start: {
          line: 264,
          column: 54
        },
        end: {
          line: 264,
          column: 63
        }
      },
      "117": {
        start: {
          line: 266,
          column: 20
        },
        end: {
          line: 266,
          column: 47
        }
      },
      "118": {
        start: {
          line: 267,
          column: 8
        },
        end: {
          line: 267,
          column: 30
        }
      },
      "119": {
        start: {
          line: 271,
          column: 28
        },
        end: {
          line: 271,
          column: 29
        }
      },
      "120": {
        start: {
          line: 275,
          column: 4
        },
        end: {
          line: 398,
          column: 5
        }
      },
      "121": {
        start: {
          line: 277,
          column: 24
        },
        end: {
          line: 277,
          column: 28
        }
      },
      "122": {
        start: {
          line: 278,
          column: 22
        },
        end: {
          line: 278,
          column: 23
        }
      },
      "123": {
        start: {
          line: 280,
          column: 25
        },
        end: {
          line: 280,
          column: 43
        }
      },
      "124": {
        start: {
          line: 281,
          column: 6
        },
        end: {
          line: 286,
          column: 7
        }
      },
      "125": {
        start: {
          line: 282,
          column: 8
        },
        end: {
          line: 282,
          column: 43
        }
      },
      "126": {
        start: {
          line: 284,
          column: 11
        },
        end: {
          line: 286,
          column: 7
        }
      },
      "127": {
        start: {
          line: 285,
          column: 8
        },
        end: {
          line: 285,
          column: 50
        }
      },
      "128": {
        start: {
          line: 288,
          column: 23
        },
        end: {
          line: 288,
          column: 27
        }
      },
      "129": {
        start: {
          line: 289,
          column: 26
        },
        end: {
          line: 289,
          column: 30
        }
      },
      "130": {
        start: {
          line: 290,
          column: 30
        },
        end: {
          line: 290,
          column: 35
        }
      },
      "131": {
        start: {
          line: 295,
          column: 22
        },
        end: {
          line: 295,
          column: 36
        }
      },
      "132": {
        start: {
          line: 296,
          column: 6
        },
        end: {
          line: 296,
          column: 48
        }
      },
      "133": {
        start: {
          line: 296,
          column: 21
        },
        end: {
          line: 296,
          column: 48
        }
      },
      "134": {
        start: {
          line: 297,
          column: 6
        },
        end: {
          line: 297,
          column: 75
        }
      },
      "135": {
        start: {
          line: 297,
          column: 45
        },
        end: {
          line: 297,
          column: 75
        }
      },
      "136": {
        start: {
          line: 298,
          column: 22
        },
        end: {
          line: 298,
          column: 65
        }
      },
      "137": {
        start: {
          line: 300,
          column: 6
        },
        end: {
          line: 303,
          column: 7
        }
      },
      "138": {
        start: {
          line: 301,
          column: 8
        },
        end: {
          line: 301,
          column: 59
        }
      },
      "139": {
        start: {
          line: 302,
          column: 8
        },
        end: {
          line: 302,
          column: 33
        }
      },
      "140": {
        start: {
          line: 305,
          column: 6
        },
        end: {
          line: 309,
          column: 7
        }
      },
      "141": {
        start: {
          line: 306,
          column: 8
        },
        end: {
          line: 306,
          column: 56
        }
      },
      "142": {
        start: {
          line: 307,
          column: 8
        },
        end: {
          line: 307,
          column: 52
        }
      },
      "143": {
        start: {
          line: 308,
          column: 8
        },
        end: {
          line: 308,
          column: 33
        }
      },
      "144": {
        start: {
          line: 311,
          column: 6
        },
        end: {
          line: 315,
          column: 7
        }
      },
      "145": {
        start: {
          line: 312,
          column: 8
        },
        end: {
          line: 312,
          column: 58
        }
      },
      "146": {
        start: {
          line: 313,
          column: 8
        },
        end: {
          line: 313,
          column: 30
        }
      },
      "147": {
        start: {
          line: 314,
          column: 8
        },
        end: {
          line: 314,
          column: 33
        }
      },
      "148": {
        start: {
          line: 318,
          column: 6
        },
        end: {
          line: 322,
          column: 7
        }
      },
      "149": {
        start: {
          line: 319,
          column: 8
        },
        end: {
          line: 319,
          column: 58
        }
      },
      "150": {
        start: {
          line: 320,
          column: 8
        },
        end: {
          line: 320,
          column: 30
        }
      },
      "151": {
        start: {
          line: 321,
          column: 8
        },
        end: {
          line: 321,
          column: 33
        }
      },
      "152": {
        start: {
          line: 325,
          column: 6
        },
        end: {
          line: 329,
          column: 7
        }
      },
      "153": {
        start: {
          line: 326,
          column: 8
        },
        end: {
          line: 326,
          column: 58
        }
      },
      "154": {
        start: {
          line: 327,
          column: 8
        },
        end: {
          line: 327,
          column: 48
        }
      },
      "155": {
        start: {
          line: 328,
          column: 8
        },
        end: {
          line: 328,
          column: 33
        }
      },
      "156": {
        start: {
          line: 332,
          column: 25
        },
        end: {
          line: 332,
          column: 58
        }
      },
      "157": {
        start: {
          line: 333,
          column: 32
        },
        end: {
          line: 333,
          column: 91
        }
      },
      "158": {
        start: {
          line: 335,
          column: 6
        },
        end: {
          line: 340,
          column: 7
        }
      },
      "159": {
        start: {
          line: 336,
          column: 8
        },
        end: {
          line: 336,
          column: 85
        }
      },
      "160": {
        start: {
          line: 337,
          column: 8
        },
        end: {
          line: 337,
          column: 77
        }
      },
      "161": {
        start: {
          line: 338,
          column: 8
        },
        end: {
          line: 338,
          column: 29
        }
      },
      "162": {
        start: {
          line: 339,
          column: 8
        },
        end: {
          line: 339,
          column: 33
        }
      },
      "163": {
        start: {
          line: 342,
          column: 6
        },
        end: {
          line: 347,
          column: 7
        }
      },
      "164": {
        start: {
          line: 343,
          column: 8
        },
        end: {
          line: 343,
          column: 78
        }
      },
      "165": {
        start: {
          line: 344,
          column: 8
        },
        end: {
          line: 344,
          column: 70
        }
      },
      "166": {
        start: {
          line: 345,
          column: 8
        },
        end: {
          line: 345,
          column: 29
        }
      },
      "167": {
        start: {
          line: 346,
          column: 8
        },
        end: {
          line: 346,
          column: 33
        }
      },
      "168": {
        start: {
          line: 350,
          column: 6
        },
        end: {
          line: 353,
          column: 7
        }
      },
      "169": {
        start: {
          line: 351,
          column: 8
        },
        end: {
          line: 351,
          column: 58
        }
      },
      "170": {
        start: {
          line: 352,
          column: 8
        },
        end: {
          line: 352,
          column: 61
        }
      },
      "171": {
        start: {
          line: 356,
          column: 18
        },
        end: {
          line: 356,
          column: 46
        }
      },
      "172": {
        start: {
          line: 357,
          column: 6
        },
        end: {
          line: 359,
          column: 7
        }
      },
      "173": {
        start: {
          line: 358,
          column: 8
        },
        end: {
          line: 358,
          column: 30
        }
      },
      "174": {
        start: {
          line: 361,
          column: 6
        },
        end: {
          line: 361,
          column: 47
        }
      },
      "175": {
        start: {
          line: 361,
          column: 24
        },
        end: {
          line: 361,
          column: 47
        }
      },
      "176": {
        start: {
          line: 364,
          column: 18
        },
        end: {
          line: 364,
          column: 47
        }
      },
      "177": {
        start: {
          line: 366,
          column: 6
        },
        end: {
          line: 366,
          column: 28
        }
      },
      "178": {
        start: {
          line: 368,
          column: 6
        },
        end: {
          line: 368,
          column: 53
        }
      },
      "179": {
        start: {
          line: 373,
          column: 21
        },
        end: {
          line: 373,
          column: 25
        }
      },
      "180": {
        start: {
          line: 374,
          column: 6
        },
        end: {
          line: 393,
          column: 7
        }
      },
      "181": {
        start: {
          line: 375,
          column: 8
        },
        end: {
          line: 375,
          column: 50
        }
      },
      "182": {
        start: {
          line: 376,
          column: 8
        },
        end: {
          line: 376,
          column: 38
        }
      },
      "183": {
        start: {
          line: 377,
          column: 8
        },
        end: {
          line: 377,
          column: 43
        }
      },
      "184": {
        start: {
          line: 378,
          column: 8
        },
        end: {
          line: 378,
          column: 43
        }
      },
      "185": {
        start: {
          line: 379,
          column: 8
        },
        end: {
          line: 379,
          column: 34
        }
      },
      "186": {
        start: {
          line: 380,
          column: 8
        },
        end: {
          line: 380,
          column: 54
        }
      },
      "187": {
        start: {
          line: 382,
          column: 8
        },
        end: {
          line: 392,
          column: 11
        }
      },
      "188": {
        start: {
          line: 385,
          column: 10
        },
        end: {
          line: 391,
          column: 11
        }
      },
      "189": {
        start: {
          line: 386,
          column: 12
        },
        end: {
          line: 386,
          column: 42
        }
      },
      "190": {
        start: {
          line: 387,
          column: 12
        },
        end: {
          line: 387,
          column: 42
        }
      },
      "191": {
        start: {
          line: 389,
          column: 12
        },
        end: {
          line: 389,
          column: 42
        }
      },
      "192": {
        start: {
          line: 390,
          column: 12
        },
        end: {
          line: 390,
          column: 46
        }
      },
      "193": {
        start: {
          line: 395,
          column: 6
        },
        end: {
          line: 395,
          column: 29
        }
      },
      "194": {
        start: {
          line: 397,
          column: 6
        },
        end: {
          line: 397,
          column: 34
        }
      },
      "195": {
        start: {
          line: 400,
          column: 4
        },
        end: {
          line: 404,
          column: 5
        }
      },
      "196": {
        start: {
          line: 403,
          column: 6
        },
        end: {
          line: 403,
          column: 44
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 31,
            column: 2
          },
          end: {
            line: 31,
            column: 3
          }
        },
        loc: {
          start: {
            line: 31,
            column: 54
          },
          end: {
            line: 38,
            column: 3
          }
        },
        line: 31
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 43,
            column: 2
          },
          end: {
            line: 43,
            column: 3
          }
        },
        loc: {
          start: {
            line: 43,
            column: 45
          },
          end: {
            line: 57,
            column: 3
          }
        },
        line: 43
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 60,
            column: 2
          },
          end: {
            line: 60,
            column: 3
          }
        },
        loc: {
          start: {
            line: 60,
            column: 50
          },
          end: {
            line: 66,
            column: 3
          }
        },
        line: 60
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 70,
            column: 2
          },
          end: {
            line: 70,
            column: 3
          }
        },
        loc: {
          start: {
            line: 70,
            column: 37
          },
          end: {
            line: 88,
            column: 3
          }
        },
        line: 70
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 92,
            column: 2
          },
          end: {
            line: 92,
            column: 3
          }
        },
        loc: {
          start: {
            line: 92,
            column: 27
          },
          end: {
            line: 107,
            column: 3
          }
        },
        line: 92
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 113,
            column: 2
          },
          end: {
            line: 113,
            column: 3
          }
        },
        loc: {
          start: {
            line: 113,
            column: 39
          },
          end: {
            line: 118,
            column: 3
          }
        },
        line: 113
      },
      "6": {
        name: "(anonymous_6)",
        decl: {
          start: {
            line: 121,
            column: 2
          },
          end: {
            line: 121,
            column: 3
          }
        },
        loc: {
          start: {
            line: 121,
            column: 35
          },
          end: {
            line: 131,
            column: 3
          }
        },
        line: 121
      },
      "7": {
        name: "(anonymous_7)",
        decl: {
          start: {
            line: 134,
            column: 2
          },
          end: {
            line: 134,
            column: 3
          }
        },
        loc: {
          start: {
            line: 134,
            column: 33
          },
          end: {
            line: 141,
            column: 3
          }
        },
        line: 134
      },
      "8": {
        name: "(anonymous_8)",
        decl: {
          start: {
            line: 150,
            column: 2
          },
          end: {
            line: 150,
            column: 3
          }
        },
        loc: {
          start: {
            line: 150,
            column: 26
          },
          end: {
            line: 172,
            column: 3
          }
        },
        line: 150
      },
      "9": {
        name: "(anonymous_9)",
        decl: {
          start: {
            line: 177,
            column: 2
          },
          end: {
            line: 177,
            column: 3
          }
        },
        loc: {
          start: {
            line: 177,
            column: 72
          },
          end: {
            line: 406,
            column: 3
          }
        },
        line: 177
      },
      "10": {
        name: "(anonymous_10)",
        decl: {
          start: {
            line: 247,
            column: 45
          },
          end: {
            line: 247,
            column: 46
          }
        },
        loc: {
          start: {
            line: 247,
            column: 50
          },
          end: {
            line: 269,
            column: 5
          }
        },
        line: 247
      },
      "11": {
        name: "(anonymous_11)",
        decl: {
          start: {
            line: 382,
            column: 43
          },
          end: {
            line: 382,
            column: 44
          }
        },
        loc: {
          start: {
            line: 382,
            column: 48
          },
          end: {
            line: 392,
            column: 9
          }
        },
        line: 382
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 34,
            column: 4
          },
          end: {
            line: 34,
            column: 99
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 34,
            column: 4
          },
          end: {
            line: 34,
            column: 99
          }
        }, {
          start: {
            line: 34,
            column: 4
          },
          end: {
            line: 34,
            column: 99
          }
        }],
        line: 34
      },
      "1": {
        loc: {
          start: {
            line: 35,
            column: 4
          },
          end: {
            line: 35,
            column: 77
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 35,
            column: 4
          },
          end: {
            line: 35,
            column: 77
          }
        }, {
          start: {
            line: 35,
            column: 4
          },
          end: {
            line: 35,
            column: 77
          }
        }],
        line: 35
      },
      "2": {
        loc: {
          start: {
            line: 36,
            column: 4
          },
          end: {
            line: 36,
            column: 93
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 36,
            column: 4
          },
          end: {
            line: 36,
            column: 93
          }
        }, {
          start: {
            line: 36,
            column: 4
          },
          end: {
            line: 36,
            column: 93
          }
        }],
        line: 36
      },
      "3": {
        loc: {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 48,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 48,
            column: 5
          }
        }, {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 48,
            column: 5
          }
        }],
        line: 45
      },
      "4": {
        loc: {
          start: {
            line: 50,
            column: 4
          },
          end: {
            line: 53,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 50,
            column: 4
          },
          end: {
            line: 53,
            column: 5
          }
        }, {
          start: {
            line: 50,
            column: 4
          },
          end: {
            line: 53,
            column: 5
          }
        }],
        line: 50
      },
      "5": {
        loc: {
          start: {
            line: 60,
            column: 35
          },
          end: {
            line: 60,
            column: 48
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 60,
            column: 46
          },
          end: {
            line: 60,
            column: 48
          }
        }],
        line: 60
      },
      "6": {
        loc: {
          start: {
            line: 63,
            column: 4
          },
          end: {
            line: 63,
            column: 50
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 63,
            column: 4
          },
          end: {
            line: 63,
            column: 50
          }
        }, {
          start: {
            line: 63,
            column: 4
          },
          end: {
            line: 63,
            column: 50
          }
        }],
        line: 63
      },
      "7": {
        loc: {
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 82,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 82,
            column: 5
          }
        }, {
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 82,
            column: 5
          }
        }],
        line: 77
      },
      "8": {
        loc: {
          start: {
            line: 93,
            column: 4
          },
          end: {
            line: 95,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 93,
            column: 4
          },
          end: {
            line: 95,
            column: 5
          }
        }, {
          start: {
            line: 93,
            column: 4
          },
          end: {
            line: 95,
            column: 5
          }
        }],
        line: 93
      },
      "9": {
        loc: {
          start: {
            line: 97,
            column: 4
          },
          end: {
            line: 99,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 97,
            column: 4
          },
          end: {
            line: 99,
            column: 5
          }
        }, {
          start: {
            line: 97,
            column: 4
          },
          end: {
            line: 99,
            column: 5
          }
        }],
        line: 97
      },
      "10": {
        loc: {
          start: {
            line: 101,
            column: 4
          },
          end: {
            line: 103,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 101,
            column: 4
          },
          end: {
            line: 103,
            column: 5
          }
        }, {
          start: {
            line: 101,
            column: 4
          },
          end: {
            line: 103,
            column: 5
          }
        }],
        line: 101
      },
      "11": {
        loc: {
          start: {
            line: 115,
            column: 43
          },
          end: {
            line: 115,
            column: 82
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 115,
            column: 68
          },
          end: {
            line: 115,
            column: 73
          }
        }, {
          start: {
            line: 115,
            column: 76
          },
          end: {
            line: 115,
            column: 82
          }
        }],
        line: 115
      },
      "12": {
        loc: {
          start: {
            line: 122,
            column: 4
          },
          end: {
            line: 124,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 122,
            column: 4
          },
          end: {
            line: 124,
            column: 5
          }
        }, {
          start: {
            line: 122,
            column: 4
          },
          end: {
            line: 124,
            column: 5
          }
        }],
        line: 122
      },
      "13": {
        loc: {
          start: {
            line: 122,
            column: 7
          },
          end: {
            line: 122,
            column: 38
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 122,
            column: 7
          },
          end: {
            line: 122,
            column: 11
          }
        }, {
          start: {
            line: 122,
            column: 15
          },
          end: {
            line: 122,
            column: 38
          }
        }],
        line: 122
      },
      "14": {
        loc: {
          start: {
            line: 126,
            column: 6
          },
          end: {
            line: 128,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 126,
            column: 6
          },
          end: {
            line: 128,
            column: 7
          }
        }, {
          start: {
            line: 126,
            column: 6
          },
          end: {
            line: 128,
            column: 7
          }
        }],
        line: 126
      },
      "15": {
        loc: {
          start: {
            line: 136,
            column: 4
          },
          end: {
            line: 136,
            column: 39
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 136,
            column: 4
          },
          end: {
            line: 136,
            column: 39
          }
        }, {
          start: {
            line: 136,
            column: 4
          },
          end: {
            line: 136,
            column: 39
          }
        }],
        line: 136
      },
      "16": {
        loc: {
          start: {
            line: 138,
            column: 4
          },
          end: {
            line: 138,
            column: 39
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 138,
            column: 4
          },
          end: {
            line: 138,
            column: 39
          }
        }, {
          start: {
            line: 138,
            column: 4
          },
          end: {
            line: 138,
            column: 39
          }
        }],
        line: 138
      },
      "17": {
        loc: {
          start: {
            line: 139,
            column: 4
          },
          end: {
            line: 139,
            column: 43
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 139,
            column: 4
          },
          end: {
            line: 139,
            column: 43
          }
        }, {
          start: {
            line: 139,
            column: 4
          },
          end: {
            line: 139,
            column: 43
          }
        }],
        line: 139
      },
      "18": {
        loc: {
          start: {
            line: 154,
            column: 4
          },
          end: {
            line: 154,
            column: 57
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 154,
            column: 4
          },
          end: {
            line: 154,
            column: 57
          }
        }, {
          start: {
            line: 154,
            column: 4
          },
          end: {
            line: 154,
            column: 57
          }
        }],
        line: 154
      },
      "19": {
        loc: {
          start: {
            line: 158,
            column: 4
          },
          end: {
            line: 158,
            column: 54
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 158,
            column: 4
          },
          end: {
            line: 158,
            column: 54
          }
        }, {
          start: {
            line: 158,
            column: 4
          },
          end: {
            line: 158,
            column: 54
          }
        }],
        line: 158
      },
      "20": {
        loc: {
          start: {
            line: 161,
            column: 4
          },
          end: {
            line: 161,
            column: 72
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 161,
            column: 4
          },
          end: {
            line: 161,
            column: 72
          }
        }, {
          start: {
            line: 161,
            column: 4
          },
          end: {
            line: 161,
            column: 72
          }
        }],
        line: 161
      },
      "21": {
        loc: {
          start: {
            line: 162,
            column: 4
          },
          end: {
            line: 162,
            column: 72
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 162,
            column: 4
          },
          end: {
            line: 162,
            column: 72
          }
        }, {
          start: {
            line: 162,
            column: 4
          },
          end: {
            line: 162,
            column: 72
          }
        }],
        line: 162
      },
      "22": {
        loc: {
          start: {
            line: 166,
            column: 4
          },
          end: {
            line: 166,
            column: 30
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 166,
            column: 4
          },
          end: {
            line: 166,
            column: 30
          }
        }, {
          start: {
            line: 166,
            column: 4
          },
          end: {
            line: 166,
            column: 30
          }
        }],
        line: 166
      },
      "23": {
        loc: {
          start: {
            line: 169,
            column: 4
          },
          end: {
            line: 169,
            column: 54
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 169,
            column: 4
          },
          end: {
            line: 169,
            column: 54
          }
        }, {
          start: {
            line: 169,
            column: 4
          },
          end: {
            line: 169,
            column: 54
          }
        }],
        line: 169
      },
      "24": {
        loc: {
          start: {
            line: 185,
            column: 4
          },
          end: {
            line: 189,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 185,
            column: 4
          },
          end: {
            line: 189,
            column: 5
          }
        }, {
          start: {
            line: 185,
            column: 4
          },
          end: {
            line: 189,
            column: 5
          }
        }],
        line: 185
      },
      "25": {
        loc: {
          start: {
            line: 191,
            column: 4
          },
          end: {
            line: 194,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 191,
            column: 4
          },
          end: {
            line: 194,
            column: 5
          }
        }, {
          start: {
            line: 191,
            column: 4
          },
          end: {
            line: 194,
            column: 5
          }
        }],
        line: 191
      },
      "26": {
        loc: {
          start: {
            line: 191,
            column: 7
          },
          end: {
            line: 191,
            column: 62
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 191,
            column: 7
          },
          end: {
            line: 191,
            column: 35
          }
        }, {
          start: {
            line: 191,
            column: 39
          },
          end: {
            line: 191,
            column: 62
          }
        }],
        line: 191
      },
      "27": {
        loc: {
          start: {
            line: 199,
            column: 4
          },
          end: {
            line: 203,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 199,
            column: 4
          },
          end: {
            line: 203,
            column: 5
          }
        }, {
          start: {
            line: 199,
            column: 4
          },
          end: {
            line: 203,
            column: 5
          }
        }],
        line: 199
      },
      "28": {
        loc: {
          start: {
            line: 207,
            column: 4
          },
          end: {
            line: 238,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 207,
            column: 4
          },
          end: {
            line: 238,
            column: 5
          }
        }, {
          start: {
            line: 207,
            column: 4
          },
          end: {
            line: 238,
            column: 5
          }
        }],
        line: 207
      },
      "29": {
        loc: {
          start: {
            line: 207,
            column: 7
          },
          end: {
            line: 209,
            column: 38
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 207,
            column: 7
          },
          end: {
            line: 207,
            column: 38
          }
        }, {
          start: {
            line: 208,
            column: 7
          },
          end: {
            line: 208,
            column: 36
          }
        }, {
          start: {
            line: 209,
            column: 7
          },
          end: {
            line: 209,
            column: 38
          }
        }],
        line: 207
      },
      "30": {
        loc: {
          start: {
            line: 219,
            column: 6
          },
          end: {
            line: 223,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 219,
            column: 6
          },
          end: {
            line: 223,
            column: 7
          }
        }, {
          start: {
            line: 219,
            column: 6
          },
          end: {
            line: 223,
            column: 7
          }
        }],
        line: 219
      },
      "31": {
        loc: {
          start: {
            line: 225,
            column: 6
          },
          end: {
            line: 227,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 225,
            column: 6
          },
          end: {
            line: 227,
            column: 7
          }
        }, {
          start: {
            line: 225,
            column: 6
          },
          end: {
            line: 227,
            column: 7
          }
        }],
        line: 225
      },
      "32": {
        loc: {
          start: {
            line: 229,
            column: 6
          },
          end: {
            line: 231,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 229,
            column: 6
          },
          end: {
            line: 231,
            column: 7
          }
        }, {
          start: {
            line: 229,
            column: 6
          },
          end: {
            line: 231,
            column: 7
          }
        }],
        line: 229
      },
      "33": {
        loc: {
          start: {
            line: 229,
            column: 9
          },
          end: {
            line: 229,
            column: 56
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 229,
            column: 9
          },
          end: {
            line: 229,
            column: 25
          }
        }, {
          start: {
            line: 229,
            column: 29
          },
          end: {
            line: 229,
            column: 56
          }
        }],
        line: 229
      },
      "34": {
        loc: {
          start: {
            line: 250,
            column: 6
          },
          end: {
            line: 254,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 250,
            column: 6
          },
          end: {
            line: 254,
            column: 7
          }
        }, {
          start: {
            line: 250,
            column: 6
          },
          end: {
            line: 254,
            column: 7
          }
        }],
        line: 250
      },
      "35": {
        loc: {
          start: {
            line: 259,
            column: 8
          },
          end: {
            line: 259,
            column: 41
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 259,
            column: 8
          },
          end: {
            line: 259,
            column: 41
          }
        }, {
          start: {
            line: 259,
            column: 8
          },
          end: {
            line: 259,
            column: 41
          }
        }],
        line: 259
      },
      "36": {
        loc: {
          start: {
            line: 262,
            column: 8
          },
          end: {
            line: 262,
            column: 43
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 262,
            column: 8
          },
          end: {
            line: 262,
            column: 43
          }
        }, {
          start: {
            line: 262,
            column: 8
          },
          end: {
            line: 262,
            column: 43
          }
        }],
        line: 262
      },
      "37": {
        loc: {
          start: {
            line: 264,
            column: 8
          },
          end: {
            line: 264,
            column: 63
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 264,
            column: 8
          },
          end: {
            line: 264,
            column: 63
          }
        }, {
          start: {
            line: 264,
            column: 8
          },
          end: {
            line: 264,
            column: 63
          }
        }],
        line: 264
      },
      "38": {
        loc: {
          start: {
            line: 281,
            column: 6
          },
          end: {
            line: 286,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 281,
            column: 6
          },
          end: {
            line: 286,
            column: 7
          }
        }, {
          start: {
            line: 281,
            column: 6
          },
          end: {
            line: 286,
            column: 7
          }
        }],
        line: 281
      },
      "39": {
        loc: {
          start: {
            line: 284,
            column: 11
          },
          end: {
            line: 286,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 284,
            column: 11
          },
          end: {
            line: 286,
            column: 7
          }
        }, {
          start: {
            line: 284,
            column: 11
          },
          end: {
            line: 286,
            column: 7
          }
        }],
        line: 284
      },
      "40": {
        loc: {
          start: {
            line: 284,
            column: 14
          },
          end: {
            line: 284,
            column: 100
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 284,
            column: 14
          },
          end: {
            line: 284,
            column: 43
          }
        }, {
          start: {
            line: 284,
            column: 47
          },
          end: {
            line: 284,
            column: 59
          }
        }, {
          start: {
            line: 284,
            column: 63
          },
          end: {
            line: 284,
            column: 100
          }
        }],
        line: 284
      },
      "41": {
        loc: {
          start: {
            line: 296,
            column: 6
          },
          end: {
            line: 296,
            column: 48
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 296,
            column: 6
          },
          end: {
            line: 296,
            column: 48
          }
        }, {
          start: {
            line: 296,
            column: 6
          },
          end: {
            line: 296,
            column: 48
          }
        }],
        line: 296
      },
      "42": {
        loc: {
          start: {
            line: 297,
            column: 6
          },
          end: {
            line: 297,
            column: 75
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 297,
            column: 6
          },
          end: {
            line: 297,
            column: 75
          }
        }, {
          start: {
            line: 297,
            column: 6
          },
          end: {
            line: 297,
            column: 75
          }
        }],
        line: 297
      },
      "43": {
        loc: {
          start: {
            line: 300,
            column: 6
          },
          end: {
            line: 303,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 300,
            column: 6
          },
          end: {
            line: 303,
            column: 7
          }
        }, {
          start: {
            line: 300,
            column: 6
          },
          end: {
            line: 303,
            column: 7
          }
        }],
        line: 300
      },
      "44": {
        loc: {
          start: {
            line: 300,
            column: 9
          },
          end: {
            line: 300,
            column: 65
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 300,
            column: 9
          },
          end: {
            line: 300,
            column: 27
          }
        }, {
          start: {
            line: 300,
            column: 31
          },
          end: {
            line: 300,
            column: 65
          }
        }],
        line: 300
      },
      "45": {
        loc: {
          start: {
            line: 305,
            column: 6
          },
          end: {
            line: 309,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 305,
            column: 6
          },
          end: {
            line: 309,
            column: 7
          }
        }, {
          start: {
            line: 305,
            column: 6
          },
          end: {
            line: 309,
            column: 7
          }
        }],
        line: 305
      },
      "46": {
        loc: {
          start: {
            line: 305,
            column: 9
          },
          end: {
            line: 305,
            column: 63
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 305,
            column: 9
          },
          end: {
            line: 305,
            column: 27
          }
        }, {
          start: {
            line: 305,
            column: 31
          },
          end: {
            line: 305,
            column: 63
          }
        }],
        line: 305
      },
      "47": {
        loc: {
          start: {
            line: 311,
            column: 6
          },
          end: {
            line: 315,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 311,
            column: 6
          },
          end: {
            line: 315,
            column: 7
          }
        }, {
          start: {
            line: 311,
            column: 6
          },
          end: {
            line: 315,
            column: 7
          }
        }],
        line: 311
      },
      "48": {
        loc: {
          start: {
            line: 311,
            column: 9
          },
          end: {
            line: 311,
            column: 63
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 311,
            column: 9
          },
          end: {
            line: 311,
            column: 27
          }
        }, {
          start: {
            line: 311,
            column: 31
          },
          end: {
            line: 311,
            column: 63
          }
        }],
        line: 311
      },
      "49": {
        loc: {
          start: {
            line: 318,
            column: 6
          },
          end: {
            line: 322,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 318,
            column: 6
          },
          end: {
            line: 322,
            column: 7
          }
        }, {
          start: {
            line: 318,
            column: 6
          },
          end: {
            line: 322,
            column: 7
          }
        }],
        line: 318
      },
      "50": {
        loc: {
          start: {
            line: 318,
            column: 9
          },
          end: {
            line: 318,
            column: 52
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 318,
            column: 9
          },
          end: {
            line: 318,
            column: 27
          }
        }, {
          start: {
            line: 318,
            column: 31
          },
          end: {
            line: 318,
            column: 52
          }
        }],
        line: 318
      },
      "51": {
        loc: {
          start: {
            line: 325,
            column: 6
          },
          end: {
            line: 329,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 325,
            column: 6
          },
          end: {
            line: 329,
            column: 7
          }
        }, {
          start: {
            line: 325,
            column: 6
          },
          end: {
            line: 329,
            column: 7
          }
        }],
        line: 325
      },
      "52": {
        loc: {
          start: {
            line: 325,
            column: 9
          },
          end: {
            line: 325,
            column: 58
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 325,
            column: 9
          },
          end: {
            line: 325,
            column: 27
          }
        }, {
          start: {
            line: 325,
            column: 31
          },
          end: {
            line: 325,
            column: 58
          }
        }],
        line: 325
      },
      "53": {
        loc: {
          start: {
            line: 335,
            column: 6
          },
          end: {
            line: 340,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 335,
            column: 6
          },
          end: {
            line: 340,
            column: 7
          }
        }, {
          start: {
            line: 335,
            column: 6
          },
          end: {
            line: 340,
            column: 7
          }
        }],
        line: 335
      },
      "54": {
        loc: {
          start: {
            line: 335,
            column: 9
          },
          end: {
            line: 335,
            column: 100
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 335,
            column: 9
          },
          end: {
            line: 335,
            column: 27
          }
        }, {
          start: {
            line: 335,
            column: 31
          },
          end: {
            line: 335,
            column: 48
          }
        }, {
          start: {
            line: 335,
            column: 52
          },
          end: {
            line: 335,
            column: 100
          }
        }],
        line: 335
      },
      "55": {
        loc: {
          start: {
            line: 342,
            column: 6
          },
          end: {
            line: 347,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 342,
            column: 6
          },
          end: {
            line: 347,
            column: 7
          }
        }, {
          start: {
            line: 342,
            column: 6
          },
          end: {
            line: 347,
            column: 7
          }
        }],
        line: 342
      },
      "56": {
        loc: {
          start: {
            line: 342,
            column: 9
          },
          end: {
            line: 342,
            column: 93
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 342,
            column: 9
          },
          end: {
            line: 342,
            column: 27
          }
        }, {
          start: {
            line: 342,
            column: 31
          },
          end: {
            line: 342,
            column: 48
          }
        }, {
          start: {
            line: 342,
            column: 52
          },
          end: {
            line: 342,
            column: 93
          }
        }],
        line: 342
      },
      "57": {
        loc: {
          start: {
            line: 350,
            column: 6
          },
          end: {
            line: 353,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 350,
            column: 6
          },
          end: {
            line: 353,
            column: 7
          }
        }, {
          start: {
            line: 350,
            column: 6
          },
          end: {
            line: 353,
            column: 7
          }
        }],
        line: 350
      },
      "58": {
        loc: {
          start: {
            line: 357,
            column: 6
          },
          end: {
            line: 359,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 357,
            column: 6
          },
          end: {
            line: 359,
            column: 7
          }
        }, {
          start: {
            line: 357,
            column: 6
          },
          end: {
            line: 359,
            column: 7
          }
        }],
        line: 357
      },
      "59": {
        loc: {
          start: {
            line: 361,
            column: 6
          },
          end: {
            line: 361,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 361,
            column: 6
          },
          end: {
            line: 361,
            column: 47
          }
        }, {
          start: {
            line: 361,
            column: 6
          },
          end: {
            line: 361,
            column: 47
          }
        }],
        line: 361
      },
      "60": {
        loc: {
          start: {
            line: 374,
            column: 6
          },
          end: {
            line: 393,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 374,
            column: 6
          },
          end: {
            line: 393,
            column: 7
          }
        }, {
          start: {
            line: 374,
            column: 6
          },
          end: {
            line: 393,
            column: 7
          }
        }],
        line: 374
      },
      "61": {
        loc: {
          start: {
            line: 385,
            column: 10
          },
          end: {
            line: 391,
            column: 11
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 385,
            column: 10
          },
          end: {
            line: 391,
            column: 11
          }
        }, {
          start: {
            line: 385,
            column: 10
          },
          end: {
            line: 391,
            column: 11
          }
        }],
        line: 385
      },
      "62": {
        loc: {
          start: {
            line: 400,
            column: 4
          },
          end: {
            line: 404,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 400,
            column: 4
          },
          end: {
            line: 404,
            column: 5
          }
        }, {
          start: {
            line: 400,
            column: 4
          },
          end: {
            line: 404,
            column: 5
          }
        }],
        line: 400
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0,
      "60": 0,
      "61": 0,
      "62": 0,
      "63": 0,
      "64": 0,
      "65": 0,
      "66": 0,
      "67": 0,
      "68": 0,
      "69": 0,
      "70": 0,
      "71": 0,
      "72": 0,
      "73": 0,
      "74": 0,
      "75": 0,
      "76": 0,
      "77": 0,
      "78": 0,
      "79": 0,
      "80": 0,
      "81": 0,
      "82": 0,
      "83": 0,
      "84": 0,
      "85": 0,
      "86": 0,
      "87": 0,
      "88": 0,
      "89": 0,
      "90": 0,
      "91": 0,
      "92": 0,
      "93": 0,
      "94": 0,
      "95": 0,
      "96": 0,
      "97": 0,
      "98": 0,
      "99": 0,
      "100": 0,
      "101": 0,
      "102": 0,
      "103": 0,
      "104": 0,
      "105": 0,
      "106": 0,
      "107": 0,
      "108": 0,
      "109": 0,
      "110": 0,
      "111": 0,
      "112": 0,
      "113": 0,
      "114": 0,
      "115": 0,
      "116": 0,
      "117": 0,
      "118": 0,
      "119": 0,
      "120": 0,
      "121": 0,
      "122": 0,
      "123": 0,
      "124": 0,
      "125": 0,
      "126": 0,
      "127": 0,
      "128": 0,
      "129": 0,
      "130": 0,
      "131": 0,
      "132": 0,
      "133": 0,
      "134": 0,
      "135": 0,
      "136": 0,
      "137": 0,
      "138": 0,
      "139": 0,
      "140": 0,
      "141": 0,
      "142": 0,
      "143": 0,
      "144": 0,
      "145": 0,
      "146": 0,
      "147": 0,
      "148": 0,
      "149": 0,
      "150": 0,
      "151": 0,
      "152": 0,
      "153": 0,
      "154": 0,
      "155": 0,
      "156": 0,
      "157": 0,
      "158": 0,
      "159": 0,
      "160": 0,
      "161": 0,
      "162": 0,
      "163": 0,
      "164": 0,
      "165": 0,
      "166": 0,
      "167": 0,
      "168": 0,
      "169": 0,
      "170": 0,
      "171": 0,
      "172": 0,
      "173": 0,
      "174": 0,
      "175": 0,
      "176": 0,
      "177": 0,
      "178": 0,
      "179": 0,
      "180": 0,
      "181": 0,
      "182": 0,
      "183": 0,
      "184": 0,
      "185": 0,
      "186": 0,
      "187": 0,
      "188": 0,
      "189": 0,
      "190": 0,
      "191": 0,
      "192": 0,
      "193": 0,
      "194": 0,
      "195": 0,
      "196": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0, 0],
      "18": [0, 0],
      "19": [0, 0],
      "20": [0, 0],
      "21": [0, 0],
      "22": [0, 0],
      "23": [0, 0],
      "24": [0, 0],
      "25": [0, 0],
      "26": [0, 0],
      "27": [0, 0],
      "28": [0, 0],
      "29": [0, 0, 0],
      "30": [0, 0],
      "31": [0, 0],
      "32": [0, 0],
      "33": [0, 0],
      "34": [0, 0],
      "35": [0, 0],
      "36": [0, 0],
      "37": [0, 0],
      "38": [0, 0],
      "39": [0, 0],
      "40": [0, 0, 0],
      "41": [0, 0],
      "42": [0, 0],
      "43": [0, 0],
      "44": [0, 0],
      "45": [0, 0],
      "46": [0, 0],
      "47": [0, 0],
      "48": [0, 0],
      "49": [0, 0],
      "50": [0, 0],
      "51": [0, 0],
      "52": [0, 0],
      "53": [0, 0],
      "54": [0, 0, 0],
      "55": [0, 0],
      "56": [0, 0, 0],
      "57": [0, 0],
      "58": [0, 0],
      "59": [0, 0],
      "60": [0, 0],
      "61": [0, 0],
      "62": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

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
      cov_htu99tt8w.f[0]++;
      var supportedOutputFormats = (cov_htu99tt8w.s[0]++, null); // window.localStorage is not defined during unit testing

      cov_htu99tt8w.s[1]++;

      if (window.localStorage) {
        cov_htu99tt8w.b[0][0]++;
        cov_htu99tt8w.s[2]++;
        supportedOutputFormats = window.localStorage.getItem("output_formats");
      } else {
        cov_htu99tt8w.b[0][1]++;
      }

      cov_htu99tt8w.s[3]++;

      if (supportedOutputFormats === "undefined") {
        cov_htu99tt8w.b[1][0]++;
        cov_htu99tt8w.s[4]++;
        supportedOutputFormats = null;
      } else {
        cov_htu99tt8w.b[1][1]++;
      }

      cov_htu99tt8w.s[5]++;

      if (supportedOutputFormats === null) {
        cov_htu99tt8w.b[2][0]++;
        cov_htu99tt8w.s[6]++;
        supportedOutputFormats = "doc,saltguihighstate,json";
      } else {
        cov_htu99tt8w.b[2][1]++;
      }

      cov_htu99tt8w.s[7]++;
      return supportedOutputFormats.includes(requestedOutputFormat);
    } // Re-organize the output to let it appear as if the output comes
    // from a single node called "RUNNER" or "MASTER".
    // This way all responses are organized by minion

  }, {
    key: "addVirtualMinion",
    value: function addVirtualMinion(response, command) {
      cov_htu99tt8w.f[1]++;
      cov_htu99tt8w.s[8]++;

      if (command.startsWith("runners.")) {
        cov_htu99tt8w.b[3][0]++;
        cov_htu99tt8w.s[9]++;
        // Add a new level in the object
        return {
          "RUNNER": response
        };
      } else {
        cov_htu99tt8w.b[3][1]++;
      }

      cov_htu99tt8w.s[10]++;

      if (command.startsWith("wheel.")) {
        cov_htu99tt8w.b[4][0]++;
        cov_htu99tt8w.s[11]++;
        // Add a new level in the object
        return {
          "WHEEL": response
        };
      } else {
        cov_htu99tt8w.b[4][1]++;
      } // otherwise return the original


      cov_htu99tt8w.s[12]++;
      return response;
    } // compose the host/minion-name label that is shown with each response

  }, {
    key: "getHostnameHtml",
    value: function getHostnameHtml(hostname) {
      var extraClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (cov_htu99tt8w.b[5][0]++, "");
      cov_htu99tt8w.f[2]++;
      var span = (cov_htu99tt8w.s[13]++, document.createElement("span"));
      cov_htu99tt8w.s[14]++;
      span.classList.add("hostname");
      cov_htu99tt8w.s[15]++;

      if (extraClass) {
        cov_htu99tt8w.b[6][0]++;
        cov_htu99tt8w.s[16]++;
        span.classList.add(extraClass);
      } else {
        cov_htu99tt8w.b[6][1]++;
      }

      cov_htu99tt8w.s[17]++;
      span.innerText = hostname;
      cov_htu99tt8w.s[18]++;
      return span;
    } // the output is only text
    // note: do not return a text-node

  }, {
    key: "getTextOutput",
    value: function getTextOutput(hostResponse) {
      cov_htu99tt8w.f[3]++;
      cov_htu99tt8w.s[19]++;
      // strip trailing whitespace
      hostResponse = hostResponse.replace(/[ \r\n]+$/g, ""); // replace all returned JIDs to links
      // typically found in the output of an async job
      // patJid is defined in scripts/parsecmdline.js

      cov_htu99tt8w.s[20]++;

      if (hostResponse.match(patJid)) {
        cov_htu99tt8w.b[7][0]++;
        var a = (cov_htu99tt8w.s[21]++, document.createElement("a"));
        cov_htu99tt8w.s[22]++;
        a.href = "/job?id=" + encodeURIComponent(hostResponse);
        cov_htu99tt8w.s[23]++;
        a.innerText = hostResponse;
        cov_htu99tt8w.s[24]++;
        return a;
      } else {
        cov_htu99tt8w.b[7][1]++;
      } // all regular text


      var span = (cov_htu99tt8w.s[25]++, document.createElement("span"));
      cov_htu99tt8w.s[26]++;
      span.innerText = hostResponse;
      cov_htu99tt8w.s[27]++;
      return span;
    } // format an object in the preferred style

  }, {
    key: "formatObject",
    value: function formatObject(obj) {
      cov_htu99tt8w.f[4]++;
      cov_htu99tt8w.s[28]++;

      if (Output.isOutputFormatAllowed("json")) {
        cov_htu99tt8w.b[8][0]++;
        cov_htu99tt8w.s[29]++;
        return _OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(obj);
      } else {
        cov_htu99tt8w.b[8][1]++;
      }

      cov_htu99tt8w.s[30]++;

      if (Output.isOutputFormatAllowed("yaml")) {
        cov_htu99tt8w.b[9][0]++;
        cov_htu99tt8w.s[31]++;
        return _OutputYaml__WEBPACK_IMPORTED_MODULE_5__["OutputYaml"].formatYAML(obj);
      } else {
        cov_htu99tt8w.b[9][1]++;
      }

      cov_htu99tt8w.s[32]++;

      if (Output.isOutputFormatAllowed("nested")) {
        cov_htu99tt8w.b[10][0]++;
        cov_htu99tt8w.s[33]++;
        return _OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(obj);
      } else {
        cov_htu99tt8w.b[10][1]++;
      } // when nothing is allowed, JSON is always allowed


      cov_htu99tt8w.s[34]++;
      return _OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(obj);
    } // this is the default output form
    // just format the returned objects
    // note: do not return a text-node

  }, {
    key: "getNormalOutput",
    value: function getNormalOutput(hostResponse) {
      cov_htu99tt8w.f[5]++;
      var content = (cov_htu99tt8w.s[35]++, Output.formatObject(hostResponse));
      var element = (cov_htu99tt8w.s[36]++, document.createElement(content.includes("\n") ? (cov_htu99tt8w.b[11][0]++, "div") : (cov_htu99tt8w.b[11][1]++, "span")));
      cov_htu99tt8w.s[37]++;
      element.innerText = content;
      cov_htu99tt8w.s[38]++;
      return element;
    }
  }, {
    key: "hasProperties",
    value: function hasProperties(obj, props) {
      cov_htu99tt8w.f[6]++;
      cov_htu99tt8w.s[39]++;

      if ((cov_htu99tt8w.b[13][0]++, !obj) || (cov_htu99tt8w.b[13][1]++, _typeof(obj) !== "object")) {
        cov_htu99tt8w.b[12][0]++;
        cov_htu99tt8w.s[40]++;
        return false;
      } else {
        cov_htu99tt8w.b[12][1]++;
      }

      cov_htu99tt8w.s[41]++;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var prop = _step.value;
          cov_htu99tt8w.s[42]++;

          if (!obj.hasOwnProperty(prop)) {
            cov_htu99tt8w.b[14][0]++;
            cov_htu99tt8w.s[43]++;
            return false;
          } else {
            cov_htu99tt8w.b[14][1]++;
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

      cov_htu99tt8w.s[44]++;
      return true;
    }
  }, {
    key: "isAsyncOutput",
    value: function isAsyncOutput(response) {
      cov_htu99tt8w.f[7]++;
      var keys = (cov_htu99tt8w.s[45]++, Object.keys(response));
      cov_htu99tt8w.s[46]++;

      if (keys.length !== 2) {
        cov_htu99tt8w.b[15][0]++;
        cov_htu99tt8w.s[47]++;
        return false;
      } else {
        cov_htu99tt8w.b[15][1]++;
      }

      cov_htu99tt8w.s[48]++;
      keys = keys.sort();
      cov_htu99tt8w.s[49]++;

      if (keys[0] !== "jid") {
        cov_htu99tt8w.b[16][0]++;
        cov_htu99tt8w.s[50]++;
        return false;
      } else {
        cov_htu99tt8w.b[16][1]++;
      }

      cov_htu99tt8w.s[51]++;

      if (keys[1] !== "minions") {
        cov_htu99tt8w.b[17][0]++;
        cov_htu99tt8w.s[52]++;
        return false;
      } else {
        cov_htu99tt8w.b[17][1]++;
      }

      cov_htu99tt8w.s[53]++;
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
      cov_htu99tt8w.f[8]++;
      // no available setting, then return the original
      var datetime_fraction_digits_str = (cov_htu99tt8w.s[54]++, window.localStorage.getItem("datetime_fraction_digits"));
      cov_htu99tt8w.s[55]++;

      if (datetime_fraction_digits_str === null) {
        cov_htu99tt8w.b[18][0]++;
        cov_htu99tt8w.s[56]++;
        return str;
      } else {
        cov_htu99tt8w.b[18][1]++;
      } // setting is not a number, return the original


      var datetime_fraction_digits_nr = (cov_htu99tt8w.s[57]++, Number.parseInt(datetime_fraction_digits_str));
      cov_htu99tt8w.s[58]++;

      if (isNaN(datetime_fraction_digits_nr)) {
        cov_htu99tt8w.b[19][0]++;
        cov_htu99tt8w.s[59]++;
        return str;
      } else {
        cov_htu99tt8w.b[19][1]++;
      } // stick to the min/max values without complaining


      cov_htu99tt8w.s[60]++;

      if (datetime_fraction_digits_nr < 0) {
        cov_htu99tt8w.b[20][0]++;
        cov_htu99tt8w.s[61]++;
        datetime_fraction_digits_nr = 0;
      } else {
        cov_htu99tt8w.b[20][1]++;
      }

      cov_htu99tt8w.s[62]++;

      if (datetime_fraction_digits_nr > 6) {
        cov_htu99tt8w.b[21][0]++;
        cov_htu99tt8w.s[63]++;
        datetime_fraction_digits_nr = 6;
      } else {
        cov_htu99tt8w.b[21][1]++;
      } // find the fractional part (assume only one '.' in the string)


      var dotPos = (cov_htu99tt8w.s[64]++, str.indexOf("."));
      cov_htu99tt8w.s[65]++;

      if (dotPos < 0) {
        cov_htu99tt8w.b[22][0]++;
        cov_htu99tt8w.s[66]++;
        return str;
      } else {
        cov_htu99tt8w.b[22][1]++;
      } // with no digits, also remove the dot


      cov_htu99tt8w.s[67]++;

      if (datetime_fraction_digits_nr === 0) {
        cov_htu99tt8w.b[23][0]++;
        cov_htu99tt8w.s[68]++;
        dotPos -= 1;
      } else {
        cov_htu99tt8w.b[23][1]++;
      }

      cov_htu99tt8w.s[69]++;
      return str.substring(0, dotPos + datetime_fraction_digits_nr + 1);
    } // the orchestrator for the output
    // determines what format should be used and uses that

  }, {
    key: "addResponseOutput",
    value: function addResponseOutput(outputContainer, minions, response, command) {
      cov_htu99tt8w.f[9]++;
      cov_htu99tt8w.s[70]++;
      // remove old content
      outputContainer.innerText = ""; // reformat runner/wheel output into regular output

      cov_htu99tt8w.s[71]++;
      response = Output.addVirtualMinion(response, command);
      cov_htu99tt8w.s[72]++;

      if (typeof response === "string") {
        cov_htu99tt8w.b[24][0]++;
        cov_htu99tt8w.s[73]++;
        // do not format a string as an object
        outputContainer.innerText = response;
        cov_htu99tt8w.s[74]++;
        return;
      } else {
        cov_htu99tt8w.b[24][1]++;
      }

      cov_htu99tt8w.s[75]++;

      if ((cov_htu99tt8w.b[26][0]++, _typeof(response) !== "object") || (cov_htu99tt8w.b[26][1]++, Array.isArray(response))) {
        cov_htu99tt8w.b[25][0]++;
        cov_htu99tt8w.s[76]++;
        outputContainer.innerText = Output.formatObject(response);
        cov_htu99tt8w.s[77]++;
        return;
      } else {
        cov_htu99tt8w.b[25][1]++;
      } // it might be documentation


      var commandArg = (cov_htu99tt8w.s[78]++, command.trim().replace(/^[a-z.]* */i, ""));
      var isDocumentationOutput = (cov_htu99tt8w.s[79]++, _OutputDocumentation__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].isDocumentationOutput(Output, response, commandArg));
      cov_htu99tt8w.s[80]++;

      if (isDocumentationOutput) {
        cov_htu99tt8w.b[27][0]++;
        cov_htu99tt8w.s[81]++;
        _OutputDocumentation__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].reduceDocumentationOutput(response, commandArg, commandArg);
        cov_htu99tt8w.s[82]++;
        _OutputDocumentation__WEBPACK_IMPORTED_MODULE_0__["OutputDocumentation"].addDocumentationOutput(outputContainer, response);
        cov_htu99tt8w.s[83]++;
        return;
      } else {
        cov_htu99tt8w.b[27][1]++;
      }

      var allDiv = (cov_htu99tt8w.s[84]++, document.createElement("div"));
      cov_htu99tt8w.s[85]++;

      if ((cov_htu99tt8w.b[29][0]++, !command.startsWith("runners.")) && (cov_htu99tt8w.b[29][1]++, !command.startsWith("wheel.")) && (cov_htu99tt8w.b[29][2]++, !Output.isAsyncOutput(response))) {
        cov_htu99tt8w.b[28][0]++;
        // runners/wheel responses are not per minion
        // Do not produce a #response line for async-start confirmation
        var span = (cov_htu99tt8w.s[86]++, document.createElement("span"));
        var cntResponses = (cov_htu99tt8w.s[87]++, Object.keys(response).length);
        var cntMinions = (cov_htu99tt8w.s[88]++, minions.length);
        var txt;
        cov_htu99tt8w.s[89]++;

        if (cntResponses === 1) {
          cov_htu99tt8w.b[30][0]++;
          cov_htu99tt8w.s[90]++;
          txt = cntResponses + " response";
        } else {
          cov_htu99tt8w.b[30][1]++;
          cov_htu99tt8w.s[91]++;
          txt = cntResponses + " responses";
        }

        cov_htu99tt8w.s[92]++;

        if (cntMinions !== cntResponses) {
          cov_htu99tt8w.b[31][0]++;
          cov_htu99tt8w.s[93]++;
          txt = txt + ", " + (cntMinions - cntResponses) + " no response";
        } else {
          cov_htu99tt8w.b[31][1]++;
        }

        cov_htu99tt8w.s[94]++;

        if ((cov_htu99tt8w.b[33][0]++, cntResponses > 0) && (cov_htu99tt8w.b[33][1]++, cntMinions !== cntResponses)) {
          cov_htu99tt8w.b[32][0]++;
          cov_htu99tt8w.s[95]++;
          txt = txt + ", " + cntMinions + " total";
        } else {
          cov_htu99tt8w.b[32][1]++;
        } // some room for the triangle


        cov_htu99tt8w.s[96]++;
        txt = txt + " ";
        cov_htu99tt8w.s[97]++;
        span.innerText = txt;
        cov_htu99tt8w.s[98]++;
        allDiv.appendChild(span);
      } else {
        cov_htu99tt8w.b[28][1]++;
      }

      var masterTriangle = (cov_htu99tt8w.s[99]++, document.createElement("span"));
      cov_htu99tt8w.s[100]++;
      masterTriangle.innerText = "\u25BD";
      cov_htu99tt8w.s[101]++;
      masterTriangle.style = "cursor: pointer";
      cov_htu99tt8w.s[102]++;
      allDiv.appendChild(masterTriangle);
      cov_htu99tt8w.s[103]++;
      outputContainer.appendChild(allDiv);
      cov_htu99tt8w.s[104]++;
      masterTriangle.addEventListener("click", function (_) {
        cov_htu99tt8w.f[10]++;
        cov_htu99tt8w.s[105]++;

        // 25B7 = WHITE RIGHT-POINTING TRIANGLE
        // 25BD = WHITE DOWN-POINTING TRIANGLE
        if (masterTriangle.innerText !== "\u25BD") {
          cov_htu99tt8w.b[34][0]++;
          cov_htu99tt8w.s[106]++;
          masterTriangle.innerText = "\u25BD";
        } else {
          cov_htu99tt8w.b[34][1]++;
          cov_htu99tt8w.s[107]++;
          masterTriangle.innerText = "\u25B7";
        }

        cov_htu99tt8w.s[108]++;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = outputContainer.childNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var div = _step2.value;
            // only click on items that are collapsible
            var childs = (cov_htu99tt8w.s[109]++, div.getElementsByClassName("triangle"));
            cov_htu99tt8w.s[110]++;

            if (childs.length !== 1) {
              cov_htu99tt8w.b[35][0]++;
              cov_htu99tt8w.s[111]++;
              continue;
            } else {
              cov_htu99tt8w.b[35][1]++;
            } // do not collapse the "all" item again


            var tr = (cov_htu99tt8w.s[112]++, childs[0]);
            cov_htu99tt8w.s[113]++;

            if (tr === masterTriangle) {
              cov_htu99tt8w.b[36][0]++;
              cov_htu99tt8w.s[114]++;
              continue;
            } else {
              cov_htu99tt8w.b[36][1]++;
            } // only click on items that are not already the same as "all"


            cov_htu99tt8w.s[115]++;

            if (tr.innerText === masterTriangle.innerText) {
              cov_htu99tt8w.b[37][0]++;
              cov_htu99tt8w.s[116]++;
              continue;
            } else {
              cov_htu99tt8w.b[37][1]++;
            } // (un)collapse the minion


            var evt = (cov_htu99tt8w.s[117]++, new MouseEvent("click", {}));
            cov_htu99tt8w.s[118]++;
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
      var nrMultiLineBlocks = (cov_htu99tt8w.s[119]++, 0); // for all other types we consider the output per minion
      // this is more generic and it simplifies the handlers

      cov_htu99tt8w.s[120]++;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop = function _loop() {
          var hostname = _step3.value;
          var isSuccess = (cov_htu99tt8w.s[121]++, true);
          var retCode = (cov_htu99tt8w.s[122]++, 0);
          var hostResponse = (cov_htu99tt8w.s[123]++, response[hostname]);
          cov_htu99tt8w.s[124]++;

          if (Output.hasProperties(hostResponse, ["retcode", "return", "success"])) {
            cov_htu99tt8w.b[38][0]++;
            cov_htu99tt8w.s[125]++;
            hostResponse = hostResponse.return;
          } else {
            cov_htu99tt8w.b[38][1]++;
            cov_htu99tt8w.s[126]++;

            if ((cov_htu99tt8w.b[40][0]++, command.startsWith("runner.")) && (cov_htu99tt8w.b[40][1]++, hostResponse) && (cov_htu99tt8w.b[40][2]++, hostResponse.hasOwnProperty("return"))) {
              cov_htu99tt8w.b[39][0]++;
              cov_htu99tt8w.s[127]++;
              hostResponse = hostResponse.return.return;
            } else {
              cov_htu99tt8w.b[39][1]++;
            }
          }

          var hostOutput = (cov_htu99tt8w.s[128]++, null);
          var hostMultiLine = (cov_htu99tt8w.s[129]++, null);
          var fndRepresentation = (cov_htu99tt8w.s[130]++, false); // the standard label is the hostname,
          // future: colored based on the successflag
          // future: colored based on the retcode

          var hostClass = (cov_htu99tt8w.s[131]++, "host_success");
          cov_htu99tt8w.s[132]++;

          if (!isSuccess) {
            cov_htu99tt8w.b[41][0]++;
            cov_htu99tt8w.s[133]++;
            hostClass = "host_failure";
          } else {
            cov_htu99tt8w.b[41][1]++;
          }

          cov_htu99tt8w.s[134]++;

          if (!response.hasOwnProperty(hostname)) {
            cov_htu99tt8w.b[42][0]++;
            cov_htu99tt8w.s[135]++;
            hostClass = "host_noresponse";
          } else {
            cov_htu99tt8w.b[42][1]++;
          }

          var hostLabel = (cov_htu99tt8w.s[136]++, Output.getHostnameHtml(hostname, hostClass));
          cov_htu99tt8w.s[137]++;

          if ((cov_htu99tt8w.b[44][0]++, !fndRepresentation) && (cov_htu99tt8w.b[44][1]++, !response.hasOwnProperty(hostname))) {
            cov_htu99tt8w.b[43][0]++;
            cov_htu99tt8w.s[138]++;
            hostOutput = Output.getTextOutput("(no response)");
            cov_htu99tt8w.s[139]++;
            fndRepresentation = true;
          } else {
            cov_htu99tt8w.b[43][1]++;
          }

          cov_htu99tt8w.s[140]++;

          if ((cov_htu99tt8w.b[46][0]++, !fndRepresentation) && (cov_htu99tt8w.b[46][1]++, typeof hostResponse === "string")) {
            cov_htu99tt8w.b[45][0]++;
            cov_htu99tt8w.s[141]++;
            hostOutput = Output.getTextOutput(hostResponse);
            cov_htu99tt8w.s[142]++;
            hostMultiLine = hostResponse.includes("\n");
            cov_htu99tt8w.s[143]++;
            fndRepresentation = true;
          } else {
            cov_htu99tt8w.b[45][1]++;
          }

          cov_htu99tt8w.s[144]++;

          if ((cov_htu99tt8w.b[48][0]++, !fndRepresentation) && (cov_htu99tt8w.b[48][1]++, _typeof(hostResponse) !== "object")) {
            cov_htu99tt8w.b[47][0]++;
            cov_htu99tt8w.s[145]++;
            hostOutput = Output.getNormalOutput(hostResponse);
            cov_htu99tt8w.s[146]++;
            hostMultiLine = false;
            cov_htu99tt8w.s[147]++;
            fndRepresentation = true;
          } else {
            cov_htu99tt8w.b[47][1]++;
          } // null is an object, but treat it separatelly


          cov_htu99tt8w.s[148]++;

          if ((cov_htu99tt8w.b[50][0]++, !fndRepresentation) && (cov_htu99tt8w.b[50][1]++, hostResponse === null)) {
            cov_htu99tt8w.b[49][0]++;
            cov_htu99tt8w.s[149]++;
            hostOutput = Output.getNormalOutput(hostResponse);
            cov_htu99tt8w.s[150]++;
            hostMultiLine = false;
            cov_htu99tt8w.s[151]++;
            fndRepresentation = true;
          } else {
            cov_htu99tt8w.b[49][1]++;
          } // an array is an object, but treat it separatelly


          cov_htu99tt8w.s[152]++;

          if ((cov_htu99tt8w.b[52][0]++, !fndRepresentation) && (cov_htu99tt8w.b[52][1]++, Array.isArray(hostResponse))) {
            cov_htu99tt8w.b[51][0]++;
            cov_htu99tt8w.s[153]++;
            hostOutput = Output.getNormalOutput(hostResponse);
            cov_htu99tt8w.s[154]++;
            hostMultiLine = hostResponse.length > 0;
            cov_htu99tt8w.s[155]++;
            fndRepresentation = true;
          } else {
            cov_htu99tt8w.b[51][1]++;
          } // it might be highstate output


          var commandCmd = (cov_htu99tt8w.s[156]++, command.trim().replace(/ .*/, ""));
          var isHighStateOutput = (cov_htu99tt8w.s[157]++, _OutputHighstate__WEBPACK_IMPORTED_MODULE_1__["OutputHighstate"].isHighStateOutput(commandCmd, hostResponse)); // enhanced highstate display

          cov_htu99tt8w.s[158]++;

          if ((cov_htu99tt8w.b[54][0]++, !fndRepresentation) && (cov_htu99tt8w.b[54][1]++, isHighStateOutput) && (cov_htu99tt8w.b[54][2]++, Output.isOutputFormatAllowed("saltguihighstate"))) {
            cov_htu99tt8w.b[53][0]++;
            cov_htu99tt8w.s[159]++;
            hostLabel = _OutputSaltGuiHighstate__WEBPACK_IMPORTED_MODULE_4__["OutputSaltGuiHighstate"].getHighStateLabel(hostname, hostResponse);
            cov_htu99tt8w.s[160]++;
            hostOutput = _OutputSaltGuiHighstate__WEBPACK_IMPORTED_MODULE_4__["OutputSaltGuiHighstate"].getHighStateOutput(hostResponse);
            cov_htu99tt8w.s[161]++;
            hostMultiLine = true;
            cov_htu99tt8w.s[162]++;
            fndRepresentation = true;
          } else {
            cov_htu99tt8w.b[53][1]++;
          } // regular highstate display


          cov_htu99tt8w.s[163]++;

          if ((cov_htu99tt8w.b[56][0]++, !fndRepresentation) && (cov_htu99tt8w.b[56][1]++, isHighStateOutput) && (cov_htu99tt8w.b[56][2]++, Output.isOutputFormatAllowed("highstate"))) {
            cov_htu99tt8w.b[55][0]++;
            cov_htu99tt8w.s[164]++;
            hostLabel = _OutputHighstate__WEBPACK_IMPORTED_MODULE_1__["OutputHighstate"].getHighStateLabel(hostname, hostResponse);
            cov_htu99tt8w.s[165]++;
            hostOutput = _OutputHighstate__WEBPACK_IMPORTED_MODULE_1__["OutputHighstate"].getHighStateOutput(hostResponse);
            cov_htu99tt8w.s[166]++;
            hostMultiLine = true;
            cov_htu99tt8w.s[167]++;
            fndRepresentation = true;
          } else {
            cov_htu99tt8w.b[55][1]++;
          } // nothing special? then it is normal output


          cov_htu99tt8w.s[168]++;

          if (!fndRepresentation) {
            cov_htu99tt8w.b[57][0]++;
            cov_htu99tt8w.s[169]++;
            hostOutput = Output.getNormalOutput(hostResponse);
            cov_htu99tt8w.s[170]++;
            hostMultiLine = Object.keys(hostResponse).length > 0;
          } else {
            cov_htu99tt8w.b[57][1]++;
          } // one response does not need to be collapsible


          var cnt = (cov_htu99tt8w.s[171]++, Object.keys(response).length);
          cov_htu99tt8w.s[172]++;

          if (cnt === 1) {
            cov_htu99tt8w.b[58][0]++;
            cov_htu99tt8w.s[173]++;
            hostMultiLine = false;
          } else {
            cov_htu99tt8w.b[58][1]++;
          }

          cov_htu99tt8w.s[174]++;

          if (hostMultiLine) {
            cov_htu99tt8w.b[59][0]++;
            cov_htu99tt8w.s[175]++;
            nrMultiLineBlocks += 1;
          } else {
            cov_htu99tt8w.b[59][1]++;
          } // compose the actual output


          var div = (cov_htu99tt8w.s[176]++, document.createElement("div"));
          cov_htu99tt8w.s[177]++;
          div.append(hostLabel);
          cov_htu99tt8w.s[178]++;
          div.appendChild(document.createTextNode(": ")); // multiple line, collapsible
          // 25B7 = WHITE RIGHT-POINTING TRIANGLE
          // 25BD = WHITE DOWN-POINTING TRIANGLE

          var triangle = (cov_htu99tt8w.s[179]++, null);
          cov_htu99tt8w.s[180]++;

          if (hostMultiLine) {
            cov_htu99tt8w.b[60][0]++;
            cov_htu99tt8w.s[181]++;
            triangle = document.createElement("span");
            cov_htu99tt8w.s[182]++;
            triangle.innerText = "\u25BD";
            cov_htu99tt8w.s[183]++;
            triangle.style = "cursor: pointer";
            cov_htu99tt8w.s[184]++;
            triangle.classList.add("triangle");
            cov_htu99tt8w.s[185]++;
            div.appendChild(triangle);
            cov_htu99tt8w.s[186]++;
            div.appendChild(document.createElement("br"));
            cov_htu99tt8w.s[187]++;
            triangle.addEventListener("click", function (_) {
              cov_htu99tt8w.f[11]++;
              cov_htu99tt8w.s[188]++;

              // 25B7 = WHITE RIGHT-POINTING TRIANGLE
              // 25BD = WHITE DOWN-POINTING TRIANGLE
              if (triangle.innerText !== "\u25BD") {
                cov_htu99tt8w.b[61][0]++;
                cov_htu99tt8w.s[189]++;
                triangle.innerText = "\u25BD";
                cov_htu99tt8w.s[190]++;
                hostOutput.style.display = "";
              } else {
                cov_htu99tt8w.b[61][1]++;
                cov_htu99tt8w.s[191]++;
                triangle.innerText = "\u25B7";
                cov_htu99tt8w.s[192]++;
                hostOutput.style.display = "none";
              }
            });
          } else {
            cov_htu99tt8w.b[60][1]++;
          }

          cov_htu99tt8w.s[193]++;
          div.append(hostOutput);
          cov_htu99tt8w.s[194]++;
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

      cov_htu99tt8w.s[195]++;

      if (nrMultiLineBlocks <= 1) {
        cov_htu99tt8w.b[62][0]++;
        cov_htu99tt8w.s[196]++;
        // No collapsible elements, hide the master
        // Also hide with 1 collapsible element
        masterTriangle.style.display = "none";
      } else {
        cov_htu99tt8w.b[62][1]++;
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
var cov_heqh4ihfo = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputDocumentation.js";
  var hash = "19f1995b5428832ce03abec1e761ee0b2a699edd";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputDocumentation.js",
    statementMap: {
      "0": {
        start: {
          line: 7,
          column: 4
        },
        end: {
          line: 7,
          column: 31
        }
      },
      "1": {
        start: {
          line: 7,
          column: 19
        },
        end: {
          line: 7,
          column: 31
        }
      },
      "2": {
        start: {
          line: 10,
          column: 4
        },
        end: {
          line: 10,
          column: 38
        }
      },
      "3": {
        start: {
          line: 10,
          column: 26
        },
        end: {
          line: 10,
          column: 38
        }
      },
      "4": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 52
        }
      },
      "5": {
        start: {
          line: 13,
          column: 40
        },
        end: {
          line: 13,
          column: 52
        }
      },
      "6": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 17
        }
      },
      "7": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 58
        }
      },
      "8": {
        start: {
          line: 27,
          column: 45
        },
        end: {
          line: 27,
          column: 58
        }
      },
      "9": {
        start: {
          line: 29,
          column: 17
        },
        end: {
          line: 29,
          column: 22
        }
      },
      "10": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 59
        }
      },
      "11": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 71,
          column: 5
        }
      },
      "12": {
        start: {
          line: 36,
          column: 21
        },
        end: {
          line: 36,
          column: 39
        }
      },
      "13": {
        start: {
          line: 38,
          column: 6
        },
        end: {
          line: 42,
          column: 7
        }
      },
      "14": {
        start: {
          line: 41,
          column: 8
        },
        end: {
          line: 41,
          column: 17
        }
      },
      "15": {
        start: {
          line: 44,
          column: 6
        },
        end: {
          line: 47,
          column: 7
        }
      },
      "16": {
        start: {
          line: 46,
          column: 8
        },
        end: {
          line: 46,
          column: 21
        }
      },
      "17": {
        start: {
          line: 51,
          column: 6
        },
        end: {
          line: 53,
          column: 7
        }
      },
      "18": {
        start: {
          line: 52,
          column: 8
        },
        end: {
          line: 52,
          column: 21
        }
      },
      "19": {
        start: {
          line: 55,
          column: 6
        },
        end: {
          line: 70,
          column: 7
        }
      },
      "20": {
        start: {
          line: 57,
          column: 8
        },
        end: {
          line: 59,
          column: 9
        }
      },
      "21": {
        start: {
          line: 58,
          column: 10
        },
        end: {
          line: 58,
          column: 19
        }
      },
      "22": {
        start: {
          line: 62,
          column: 8
        },
        end: {
          line: 64,
          column: 9
        }
      },
      "23": {
        start: {
          line: 63,
          column: 10
        },
        end: {
          line: 63,
          column: 23
        }
      },
      "24": {
        start: {
          line: 67,
          column: 8
        },
        end: {
          line: 69,
          column: 9
        }
      },
      "25": {
        start: {
          line: 68,
          column: 10
        },
        end: {
          line: 68,
          column: 24
        }
      },
      "26": {
        start: {
          line: 73,
          column: 4
        },
        end: {
          line: 73,
          column: 18
        }
      },
      "27": {
        start: {
          line: 79,
          column: 4
        },
        end: {
          line: 81,
          column: 5
        }
      },
      "28": {
        start: {
          line: 80,
          column: 6
        },
        end: {
          line: 80,
          column: 16
        }
      },
      "29": {
        start: {
          line: 82,
          column: 4
        },
        end: {
          line: 85,
          column: 5
        }
      },
      "30": {
        start: {
          line: 84,
          column: 6
        },
        end: {
          line: 84,
          column: 36
        }
      },
      "31": {
        start: {
          line: 87,
          column: 4
        },
        end: {
          line: 89,
          column: 5
        }
      },
      "32": {
        start: {
          line: 88,
          column: 6
        },
        end: {
          line: 88,
          column: 16
        }
      },
      "33": {
        start: {
          line: 90,
          column: 4
        },
        end: {
          line: 93,
          column: 5
        }
      },
      "34": {
        start: {
          line: 92,
          column: 6
        },
        end: {
          line: 92,
          column: 36
        }
      },
      "35": {
        start: {
          line: 95,
          column: 4
        },
        end: {
          line: 95,
          column: 21
        }
      },
      "36": {
        start: {
          line: 113,
          column: 4
        },
        end: {
          line: 116,
          column: 5
        }
      },
      "37": {
        start: {
          line: 115,
          column: 6
        },
        end: {
          line: 115,
          column: 13
        }
      },
      "38": {
        start: {
          line: 120,
          column: 4
        },
        end: {
          line: 120,
          column: 63
        }
      },
      "39": {
        start: {
          line: 122,
          column: 25
        },
        end: {
          line: 122,
          column: 29
        }
      },
      "40": {
        start: {
          line: 123,
          column: 4
        },
        end: {
          line: 161,
          column: 5
        }
      },
      "41": {
        start: {
          line: 126,
          column: 6
        },
        end: {
          line: 129,
          column: 7
        }
      },
      "42": {
        start: {
          line: 127,
          column: 8
        },
        end: {
          line: 127,
          column: 34
        }
      },
      "43": {
        start: {
          line: 128,
          column: 8
        },
        end: {
          line: 128,
          column: 17
        }
      },
      "44": {
        start: {
          line: 133,
          column: 6
        },
        end: {
          line: 136,
          column: 7
        }
      },
      "45": {
        start: {
          line: 134,
          column: 8
        },
        end: {
          line: 134,
          column: 34
        }
      },
      "46": {
        start: {
          line: 135,
          column: 8
        },
        end: {
          line: 135,
          column: 17
        }
      },
      "47": {
        start: {
          line: 141,
          column: 27
        },
        end: {
          line: 141,
          column: 45
        }
      },
      "48": {
        start: {
          line: 142,
          column: 6
        },
        end: {
          line: 149,
          column: 7
        }
      },
      "49": {
        start: {
          line: 145,
          column: 8
        },
        end: {
          line: 148,
          column: 9
        }
      },
      "50": {
        start: {
          line: 147,
          column: 10
        },
        end: {
          line: 147,
          column: 35
        }
      },
      "51": {
        start: {
          line: 153,
          column: 6
        },
        end: {
          line: 156,
          column: 7
        }
      },
      "52": {
        start: {
          line: 154,
          column: 8
        },
        end: {
          line: 154,
          column: 34
        }
      },
      "53": {
        start: {
          line: 155,
          column: 8
        },
        end: {
          line: 155,
          column: 17
        }
      },
      "54": {
        start: {
          line: 160,
          column: 6
        },
        end: {
          line: 160,
          column: 32
        }
      },
      "55": {
        start: {
          line: 163,
          column: 4
        },
        end: {
          line: 173,
          column: 5
        }
      },
      "56": {
        start: {
          line: 165,
          column: 33
        },
        end: {
          line: 165,
          column: 57
        }
      },
      "57": {
        start: {
          line: 166,
          column: 6
        },
        end: {
          line: 166,
          column: 38
        }
      },
      "58": {
        start: {
          line: 167,
          column: 6
        },
        end: {
          line: 167,
          column: 47
        }
      },
      "59": {
        start: {
          line: 171,
          column: 6
        },
        end: {
          line: 171,
          column: 30
        }
      },
      "60": {
        start: {
          line: 172,
          column: 6
        },
        end: {
          line: 172,
          column: 62
        }
      },
      "61": {
        start: {
          line: 181,
          column: 4
        },
        end: {
          line: 253,
          column: 5
        }
      },
      "62": {
        start: {
          line: 183,
          column: 27
        },
        end: {
          line: 183,
          column: 45
        }
      },
      "63": {
        start: {
          line: 185,
          column: 6
        },
        end: {
          line: 252,
          column: 7
        }
      },
      "64": {
        start: {
          line: 187,
          column: 18
        },
        end: {
          line: 187,
          column: 35
        }
      },
      "65": {
        start: {
          line: 188,
          column: 8
        },
        end: {
          line: 188,
          column: 34
        }
      },
      "66": {
        start: {
          line: 188,
          column: 25
        },
        end: {
          line: 188,
          column: 34
        }
      },
      "67": {
        start: {
          line: 189,
          column: 8
        },
        end: {
          line: 189,
          column: 30
        }
      },
      "68": {
        start: {
          line: 193,
          column: 8
        },
        end: {
          line: 193,
          column: 52
        }
      },
      "69": {
        start: {
          line: 197,
          column: 8
        },
        end: {
          line: 197,
          column: 49
        }
      },
      "70": {
        start: {
          line: 201,
          column: 8
        },
        end: {
          line: 201,
          column: 51
        }
      },
      "71": {
        start: {
          line: 205,
          column: 8
        },
        end: {
          line: 205,
          column: 41
        }
      },
      "72": {
        start: {
          line: 209,
          column: 8
        },
        end: {
          line: 209,
          column: 40
        }
      },
      "73": {
        start: {
          line: 213,
          column: 8
        },
        end: {
          line: 213,
          column: 40
        }
      },
      "74": {
        start: {
          line: 217,
          column: 8
        },
        end: {
          line: 234,
          column: 9
        }
      },
      "75": {
        start: {
          line: 219,
          column: 28
        },
        end: {
          line: 221,
          column: 46
        }
      },
      "76": {
        start: {
          line: 222,
          column: 24
        },
        end: {
          line: 222,
          column: 45
        }
      },
      "77": {
        start: {
          line: 223,
          column: 10
        },
        end: {
          line: 223,
          column: 72
        }
      },
      "78": {
        start: {
          line: 223,
          column: 35
        },
        end: {
          line: 223,
          column: 63
        }
      },
      "79": {
        start: {
          line: 223,
          column: 64
        },
        end: {
          line: 223,
          column: 70
        }
      },
      "80": {
        start: {
          line: 224,
          column: 23
        },
        end: {
          line: 224,
          column: 31
        }
      },
      "81": {
        start: {
          line: 225,
          column: 25
        },
        end: {
          line: 225,
          column: 33
        }
      },
      "82": {
        start: {
          line: 227,
          column: 10
        },
        end: {
          line: 231,
          column: 11
        }
      },
      "83": {
        start: {
          line: 228,
          column: 12
        },
        end: {
          line: 230,
          column: 75
        }
      },
      "84": {
        start: {
          line: 233,
          column: 10
        },
        end: {
          line: 233,
          column: 52
        }
      },
      "85": {
        start: {
          line: 238,
          column: 8
        },
        end: {
          line: 238,
          column: 95
        }
      },
      "86": {
        start: {
          line: 242,
          column: 8
        },
        end: {
          line: 242,
          column: 81
        }
      },
      "87": {
        start: {
          line: 245,
          column: 8
        },
        end: {
          line: 245,
          column: 41
        }
      },
      "88": {
        start: {
          line: 248,
          column: 8
        },
        end: {
          line: 248,
          column: 47
        }
      },
      "89": {
        start: {
          line: 250,
          column: 8
        },
        end: {
          line: 251,
          column: 139
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 4,
            column: 2
          },
          end: {
            line: 4,
            column: 3
          }
        },
        loc: {
          start: {
            line: 4,
            column: 40
          },
          end: {
            line: 17,
            column: 3
          }
        },
        line: 4
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 25,
            column: 2
          },
          end: {
            line: 25,
            column: 3
          }
        },
        loc: {
          start: {
            line: 25,
            column: 58
          },
          end: {
            line: 74,
            column: 3
          }
        },
        line: 25
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 78,
            column: 2
          },
          end: {
            line: 78,
            column: 3
          }
        },
        loc: {
          start: {
            line: 78,
            column: 36
          },
          end: {
            line: 96,
            column: 3
          }
        },
        line: 78
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 112,
            column: 2
          },
          end: {
            line: 112,
            column: 3
          }
        },
        loc: {
          start: {
            line: 112,
            column: 67
          },
          end: {
            line: 174,
            column: 3
          }
        },
        line: 112
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 177,
            column: 2
          },
          end: {
            line: 177,
            column: 3
          }
        },
        loc: {
          start: {
            line: 177,
            column: 59
          },
          end: {
            line: 254,
            column: 3
          }
        },
        line: 177
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 31
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 31
          }
        }, {
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 31
          }
        }],
        line: 7
      },
      "1": {
        loc: {
          start: {
            line: 10,
            column: 4
          },
          end: {
            line: 10,
            column: 38
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 10,
            column: 4
          },
          end: {
            line: 10,
            column: 38
          }
        }, {
          start: {
            line: 10,
            column: 4
          },
          end: {
            line: 10,
            column: 38
          }
        }],
        line: 10
      },
      "2": {
        loc: {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 13,
            column: 52
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 13,
            column: 52
          }
        }, {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 13,
            column: 52
          }
        }],
        line: 13
      },
      "3": {
        loc: {
          start: {
            line: 27,
            column: 4
          },
          end: {
            line: 27,
            column: 58
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 27,
            column: 4
          },
          end: {
            line: 27,
            column: 58
          }
        }, {
          start: {
            line: 27,
            column: 4
          },
          end: {
            line: 27,
            column: 58
          }
        }],
        line: 27
      },
      "4": {
        loc: {
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 42,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 42,
            column: 7
          }
        }, {
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 42,
            column: 7
          }
        }],
        line: 38
      },
      "5": {
        loc: {
          start: {
            line: 44,
            column: 6
          },
          end: {
            line: 47,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 44,
            column: 6
          },
          end: {
            line: 47,
            column: 7
          }
        }, {
          start: {
            line: 44,
            column: 6
          },
          end: {
            line: 47,
            column: 7
          }
        }],
        line: 44
      },
      "6": {
        loc: {
          start: {
            line: 51,
            column: 6
          },
          end: {
            line: 53,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 51,
            column: 6
          },
          end: {
            line: 53,
            column: 7
          }
        }, {
          start: {
            line: 51,
            column: 6
          },
          end: {
            line: 53,
            column: 7
          }
        }],
        line: 51
      },
      "7": {
        loc: {
          start: {
            line: 57,
            column: 8
          },
          end: {
            line: 59,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 57,
            column: 8
          },
          end: {
            line: 59,
            column: 9
          }
        }, {
          start: {
            line: 57,
            column: 8
          },
          end: {
            line: 59,
            column: 9
          }
        }],
        line: 57
      },
      "8": {
        loc: {
          start: {
            line: 62,
            column: 8
          },
          end: {
            line: 64,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 62,
            column: 8
          },
          end: {
            line: 64,
            column: 9
          }
        }, {
          start: {
            line: 62,
            column: 8
          },
          end: {
            line: 64,
            column: 9
          }
        }],
        line: 62
      },
      "9": {
        loc: {
          start: {
            line: 67,
            column: 8
          },
          end: {
            line: 69,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 67,
            column: 8
          },
          end: {
            line: 69,
            column: 9
          }
        }, {
          start: {
            line: 67,
            column: 8
          },
          end: {
            line: 69,
            column: 9
          }
        }],
        line: 67
      },
      "10": {
        loc: {
          start: {
            line: 79,
            column: 4
          },
          end: {
            line: 81,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 79,
            column: 4
          },
          end: {
            line: 81,
            column: 5
          }
        }, {
          start: {
            line: 79,
            column: 4
          },
          end: {
            line: 81,
            column: 5
          }
        }],
        line: 79
      },
      "11": {
        loc: {
          start: {
            line: 82,
            column: 4
          },
          end: {
            line: 85,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 82,
            column: 4
          },
          end: {
            line: 85,
            column: 5
          }
        }, {
          start: {
            line: 82,
            column: 4
          },
          end: {
            line: 85,
            column: 5
          }
        }],
        line: 82
      },
      "12": {
        loc: {
          start: {
            line: 87,
            column: 4
          },
          end: {
            line: 89,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 87,
            column: 4
          },
          end: {
            line: 89,
            column: 5
          }
        }, {
          start: {
            line: 87,
            column: 4
          },
          end: {
            line: 89,
            column: 5
          }
        }],
        line: 87
      },
      "13": {
        loc: {
          start: {
            line: 90,
            column: 4
          },
          end: {
            line: 93,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 90,
            column: 4
          },
          end: {
            line: 93,
            column: 5
          }
        }, {
          start: {
            line: 90,
            column: 4
          },
          end: {
            line: 93,
            column: 5
          }
        }],
        line: 90
      },
      "14": {
        loc: {
          start: {
            line: 113,
            column: 4
          },
          end: {
            line: 116,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 113,
            column: 4
          },
          end: {
            line: 116,
            column: 5
          }
        }, {
          start: {
            line: 113,
            column: 4
          },
          end: {
            line: 116,
            column: 5
          }
        }],
        line: 113
      },
      "15": {
        loc: {
          start: {
            line: 113,
            column: 7
          },
          end: {
            line: 113,
            column: 48
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 113,
            column: 7
          },
          end: {
            line: 113,
            column: 16
          }
        }, {
          start: {
            line: 113,
            column: 20
          },
          end: {
            line: 113,
            column: 48
          }
        }],
        line: 113
      },
      "16": {
        loc: {
          start: {
            line: 126,
            column: 6
          },
          end: {
            line: 129,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 126,
            column: 6
          },
          end: {
            line: 129,
            column: 7
          }
        }, {
          start: {
            line: 126,
            column: 6
          },
          end: {
            line: 129,
            column: 7
          }
        }],
        line: 126
      },
      "17": {
        loc: {
          start: {
            line: 133,
            column: 6
          },
          end: {
            line: 136,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 133,
            column: 6
          },
          end: {
            line: 136,
            column: 7
          }
        }, {
          start: {
            line: 133,
            column: 6
          },
          end: {
            line: 136,
            column: 7
          }
        }],
        line: 133
      },
      "18": {
        loc: {
          start: {
            line: 133,
            column: 9
          },
          end: {
            line: 133,
            column: 70
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 133,
            column: 9
          },
          end: {
            line: 133,
            column: 28
          }
        }, {
          start: {
            line: 133,
            column: 32
          },
          end: {
            line: 133,
            column: 70
          }
        }],
        line: 133
      },
      "19": {
        loc: {
          start: {
            line: 145,
            column: 8
          },
          end: {
            line: 148,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 145,
            column: 8
          },
          end: {
            line: 148,
            column: 9
          }
        }, {
          start: {
            line: 145,
            column: 8
          },
          end: {
            line: 148,
            column: 9
          }
        }],
        line: 145
      },
      "20": {
        loc: {
          start: {
            line: 153,
            column: 6
          },
          end: {
            line: 156,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 153,
            column: 6
          },
          end: {
            line: 156,
            column: 7
          }
        }, {
          start: {
            line: 153,
            column: 6
          },
          end: {
            line: 156,
            column: 7
          }
        }],
        line: 153
      },
      "21": {
        loc: {
          start: {
            line: 163,
            column: 4
          },
          end: {
            line: 173,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 163,
            column: 4
          },
          end: {
            line: 173,
            column: 5
          }
        }, {
          start: {
            line: 163,
            column: 4
          },
          end: {
            line: 173,
            column: 5
          }
        }],
        line: 163
      },
      "22": {
        loc: {
          start: {
            line: 188,
            column: 8
          },
          end: {
            line: 188,
            column: 34
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 188,
            column: 8
          },
          end: {
            line: 188,
            column: 34
          }
        }, {
          start: {
            line: 188,
            column: 8
          },
          end: {
            line: 188,
            column: 34
          }
        }],
        line: 188
      },
      "23": {
        loc: {
          start: {
            line: 223,
            column: 10
          },
          end: {
            line: 223,
            column: 72
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 223,
            column: 10
          },
          end: {
            line: 223,
            column: 72
          }
        }, {
          start: {
            line: 223,
            column: 10
          },
          end: {
            line: 223,
            column: 72
          }
        }],
        line: 223
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0,
      "60": 0,
      "61": 0,
      "62": 0,
      "63": 0,
      "64": 0,
      "65": 0,
      "66": 0,
      "67": 0,
      "68": 0,
      "69": 0,
      "70": 0,
      "71": 0,
      "72": 0,
      "73": 0,
      "74": 0,
      "75": 0,
      "76": 0,
      "77": 0,
      "78": 0,
      "79": 0,
      "80": 0,
      "81": 0,
      "82": 0,
      "83": 0,
      "84": 0,
      "85": 0,
      "86": 0,
      "87": 0,
      "88": 0,
      "89": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0, 0],
      "18": [0, 0],
      "19": [0, 0],
      "20": [0, 0],
      "21": [0, 0],
      "22": [0, 0],
      "23": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

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
      cov_heqh4ihfo.f[0]++;
      cov_heqh4ihfo.s[0]++;

      // no filter is always OK
      if (!filterKey) {
        cov_heqh4ihfo.b[0][0]++;
        cov_heqh4ihfo.s[1]++;
        return true;
      } else {
        cov_heqh4ihfo.b[0][1]++;
      } // an exact match is great


      cov_heqh4ihfo.s[2]++;

      if (key === filterKey) {
        cov_heqh4ihfo.b[1][0]++;
        cov_heqh4ihfo.s[3]++;
        return true;
      } else {
        cov_heqh4ihfo.b[1][1]++;
      } // a true prefix is also ok


      cov_heqh4ihfo.s[4]++;

      if (key.startsWith(filterKey + ".")) {
        cov_heqh4ihfo.b[2][0]++;
        cov_heqh4ihfo.s[5]++;
        return true;
      } else {
        cov_heqh4ihfo.b[2][1]++;
      } // no match


      cov_heqh4ihfo.s[6]++;
      return false;
    } // we only treat output as documentation output when it sticks to strict rules
    // all minions must return strings
    // and when its key matches the requested documentation
    // empty values are allowed due to errors in the documentation
    // 'output' is needed like this to prevent an error during testing

  }, {
    key: "isDocumentationOutput",
    value: function isDocumentationOutput(output, response, command) {
      cov_heqh4ihfo.f[1]++;
      cov_heqh4ihfo.s[7]++;

      if (!output.isOutputFormatAllowed("doc")) {
        cov_heqh4ihfo.b[3][0]++;
        cov_heqh4ihfo.s[8]++;
        return false;
      } else {
        cov_heqh4ihfo.b[3][1]++;
      }

      var result = (cov_heqh4ihfo.s[9]++, false); // reduce the search key to match the data in the response

      cov_heqh4ihfo.s[10]++;
      command = OutputDocumentation.reduceFilterKey(command);
      cov_heqh4ihfo.s[11]++;

      var _arr = Object.keys(response);

      for (var _i = 0; _i < _arr.length; _i++) {
        var hostname = _arr[_i];

        var _output = (cov_heqh4ihfo.s[12]++, response[hostname]);

        cov_heqh4ihfo.s[13]++;

        if (!_output) {
          cov_heqh4ihfo.b[4][0]++;
          cov_heqh4ihfo.s[14]++;
          // some commands do not have help-text
          // e.g. wheel.key.get_key
          continue;
        } else {
          cov_heqh4ihfo.b[4][1]++;
        }

        cov_heqh4ihfo.s[15]++;

        if (_typeof(_output) !== "object") {
          cov_heqh4ihfo.b[5][0]++;
          cov_heqh4ihfo.s[16]++;
          // strange --> no documentation object
          return false;
        } else {
          cov_heqh4ihfo.b[5][1]++;
        } // arrays are also objects,
        // but not what we are looking for


        cov_heqh4ihfo.s[17]++;

        if (Array.isArray(_output)) {
          cov_heqh4ihfo.b[6][0]++;
          cov_heqh4ihfo.s[18]++;
          return false;
        } else {
          cov_heqh4ihfo.b[6][1]++;
        }

        cov_heqh4ihfo.s[19]++;

        var _arr2 = Object.keys(_output);

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var key = _arr2[_i2];
          cov_heqh4ihfo.s[20]++;

          // e.g. for "test.rand_str"
          if (_output[key] === null) {
            cov_heqh4ihfo.b[7][0]++;
            cov_heqh4ihfo.s[21]++;
            continue;
          } else {
            cov_heqh4ihfo.b[7][1]++;
          } // but otherwise it must be a (documentation)string


          cov_heqh4ihfo.s[22]++;

          if (typeof _output[key] !== "string") {
            cov_heqh4ihfo.b[8][0]++;
            cov_heqh4ihfo.s[23]++;
            return false;
          } else {
            cov_heqh4ihfo.b[8][1]++;
          } // is this what we were looking for?


          cov_heqh4ihfo.s[24]++;

          if (OutputDocumentation.isDocuKeyMatch(key, command)) {
            cov_heqh4ihfo.b[9][0]++;
            cov_heqh4ihfo.s[25]++;
            result = true;
          } else {
            cov_heqh4ihfo.b[9][1]++;
          }
        }
      }

      cov_heqh4ihfo.s[26]++;
      return result;
    } // reduce the search key to match the data in the response

  }, {
    key: "reduceFilterKey",
    value: function reduceFilterKey(filterKey) {
      cov_heqh4ihfo.f[2]++;
      cov_heqh4ihfo.s[27]++;

      if (filterKey === "wheel") {
        cov_heqh4ihfo.b[10][0]++;
        cov_heqh4ihfo.s[28]++;
        return "";
      } else {
        cov_heqh4ihfo.b[10][1]++;
      }

      cov_heqh4ihfo.s[29]++;

      if (filterKey.startsWith("wheel.")) {
        cov_heqh4ihfo.b[11][0]++;
        cov_heqh4ihfo.s[30]++;
        // strip the prefix "wheel."
        return filterKey.substring(6);
      } else {
        cov_heqh4ihfo.b[11][1]++;
      }

      cov_heqh4ihfo.s[31]++;

      if (filterKey === "runners") {
        cov_heqh4ihfo.b[12][0]++;
        cov_heqh4ihfo.s[32]++;
        return "";
      } else {
        cov_heqh4ihfo.b[12][1]++;
      }

      cov_heqh4ihfo.s[33]++;

      if (filterKey.startsWith("runners.")) {
        cov_heqh4ihfo.b[13][0]++;
        cov_heqh4ihfo.s[34]++;
        // strip the prefix "runners."
        return filterKey.substring(8);
      } else {
        cov_heqh4ihfo.b[13][1]++;
      }

      cov_heqh4ihfo.s[35]++;
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
      cov_heqh4ihfo.f[3]++;
      cov_heqh4ihfo.s[36]++;

      if ((cov_heqh4ihfo.b[15][0]++, !response) || (cov_heqh4ihfo.b[15][1]++, _typeof(response) !== "object")) {
        cov_heqh4ihfo.b[14][0]++;
        cov_heqh4ihfo.s[37]++;
        // strange --> don't try to fix anything
        return;
      } else {
        cov_heqh4ihfo.b[14][1]++;
      } // reduce the search key to match the data in the response
      // i.e. remove the prefixes for "wheel" and "runners"


      cov_heqh4ihfo.s[38]++;
      filterKey = OutputDocumentation.reduceFilterKey(filterKey);
      var selectedMinion = (cov_heqh4ihfo.s[39]++, null);
      cov_heqh4ihfo.s[40]++;

      var _arr3 = Object.keys(response);

      for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
        var hostname = _arr3[_i3];
        cov_heqh4ihfo.s[41]++;

        // When we already found the documentation ignore all others
        if (selectedMinion) {
          cov_heqh4ihfo.b[16][0]++;
          cov_heqh4ihfo.s[42]++;
          delete response[hostname];
          cov_heqh4ihfo.s[43]++;
          continue;
        } else {
          cov_heqh4ihfo.b[16][1]++;
        } // make sure it is an object (instead of e.g. "false" for an offline minion)
        // when it is not, the whole entry is ignored


        cov_heqh4ihfo.s[44]++;

        if ((cov_heqh4ihfo.b[18][0]++, !response[hostname]) || (cov_heqh4ihfo.b[18][1]++, _typeof(response[hostname]) !== "object")) {
          cov_heqh4ihfo.b[17][0]++;
          cov_heqh4ihfo.s[45]++;
          delete response[hostname];
          cov_heqh4ihfo.s[46]++;
          continue;
        } else {
          cov_heqh4ihfo.b[17][1]++;
        } // make sure that the entry matches with the requested command or prefix
        // that's always the case for SYS.DOC output, but not for RUNNERS.DOC.RUNNER
        // and/or RUNNERS.DOC.WHEEL.


        var hostResponse = (cov_heqh4ihfo.s[47]++, response[hostname]);
        cov_heqh4ihfo.s[48]++;

        var _arr4 = Object.keys(hostResponse);

        for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
          var key = _arr4[_i4];
          cov_heqh4ihfo.s[49]++;

          // is this what we were looking for?
          if (!OutputDocumentation.isDocuKeyMatch(key, filterKey)) {
            cov_heqh4ihfo.b[19][0]++;
            cov_heqh4ihfo.s[50]++;
            // no match, ignore the whole entry
            delete hostResponse[key];
          } else {
            cov_heqh4ihfo.b[19][1]++;
          }
        } // no documentation present (or left) on this minion?
        // then discard the result of this minion


        cov_heqh4ihfo.s[51]++;

        if (Object.keys(hostResponse).length === 0) {
          cov_heqh4ihfo.b[20][0]++;
          cov_heqh4ihfo.s[52]++;
          delete response[hostname];
          cov_heqh4ihfo.s[53]++;
          continue;
        } else {
          cov_heqh4ihfo.b[20][1]++;
        } // we have found documentation output
        // mark all other documentation for discarding


        cov_heqh4ihfo.s[54]++;
        selectedMinion = hostname;
      }

      cov_heqh4ihfo.s[55]++;

      if (selectedMinion) {
        cov_heqh4ihfo.b[21][0]++;
        // basically rename the key
        var savedDocumentation = (cov_heqh4ihfo.s[56]++, response[selectedMinion]);
        cov_heqh4ihfo.s[57]++;
        delete response[selectedMinion];
        cov_heqh4ihfo.s[58]++;
        response[visualKey] = savedDocumentation;
      } else {
        cov_heqh4ihfo.b[21][1]++;
        cov_heqh4ihfo.s[59]++;
        // prepare a dummy response when no documentation could be found
        // otherwise leave all documentation responses organized by minion
        response["dummy"] = {};
        cov_heqh4ihfo.s[60]++;
        response["dummy"][visualKey] = "no documentation found";
      }
    } // add the output of a documentation command to the display

  }, {
    key: "addDocumentationOutput",
    value: function addDocumentationOutput(outputContainer, response) {
      cov_heqh4ihfo.f[4]++;
      cov_heqh4ihfo.s[61]++;

      // we expect no hostnames present
      // as it should have been reduced already
      var _arr5 = Object.keys(response);

      for (var _i5 = 0; _i5 < _arr5.length; _i5++) {
        var hostname = _arr5[_i5];
        var hostResponse = (cov_heqh4ihfo.s[62]++, response[hostname]);
        cov_heqh4ihfo.s[63]++;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(hostResponse).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;
            var out = (cov_heqh4ihfo.s[64]++, hostResponse[key]);
            cov_heqh4ihfo.s[65]++;

            if (out === null) {
              cov_heqh4ihfo.b[22][0]++;
              cov_heqh4ihfo.s[66]++;
              continue;
            } else {
              cov_heqh4ihfo.b[22][1]++;
            }

            cov_heqh4ihfo.s[67]++;
            out = out.trimRight(); // internal links: remove the ".. rubric::" prefix
            // e.g. in "sys.doc state.apply"

            cov_heqh4ihfo.s[68]++;
            out = out.replace(/[.][.] rubric:: */g, ""); // internal links: remove prefixes like ":mod:" and ":py:func:"
            // e.g. in "sys.doc state.apply"

            cov_heqh4ihfo.s[69]++;
            out = out.replace(/(:[a-z_]*)*:`/g, "`"); // internal links: remove link indicators in highlighted text
            // e.g. in "sys.doc state.apply"

            cov_heqh4ihfo.s[70]++;
            out = out.replace(/[ \n]*<[^`]*>`/gm, "`"); // turn text into html
            // e.g. in "sys.doc cmd.run"

            cov_heqh4ihfo.s[71]++;
            out = out.replace(/&/g, "&amp;"); // turn text into html
            // e.g. in "sys.doc state.template"

            cov_heqh4ihfo.s[72]++;
            out = out.replace(/</g, "&lt;"); // turn text into html
            // e.g. in "sys.doc state.template"

            cov_heqh4ihfo.s[73]++;
            out = out.replace(/>/g, "&gt;"); // external links
            // e.g. in "sys.doc pkg.install"

            cov_heqh4ihfo.s[74]++;

            while (out.includes(".. _")) {
              // take only a line containing ".. _"
              var reference = (cov_heqh4ihfo.s[75]++, out.replace(/^(.|\n|\r)*[.][.] _/m, "").replace(/(\n|\r)(.|\n|\r)*$/m, ""));
              var words = (cov_heqh4ihfo.s[76]++, reference.split(": "));
              cov_heqh4ihfo.s[77]++;

              if (words.length !== 2) {
                cov_heqh4ihfo.b[23][0]++;
                cov_heqh4ihfo.s[78]++;
                console.log("words", words);
                cov_heqh4ihfo.s[79]++;
                break;
              } else {
                cov_heqh4ihfo.b[23][1]++;
              }

              var link = (cov_heqh4ihfo.s[80]++, words[0]);
              var target = (cov_heqh4ihfo.s[81]++, words[1]); // add link to all references

              cov_heqh4ihfo.s[82]++;

              while (out.includes(link + "_")) {
                cov_heqh4ihfo.s[83]++;
                out = out.replace(link + "_", "<a href='" + target + "' target='_blank'>" + link + "</a>");
              } // remove the item from the link table


              cov_heqh4ihfo.s[84]++;
              out = out.replace(".. _" + reference, "");
            } // replace ``......``
            // e.g. in "sys.doc state.apply"


            cov_heqh4ihfo.s[85]++;
            out = out.replace(/``([^`]*)``/g, "<span style='background-color: #575757'>$1</span>"); // replace `......`
            // e.g. in "sys.doc state.apply"

            cov_heqh4ihfo.s[86]++;
            out = out.replace(/`([^`]*)`/g, "<span style='color: yellow'>$1</span>"); // remove whitespace at end of lines

            cov_heqh4ihfo.s[87]++;
            out = out.replace(/  *\n/gm, ""); // remove duplicate empty lines (usually due to previous rule)

            cov_heqh4ihfo.s[88]++;
            out = out.replace(/\n\n\n*/gm, "\n\n");
            cov_heqh4ihfo.s[89]++;
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
var cov_rtw3odfoo = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputHighstate.js";
  var hash = "50e41bf07fe7ecad7508c4032276e0833a724d3b";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputHighstate.js",
    statementMap: {
      "0": {
        start: {
          line: 7,
          column: 4
        },
        end: {
          line: 7,
          column: 64
        }
      },
      "1": {
        start: {
          line: 7,
          column: 51
        },
        end: {
          line: 7,
          column: 64
        }
      },
      "2": {
        start: {
          line: 9,
          column: 4
        },
        end: {
          line: 9,
          column: 50
        }
      },
      "3": {
        start: {
          line: 9,
          column: 37
        },
        end: {
          line: 9,
          column: 50
        }
      },
      "4": {
        start: {
          line: 10,
          column: 4
        },
        end: {
          line: 10,
          column: 45
        }
      },
      "5": {
        start: {
          line: 10,
          column: 32
        },
        end: {
          line: 10,
          column: 45
        }
      },
      "6": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 11,
          column: 80
        }
      },
      "7": {
        start: {
          line: 11,
          column: 67
        },
        end: {
          line: 11,
          column: 80
        }
      },
      "8": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 15,
          column: 5
        }
      },
      "9": {
        start: {
          line: 13,
          column: 25
        },
        end: {
          line: 13,
          column: 41
        }
      },
      "10": {
        start: {
          line: 14,
          column: 6
        },
        end: {
          line: 14,
          column: 47
        }
      },
      "11": {
        start: {
          line: 14,
          column: 34
        },
        end: {
          line: 14,
          column: 47
        }
      },
      "12": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 16
        }
      },
      "13": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 22,
          column: 5
        }
      },
      "14": {
        start: {
          line: 21,
          column: 6
        },
        end: {
          line: 21,
          column: 37
        }
      },
      "15": {
        start: {
          line: 23,
          column: 4
        },
        end: {
          line: 25,
          column: 5
        }
      },
      "16": {
        start: {
          line: 24,
          column: 6
        },
        end: {
          line: 24,
          column: 38
        }
      },
      "17": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 28,
          column: 5
        }
      },
      "18": {
        start: {
          line: 27,
          column: 6
        },
        end: {
          line: 27,
          column: 37
        }
      },
      "19": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 36
        }
      },
      "20": {
        start: {
          line: 33,
          column: 22
        },
        end: {
          line: 33,
          column: 27
        }
      },
      "21": {
        start: {
          line: 34,
          column: 19
        },
        end: {
          line: 34,
          column: 24
        }
      },
      "22": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 40,
          column: 5
        }
      },
      "23": {
        start: {
          line: 37,
          column: 19
        },
        end: {
          line: 37,
          column: 36
        }
      },
      "24": {
        start: {
          line: 38,
          column: 6
        },
        end: {
          line: 39,
          column: 47
        }
      },
      "25": {
        start: {
          line: 38,
          column: 31
        },
        end: {
          line: 38,
          column: 47
        }
      },
      "26": {
        start: {
          line: 39,
          column: 11
        },
        end: {
          line: 39,
          column: 47
        }
      },
      "27": {
        start: {
          line: 39,
          column: 28
        },
        end: {
          line: 39,
          column: 47
        }
      },
      "28": {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 44,
          column: 5
        }
      },
      "29": {
        start: {
          line: 43,
          column: 6
        },
        end: {
          line: 43,
          column: 62
        }
      },
      "30": {
        start: {
          line: 45,
          column: 4
        },
        end: {
          line: 47,
          column: 5
        }
      },
      "31": {
        start: {
          line: 46,
          column: 6
        },
        end: {
          line: 46,
          column: 60
        }
      },
      "32": {
        start: {
          line: 48,
          column: 4
        },
        end: {
          line: 48,
          column: 60
        }
      },
      "33": {
        start: {
          line: 56,
          column: 18
        },
        end: {
          line: 56,
          column: 20
        }
      },
      "34": {
        start: {
          line: 57,
          column: 4
        },
        end: {
          line: 62,
          column: 6
        }
      },
      "35": {
        start: {
          line: 59,
          column: 8
        },
        end: {
          line: 59,
          column: 50
        }
      },
      "36": {
        start: {
          line: 60,
          column: 8
        },
        end: {
          line: 60,
          column: 42
        }
      },
      "37": {
        start: {
          line: 64,
          column: 4
        },
        end: {
          line: 64,
          column: 74
        }
      },
      "38": {
        start: {
          line: 64,
          column: 32
        },
        end: {
          line: 64,
          column: 69
        }
      },
      "39": {
        start: {
          line: 66,
          column: 19
        },
        end: {
          line: 66,
          column: 25
        }
      },
      "40": {
        start: {
          line: 68,
          column: 16
        },
        end: {
          line: 68,
          column: 45
        }
      },
      "41": {
        start: {
          line: 70,
          column: 20
        },
        end: {
          line: 70,
          column: 21
        }
      },
      "42": {
        start: {
          line: 71,
          column: 17
        },
        end: {
          line: 71,
          column: 18
        }
      },
      "43": {
        start: {
          line: 72,
          column: 18
        },
        end: {
          line: 72,
          column: 19
        }
      },
      "44": {
        start: {
          line: 73,
          column: 23
        },
        end: {
          line: 73,
          column: 24
        }
      },
      "45": {
        start: {
          line: 74,
          column: 18
        },
        end: {
          line: 74,
          column: 19
        }
      },
      "46": {
        start: {
          line: 75,
          column: 4
        },
        end: {
          line: 223,
          column: 5
        }
      },
      "47": {
        start: {
          line: 77,
          column: 22
        },
        end: {
          line: 77,
          column: 51
        }
      },
      "48": {
        start: {
          line: 79,
          column: 19
        },
        end: {
          line: 79,
          column: 49
        }
      },
      "49": {
        start: {
          line: 80,
          column: 6
        },
        end: {
          line: 95,
          column: 7
        }
      },
      "50": {
        start: {
          line: 82,
          column: 8
        },
        end: {
          line: 82,
          column: 36
        }
      },
      "51": {
        start: {
          line: 83,
          column: 8
        },
        end: {
          line: 83,
          column: 34
        }
      },
      "52": {
        start: {
          line: 84,
          column: 8
        },
        end: {
          line: 84,
          column: 21
        }
      },
      "53": {
        start: {
          line: 85,
          column: 13
        },
        end: {
          line: 95,
          column: 7
        }
      },
      "54": {
        start: {
          line: 87,
          column: 8
        },
        end: {
          line: 87,
          column: 35
        }
      },
      "55": {
        start: {
          line: 88,
          column: 8
        },
        end: {
          line: 88,
          column: 34
        }
      },
      "56": {
        start: {
          line: 89,
          column: 8
        },
        end: {
          line: 89,
          column: 23
        }
      },
      "57": {
        start: {
          line: 92,
          column: 8
        },
        end: {
          line: 92,
          column: 33
        }
      },
      "58": {
        start: {
          line: 93,
          column: 8
        },
        end: {
          line: 93,
          column: 34
        }
      },
      "59": {
        start: {
          line: 94,
          column: 8
        },
        end: {
          line: 94,
          column: 20
        }
      },
      "60": {
        start: {
          line: 96,
          column: 6
        },
        end: {
          line: 96,
          column: 27
        }
      },
      "61": {
        start: {
          line: 98,
          column: 6
        },
        end: {
          line: 98,
          column: 51
        }
      },
      "62": {
        start: {
          line: 100,
          column: 6
        },
        end: {
          line: 106,
          column: 7
        }
      },
      "63": {
        start: {
          line: 101,
          column: 8
        },
        end: {
          line: 101,
          column: 59
        }
      },
      "64": {
        start: {
          line: 105,
          column: 8
        },
        end: {
          line: 105,
          column: 68
        }
      },
      "65": {
        start: {
          line: 108,
          column: 6
        },
        end: {
          line: 110,
          column: 7
        }
      },
      "66": {
        start: {
          line: 109,
          column: 8
        },
        end: {
          line: 109,
          column: 90
        }
      },
      "67": {
        start: {
          line: 112,
          column: 6
        },
        end: {
          line: 115,
          column: 7
        }
      },
      "68": {
        start: {
          line: 113,
          column: 8
        },
        end: {
          line: 114,
          column: 65
        }
      },
      "69": {
        start: {
          line: 117,
          column: 25
        },
        end: {
          line: 117,
          column: 52
        }
      },
      "70": {
        start: {
          line: 118,
          column: 6
        },
        end: {
          line: 118,
          column: 51
        }
      },
      "71": {
        start: {
          line: 119,
          column: 6
        },
        end: {
          line: 120,
          column: 72
        }
      },
      "72": {
        start: {
          line: 122,
          column: 6
        },
        end: {
          line: 130,
          column: 7
        }
      },
      "73": {
        start: {
          line: 123,
          column: 8
        },
        end: {
          line: 123,
          column: 53
        }
      },
      "74": {
        start: {
          line: 124,
          column: 18
        },
        end: {
          line: 124,
          column: 30
        }
      },
      "75": {
        start: {
          line: 126,
          column: 8
        },
        end: {
          line: 126,
          column: 44
        }
      },
      "76": {
        start: {
          line: 128,
          column: 8
        },
        end: {
          line: 128,
          column: 51
        }
      },
      "77": {
        start: {
          line: 129,
          column: 8
        },
        end: {
          line: 129,
          column: 62
        }
      },
      "78": {
        start: {
          line: 132,
          column: 6
        },
        end: {
          line: 180,
          column: 7
        }
      },
      "79": {
        start: {
          line: 133,
          column: 8
        },
        end: {
          line: 179,
          column: 9
        }
      },
      "80": {
        start: {
          line: 134,
          column: 10
        },
        end: {
          line: 134,
          column: 55
        }
      },
      "81": {
        start: {
          line: 135,
          column: 10
        },
        end: {
          line: 135,
          column: 89
        }
      },
      "82": {
        start: {
          line: 137,
          column: 10
        },
        end: {
          line: 178,
          column: 11
        }
      },
      "83": {
        start: {
          line: 138,
          column: 12
        },
        end: {
          line: 138,
          column: 34
        }
      },
      "84": {
        start: {
          line: 139,
          column: 27
        },
        end: {
          line: 139,
          column: 44
        }
      },
      "85": {
        start: {
          line: 143,
          column: 12
        },
        end: {
          line: 177,
          column: 13
        }
      },
      "86": {
        start: {
          line: 144,
          column: 14
        },
        end: {
          line: 144,
          column: 59
        }
      },
      "87": {
        start: {
          line: 146,
          column: 14
        },
        end: {
          line: 146,
          column: 74
        }
      },
      "88": {
        start: {
          line: 147,
          column: 28
        },
        end: {
          line: 147,
          column: 53
        }
      },
      "89": {
        start: {
          line: 148,
          column: 14
        },
        end: {
          line: 151,
          column: 15
        }
      },
      "90": {
        start: {
          line: 149,
          column: 16
        },
        end: {
          line: 149,
          column: 61
        }
      },
      "91": {
        start: {
          line: 150,
          column: 16
        },
        end: {
          line: 150,
          column: 73
        }
      },
      "92": {
        start: {
          line: 152,
          column: 19
        },
        end: {
          line: 177,
          column: 13
        }
      },
      "93": {
        start: {
          line: 154,
          column: 14
        },
        end: {
          line: 154,
          column: 59
        }
      },
      "94": {
        start: {
          line: 155,
          column: 14
        },
        end: {
          line: 157,
          column: 41
        }
      },
      "95": {
        start: {
          line: 160,
          column: 14
        },
        end: {
          line: 169,
          column: 15
        }
      },
      "96": {
        start: {
          line: 161,
          column: 16
        },
        end: {
          line: 161,
          column: 61
        }
      },
      "97": {
        start: {
          line: 163,
          column: 16
        },
        end: {
          line: 166,
          column: 47
        }
      },
      "98": {
        start: {
          line: 167,
          column: 16
        },
        end: {
          line: 167,
          column: 34
        }
      },
      "99": {
        start: {
          line: 168,
          column: 16
        },
        end: {
          line: 168,
          column: 34
        }
      },
      "100": {
        start: {
          line: 171,
          column: 14
        },
        end: {
          line: 176,
          column: 15
        }
      },
      "101": {
        start: {
          line: 172,
          column: 16
        },
        end: {
          line: 172,
          column: 61
        }
      },
      "102": {
        start: {
          line: 173,
          column: 16
        },
        end: {
          line: 175,
          column: 52
        }
      },
      "103": {
        start: {
          line: 182,
          column: 6
        },
        end: {
          line: 186,
          column: 7
        }
      },
      "104": {
        start: {
          line: 183,
          column: 8
        },
        end: {
          line: 183,
          column: 53
        }
      },
      "105": {
        start: {
          line: 184,
          column: 8
        },
        end: {
          line: 185,
          column: 53
        }
      },
      "106": {
        start: {
          line: 188,
          column: 6
        },
        end: {
          line: 199,
          column: 7
        }
      },
      "107": {
        start: {
          line: 189,
          column: 23
        },
        end: {
          line: 189,
          column: 48
        }
      },
      "108": {
        start: {
          line: 190,
          column: 8
        },
        end: {
          line: 190,
          column: 31
        }
      },
      "109": {
        start: {
          line: 191,
          column: 8
        },
        end: {
          line: 198,
          column: 9
        }
      },
      "110": {
        start: {
          line: 195,
          column: 10
        },
        end: {
          line: 195,
          column: 55
        }
      },
      "111": {
        start: {
          line: 196,
          column: 10
        },
        end: {
          line: 197,
          column: 79
        }
      },
      "112": {
        start: {
          line: 203,
          column: 6
        },
        end: {
          line: 220,
          column: 7
        }
      },
      "113": {
        start: {
          line: 204,
          column: 21
        },
        end: {
          line: 204,
          column: 30
        }
      },
      "114": {
        start: {
          line: 205,
          column: 8
        },
        end: {
          line: 205,
          column: 41
        }
      },
      "115": {
        start: {
          line: 205,
          column: 32
        },
        end: {
          line: 205,
          column: 41
        }
      },
      "116": {
        start: {
          line: 206,
          column: 8
        },
        end: {
          line: 206,
          column: 38
        }
      },
      "117": {
        start: {
          line: 206,
          column: 29
        },
        end: {
          line: 206,
          column: 38
        }
      },
      "118": {
        start: {
          line: 207,
          column: 8
        },
        end: {
          line: 207,
          column: 39
        }
      },
      "119": {
        start: {
          line: 207,
          column: 30
        },
        end: {
          line: 207,
          column: 39
        }
      },
      "120": {
        start: {
          line: 208,
          column: 8
        },
        end: {
          line: 208,
          column: 43
        }
      },
      "121": {
        start: {
          line: 208,
          column: 34
        },
        end: {
          line: 208,
          column: 43
        }
      },
      "122": {
        start: {
          line: 209,
          column: 8
        },
        end: {
          line: 209,
          column: 39
        }
      },
      "123": {
        start: {
          line: 209,
          column: 30
        },
        end: {
          line: 209,
          column: 39
        }
      },
      "124": {
        start: {
          line: 210,
          column: 8
        },
        end: {
          line: 210,
          column: 39
        }
      },
      "125": {
        start: {
          line: 210,
          column: 30
        },
        end: {
          line: 210,
          column: 39
        }
      },
      "126": {
        start: {
          line: 211,
          column: 8
        },
        end: {
          line: 211,
          column: 40
        }
      },
      "127": {
        start: {
          line: 211,
          column: 31
        },
        end: {
          line: 211,
          column: 40
        }
      },
      "128": {
        start: {
          line: 212,
          column: 8
        },
        end: {
          line: 212,
          column: 36
        }
      },
      "129": {
        start: {
          line: 212,
          column: 27
        },
        end: {
          line: 212,
          column: 36
        }
      },
      "130": {
        start: {
          line: 213,
          column: 8
        },
        end: {
          line: 213,
          column: 36
        }
      },
      "131": {
        start: {
          line: 213,
          column: 27
        },
        end: {
          line: 213,
          column: 36
        }
      },
      "132": {
        start: {
          line: 214,
          column: 8
        },
        end: {
          line: 214,
          column: 40
        }
      },
      "133": {
        start: {
          line: 214,
          column: 31
        },
        end: {
          line: 214,
          column: 40
        }
      },
      "134": {
        start: {
          line: 215,
          column: 8
        },
        end: {
          line: 215,
          column: 38
        }
      },
      "135": {
        start: {
          line: 215,
          column: 29
        },
        end: {
          line: 215,
          column: 38
        }
      },
      "136": {
        start: {
          line: 216,
          column: 8
        },
        end: {
          line: 216,
          column: 42
        }
      },
      "137": {
        start: {
          line: 216,
          column: 33
        },
        end: {
          line: 216,
          column: 42
        }
      },
      "138": {
        start: {
          line: 217,
          column: 8
        },
        end: {
          line: 217,
          column: 53
        }
      },
      "139": {
        start: {
          line: 218,
          column: 8
        },
        end: {
          line: 219,
          column: 56
        }
      },
      "140": {
        start: {
          line: 222,
          column: 6
        },
        end: {
          line: 222,
          column: 26
        }
      },
      "141": {
        start: {
          line: 226,
          column: 15
        },
        end: {
          line: 226,
          column: 17
        }
      },
      "142": {
        start: {
          line: 228,
          column: 4
        },
        end: {
          line: 228,
          column: 58
        }
      },
      "143": {
        start: {
          line: 228,
          column: 18
        },
        end: {
          line: 228,
          column: 58
        }
      },
      "144": {
        start: {
          line: 229,
          column: 4
        },
        end: {
          line: 229,
          column: 52
        }
      },
      "145": {
        start: {
          line: 229,
          column: 16
        },
        end: {
          line: 229,
          column: 52
        }
      },
      "146": {
        start: {
          line: 230,
          column: 4
        },
        end: {
          line: 230,
          column: 49
        }
      },
      "147": {
        start: {
          line: 230,
          column: 15
        },
        end: {
          line: 230,
          column: 49
        }
      },
      "148": {
        start: {
          line: 231,
          column: 18
        },
        end: {
          line: 231,
          column: 46
        }
      },
      "149": {
        start: {
          line: 232,
          column: 4
        },
        end: {
          line: 234,
          column: 5
        }
      },
      "150": {
        start: {
          line: 233,
          column: 6
        },
        end: {
          line: 233,
          column: 63
        }
      },
      "151": {
        start: {
          line: 239,
          column: 4
        },
        end: {
          line: 240,
          column: 57
        }
      },
      "152": {
        start: {
          line: 239,
          column: 22
        },
        end: {
          line: 239,
          column: 57
        }
      },
      "153": {
        start: {
          line: 240,
          column: 9
        },
        end: {
          line: 240,
          column: 57
        }
      },
      "154": {
        start: {
          line: 240,
          column: 21
        },
        end: {
          line: 240,
          column: 57
        }
      },
      "155": {
        start: {
          line: 243,
          column: 4
        },
        end: {
          line: 245,
          column: 5
        }
      },
      "156": {
        start: {
          line: 244,
          column: 6
        },
        end: {
          line: 244,
          column: 69
        }
      },
      "157": {
        start: {
          line: 247,
          column: 4
        },
        end: {
          line: 249,
          column: 5
        }
      },
      "158": {
        start: {
          line: 248,
          column: 6
        },
        end: {
          line: 248,
          column: 61
        }
      },
      "159": {
        start: {
          line: 252,
          column: 4
        },
        end: {
          line: 252,
          column: 15
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 5,
            column: 3
          }
        },
        loc: {
          start: {
            line: 5,
            column: 46
          },
          end: {
            line: 17,
            column: 3
          }
        },
        line: 5
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 19,
            column: 3
          }
        },
        loc: {
          start: {
            line: 19,
            column: 35
          },
          end: {
            line: 30,
            column: 3
          }
        },
        line: 19
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 32,
            column: 2
          },
          end: {
            line: 32,
            column: 3
          }
        },
        loc: {
          start: {
            line: 32,
            column: 51
          },
          end: {
            line: 49,
            column: 3
          }
        },
        line: 32
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 51,
            column: 2
          },
          end: {
            line: 51,
            column: 3
          }
        },
        loc: {
          start: {
            line: 51,
            column: 42
          },
          end: {
            line: 253,
            column: 3
          }
        },
        line: 51
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 58,
            column: 6
          },
          end: {
            line: 58,
            column: 7
          }
        },
        loc: {
          start: {
            line: 58,
            column: 24
          },
          end: {
            line: 61,
            column: 7
          }
        },
        line: 58
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 64,
            column: 15
          },
          end: {
            line: 64,
            column: 16
          }
        },
        loc: {
          start: {
            line: 64,
            column: 30
          },
          end: {
            line: 64,
            column: 71
          }
        },
        line: 64
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 64
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 64
          }
        }, {
          start: {
            line: 7,
            column: 4
          },
          end: {
            line: 7,
            column: 64
          }
        }],
        line: 7
      },
      "1": {
        loc: {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 50
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 50
          }
        }, {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 50
          }
        }],
        line: 9
      },
      "2": {
        loc: {
          start: {
            line: 10,
            column: 4
          },
          end: {
            line: 10,
            column: 45
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 10,
            column: 4
          },
          end: {
            line: 10,
            column: 45
          }
        }, {
          start: {
            line: 10,
            column: 4
          },
          end: {
            line: 10,
            column: 45
          }
        }],
        line: 10
      },
      "3": {
        loc: {
          start: {
            line: 11,
            column: 4
          },
          end: {
            line: 11,
            column: 80
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 11,
            column: 4
          },
          end: {
            line: 11,
            column: 80
          }
        }, {
          start: {
            line: 11,
            column: 4
          },
          end: {
            line: 11,
            column: 80
          }
        }],
        line: 11
      },
      "4": {
        loc: {
          start: {
            line: 11,
            column: 7
          },
          end: {
            line: 11,
            column: 65
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 11,
            column: 7
          },
          end: {
            line: 11,
            column: 32
          }
        }, {
          start: {
            line: 11,
            column: 36
          },
          end: {
            line: 11,
            column: 65
          }
        }],
        line: 11
      },
      "5": {
        loc: {
          start: {
            line: 14,
            column: 6
          },
          end: {
            line: 14,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 14,
            column: 6
          },
          end: {
            line: 14,
            column: 47
          }
        }, {
          start: {
            line: 14,
            column: 6
          },
          end: {
            line: 14,
            column: 47
          }
        }],
        line: 14
      },
      "6": {
        loc: {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        }, {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        }],
        line: 20
      },
      "7": {
        loc: {
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 25,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 25,
            column: 5
          }
        }, {
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 25,
            column: 5
          }
        }],
        line: 23
      },
      "8": {
        loc: {
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 28,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 28,
            column: 5
          }
        }, {
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 28,
            column: 5
          }
        }],
        line: 26
      },
      "9": {
        loc: {
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 39,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 39,
            column: 47
          }
        }, {
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 39,
            column: 47
          }
        }],
        line: 38
      },
      "10": {
        loc: {
          start: {
            line: 39,
            column: 11
          },
          end: {
            line: 39,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 39,
            column: 11
          },
          end: {
            line: 39,
            column: 47
          }
        }, {
          start: {
            line: 39,
            column: 11
          },
          end: {
            line: 39,
            column: 47
          }
        }],
        line: 39
      },
      "11": {
        loc: {
          start: {
            line: 42,
            column: 4
          },
          end: {
            line: 44,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 42,
            column: 4
          },
          end: {
            line: 44,
            column: 5
          }
        }, {
          start: {
            line: 42,
            column: 4
          },
          end: {
            line: 44,
            column: 5
          }
        }],
        line: 42
      },
      "12": {
        loc: {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 47,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 47,
            column: 5
          }
        }, {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 47,
            column: 5
          }
        }],
        line: 45
      },
      "13": {
        loc: {
          start: {
            line: 80,
            column: 6
          },
          end: {
            line: 95,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 80,
            column: 6
          },
          end: {
            line: 95,
            column: 7
          }
        }, {
          start: {
            line: 80,
            column: 6
          },
          end: {
            line: 95,
            column: 7
          }
        }],
        line: 80
      },
      "14": {
        loc: {
          start: {
            line: 85,
            column: 13
          },
          end: {
            line: 95,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 85,
            column: 13
          },
          end: {
            line: 95,
            column: 7
          }
        }, {
          start: {
            line: 85,
            column: 13
          },
          end: {
            line: 95,
            column: 7
          }
        }],
        line: 85
      },
      "15": {
        loc: {
          start: {
            line: 100,
            column: 6
          },
          end: {
            line: 106,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 100,
            column: 6
          },
          end: {
            line: 106,
            column: 7
          }
        }, {
          start: {
            line: 100,
            column: 6
          },
          end: {
            line: 106,
            column: 7
          }
        }],
        line: 100
      },
      "16": {
        loc: {
          start: {
            line: 108,
            column: 6
          },
          end: {
            line: 110,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 108,
            column: 6
          },
          end: {
            line: 110,
            column: 7
          }
        }, {
          start: {
            line: 108,
            column: 6
          },
          end: {
            line: 110,
            column: 7
          }
        }],
        line: 108
      },
      "17": {
        loc: {
          start: {
            line: 108,
            column: 9
          },
          end: {
            line: 108,
            column: 49
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 108,
            column: 9
          },
          end: {
            line: 108,
            column: 20
          }
        }, {
          start: {
            line: 108,
            column: 24
          },
          end: {
            line: 108,
            column: 49
          }
        }],
        line: 108
      },
      "18": {
        loc: {
          start: {
            line: 112,
            column: 6
          },
          end: {
            line: 115,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 112,
            column: 6
          },
          end: {
            line: 115,
            column: 7
          }
        }, {
          start: {
            line: 112,
            column: 6
          },
          end: {
            line: 115,
            column: 7
          }
        }],
        line: 112
      },
      "19": {
        loc: {
          start: {
            line: 122,
            column: 6
          },
          end: {
            line: 130,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 122,
            column: 6
          },
          end: {
            line: 130,
            column: 7
          }
        }, {
          start: {
            line: 122,
            column: 6
          },
          end: {
            line: 130,
            column: 7
          }
        }],
        line: 122
      },
      "20": {
        loc: {
          start: {
            line: 132,
            column: 6
          },
          end: {
            line: 180,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 132,
            column: 6
          },
          end: {
            line: 180,
            column: 7
          }
        }, {
          start: {
            line: 132,
            column: 6
          },
          end: {
            line: 180,
            column: 7
          }
        }],
        line: 132
      },
      "21": {
        loc: {
          start: {
            line: 133,
            column: 8
          },
          end: {
            line: 179,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 133,
            column: 8
          },
          end: {
            line: 179,
            column: 9
          }
        }, {
          start: {
            line: 133,
            column: 8
          },
          end: {
            line: 179,
            column: 9
          }
        }],
        line: 133
      },
      "22": {
        loc: {
          start: {
            line: 133,
            column: 11
          },
          end: {
            line: 133,
            column: 74
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 133,
            column: 11
          },
          end: {
            line: 133,
            column: 43
          }
        }, {
          start: {
            line: 133,
            column: 47
          },
          end: {
            line: 133,
            column: 74
          }
        }],
        line: 133
      },
      "23": {
        loc: {
          start: {
            line: 143,
            column: 12
          },
          end: {
            line: 177,
            column: 13
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 143,
            column: 12
          },
          end: {
            line: 177,
            column: 13
          }
        }, {
          start: {
            line: 143,
            column: 12
          },
          end: {
            line: 177,
            column: 13
          }
        }],
        line: 143
      },
      "24": {
        loc: {
          start: {
            line: 143,
            column: 15
          },
          end: {
            line: 143,
            column: 66
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 143,
            column: 15
          },
          end: {
            line: 143,
            column: 41
          }
        }, {
          start: {
            line: 143,
            column: 45
          },
          end: {
            line: 143,
            column: 66
          }
        }],
        line: 143
      },
      "25": {
        loc: {
          start: {
            line: 152,
            column: 19
          },
          end: {
            line: 177,
            column: 13
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 152,
            column: 19
          },
          end: {
            line: 177,
            column: 13
          }
        }, {
          start: {
            line: 152,
            column: 19
          },
          end: {
            line: 177,
            column: 13
          }
        }],
        line: 152
      },
      "26": {
        loc: {
          start: {
            line: 152,
            column: 22
          },
          end: {
            line: 152,
            column: 78
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 152,
            column: 22
          },
          end: {
            line: 152,
            column: 48
          }
        }, {
          start: {
            line: 152,
            column: 52
          },
          end: {
            line: 152,
            column: 78
          }
        }],
        line: 152
      },
      "27": {
        loc: {
          start: {
            line: 160,
            column: 14
          },
          end: {
            line: 169,
            column: 15
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 160,
            column: 14
          },
          end: {
            line: 169,
            column: 15
          }
        }, {
          start: {
            line: 160,
            column: 14
          },
          end: {
            line: 169,
            column: 15
          }
        }],
        line: 160
      },
      "28": {
        loc: {
          start: {
            line: 160,
            column: 17
          },
          end: {
            line: 160,
            column: 77
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 160,
            column: 17
          },
          end: {
            line: 160,
            column: 45
          }
        }, {
          start: {
            line: 160,
            column: 49
          },
          end: {
            line: 160,
            column: 77
          }
        }],
        line: 160
      },
      "29": {
        loc: {
          start: {
            line: 182,
            column: 6
          },
          end: {
            line: 186,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 182,
            column: 6
          },
          end: {
            line: 186,
            column: 7
          }
        }, {
          start: {
            line: 182,
            column: 6
          },
          end: {
            line: 186,
            column: 7
          }
        }],
        line: 182
      },
      "30": {
        loc: {
          start: {
            line: 188,
            column: 6
          },
          end: {
            line: 199,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 188,
            column: 6
          },
          end: {
            line: 199,
            column: 7
          }
        }, {
          start: {
            line: 188,
            column: 6
          },
          end: {
            line: 199,
            column: 7
          }
        }],
        line: 188
      },
      "31": {
        loc: {
          start: {
            line: 191,
            column: 8
          },
          end: {
            line: 198,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 191,
            column: 8
          },
          end: {
            line: 198,
            column: 9
          }
        }, {
          start: {
            line: 191,
            column: 8
          },
          end: {
            line: 198,
            column: 9
          }
        }],
        line: 191
      },
      "32": {
        loc: {
          start: {
            line: 205,
            column: 8
          },
          end: {
            line: 205,
            column: 41
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 205,
            column: 8
          },
          end: {
            line: 205,
            column: 41
          }
        }, {
          start: {
            line: 205,
            column: 8
          },
          end: {
            line: 205,
            column: 41
          }
        }],
        line: 205
      },
      "33": {
        loc: {
          start: {
            line: 206,
            column: 8
          },
          end: {
            line: 206,
            column: 38
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 206,
            column: 8
          },
          end: {
            line: 206,
            column: 38
          }
        }, {
          start: {
            line: 206,
            column: 8
          },
          end: {
            line: 206,
            column: 38
          }
        }],
        line: 206
      },
      "34": {
        loc: {
          start: {
            line: 207,
            column: 8
          },
          end: {
            line: 207,
            column: 39
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 207,
            column: 8
          },
          end: {
            line: 207,
            column: 39
          }
        }, {
          start: {
            line: 207,
            column: 8
          },
          end: {
            line: 207,
            column: 39
          }
        }],
        line: 207
      },
      "35": {
        loc: {
          start: {
            line: 208,
            column: 8
          },
          end: {
            line: 208,
            column: 43
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 208,
            column: 8
          },
          end: {
            line: 208,
            column: 43
          }
        }, {
          start: {
            line: 208,
            column: 8
          },
          end: {
            line: 208,
            column: 43
          }
        }],
        line: 208
      },
      "36": {
        loc: {
          start: {
            line: 209,
            column: 8
          },
          end: {
            line: 209,
            column: 39
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 209,
            column: 8
          },
          end: {
            line: 209,
            column: 39
          }
        }, {
          start: {
            line: 209,
            column: 8
          },
          end: {
            line: 209,
            column: 39
          }
        }],
        line: 209
      },
      "37": {
        loc: {
          start: {
            line: 210,
            column: 8
          },
          end: {
            line: 210,
            column: 39
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 210,
            column: 8
          },
          end: {
            line: 210,
            column: 39
          }
        }, {
          start: {
            line: 210,
            column: 8
          },
          end: {
            line: 210,
            column: 39
          }
        }],
        line: 210
      },
      "38": {
        loc: {
          start: {
            line: 211,
            column: 8
          },
          end: {
            line: 211,
            column: 40
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 211,
            column: 8
          },
          end: {
            line: 211,
            column: 40
          }
        }, {
          start: {
            line: 211,
            column: 8
          },
          end: {
            line: 211,
            column: 40
          }
        }],
        line: 211
      },
      "39": {
        loc: {
          start: {
            line: 212,
            column: 8
          },
          end: {
            line: 212,
            column: 36
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 212,
            column: 8
          },
          end: {
            line: 212,
            column: 36
          }
        }, {
          start: {
            line: 212,
            column: 8
          },
          end: {
            line: 212,
            column: 36
          }
        }],
        line: 212
      },
      "40": {
        loc: {
          start: {
            line: 213,
            column: 8
          },
          end: {
            line: 213,
            column: 36
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 213,
            column: 8
          },
          end: {
            line: 213,
            column: 36
          }
        }, {
          start: {
            line: 213,
            column: 8
          },
          end: {
            line: 213,
            column: 36
          }
        }],
        line: 213
      },
      "41": {
        loc: {
          start: {
            line: 214,
            column: 8
          },
          end: {
            line: 214,
            column: 40
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 214,
            column: 8
          },
          end: {
            line: 214,
            column: 40
          }
        }, {
          start: {
            line: 214,
            column: 8
          },
          end: {
            line: 214,
            column: 40
          }
        }],
        line: 214
      },
      "42": {
        loc: {
          start: {
            line: 215,
            column: 8
          },
          end: {
            line: 215,
            column: 38
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 215,
            column: 8
          },
          end: {
            line: 215,
            column: 38
          }
        }, {
          start: {
            line: 215,
            column: 8
          },
          end: {
            line: 215,
            column: 38
          }
        }],
        line: 215
      },
      "43": {
        loc: {
          start: {
            line: 216,
            column: 8
          },
          end: {
            line: 216,
            column: 42
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 216,
            column: 8
          },
          end: {
            line: 216,
            column: 42
          }
        }, {
          start: {
            line: 216,
            column: 8
          },
          end: {
            line: 216,
            column: 42
          }
        }],
        line: 216
      },
      "44": {
        loc: {
          start: {
            line: 228,
            column: 4
          },
          end: {
            line: 228,
            column: 58
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 228,
            column: 4
          },
          end: {
            line: 228,
            column: 58
          }
        }, {
          start: {
            line: 228,
            column: 4
          },
          end: {
            line: 228,
            column: 58
          }
        }],
        line: 228
      },
      "45": {
        loc: {
          start: {
            line: 229,
            column: 4
          },
          end: {
            line: 229,
            column: 52
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 229,
            column: 4
          },
          end: {
            line: 229,
            column: 52
          }
        }, {
          start: {
            line: 229,
            column: 4
          },
          end: {
            line: 229,
            column: 52
          }
        }],
        line: 229
      },
      "46": {
        loc: {
          start: {
            line: 230,
            column: 4
          },
          end: {
            line: 230,
            column: 49
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 230,
            column: 4
          },
          end: {
            line: 230,
            column: 49
          }
        }, {
          start: {
            line: 230,
            column: 4
          },
          end: {
            line: 230,
            column: 49
          }
        }],
        line: 230
      },
      "47": {
        loc: {
          start: {
            line: 232,
            column: 4
          },
          end: {
            line: 234,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 232,
            column: 4
          },
          end: {
            line: 234,
            column: 5
          }
        }, {
          start: {
            line: 232,
            column: 4
          },
          end: {
            line: 234,
            column: 5
          }
        }],
        line: 232
      },
      "48": {
        loc: {
          start: {
            line: 232,
            column: 7
          },
          end: {
            line: 232,
            column: 67
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 232,
            column: 7
          },
          end: {
            line: 232,
            column: 26
          }
        }, {
          start: {
            line: 232,
            column: 30
          },
          end: {
            line: 232,
            column: 47
          }
        }, {
          start: {
            line: 232,
            column: 51
          },
          end: {
            line: 232,
            column: 67
          }
        }],
        line: 232
      },
      "49": {
        loc: {
          start: {
            line: 239,
            column: 4
          },
          end: {
            line: 240,
            column: 57
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 239,
            column: 4
          },
          end: {
            line: 240,
            column: 57
          }
        }, {
          start: {
            line: 239,
            column: 4
          },
          end: {
            line: 240,
            column: 57
          }
        }],
        line: 239
      },
      "50": {
        loc: {
          start: {
            line: 240,
            column: 9
          },
          end: {
            line: 240,
            column: 57
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 240,
            column: 9
          },
          end: {
            line: 240,
            column: 57
          }
        }, {
          start: {
            line: 240,
            column: 9
          },
          end: {
            line: 240,
            column: 57
          }
        }],
        line: 240
      },
      "51": {
        loc: {
          start: {
            line: 243,
            column: 4
          },
          end: {
            line: 245,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 243,
            column: 4
          },
          end: {
            line: 245,
            column: 5
          }
        }, {
          start: {
            line: 243,
            column: 4
          },
          end: {
            line: 245,
            column: 5
          }
        }],
        line: 243
      },
      "52": {
        loc: {
          start: {
            line: 243,
            column: 7
          },
          end: {
            line: 243,
            column: 38
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 243,
            column: 7
          },
          end: {
            line: 243,
            column: 16
          }
        }, {
          start: {
            line: 243,
            column: 20
          },
          end: {
            line: 243,
            column: 38
          }
        }],
        line: 243
      },
      "53": {
        loc: {
          start: {
            line: 247,
            column: 4
          },
          end: {
            line: 249,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 247,
            column: 4
          },
          end: {
            line: 249,
            column: 5
          }
        }, {
          start: {
            line: 247,
            column: 4
          },
          end: {
            line: 249,
            column: 5
          }
        }],
        line: 247
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0,
      "60": 0,
      "61": 0,
      "62": 0,
      "63": 0,
      "64": 0,
      "65": 0,
      "66": 0,
      "67": 0,
      "68": 0,
      "69": 0,
      "70": 0,
      "71": 0,
      "72": 0,
      "73": 0,
      "74": 0,
      "75": 0,
      "76": 0,
      "77": 0,
      "78": 0,
      "79": 0,
      "80": 0,
      "81": 0,
      "82": 0,
      "83": 0,
      "84": 0,
      "85": 0,
      "86": 0,
      "87": 0,
      "88": 0,
      "89": 0,
      "90": 0,
      "91": 0,
      "92": 0,
      "93": 0,
      "94": 0,
      "95": 0,
      "96": 0,
      "97": 0,
      "98": 0,
      "99": 0,
      "100": 0,
      "101": 0,
      "102": 0,
      "103": 0,
      "104": 0,
      "105": 0,
      "106": 0,
      "107": 0,
      "108": 0,
      "109": 0,
      "110": 0,
      "111": 0,
      "112": 0,
      "113": 0,
      "114": 0,
      "115": 0,
      "116": 0,
      "117": 0,
      "118": 0,
      "119": 0,
      "120": 0,
      "121": 0,
      "122": 0,
      "123": 0,
      "124": 0,
      "125": 0,
      "126": 0,
      "127": 0,
      "128": 0,
      "129": 0,
      "130": 0,
      "131": 0,
      "132": 0,
      "133": 0,
      "134": 0,
      "135": 0,
      "136": 0,
      "137": 0,
      "138": 0,
      "139": 0,
      "140": 0,
      "141": 0,
      "142": 0,
      "143": 0,
      "144": 0,
      "145": 0,
      "146": 0,
      "147": 0,
      "148": 0,
      "149": 0,
      "150": 0,
      "151": 0,
      "152": 0,
      "153": 0,
      "154": 0,
      "155": 0,
      "156": 0,
      "157": 0,
      "158": 0,
      "159": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0, 0],
      "18": [0, 0],
      "19": [0, 0],
      "20": [0, 0],
      "21": [0, 0],
      "22": [0, 0],
      "23": [0, 0],
      "24": [0, 0],
      "25": [0, 0],
      "26": [0, 0],
      "27": [0, 0],
      "28": [0, 0],
      "29": [0, 0],
      "30": [0, 0],
      "31": [0, 0],
      "32": [0, 0],
      "33": [0, 0],
      "34": [0, 0],
      "35": [0, 0],
      "36": [0, 0],
      "37": [0, 0],
      "38": [0, 0],
      "39": [0, 0],
      "40": [0, 0],
      "41": [0, 0],
      "42": [0, 0],
      "43": [0, 0],
      "44": [0, 0],
      "45": [0, 0],
      "46": [0, 0],
      "47": [0, 0],
      "48": [0, 0, 0],
      "49": [0, 0],
      "50": [0, 0],
      "51": [0, 0],
      "52": [0, 0],
      "53": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

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
      cov_rtw3odfoo.f[0]++;
      cov_rtw3odfoo.s[0]++;

      if (!_Output__WEBPACK_IMPORTED_MODULE_0__["Output"].isOutputFormatAllowed("highstate")) {
        cov_rtw3odfoo.b[0][0]++;
        cov_rtw3odfoo.s[1]++;
        return false;
      } else {
        cov_rtw3odfoo.b[0][1]++;
      }

      cov_rtw3odfoo.s[2]++;

      if (_typeof(response) !== "object") {
        cov_rtw3odfoo.b[1][0]++;
        cov_rtw3odfoo.s[3]++;
        return false;
      } else {
        cov_rtw3odfoo.b[1][1]++;
      }

      cov_rtw3odfoo.s[4]++;

      if (Array.isArray(response)) {
        cov_rtw3odfoo.b[2][0]++;
        cov_rtw3odfoo.s[5]++;
        return false;
      } else {
        cov_rtw3odfoo.b[2][1]++;
      }

      cov_rtw3odfoo.s[6]++;

      if ((cov_rtw3odfoo.b[4][0]++, command !== "state.apply") && (cov_rtw3odfoo.b[4][1]++, command !== "state.highstate")) {
        cov_rtw3odfoo.b[3][0]++;
        cov_rtw3odfoo.s[7]++;
        return false;
      } else {
        cov_rtw3odfoo.b[3][1]++;
      }

      cov_rtw3odfoo.s[8]++;

      var _arr = Object.keys(response);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];
        var components = (cov_rtw3odfoo.s[9]++, key.split("_|-"));
        cov_rtw3odfoo.s[10]++;

        if (components.length !== 4) {
          cov_rtw3odfoo.b[5][0]++;
          cov_rtw3odfoo.s[11]++;
          return false;
        } else {
          cov_rtw3odfoo.b[5][1]++;
        }
      }

      cov_rtw3odfoo.s[12]++;
      return true;
    }
  }, {
    key: "getDurationClause",
    value: function getDurationClause(millis) {
      cov_rtw3odfoo.f[1]++;
      cov_rtw3odfoo.s[13]++;

      if (millis === 1) {
        cov_rtw3odfoo.b[6][0]++;
        cov_rtw3odfoo.s[14]++;
        return "".concat(millis, " millisecond");
      } else {
        cov_rtw3odfoo.b[6][1]++;
      }

      cov_rtw3odfoo.s[15]++;

      if (millis < 1000) {
        cov_rtw3odfoo.b[7][0]++;
        cov_rtw3odfoo.s[16]++;
        return "".concat(millis, " milliseconds");
      } else {
        cov_rtw3odfoo.b[7][1]++;
      }

      cov_rtw3odfoo.s[17]++;

      if (millis === 1000) {
        cov_rtw3odfoo.b[8][0]++;
        cov_rtw3odfoo.s[18]++;
        return "".concat(millis / 1000, " second");
      } else {
        cov_rtw3odfoo.b[8][1]++;
      }

      cov_rtw3odfoo.s[19]++;
      return "".concat(millis / 1000, " seconds");
    }
  }, {
    key: "getHighStateLabel",
    value: function getHighStateLabel(hostname, hostResponse) {
      cov_rtw3odfoo.f[2]++;
      var anyFailures = (cov_rtw3odfoo.s[20]++, false);
      var anySkips = (cov_rtw3odfoo.s[21]++, false); // do not use Object.entries, that is not supported by the test framework

      cov_rtw3odfoo.s[22]++;

      var _arr2 = Object.keys(hostResponse);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var key = _arr2[_i2];
        var task = (cov_rtw3odfoo.s[23]++, hostResponse[key]);
        cov_rtw3odfoo.s[24]++;

        if (task.result === null) {
          cov_rtw3odfoo.b[9][0]++;
          cov_rtw3odfoo.s[25]++;
          anySkips = true;
        } else {
          cov_rtw3odfoo.b[9][1]++;
          cov_rtw3odfoo.s[26]++;

          if (!task.result) {
            cov_rtw3odfoo.b[10][0]++;
            cov_rtw3odfoo.s[27]++;
            anyFailures = true;
          } else {
            cov_rtw3odfoo.b[10][1]++;
          }
        }
      }

      cov_rtw3odfoo.s[28]++;

      if (anyFailures) {
        cov_rtw3odfoo.b[11][0]++;
        cov_rtw3odfoo.s[29]++;
        return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_failure");
      } else {
        cov_rtw3odfoo.b[11][1]++;
      }

      cov_rtw3odfoo.s[30]++;

      if (anySkips) {
        cov_rtw3odfoo.b[12][0]++;
        cov_rtw3odfoo.s[31]++;
        return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_skips");
      } else {
        cov_rtw3odfoo.b[12][1]++;
      }

      cov_rtw3odfoo.s[32]++;
      return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_success");
    }
  }, {
    key: "getHighStateOutput",
    value: function getHighStateOutput(hostResponse) {
      cov_rtw3odfoo.f[3]++;
      // The tasks are in an (unordered) object with uninteresting keys
      // convert it to an array that is in execution order
      // first put all the values in an array
      var tasks = (cov_rtw3odfoo.s[33]++, []);
      cov_rtw3odfoo.s[34]++;
      Object.keys(hostResponse).forEach(function (taskKey) {
        cov_rtw3odfoo.f[4]++;
        cov_rtw3odfoo.s[35]++;
        hostResponse[taskKey].___key___ = taskKey;
        cov_rtw3odfoo.s[36]++;
        tasks.push(hostResponse[taskKey]);
      }); // then sort the array

      cov_rtw3odfoo.s[37]++;
      tasks.sort(function (a, b) {
        cov_rtw3odfoo.f[5]++;
        cov_rtw3odfoo.s[38]++;
        return a.__run_num__ - b.__run_num__;
      });
      var indent = (cov_rtw3odfoo.s[39]++, "    ");
      var div = (cov_rtw3odfoo.s[40]++, document.createElement("div"));
      var succeeded = (cov_rtw3odfoo.s[41]++, 0);
      var failed = (cov_rtw3odfoo.s[42]++, 0);
      var skipped = (cov_rtw3odfoo.s[43]++, 0);
      var total_millis = (cov_rtw3odfoo.s[44]++, 0);
      var changes = (cov_rtw3odfoo.s[45]++, 0);
      cov_rtw3odfoo.s[46]++;

      for (var _i3 = 0; _i3 < tasks.length; _i3++) {
        var task = tasks[_i3];
        var taskDiv = (cov_rtw3odfoo.s[47]++, document.createElement("div"));
        var span = (cov_rtw3odfoo.s[48]++, document.createElement("span"));
        cov_rtw3odfoo.s[49]++;

        if (task.result === null) {
          cov_rtw3odfoo.b[13][0]++;
          cov_rtw3odfoo.s[50]++;
          // 2714 = HEAVY CHECK MARK
          span.style.color = "yellow";
          cov_rtw3odfoo.s[51]++;
          span.innerText = "\u2714";
          cov_rtw3odfoo.s[52]++;
          skipped += 1;
        } else {
          cov_rtw3odfoo.b[13][1]++;
          cov_rtw3odfoo.s[53]++;

          if (task.result) {
            cov_rtw3odfoo.b[14][0]++;
            cov_rtw3odfoo.s[54]++;
            // 2714 = HEAVY CHECK MARK
            span.style.color = "green";
            cov_rtw3odfoo.s[55]++;
            span.innerText = "\u2714";
            cov_rtw3odfoo.s[56]++;
            succeeded += 1;
          } else {
            cov_rtw3odfoo.b[14][1]++;
            cov_rtw3odfoo.s[57]++;
            // 2718 = HEAVY BALLOT X
            span.style.color = "red";
            cov_rtw3odfoo.s[58]++;
            span.innerText = "\u2718";
            cov_rtw3odfoo.s[59]++;
            failed += 1;
          }
        }

        cov_rtw3odfoo.s[60]++;
        taskDiv.append(span);
        cov_rtw3odfoo.s[61]++;
        taskDiv.append(document.createTextNode(" "));
        cov_rtw3odfoo.s[62]++;

        if (task.name) {
          cov_rtw3odfoo.b[15][0]++;
          cov_rtw3odfoo.s[63]++;
          taskDiv.append(document.createTextNode(task.name));
        } else {
          cov_rtw3odfoo.b[15][1]++;
          cov_rtw3odfoo.s[64]++;
          // make sure that the checkbox/ballot-x is on a reasonable line
          // also for the next "from" clause (if any)
          taskDiv.append(document.createTextNode("(anonymous task)"));
        }

        cov_rtw3odfoo.s[65]++;

        if ((cov_rtw3odfoo.b[17][0]++, task.__id__) && (cov_rtw3odfoo.b[17][1]++, task.__id__ !== task.name)) {
          cov_rtw3odfoo.b[16][0]++;
          cov_rtw3odfoo.s[66]++;
          taskDiv.append(document.createTextNode(" id=" + encodeURIComponent(task.__id__)));
        } else {
          cov_rtw3odfoo.b[16][1]++;
        }

        cov_rtw3odfoo.s[67]++;

        if (task.__sls__) {
          cov_rtw3odfoo.b[18][0]++;
          cov_rtw3odfoo.s[68]++;
          taskDiv.append(document.createTextNode(" (from " + task.__sls__.replace(".", "/") + ".sls)"));
        } else {
          cov_rtw3odfoo.b[18][1]++;
        }

        var components = (cov_rtw3odfoo.s[69]++, task.___key___.split("_|-"));
        cov_rtw3odfoo.s[70]++;
        taskDiv.append(document.createElement("br"));
        cov_rtw3odfoo.s[71]++;
        taskDiv.append(document.createTextNode(indent + "Function is " + components[0] + "." + components[3]));
        cov_rtw3odfoo.s[72]++;

        if (task.comment) {
          cov_rtw3odfoo.b[19][0]++;
          cov_rtw3odfoo.s[73]++;
          taskDiv.append(document.createElement("br"));
          var txt = (cov_rtw3odfoo.s[74]++, task.comment); // trim extra whitespace

          cov_rtw3odfoo.s[75]++;
          txt = txt.replace(/[ \r\n]+$/g, ""); // indent extra lines

          cov_rtw3odfoo.s[76]++;
          txt = txt.replace(/[\n]+/g, "\n" + indent);
          cov_rtw3odfoo.s[77]++;
          taskDiv.append(document.createTextNode(indent + txt));
        } else {
          cov_rtw3odfoo.b[19][1]++;
        }

        cov_rtw3odfoo.s[78]++;

        if (task.hasOwnProperty("changes")) {
          cov_rtw3odfoo.b[20][0]++;
          cov_rtw3odfoo.s[79]++;

          if ((cov_rtw3odfoo.b[22][0]++, _typeof(task.changes) !== "object") || (cov_rtw3odfoo.b[22][1]++, Array.isArray(task.changes))) {
            cov_rtw3odfoo.b[21][0]++;
            cov_rtw3odfoo.s[80]++;
            taskDiv.append(document.createElement("br"));
            cov_rtw3odfoo.s[81]++;
            taskDiv.append(document.createTextNode(indent + JSON.stringify(task.changes)));
          } else {
            cov_rtw3odfoo.b[21][1]++;
            cov_rtw3odfoo.s[82]++;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = Object.keys(task.changes).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;
                cov_rtw3odfoo.s[83]++;
                changes = changes + 1;
                var change = (cov_rtw3odfoo.s[84]++, task.changes[key]); // 25BA = BLACK RIGHT-POINTING POINTER
                // don't use arrows here, these are higher than a regular
                // text-line and disturb the text-flow

                cov_rtw3odfoo.s[85]++;

                if ((cov_rtw3odfoo.b[24][0]++, typeof change === "string") && (cov_rtw3odfoo.b[24][1]++, change.includes("\n"))) {
                  cov_rtw3odfoo.b[23][0]++;
                  cov_rtw3odfoo.s[86]++;
                  taskDiv.append(document.createElement("br")); // show multi-line text as a separate block

                  cov_rtw3odfoo.s[87]++;
                  taskDiv.append(document.createTextNode(indent + key + ":"));
                  var lines = (cov_rtw3odfoo.s[88]++, change.trim().split("\n"));
                  cov_rtw3odfoo.s[89]++;
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var _line = _step2.value;
                      cov_rtw3odfoo.s[90]++;
                      taskDiv.append(document.createElement("br"));
                      cov_rtw3odfoo.s[91]++;
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
                } else {
                  cov_rtw3odfoo.b[23][1]++;
                  cov_rtw3odfoo.s[92]++;

                  if ((cov_rtw3odfoo.b[26][0]++, _typeof(change) !== "object") || (cov_rtw3odfoo.b[26][1]++, Array.isArray(task.change))) {
                    cov_rtw3odfoo.b[25][0]++;
                    cov_rtw3odfoo.s[93]++;
                    // show all other non-objects in a simple way
                    taskDiv.append(document.createElement("br"));
                    cov_rtw3odfoo.s[94]++;
                    taskDiv.append(document.createTextNode(indent + key + ": " + JSON.stringify(change)));
                  } else {
                    cov_rtw3odfoo.b[25][1]++;
                    cov_rtw3odfoo.s[95]++;

                    // treat old->new first
                    if ((cov_rtw3odfoo.b[28][0]++, change.hasOwnProperty("old")) && (cov_rtw3odfoo.b[28][1]++, change.hasOwnProperty("new"))) {
                      cov_rtw3odfoo.b[27][0]++;
                      cov_rtw3odfoo.s[96]++;
                      taskDiv.append(document.createElement("br")); // place changes on one line

                      cov_rtw3odfoo.s[97]++;
                      taskDiv.append(document.createTextNode(indent + key + ": " + JSON.stringify(change.old) + " \u25BA " + JSON.stringify(change.new)));
                      cov_rtw3odfoo.s[98]++;
                      delete change.old;
                      cov_rtw3odfoo.s[99]++;
                      delete change.new;
                    } else {
                      cov_rtw3odfoo.b[27][1]++;
                    } // then show whatever remains


                    cov_rtw3odfoo.s[100]++;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                      for (var _iterator3 = Object.keys(change).sort()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var taskkey = _step3.value;
                        cov_rtw3odfoo.s[101]++;
                        taskDiv.append(document.createElement("br"));
                        cov_rtw3odfoo.s[102]++;
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
        } else {
          cov_rtw3odfoo.b[20][1]++;
        }

        cov_rtw3odfoo.s[103]++;

        if (task.hasOwnProperty("start_time")) {
          cov_rtw3odfoo.b[29][0]++;
          cov_rtw3odfoo.s[104]++;
          taskDiv.append(document.createElement("br"));
          cov_rtw3odfoo.s[105]++;
          taskDiv.append(document.createTextNode(indent + "Started at " + task.start_time));
        } else {
          cov_rtw3odfoo.b[29][1]++;
        }

        cov_rtw3odfoo.s[106]++;

        if (task.hasOwnProperty("duration")) {
          cov_rtw3odfoo.b[30][0]++;
          var millis = (cov_rtw3odfoo.s[107]++, Math.round(task.duration));
          cov_rtw3odfoo.s[108]++;
          total_millis += millis;
          cov_rtw3odfoo.s[109]++;

          if (millis >= 10) {
            cov_rtw3odfoo.b[31][0]++;
            cov_rtw3odfoo.s[110]++;
            // anything below 10ms is not worth reporting
            // report only the "slow" jobs
            // it still counts for the grand total thought
            taskDiv.append(document.createElement("br"));
            cov_rtw3odfoo.s[111]++;
            taskDiv.append(document.createTextNode(indent + "Duration " + OutputHighstate.getDurationClause(millis)));
          } else {
            cov_rtw3odfoo.b[31][1]++;
          }
        } else {
          cov_rtw3odfoo.b[30][1]++;
        } // show any unknown attribute of a task
        // do not use Object.entries, that is not supported by the test framework


        cov_rtw3odfoo.s[112]++;

        var _arr3 = Object.keys(task);

        for (var _i4 = 0; _i4 < _arr3.length; _i4++) {
          var _key = _arr3[_i4];
          var item = (cov_rtw3odfoo.s[113]++, task[_key]);
          cov_rtw3odfoo.s[114]++;

          if (_key === "___key___") {
            cov_rtw3odfoo.b[32][0]++;
            cov_rtw3odfoo.s[115]++;
            continue;
          } else {
            cov_rtw3odfoo.b[32][1]++;
          } // ignored, generated by us


          cov_rtw3odfoo.s[116]++;

          if (_key === "__id__") {
            cov_rtw3odfoo.b[33][0]++;
            cov_rtw3odfoo.s[117]++;
            continue;
          } else {
            cov_rtw3odfoo.b[33][1]++;
          } // handled


          cov_rtw3odfoo.s[118]++;

          if (_key === "__sls__") {
            cov_rtw3odfoo.b[34][0]++;
            cov_rtw3odfoo.s[119]++;
            continue;
          } else {
            cov_rtw3odfoo.b[34][1]++;
          } // handled


          cov_rtw3odfoo.s[120]++;

          if (_key === "__run_num__") {
            cov_rtw3odfoo.b[35][0]++;
            cov_rtw3odfoo.s[121]++;
            continue;
          } else {
            cov_rtw3odfoo.b[35][1]++;
          } // handled, not shown


          cov_rtw3odfoo.s[122]++;

          if (_key === "changes") {
            cov_rtw3odfoo.b[36][0]++;
            cov_rtw3odfoo.s[123]++;
            continue;
          } else {
            cov_rtw3odfoo.b[36][1]++;
          } // handled


          cov_rtw3odfoo.s[124]++;

          if (_key === "comment") {
            cov_rtw3odfoo.b[37][0]++;
            cov_rtw3odfoo.s[125]++;
            continue;
          } else {
            cov_rtw3odfoo.b[37][1]++;
          } // handled


          cov_rtw3odfoo.s[126]++;

          if (_key === "duration") {
            cov_rtw3odfoo.b[38][0]++;
            cov_rtw3odfoo.s[127]++;
            continue;
          } else {
            cov_rtw3odfoo.b[38][1]++;
          } // handled


          cov_rtw3odfoo.s[128]++;

          if (_key === "host") {
            cov_rtw3odfoo.b[39][0]++;
            cov_rtw3odfoo.s[129]++;
            continue;
          } else {
            cov_rtw3odfoo.b[39][1]++;
          } // ignored, same as host


          cov_rtw3odfoo.s[130]++;

          if (_key === "name") {
            cov_rtw3odfoo.b[40][0]++;
            cov_rtw3odfoo.s[131]++;
            continue;
          } else {
            cov_rtw3odfoo.b[40][1]++;
          } // handled


          cov_rtw3odfoo.s[132]++;

          if (_key === "pchanges") {
            cov_rtw3odfoo.b[41][0]++;
            cov_rtw3odfoo.s[133]++;
            continue;
          } else {
            cov_rtw3odfoo.b[41][1]++;
          } // ignored, also ignored by cli


          cov_rtw3odfoo.s[134]++;

          if (_key === "result") {
            cov_rtw3odfoo.b[42][0]++;
            cov_rtw3odfoo.s[135]++;
            continue;
          } else {
            cov_rtw3odfoo.b[42][1]++;
          } // handled


          cov_rtw3odfoo.s[136]++;

          if (_key === "start_time") {
            cov_rtw3odfoo.b[43][0]++;
            cov_rtw3odfoo.s[137]++;
            continue;
          } else {
            cov_rtw3odfoo.b[43][1]++;
          } // handled


          cov_rtw3odfoo.s[138]++;
          taskDiv.append(document.createElement("br"));
          cov_rtw3odfoo.s[139]++;
          taskDiv.append(document.createTextNode(indent + _key + " = " + JSON.stringify(item)));
        }

        cov_rtw3odfoo.s[140]++;
        div.append(taskDiv);
      } // add a summary line


      var line = (cov_rtw3odfoo.s[141]++, "");
      cov_rtw3odfoo.s[142]++;

      if (succeeded) {
        cov_rtw3odfoo.b[44][0]++;
        cov_rtw3odfoo.s[143]++;
        line += ", " + succeeded + " succeeded";
      } else {
        cov_rtw3odfoo.b[44][1]++;
      }

      cov_rtw3odfoo.s[144]++;

      if (skipped) {
        cov_rtw3odfoo.b[45][0]++;
        cov_rtw3odfoo.s[145]++;
        line += ", " + skipped + " skipped";
      } else {
        cov_rtw3odfoo.b[45][1]++;
      }

      cov_rtw3odfoo.s[146]++;

      if (failed) {
        cov_rtw3odfoo.b[46][0]++;
        cov_rtw3odfoo.s[147]++;
        line += ", " + failed + " failed";
      } else {
        cov_rtw3odfoo.b[46][1]++;
      }

      var total = (cov_rtw3odfoo.s[148]++, succeeded + skipped + failed);
      cov_rtw3odfoo.s[149]++;

      if ((cov_rtw3odfoo.b[48][0]++, total !== succeeded) && (cov_rtw3odfoo.b[48][1]++, total !== skipped) && (cov_rtw3odfoo.b[48][2]++, total !== failed)) {
        cov_rtw3odfoo.b[47][0]++;
        cov_rtw3odfoo.s[150]++;
        line += ", " + (succeeded + skipped + failed) + " total";
      } else {
        cov_rtw3odfoo.b[47][1]++;
      } // note that the number of changes may be higher or lower
      // than the number of tasks. tasks may contribute multiple
      // changes, or tasks may have no changes.


      cov_rtw3odfoo.s[151]++;

      if (changes === 1) {
        cov_rtw3odfoo.b[49][0]++;
        cov_rtw3odfoo.s[152]++;
        line += ", " + changes + " change";
      } else {
        cov_rtw3odfoo.b[49][1]++;
        cov_rtw3odfoo.s[153]++;

        if (changes) {
          cov_rtw3odfoo.b[50][0]++;
          cov_rtw3odfoo.s[154]++;
          line += ", " + changes + " changes";
        } else {
          cov_rtw3odfoo.b[50][1]++;
        }
      } // multiple durations and significant?


      cov_rtw3odfoo.s[155]++;

      if ((cov_rtw3odfoo.b[52][0]++, total > 1) && (cov_rtw3odfoo.b[52][1]++, total_millis >= 10)) {
        cov_rtw3odfoo.b[51][0]++;
        cov_rtw3odfoo.s[156]++;
        line += ", " + OutputHighstate.getDurationClause(total_millis);
      } else {
        cov_rtw3odfoo.b[51][1]++;
      }

      cov_rtw3odfoo.s[157]++;

      if (line) {
        cov_rtw3odfoo.b[53][0]++;
        cov_rtw3odfoo.s[158]++;
        div.append(document.createTextNode(line.substring(2)));
      } else {
        cov_rtw3odfoo.b[53][1]++;
      }

      cov_rtw3odfoo.s[159]++;
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
var cov_1ruk8t65yk = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputJson.js";
  var hash = "2b2014efc0dd3faf55f92a21c5f6ae56d2efe693";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputJson.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 12,
          column: 5
        }
      },
      "1": {
        start: {
          line: 11,
          column: 6
        },
        end: {
          line: 11,
          column: 35
        }
      },
      "2": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 18,
          column: 5
        }
      },
      "3": {
        start: {
          line: 17,
          column: 6
        },
        end: {
          line: 17,
          column: 25
        }
      },
      "4": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 24,
          column: 5
        }
      },
      "5": {
        start: {
          line: 23,
          column: 6
        },
        end: {
          line: 23,
          column: 35
        }
      },
      "6": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 29,
          column: 5
        }
      },
      "7": {
        start: {
          line: 28,
          column: 6
        },
        end: {
          line: 28,
          column: 19
        }
      },
      "8": {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 34,
          column: 5
        }
      },
      "9": {
        start: {
          line: 33,
          column: 6
        },
        end: {
          line: 33,
          column: 19
        }
      },
      "10": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 36,
          column: 16
        }
      },
      "11": {
        start: {
          line: 44,
          column: 23
        },
        end: {
          line: 44,
          column: 24
        }
      },
      "12": {
        start: {
          line: 46,
          column: 14
        },
        end: {
          line: 46,
          column: 48
        }
      },
      "13": {
        start: {
          line: 47,
          column: 4
        },
        end: {
          line: 49,
          column: 5
        }
      },
      "14": {
        start: {
          line: 48,
          column: 6
        },
        end: {
          line: 48,
          column: 17
        }
      },
      "15": {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 63,
          column: 5
        }
      },
      "16": {
        start: {
          line: 54,
          column: 6
        },
        end: {
          line: 54,
          column: 16
        }
      },
      "17": {
        start: {
          line: 55,
          column: 22
        },
        end: {
          line: 55,
          column: 24
        }
      },
      "18": {
        start: {
          line: 56,
          column: 6
        },
        end: {
          line: 60,
          column: 7
        }
      },
      "19": {
        start: {
          line: 57,
          column: 8
        },
        end: {
          line: 58,
          column: 64
        }
      },
      "20": {
        start: {
          line: 59,
          column: 8
        },
        end: {
          line: 59,
          column: 24
        }
      },
      "21": {
        start: {
          line: 61,
          column: 6
        },
        end: {
          line: 61,
          column: 50
        }
      },
      "22": {
        start: {
          line: 62,
          column: 6
        },
        end: {
          line: 62,
          column: 17
        }
      },
      "23": {
        start: {
          line: 67,
          column: 17
        },
        end: {
          line: 67,
          column: 35
        }
      },
      "24": {
        start: {
          line: 68,
          column: 4
        },
        end: {
          line: 68,
          column: 14
        }
      },
      "25": {
        start: {
          line: 69,
          column: 20
        },
        end: {
          line: 69,
          column: 22
        }
      },
      "26": {
        start: {
          line: 71,
          column: 4
        },
        end: {
          line: 76,
          column: 5
        }
      },
      "27": {
        start: {
          line: 72,
          column: 19
        },
        end: {
          line: 72,
          column: 29
        }
      },
      "28": {
        start: {
          line: 73,
          column: 6
        },
        end: {
          line: 74,
          column: 62
        }
      },
      "29": {
        start: {
          line: 75,
          column: 6
        },
        end: {
          line: 75,
          column: 22
        }
      },
      "30": {
        start: {
          line: 77,
          column: 4
        },
        end: {
          line: 77,
          column: 48
        }
      },
      "31": {
        start: {
          line: 78,
          column: 4
        },
        end: {
          line: 78,
          column: 15
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 6,
            column: 3
          }
        },
        loc: {
          start: {
            line: 6,
            column: 33
          },
          end: {
            line: 37,
            column: 3
          }
        },
        line: 6
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 41,
            column: 2
          },
          end: {
            line: 41,
            column: 3
          }
        },
        loc: {
          start: {
            line: 41,
            column: 42
          },
          end: {
            line: 79,
            column: 3
          }
        },
        line: 41
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 12,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 12,
            column: 5
          }
        }, {
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 12,
            column: 5
          }
        }],
        line: 8
      },
      "1": {
        loc: {
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        }, {
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        }],
        line: 14
      },
      "2": {
        loc: {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 24,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 24,
            column: 5
          }
        }, {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 24,
            column: 5
          }
        }],
        line: 20
      },
      "3": {
        loc: {
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 29,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 29,
            column: 5
          }
        }, {
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 29,
            column: 5
          }
        }],
        line: 26
      },
      "4": {
        loc: {
          start: {
            line: 26,
            column: 7
          },
          end: {
            line: 26,
            column: 49
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 26,
            column: 7
          },
          end: {
            line: 26,
            column: 27
          }
        }, {
          start: {
            line: 26,
            column: 31
          },
          end: {
            line: 26,
            column: 49
          }
        }],
        line: 26
      },
      "5": {
        loc: {
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 34,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 34,
            column: 5
          }
        }, {
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 34,
            column: 5
          }
        }],
        line: 31
      },
      "6": {
        loc: {
          start: {
            line: 31,
            column: 7
          },
          end: {
            line: 31,
            column: 63
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 31,
            column: 7
          },
          end: {
            line: 31,
            column: 28
          }
        }, {
          start: {
            line: 31,
            column: 32
          },
          end: {
            line: 31,
            column: 63
          }
        }],
        line: 31
      },
      "7": {
        loc: {
          start: {
            line: 41,
            column: 27
          },
          end: {
            line: 41,
            column: 40
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 41,
            column: 39
          },
          end: {
            line: 41,
            column: 40
          }
        }],
        line: 41
      },
      "8": {
        loc: {
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 49,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 49,
            column: 5
          }
        }, {
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 49,
            column: 5
          }
        }],
        line: 47
      },
      "9": {
        loc: {
          start: {
            line: 51,
            column: 4
          },
          end: {
            line: 63,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 51,
            column: 4
          },
          end: {
            line: 63,
            column: 5
          }
        }, {
          start: {
            line: 51,
            column: 4
          },
          end: {
            line: 63,
            column: 5
          }
        }],
        line: 51
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0],
      "8": [0, 0],
      "9": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

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
      cov_1ruk8t65yk.f[0]++;
      cov_1ruk8t65yk.s[0]++;

      if (value === null) {
        cov_1ruk8t65yk.b[0][0]++;
        cov_1ruk8t65yk.s[1]++;
        // null is an object, but not really
        // leave that to the builtin function
        return JSON.stringify(value);
      } else {
        cov_1ruk8t65yk.b[0][1]++;
      }

      cov_1ruk8t65yk.s[2]++;

      if (value === undefined) {
        cov_1ruk8t65yk.b[1][0]++;
        cov_1ruk8t65yk.s[3]++;
        // JSON.stringify does not return a string for this
        // but again a value undefined, we need a string
        return "undefined";
      } else {
        cov_1ruk8t65yk.b[1][1]++;
      }

      cov_1ruk8t65yk.s[4]++;

      if (_typeof(value) !== "object") {
        cov_1ruk8t65yk.b[2][0]++;
        cov_1ruk8t65yk.s[5]++;
        // a simple type
        // leave that to the builtin function
        return JSON.stringify(value);
      } else {
        cov_1ruk8t65yk.b[2][1]++;
      }

      cov_1ruk8t65yk.s[6]++;

      if ((cov_1ruk8t65yk.b[4][0]++, Array.isArray(value)) && (cov_1ruk8t65yk.b[4][1]++, value.length === 0)) {
        cov_1ruk8t65yk.b[3][0]++;
        cov_1ruk8t65yk.s[7]++;
        // show the brackets for an empty array a bit wider apart
        return "[ ]";
      } else {
        cov_1ruk8t65yk.b[3][1]++;
      }

      cov_1ruk8t65yk.s[8]++;

      if ((cov_1ruk8t65yk.b[6][0]++, !Array.isArray(value)) && (cov_1ruk8t65yk.b[6][1]++, Object.keys(value).length === 0)) {
        cov_1ruk8t65yk.b[5][0]++;
        cov_1ruk8t65yk.s[9]++;
        // show the brackets for an empty object a bit wider apart
        return "{ }";
      } else {
        cov_1ruk8t65yk.b[5][1]++;
      }

      cov_1ruk8t65yk.s[10]++;
      return null;
    } // format an object as JSON
    // based on an initial indentation and an indentation increment

  }, {
    key: "formatJSON",
    value: function formatJSON(value) {
      var indentLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (cov_1ruk8t65yk.b[7][0]++, 0);
      cov_1ruk8t65yk.f[1]++;
      // indent each level with 4 spaces
      var indentStep = (cov_1ruk8t65yk.s[11]++, 4);
      var str = (cov_1ruk8t65yk.s[12]++, OutputJson.formatSimpleJSON(value));
      cov_1ruk8t65yk.s[13]++;

      if (str !== null) {
        cov_1ruk8t65yk.b[8][0]++;
        cov_1ruk8t65yk.s[14]++;
        return str;
      } else {
        cov_1ruk8t65yk.b[8][1]++;
      }

      cov_1ruk8t65yk.s[15]++;

      if (Array.isArray(value)) {
        cov_1ruk8t65yk.b[9][0]++;
        cov_1ruk8t65yk.s[16]++;
        // an array
        // put each element on its own line
        str = "[";

        var _separator = (cov_1ruk8t65yk.s[17]++, "");

        cov_1ruk8t65yk.s[18]++;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;
            cov_1ruk8t65yk.s[19]++;
            str += _separator + "\n" + " ".repeat(indentLevel + indentStep) + OutputJson.formatJSON(elem, indentLevel + indentStep);
            cov_1ruk8t65yk.s[20]++;
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

        cov_1ruk8t65yk.s[21]++;
        str += "\n" + " ".repeat(indentLevel) + "]";
        cov_1ruk8t65yk.s[22]++;
        return str;
      } else {
        cov_1ruk8t65yk.b[9][1]++;
      } // regular object
      // put each name+value on its own line


      var keys = (cov_1ruk8t65yk.s[23]++, Object.keys(value));
      cov_1ruk8t65yk.s[24]++;
      str = "{";
      var separator = (cov_1ruk8t65yk.s[25]++, ""); // do not use Object.entries, that is not supported by the test framework

      cov_1ruk8t65yk.s[26]++;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(value).sort()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;
          var item = (cov_1ruk8t65yk.s[27]++, value[key]);
          cov_1ruk8t65yk.s[28]++;
          str += separator + "\n" + " ".repeat(indentLevel + indentStep) + "\"" + key + "\": " + OutputJson.formatJSON(item, indentLevel + indentStep);
          cov_1ruk8t65yk.s[29]++;
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

      cov_1ruk8t65yk.s[30]++;
      str += "\n" + " ".repeat(indentLevel) + "}";
      cov_1ruk8t65yk.s[31]++;
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
var cov_2lb7p6ndno = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputNested.js";
  var hash = "f3eb201185dca9163be7adf74c7c232d7d89cba5";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputNested.js",
    statementMap: {
      "0": {
        start: {
          line: 7,
          column: 4
        },
        end: {
          line: 7,
          column: 54
        }
      },
      "1": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 50,
          column: 5
        }
      },
      "2": {
        start: {
          line: 12,
          column: 6
        },
        end: {
          line: 12,
          column: 61
        }
      },
      "3": {
        start: {
          line: 13,
          column: 11
        },
        end: {
          line: 50,
          column: 5
        }
      },
      "4": {
        start: {
          line: 14,
          column: 6
        },
        end: {
          line: 14,
          column: 66
        }
      },
      "5": {
        start: {
          line: 15,
          column: 11
        },
        end: {
          line: 50,
          column: 5
        }
      },
      "6": {
        start: {
          line: 16,
          column: 6
        },
        end: {
          line: 16,
          column: 58
        }
      },
      "7": {
        start: {
          line: 17,
          column: 11
        },
        end: {
          line: 50,
          column: 5
        }
      },
      "8": {
        start: {
          line: 18,
          column: 23
        },
        end: {
          line: 18,
          column: 27
        }
      },
      "9": {
        start: {
          line: 19,
          column: 6
        },
        end: {
          line: 19,
          column: 35
        }
      },
      "10": {
        start: {
          line: 20,
          column: 6
        },
        end: {
          line: 26,
          column: 7
        }
      },
      "11": {
        start: {
          line: 21,
          column: 26
        },
        end: {
          line: 21,
          column: 32
        }
      },
      "12": {
        start: {
          line: 22,
          column: 8
        },
        end: {
          line: 23,
          column: 50
        }
      },
      "13": {
        start: {
          line: 23,
          column: 10
        },
        end: {
          line: 23,
          column: 50
        }
      },
      "14": {
        start: {
          line: 24,
          column: 8
        },
        end: {
          line: 24,
          column: 66
        }
      },
      "15": {
        start: {
          line: 25,
          column: 8
        },
        end: {
          line: 25,
          column: 27
        }
      },
      "16": {
        start: {
          line: 27,
          column: 11
        },
        end: {
          line: 50,
          column: 5
        }
      },
      "17": {
        start: {
          line: 28,
          column: 6
        },
        end: {
          line: 40,
          column: 7
        }
      },
      "18": {
        start: {
          line: 29,
          column: 8
        },
        end: {
          line: 39,
          column: 9
        }
      },
      "19": {
        start: {
          line: 30,
          column: 10
        },
        end: {
          line: 30,
          column: 55
        }
      },
      "20": {
        start: {
          line: 32,
          column: 10
        },
        end: {
          line: 35,
          column: 30
        }
      },
      "21": {
        start: {
          line: 33,
          column: 12
        },
        end: {
          line: 33,
          column: 24
        }
      },
      "22": {
        start: {
          line: 35,
          column: 12
        },
        end: {
          line: 35,
          column: 30
        }
      },
      "23": {
        start: {
          line: 36,
          column: 10
        },
        end: {
          line: 36,
          column: 61
        }
      },
      "24": {
        start: {
          line: 38,
          column: 10
        },
        end: {
          line: 38,
          column: 60
        }
      },
      "25": {
        start: {
          line: 41,
          column: 11
        },
        end: {
          line: 50,
          column: 5
        }
      },
      "26": {
        start: {
          line: 42,
          column: 6
        },
        end: {
          line: 42,
          column: 70
        }
      },
      "27": {
        start: {
          line: 42,
          column: 17
        },
        end: {
          line: 42,
          column: 70
        }
      },
      "28": {
        start: {
          line: 43,
          column: 6
        },
        end: {
          line: 49,
          column: 7
        }
      },
      "29": {
        start: {
          line: 44,
          column: 20
        },
        end: {
          line: 44,
          column: 28
        }
      },
      "30": {
        start: {
          line: 45,
          column: 8
        },
        end: {
          line: 45,
          column: 65
        }
      },
      "31": {
        start: {
          line: 46,
          column: 8
        },
        end: {
          line: 48,
          column: 9
        }
      },
      "32": {
        start: {
          line: 47,
          column: 10
        },
        end: {
          line: 47,
          column: 57
        }
      },
      "33": {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 51,
          column: 15
        }
      },
      "34": {
        start: {
          line: 55,
          column: 18
        },
        end: {
          line: 55,
          column: 56
        }
      },
      "35": {
        start: {
          line: 56,
          column: 4
        },
        end: {
          line: 56,
          column: 28
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 6,
            column: 3
          }
        },
        loc: {
          start: {
            line: 6,
            column: 52
          },
          end: {
            line: 8,
            column: 3
          }
        },
        line: 6
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 10,
            column: 2
          },
          end: {
            line: 10,
            column: 3
          }
        },
        loc: {
          start: {
            line: 10,
            column: 43
          },
          end: {
            line: 52,
            column: 3
          }
        },
        line: 10
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 54,
            column: 2
          },
          end: {
            line: 54,
            column: 3
          }
        },
        loc: {
          start: {
            line: 54,
            column: 44
          },
          end: {
            line: 57,
            column: 3
          }
        },
        line: 54
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 6,
            column: 30
          },
          end: {
            line: 6,
            column: 39
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 6,
            column: 37
          },
          end: {
            line: 6,
            column: 39
          }
        }],
        line: 6
      },
      "1": {
        loc: {
          start: {
            line: 6,
            column: 41
          },
          end: {
            line: 6,
            column: 50
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 6,
            column: 48
          },
          end: {
            line: 6,
            column: 50
          }
        }],
        line: 6
      },
      "2": {
        loc: {
          start: {
            line: 11,
            column: 4
          },
          end: {
            line: 50,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 11,
            column: 4
          },
          end: {
            line: 50,
            column: 5
          }
        }, {
          start: {
            line: 11,
            column: 4
          },
          end: {
            line: 50,
            column: 5
          }
        }],
        line: 11
      },
      "3": {
        loc: {
          start: {
            line: 13,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 13,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }, {
          start: {
            line: 13,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }],
        line: 13
      },
      "4": {
        loc: {
          start: {
            line: 15,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 15,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }, {
          start: {
            line: 15,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }],
        line: 15
      },
      "5": {
        loc: {
          start: {
            line: 15,
            column: 14
          },
          end: {
            line: 15,
            column: 65
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 15,
            column: 14
          },
          end: {
            line: 15,
            column: 38
          }
        }, {
          start: {
            line: 15,
            column: 42
          },
          end: {
            line: 15,
            column: 65
          }
        }],
        line: 15
      },
      "6": {
        loc: {
          start: {
            line: 17,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 17,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }, {
          start: {
            line: 17,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }],
        line: 17
      },
      "7": {
        loc: {
          start: {
            line: 22,
            column: 8
          },
          end: {
            line: 23,
            column: 50
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 22,
            column: 8
          },
          end: {
            line: 23,
            column: 50
          }
        }, {
          start: {
            line: 22,
            column: 8
          },
          end: {
            line: 23,
            column: 50
          }
        }],
        line: 22
      },
      "8": {
        loc: {
          start: {
            line: 27,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 27,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }, {
          start: {
            line: 27,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }],
        line: 27
      },
      "9": {
        loc: {
          start: {
            line: 27,
            column: 14
          },
          end: {
            line: 27,
            column: 59
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 27,
            column: 14
          },
          end: {
            line: 27,
            column: 37
          }
        }, {
          start: {
            line: 27,
            column: 41
          },
          end: {
            line: 27,
            column: 59
          }
        }],
        line: 27
      },
      "10": {
        loc: {
          start: {
            line: 29,
            column: 8
          },
          end: {
            line: 39,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 29,
            column: 8
          },
          end: {
            line: 39,
            column: 9
          }
        }, {
          start: {
            line: 29,
            column: 8
          },
          end: {
            line: 39,
            column: 9
          }
        }],
        line: 29
      },
      "11": {
        loc: {
          start: {
            line: 32,
            column: 10
          },
          end: {
            line: 35,
            column: 30
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 32,
            column: 10
          },
          end: {
            line: 35,
            column: 30
          }
        }, {
          start: {
            line: 32,
            column: 10
          },
          end: {
            line: 35,
            column: 30
          }
        }],
        line: 32
      },
      "12": {
        loc: {
          start: {
            line: 32,
            column: 13
          },
          end: {
            line: 32,
            column: 59
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 32,
            column: 13
          },
          end: {
            line: 32,
            column: 36
          }
        }, {
          start: {
            line: 32,
            column: 40
          },
          end: {
            line: 32,
            column: 59
          }
        }],
        line: 32
      },
      "13": {
        loc: {
          start: {
            line: 41,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 41,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }, {
          start: {
            line: 41,
            column: 11
          },
          end: {
            line: 50,
            column: 5
          }
        }],
        line: 41
      },
      "14": {
        loc: {
          start: {
            line: 42,
            column: 6
          },
          end: {
            line: 42,
            column: 70
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 42,
            column: 6
          },
          end: {
            line: 42,
            column: 70
          }
        }, {
          start: {
            line: 42,
            column: 6
          },
          end: {
            line: 42,
            column: 70
          }
        }],
        line: 42
      },
      "15": {
        loc: {
          start: {
            line: 46,
            column: 8
          },
          end: {
            line: 48,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 46,
            column: 8
          },
          end: {
            line: 48,
            column: 9
          }
        }, {
          start: {
            line: 46,
            column: 8
          },
          end: {
            line: 48,
            column: 9
          }
        }],
        line: 46
      },
      "16": {
        loc: {
          start: {
            line: 46,
            column: 11
          },
          end: {
            line: 46,
            column: 37
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 46,
            column: 11
          },
          end: {
            line: 46,
            column: 23
          }
        }, {
          start: {
            line: 46,
            column: 27
          },
          end: {
            line: 46,
            column: 37
          }
        }],
        line: 46
      },
      "17": {
        loc: {
          start: {
            line: 54,
            column: 29
          },
          end: {
            line: 54,
            column: 42
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 54,
            column: 41
          },
          end: {
            line: 54,
            column: 42
          }
        }],
        line: 54
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {
      "0": [0],
      "1": [0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

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
      var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (cov_2lb7p6ndno.b[0][0]++, '');
      var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : (cov_2lb7p6ndno.b[1][0]++, '');
      cov_2lb7p6ndno.f[0]++;
      cov_2lb7p6ndno.s[0]++;
      return " ".repeat(indent) + prefix + msg + suffix;
    }
  }, {
    key: "display",
    value: function display(ret, indent, prefix, out) {
      cov_2lb7p6ndno.f[1]++;
      cov_2lb7p6ndno.s[1]++;

      if (ret === null) {
        cov_2lb7p6ndno.b[2][0]++;
        cov_2lb7p6ndno.s[2]++;
        out.push(OutputNested.ustring(indent, "None", prefix));
      } else {
        cov_2lb7p6ndno.b[2][1]++;
        cov_2lb7p6ndno.s[3]++;

        if (ret === undefined) {
          cov_2lb7p6ndno.b[3][0]++;
          cov_2lb7p6ndno.s[4]++;
          out.push(OutputNested.ustring(indent, "undefined", prefix));
        } else {
          cov_2lb7p6ndno.b[3][1]++;
          cov_2lb7p6ndno.s[5]++;

          if ((cov_2lb7p6ndno.b[5][0]++, typeof ret === "boolean") || (cov_2lb7p6ndno.b[5][1]++, typeof ret === "number")) {
            cov_2lb7p6ndno.b[4][0]++;
            cov_2lb7p6ndno.s[6]++;
            out.push(OutputNested.ustring(indent, ret, prefix));
          } else {
            cov_2lb7p6ndno.b[4][1]++;
            cov_2lb7p6ndno.s[7]++;

            if (typeof ret === "string") {
              cov_2lb7p6ndno.b[6][0]++;
              var first_line = (cov_2lb7p6ndno.s[8]++, true);
              cov_2lb7p6ndno.s[9]++;
              ret = ret.replace(/\n$/, "");
              cov_2lb7p6ndno.s[10]++;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = ret.split("\n")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var line = _step.value;
                  var line_prefix = (cov_2lb7p6ndno.s[11]++, prefix);
                  cov_2lb7p6ndno.s[12]++;

                  if (!first_line) {
                    cov_2lb7p6ndno.b[7][0]++;
                    cov_2lb7p6ndno.s[13]++;
                    line_prefix = ".".repeat(prefix.length);
                  } else {
                    cov_2lb7p6ndno.b[7][1]++;
                  }

                  cov_2lb7p6ndno.s[14]++;
                  out.push(OutputNested.ustring(indent, line, line_prefix));
                  cov_2lb7p6ndno.s[15]++;
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
            } else {
              cov_2lb7p6ndno.b[6][1]++;
              cov_2lb7p6ndno.s[16]++;

              if ((cov_2lb7p6ndno.b[9][0]++, _typeof(ret) === "object") && (cov_2lb7p6ndno.b[9][1]++, Array.isArray(ret))) {
                cov_2lb7p6ndno.b[8][0]++;
                cov_2lb7p6ndno.s[17]++;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = ret[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var ind = _step2.value;
                    cov_2lb7p6ndno.s[18]++;

                    if (_typeof(ind) === "object"
                    /* including array */
                    ) {
                        cov_2lb7p6ndno.b[10][0]++;
                        cov_2lb7p6ndno.s[19]++;
                        out.push(OutputNested.ustring(indent, '|_'));

                        var _prefix = void 0;

                        cov_2lb7p6ndno.s[20]++;

                        if ((cov_2lb7p6ndno.b[12][0]++, _typeof(ind) === "object") && (cov_2lb7p6ndno.b[12][1]++, !Array.isArray(ind))) {
                          cov_2lb7p6ndno.b[11][0]++;
                          cov_2lb7p6ndno.s[21]++;
                          _prefix = '';
                        } else {
                          cov_2lb7p6ndno.b[11][1]++;
                          cov_2lb7p6ndno.s[22]++;
                          _prefix = "-\xA0";
                        }

                        cov_2lb7p6ndno.s[23]++;
                        OutputNested.display(ind, indent + 2, _prefix, out);
                      } else {
                      cov_2lb7p6ndno.b[10][1]++;
                      cov_2lb7p6ndno.s[24]++;
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
              } else {
                cov_2lb7p6ndno.b[8][1]++;
                cov_2lb7p6ndno.s[25]++;

                if (_typeof(ret) === "object") {
                  cov_2lb7p6ndno.b[13][0]++;
                  cov_2lb7p6ndno.s[26]++;

                  if (indent) {
                    cov_2lb7p6ndno.b[14][0]++;
                    cov_2lb7p6ndno.s[27]++;
                    out.push(OutputNested.ustring(indent, '----------'));
                  } else {
                    cov_2lb7p6ndno.b[14][1]++;
                  }

                  cov_2lb7p6ndno.s[28]++;
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = Object.keys(ret).sort()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var key = _step3.value;
                      var val = (cov_2lb7p6ndno.s[29]++, ret[key]);
                      cov_2lb7p6ndno.s[30]++;
                      out.push(OutputNested.ustring(indent, key, prefix, ':'));
                      cov_2lb7p6ndno.s[31]++;

                      if ((cov_2lb7p6ndno.b[16][0]++, val !== null) && (cov_2lb7p6ndno.b[16][1]++, val !== "")) {
                        cov_2lb7p6ndno.b[15][0]++;
                        cov_2lb7p6ndno.s[32]++;
                        OutputNested.display(val, indent + 4, '', out);
                      } else {
                        cov_2lb7p6ndno.b[15][1]++;
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
                } else {
                  cov_2lb7p6ndno.b[13][1]++;
                }
              }
            }
          }
        }
      }

      cov_2lb7p6ndno.s[33]++;
      return out;
    }
  }, {
    key: "formatNESTED",
    value: function formatNESTED(value) {
      var indentLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (cov_2lb7p6ndno.b[17][0]++, 0);
      cov_2lb7p6ndno.f[2]++;
      var lines = (cov_2lb7p6ndno.s[34]++, OutputNested.display(value, 0, '', []));
      cov_2lb7p6ndno.s[35]++;
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
/* harmony import */ var _Output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Output */ "./saltgui/static/scripts/output/Output.js");
var cov_b7jydiney = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputSaltGuiHighstate.js";
  var hash = "e282b2c382b39ad6d7d6a9227b1205e617262cbf";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputSaltGuiHighstate.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 4
        },
        end: {
          line: 11,
          column: 5
        }
      },
      "1": {
        start: {
          line: 10,
          column: 6
        },
        end: {
          line: 10,
          column: 37
        }
      },
      "2": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 14,
          column: 5
        }
      },
      "3": {
        start: {
          line: 13,
          column: 6
        },
        end: {
          line: 13,
          column: 38
        }
      },
      "4": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 17,
          column: 5
        }
      },
      "5": {
        start: {
          line: 16,
          column: 6
        },
        end: {
          line: 16,
          column: 37
        }
      },
      "6": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 36
        }
      },
      "7": {
        start: {
          line: 22,
          column: 22
        },
        end: {
          line: 22,
          column: 27
        }
      },
      "8": {
        start: {
          line: 23,
          column: 19
        },
        end: {
          line: 23,
          column: 24
        }
      },
      "9": {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 29,
          column: 5
        }
      },
      "10": {
        start: {
          line: 26,
          column: 19
        },
        end: {
          line: 26,
          column: 36
        }
      },
      "11": {
        start: {
          line: 27,
          column: 6
        },
        end: {
          line: 28,
          column: 47
        }
      },
      "12": {
        start: {
          line: 27,
          column: 31
        },
        end: {
          line: 27,
          column: 47
        }
      },
      "13": {
        start: {
          line: 28,
          column: 11
        },
        end: {
          line: 28,
          column: 47
        }
      },
      "14": {
        start: {
          line: 28,
          column: 28
        },
        end: {
          line: 28,
          column: 47
        }
      },
      "15": {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 33,
          column: 5
        }
      },
      "16": {
        start: {
          line: 32,
          column: 6
        },
        end: {
          line: 32,
          column: 62
        }
      },
      "17": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 36,
          column: 5
        }
      },
      "18": {
        start: {
          line: 35,
          column: 6
        },
        end: {
          line: 35,
          column: 60
        }
      },
      "19": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 37,
          column: 60
        }
      },
      "20": {
        start: {
          line: 41,
          column: 4
        },
        end: {
          line: 43,
          column: 5
        }
      },
      "21": {
        start: {
          line: 42,
          column: 6
        },
        end: {
          line: 42,
          column: 15
        }
      },
      "22": {
        start: {
          line: 45,
          column: 4
        },
        end: {
          line: 49,
          column: 5
        }
      },
      "23": {
        start: {
          line: 46,
          column: 6
        },
        end: {
          line: 46,
          column: 51
        }
      },
      "24": {
        start: {
          line: 47,
          column: 6
        },
        end: {
          line: 47,
          column: 85
        }
      },
      "25": {
        start: {
          line: 48,
          column: 6
        },
        end: {
          line: 48,
          column: 15
        }
      },
      "26": {
        start: {
          line: 51,
          column: 18
        },
        end: {
          line: 51,
          column: 19
        }
      },
      "27": {
        start: {
          line: 52,
          column: 4
        },
        end: {
          line: 110,
          column: 5
        }
      },
      "28": {
        start: {
          line: 54,
          column: 6
        },
        end: {
          line: 54,
          column: 28
        }
      },
      "29": {
        start: {
          line: 56,
          column: 21
        },
        end: {
          line: 56,
          column: 38
        }
      },
      "30": {
        start: {
          line: 58,
          column: 6
        },
        end: {
          line: 68,
          column: 7
        }
      },
      "31": {
        start: {
          line: 59,
          column: 8
        },
        end: {
          line: 59,
          column: 53
        }
      },
      "32": {
        start: {
          line: 61,
          column: 8
        },
        end: {
          line: 61,
          column: 68
        }
      },
      "33": {
        start: {
          line: 62,
          column: 22
        },
        end: {
          line: 62,
          column: 47
        }
      },
      "34": {
        start: {
          line: 63,
          column: 8
        },
        end: {
          line: 66,
          column: 9
        }
      },
      "35": {
        start: {
          line: 64,
          column: 10
        },
        end: {
          line: 64,
          column: 55
        }
      },
      "36": {
        start: {
          line: 65,
          column: 10
        },
        end: {
          line: 65,
          column: 67
        }
      },
      "37": {
        start: {
          line: 67,
          column: 8
        },
        end: {
          line: 67,
          column: 17
        }
      },
      "38": {
        start: {
          line: 70,
          column: 6
        },
        end: {
          line: 78,
          column: 7
        }
      },
      "39": {
        start: {
          line: 71,
          column: 8
        },
        end: {
          line: 76,
          column: 9
        }
      },
      "40": {
        start: {
          line: 72,
          column: 23
        },
        end: {
          line: 72,
          column: 34
        }
      },
      "41": {
        start: {
          line: 73,
          column: 10
        },
        end: {
          line: 73,
          column: 55
        }
      },
      "42": {
        start: {
          line: 74,
          column: 10
        },
        end: {
          line: 75,
          column: 70
        }
      },
      "43": {
        start: {
          line: 77,
          column: 8
        },
        end: {
          line: 77,
          column: 17
        }
      },
      "44": {
        start: {
          line: 80,
          column: 6
        },
        end: {
          line: 87,
          column: 7
        }
      },
      "45": {
        start: {
          line: 82,
          column: 8
        },
        end: {
          line: 82,
          column: 53
        }
      },
      "46": {
        start: {
          line: 83,
          column: 8
        },
        end: {
          line: 85,
          column: 35
        }
      },
      "47": {
        start: {
          line: 86,
          column: 8
        },
        end: {
          line: 86,
          column: 17
        }
      },
      "48": {
        start: {
          line: 90,
          column: 6
        },
        end: {
          line: 102,
          column: 7
        }
      },
      "49": {
        start: {
          line: 91,
          column: 8
        },
        end: {
          line: 91,
          column: 53
        }
      },
      "50": {
        start: {
          line: 96,
          column: 8
        },
        end: {
          line: 99,
          column: 39
        }
      },
      "51": {
        start: {
          line: 100,
          column: 8
        },
        end: {
          line: 100,
          column: 26
        }
      },
      "52": {
        start: {
          line: 101,
          column: 8
        },
        end: {
          line: 101,
          column: 26
        }
      },
      "53": {
        start: {
          line: 104,
          column: 6
        },
        end: {
          line: 109,
          column: 7
        }
      },
      "54": {
        start: {
          line: 105,
          column: 8
        },
        end: {
          line: 105,
          column: 53
        }
      },
      "55": {
        start: {
          line: 106,
          column: 8
        },
        end: {
          line: 108,
          column: 44
        }
      },
      "56": {
        start: {
          line: 118,
          column: 18
        },
        end: {
          line: 118,
          column: 20
        }
      },
      "57": {
        start: {
          line: 119,
          column: 4
        },
        end: {
          line: 124,
          column: 6
        }
      },
      "58": {
        start: {
          line: 121,
          column: 8
        },
        end: {
          line: 121,
          column: 50
        }
      },
      "59": {
        start: {
          line: 122,
          column: 8
        },
        end: {
          line: 122,
          column: 42
        }
      },
      "60": {
        start: {
          line: 126,
          column: 4
        },
        end: {
          line: 126,
          column: 74
        }
      },
      "61": {
        start: {
          line: 126,
          column: 32
        },
        end: {
          line: 126,
          column: 69
        }
      },
      "62": {
        start: {
          line: 128,
          column: 19
        },
        end: {
          line: 128,
          column: 25
        }
      },
      "63": {
        start: {
          line: 130,
          column: 16
        },
        end: {
          line: 130,
          column: 45
        }
      },
      "64": {
        start: {
          line: 132,
          column: 20
        },
        end: {
          line: 132,
          column: 21
        }
      },
      "65": {
        start: {
          line: 133,
          column: 17
        },
        end: {
          line: 133,
          column: 18
        }
      },
      "66": {
        start: {
          line: 134,
          column: 18
        },
        end: {
          line: 134,
          column: 19
        }
      },
      "67": {
        start: {
          line: 135,
          column: 23
        },
        end: {
          line: 135,
          column: 24
        }
      },
      "68": {
        start: {
          line: 136,
          column: 18
        },
        end: {
          line: 136,
          column: 19
        }
      },
      "69": {
        start: {
          line: 137,
          column: 4
        },
        end: {
          line: 237,
          column: 5
        }
      },
      "70": {
        start: {
          line: 139,
          column: 22
        },
        end: {
          line: 139,
          column: 51
        }
      },
      "71": {
        start: {
          line: 141,
          column: 19
        },
        end: {
          line: 141,
          column: 49
        }
      },
      "72": {
        start: {
          line: 142,
          column: 6
        },
        end: {
          line: 157,
          column: 7
        }
      },
      "73": {
        start: {
          line: 144,
          column: 8
        },
        end: {
          line: 144,
          column: 36
        }
      },
      "74": {
        start: {
          line: 145,
          column: 8
        },
        end: {
          line: 145,
          column: 34
        }
      },
      "75": {
        start: {
          line: 146,
          column: 8
        },
        end: {
          line: 146,
          column: 21
        }
      },
      "76": {
        start: {
          line: 147,
          column: 13
        },
        end: {
          line: 157,
          column: 7
        }
      },
      "77": {
        start: {
          line: 149,
          column: 8
        },
        end: {
          line: 149,
          column: 35
        }
      },
      "78": {
        start: {
          line: 150,
          column: 8
        },
        end: {
          line: 150,
          column: 34
        }
      },
      "79": {
        start: {
          line: 151,
          column: 8
        },
        end: {
          line: 151,
          column: 23
        }
      },
      "80": {
        start: {
          line: 154,
          column: 8
        },
        end: {
          line: 154,
          column: 33
        }
      },
      "81": {
        start: {
          line: 155,
          column: 8
        },
        end: {
          line: 155,
          column: 34
        }
      },
      "82": {
        start: {
          line: 156,
          column: 8
        },
        end: {
          line: 156,
          column: 20
        }
      },
      "83": {
        start: {
          line: 158,
          column: 6
        },
        end: {
          line: 158,
          column: 27
        }
      },
      "84": {
        start: {
          line: 160,
          column: 6
        },
        end: {
          line: 160,
          column: 51
        }
      },
      "85": {
        start: {
          line: 162,
          column: 6
        },
        end: {
          line: 168,
          column: 7
        }
      },
      "86": {
        start: {
          line: 163,
          column: 8
        },
        end: {
          line: 163,
          column: 59
        }
      },
      "87": {
        start: {
          line: 167,
          column: 8
        },
        end: {
          line: 167,
          column: 68
        }
      },
      "88": {
        start: {
          line: 170,
          column: 6
        },
        end: {
          line: 172,
          column: 7
        }
      },
      "89": {
        start: {
          line: 171,
          column: 8
        },
        end: {
          line: 171,
          column: 90
        }
      },
      "90": {
        start: {
          line: 174,
          column: 6
        },
        end: {
          line: 177,
          column: 7
        }
      },
      "91": {
        start: {
          line: 175,
          column: 8
        },
        end: {
          line: 176,
          column: 65
        }
      },
      "92": {
        start: {
          line: 179,
          column: 25
        },
        end: {
          line: 179,
          column: 52
        }
      },
      "93": {
        start: {
          line: 180,
          column: 6
        },
        end: {
          line: 180,
          column: 51
        }
      },
      "94": {
        start: {
          line: 181,
          column: 6
        },
        end: {
          line: 182,
          column: 72
        }
      },
      "95": {
        start: {
          line: 184,
          column: 6
        },
        end: {
          line: 192,
          column: 7
        }
      },
      "96": {
        start: {
          line: 185,
          column: 8
        },
        end: {
          line: 185,
          column: 53
        }
      },
      "97": {
        start: {
          line: 186,
          column: 18
        },
        end: {
          line: 186,
          column: 30
        }
      },
      "98": {
        start: {
          line: 188,
          column: 8
        },
        end: {
          line: 188,
          column: 44
        }
      },
      "99": {
        start: {
          line: 190,
          column: 8
        },
        end: {
          line: 190,
          column: 51
        }
      },
      "100": {
        start: {
          line: 191,
          column: 8
        },
        end: {
          line: 191,
          column: 62
        }
      },
      "101": {
        start: {
          line: 194,
          column: 6
        },
        end: {
          line: 194,
          column: 78
        }
      },
      "102": {
        start: {
          line: 196,
          column: 6
        },
        end: {
          line: 200,
          column: 7
        }
      },
      "103": {
        start: {
          line: 197,
          column: 8
        },
        end: {
          line: 197,
          column: 53
        }
      },
      "104": {
        start: {
          line: 198,
          column: 8
        },
        end: {
          line: 199,
          column: 73
        }
      },
      "105": {
        start: {
          line: 202,
          column: 6
        },
        end: {
          line: 213,
          column: 7
        }
      },
      "106": {
        start: {
          line: 203,
          column: 23
        },
        end: {
          line: 203,
          column: 48
        }
      },
      "107": {
        start: {
          line: 204,
          column: 8
        },
        end: {
          line: 204,
          column: 31
        }
      },
      "108": {
        start: {
          line: 205,
          column: 8
        },
        end: {
          line: 212,
          column: 9
        }
      },
      "109": {
        start: {
          line: 209,
          column: 10
        },
        end: {
          line: 209,
          column: 55
        }
      },
      "110": {
        start: {
          line: 210,
          column: 10
        },
        end: {
          line: 211,
          column: 86
        }
      },
      "111": {
        start: {
          line: 217,
          column: 6
        },
        end: {
          line: 234,
          column: 7
        }
      },
      "112": {
        start: {
          line: 218,
          column: 21
        },
        end: {
          line: 218,
          column: 30
        }
      },
      "113": {
        start: {
          line: 219,
          column: 8
        },
        end: {
          line: 219,
          column: 41
        }
      },
      "114": {
        start: {
          line: 219,
          column: 32
        },
        end: {
          line: 219,
          column: 41
        }
      },
      "115": {
        start: {
          line: 220,
          column: 8
        },
        end: {
          line: 220,
          column: 38
        }
      },
      "116": {
        start: {
          line: 220,
          column: 29
        },
        end: {
          line: 220,
          column: 38
        }
      },
      "117": {
        start: {
          line: 221,
          column: 8
        },
        end: {
          line: 221,
          column: 39
        }
      },
      "118": {
        start: {
          line: 221,
          column: 30
        },
        end: {
          line: 221,
          column: 39
        }
      },
      "119": {
        start: {
          line: 222,
          column: 8
        },
        end: {
          line: 222,
          column: 43
        }
      },
      "120": {
        start: {
          line: 222,
          column: 34
        },
        end: {
          line: 222,
          column: 43
        }
      },
      "121": {
        start: {
          line: 223,
          column: 8
        },
        end: {
          line: 223,
          column: 39
        }
      },
      "122": {
        start: {
          line: 223,
          column: 30
        },
        end: {
          line: 223,
          column: 39
        }
      },
      "123": {
        start: {
          line: 224,
          column: 8
        },
        end: {
          line: 224,
          column: 39
        }
      },
      "124": {
        start: {
          line: 224,
          column: 30
        },
        end: {
          line: 224,
          column: 39
        }
      },
      "125": {
        start: {
          line: 225,
          column: 8
        },
        end: {
          line: 225,
          column: 40
        }
      },
      "126": {
        start: {
          line: 225,
          column: 31
        },
        end: {
          line: 225,
          column: 40
        }
      },
      "127": {
        start: {
          line: 226,
          column: 8
        },
        end: {
          line: 226,
          column: 36
        }
      },
      "128": {
        start: {
          line: 226,
          column: 27
        },
        end: {
          line: 226,
          column: 36
        }
      },
      "129": {
        start: {
          line: 227,
          column: 8
        },
        end: {
          line: 227,
          column: 36
        }
      },
      "130": {
        start: {
          line: 227,
          column: 27
        },
        end: {
          line: 227,
          column: 36
        }
      },
      "131": {
        start: {
          line: 228,
          column: 8
        },
        end: {
          line: 228,
          column: 40
        }
      },
      "132": {
        start: {
          line: 228,
          column: 31
        },
        end: {
          line: 228,
          column: 40
        }
      },
      "133": {
        start: {
          line: 229,
          column: 8
        },
        end: {
          line: 229,
          column: 38
        }
      },
      "134": {
        start: {
          line: 229,
          column: 29
        },
        end: {
          line: 229,
          column: 38
        }
      },
      "135": {
        start: {
          line: 230,
          column: 8
        },
        end: {
          line: 230,
          column: 42
        }
      },
      "136": {
        start: {
          line: 230,
          column: 33
        },
        end: {
          line: 230,
          column: 42
        }
      },
      "137": {
        start: {
          line: 231,
          column: 8
        },
        end: {
          line: 231,
          column: 53
        }
      },
      "138": {
        start: {
          line: 232,
          column: 8
        },
        end: {
          line: 233,
          column: 56
        }
      },
      "139": {
        start: {
          line: 236,
          column: 6
        },
        end: {
          line: 236,
          column: 26
        }
      },
      "140": {
        start: {
          line: 240,
          column: 15
        },
        end: {
          line: 240,
          column: 17
        }
      },
      "141": {
        start: {
          line: 242,
          column: 4
        },
        end: {
          line: 242,
          column: 58
        }
      },
      "142": {
        start: {
          line: 242,
          column: 18
        },
        end: {
          line: 242,
          column: 58
        }
      },
      "143": {
        start: {
          line: 243,
          column: 4
        },
        end: {
          line: 243,
          column: 52
        }
      },
      "144": {
        start: {
          line: 243,
          column: 16
        },
        end: {
          line: 243,
          column: 52
        }
      },
      "145": {
        start: {
          line: 244,
          column: 4
        },
        end: {
          line: 244,
          column: 49
        }
      },
      "146": {
        start: {
          line: 244,
          column: 15
        },
        end: {
          line: 244,
          column: 49
        }
      },
      "147": {
        start: {
          line: 245,
          column: 18
        },
        end: {
          line: 245,
          column: 46
        }
      },
      "148": {
        start: {
          line: 246,
          column: 4
        },
        end: {
          line: 248,
          column: 5
        }
      },
      "149": {
        start: {
          line: 247,
          column: 6
        },
        end: {
          line: 247,
          column: 63
        }
      },
      "150": {
        start: {
          line: 253,
          column: 4
        },
        end: {
          line: 254,
          column: 57
        }
      },
      "151": {
        start: {
          line: 253,
          column: 22
        },
        end: {
          line: 253,
          column: 57
        }
      },
      "152": {
        start: {
          line: 254,
          column: 9
        },
        end: {
          line: 254,
          column: 57
        }
      },
      "153": {
        start: {
          line: 254,
          column: 21
        },
        end: {
          line: 254,
          column: 57
        }
      },
      "154": {
        start: {
          line: 257,
          column: 4
        },
        end: {
          line: 259,
          column: 5
        }
      },
      "155": {
        start: {
          line: 258,
          column: 6
        },
        end: {
          line: 258,
          column: 76
        }
      },
      "156": {
        start: {
          line: 261,
          column: 4
        },
        end: {
          line: 263,
          column: 5
        }
      },
      "157": {
        start: {
          line: 262,
          column: 6
        },
        end: {
          line: 262,
          column: 61
        }
      },
      "158": {
        start: {
          line: 265,
          column: 4
        },
        end: {
          line: 265,
          column: 15
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 8,
            column: 2
          },
          end: {
            line: 8,
            column: 3
          }
        },
        loc: {
          start: {
            line: 8,
            column: 35
          },
          end: {
            line: 19,
            column: 3
          }
        },
        line: 8
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 21,
            column: 2
          },
          end: {
            line: 21,
            column: 3
          }
        },
        loc: {
          start: {
            line: 21,
            column: 51
          },
          end: {
            line: 38,
            column: 3
          }
        },
        line: 21
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 40,
            column: 2
          },
          end: {
            line: 40,
            column: 3
          }
        },
        loc: {
          start: {
            line: 40,
            column: 47
          },
          end: {
            line: 111,
            column: 3
          }
        },
        line: 40
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 113,
            column: 2
          },
          end: {
            line: 113,
            column: 3
          }
        },
        loc: {
          start: {
            line: 113,
            column: 42
          },
          end: {
            line: 266,
            column: 3
          }
        },
        line: 113
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 120,
            column: 6
          },
          end: {
            line: 120,
            column: 7
          }
        },
        loc: {
          start: {
            line: 120,
            column: 24
          },
          end: {
            line: 123,
            column: 7
          }
        },
        line: 120
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 126,
            column: 15
          },
          end: {
            line: 126,
            column: 16
          }
        },
        loc: {
          start: {
            line: 126,
            column: 30
          },
          end: {
            line: 126,
            column: 71
          }
        },
        line: 126
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 11,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 11,
            column: 5
          }
        }, {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 11,
            column: 5
          }
        }],
        line: 9
      },
      "1": {
        loc: {
          start: {
            line: 12,
            column: 4
          },
          end: {
            line: 14,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 12,
            column: 4
          },
          end: {
            line: 14,
            column: 5
          }
        }, {
          start: {
            line: 12,
            column: 4
          },
          end: {
            line: 14,
            column: 5
          }
        }],
        line: 12
      },
      "2": {
        loc: {
          start: {
            line: 15,
            column: 4
          },
          end: {
            line: 17,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 15,
            column: 4
          },
          end: {
            line: 17,
            column: 5
          }
        }, {
          start: {
            line: 15,
            column: 4
          },
          end: {
            line: 17,
            column: 5
          }
        }],
        line: 15
      },
      "3": {
        loc: {
          start: {
            line: 27,
            column: 6
          },
          end: {
            line: 28,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 27,
            column: 6
          },
          end: {
            line: 28,
            column: 47
          }
        }, {
          start: {
            line: 27,
            column: 6
          },
          end: {
            line: 28,
            column: 47
          }
        }],
        line: 27
      },
      "4": {
        loc: {
          start: {
            line: 28,
            column: 11
          },
          end: {
            line: 28,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 28,
            column: 11
          },
          end: {
            line: 28,
            column: 47
          }
        }, {
          start: {
            line: 28,
            column: 11
          },
          end: {
            line: 28,
            column: 47
          }
        }],
        line: 28
      },
      "5": {
        loc: {
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 33,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 33,
            column: 5
          }
        }, {
          start: {
            line: 31,
            column: 4
          },
          end: {
            line: 33,
            column: 5
          }
        }],
        line: 31
      },
      "6": {
        loc: {
          start: {
            line: 34,
            column: 4
          },
          end: {
            line: 36,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 34,
            column: 4
          },
          end: {
            line: 36,
            column: 5
          }
        }, {
          start: {
            line: 34,
            column: 4
          },
          end: {
            line: 36,
            column: 5
          }
        }],
        line: 34
      },
      "7": {
        loc: {
          start: {
            line: 41,
            column: 4
          },
          end: {
            line: 43,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 41,
            column: 4
          },
          end: {
            line: 43,
            column: 5
          }
        }, {
          start: {
            line: 41,
            column: 4
          },
          end: {
            line: 43,
            column: 5
          }
        }],
        line: 41
      },
      "8": {
        loc: {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 49,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 49,
            column: 5
          }
        }, {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 49,
            column: 5
          }
        }],
        line: 45
      },
      "9": {
        loc: {
          start: {
            line: 45,
            column: 7
          },
          end: {
            line: 45,
            column: 70
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 45,
            column: 7
          },
          end: {
            line: 45,
            column: 39
          }
        }, {
          start: {
            line: 45,
            column: 43
          },
          end: {
            line: 45,
            column: 70
          }
        }],
        line: 45
      },
      "10": {
        loc: {
          start: {
            line: 58,
            column: 6
          },
          end: {
            line: 68,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 58,
            column: 6
          },
          end: {
            line: 68,
            column: 7
          }
        }, {
          start: {
            line: 58,
            column: 6
          },
          end: {
            line: 68,
            column: 7
          }
        }],
        line: 58
      },
      "11": {
        loc: {
          start: {
            line: 58,
            column: 9
          },
          end: {
            line: 58,
            column: 60
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 58,
            column: 9
          },
          end: {
            line: 58,
            column: 35
          }
        }, {
          start: {
            line: 58,
            column: 39
          },
          end: {
            line: 58,
            column: 60
          }
        }],
        line: 58
      },
      "12": {
        loc: {
          start: {
            line: 70,
            column: 6
          },
          end: {
            line: 78,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 70,
            column: 6
          },
          end: {
            line: 78,
            column: 7
          }
        }, {
          start: {
            line: 70,
            column: 6
          },
          end: {
            line: 78,
            column: 7
          }
        }],
        line: 70
      },
      "13": {
        loc: {
          start: {
            line: 80,
            column: 6
          },
          end: {
            line: 87,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 80,
            column: 6
          },
          end: {
            line: 87,
            column: 7
          }
        }, {
          start: {
            line: 80,
            column: 6
          },
          end: {
            line: 87,
            column: 7
          }
        }],
        line: 80
      },
      "14": {
        loc: {
          start: {
            line: 90,
            column: 6
          },
          end: {
            line: 102,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 90,
            column: 6
          },
          end: {
            line: 102,
            column: 7
          }
        }, {
          start: {
            line: 90,
            column: 6
          },
          end: {
            line: 102,
            column: 7
          }
        }],
        line: 90
      },
      "15": {
        loc: {
          start: {
            line: 90,
            column: 9
          },
          end: {
            line: 90,
            column: 69
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 90,
            column: 9
          },
          end: {
            line: 90,
            column: 37
          }
        }, {
          start: {
            line: 90,
            column: 41
          },
          end: {
            line: 90,
            column: 69
          }
        }],
        line: 90
      },
      "16": {
        loc: {
          start: {
            line: 142,
            column: 6
          },
          end: {
            line: 157,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 142,
            column: 6
          },
          end: {
            line: 157,
            column: 7
          }
        }, {
          start: {
            line: 142,
            column: 6
          },
          end: {
            line: 157,
            column: 7
          }
        }],
        line: 142
      },
      "17": {
        loc: {
          start: {
            line: 147,
            column: 13
          },
          end: {
            line: 157,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 147,
            column: 13
          },
          end: {
            line: 157,
            column: 7
          }
        }, {
          start: {
            line: 147,
            column: 13
          },
          end: {
            line: 157,
            column: 7
          }
        }],
        line: 147
      },
      "18": {
        loc: {
          start: {
            line: 162,
            column: 6
          },
          end: {
            line: 168,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 162,
            column: 6
          },
          end: {
            line: 168,
            column: 7
          }
        }, {
          start: {
            line: 162,
            column: 6
          },
          end: {
            line: 168,
            column: 7
          }
        }],
        line: 162
      },
      "19": {
        loc: {
          start: {
            line: 170,
            column: 6
          },
          end: {
            line: 172,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 170,
            column: 6
          },
          end: {
            line: 172,
            column: 7
          }
        }, {
          start: {
            line: 170,
            column: 6
          },
          end: {
            line: 172,
            column: 7
          }
        }],
        line: 170
      },
      "20": {
        loc: {
          start: {
            line: 170,
            column: 9
          },
          end: {
            line: 170,
            column: 49
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 170,
            column: 9
          },
          end: {
            line: 170,
            column: 20
          }
        }, {
          start: {
            line: 170,
            column: 24
          },
          end: {
            line: 170,
            column: 49
          }
        }],
        line: 170
      },
      "21": {
        loc: {
          start: {
            line: 174,
            column: 6
          },
          end: {
            line: 177,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 174,
            column: 6
          },
          end: {
            line: 177,
            column: 7
          }
        }, {
          start: {
            line: 174,
            column: 6
          },
          end: {
            line: 177,
            column: 7
          }
        }],
        line: 174
      },
      "22": {
        loc: {
          start: {
            line: 184,
            column: 6
          },
          end: {
            line: 192,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 184,
            column: 6
          },
          end: {
            line: 192,
            column: 7
          }
        }, {
          start: {
            line: 184,
            column: 6
          },
          end: {
            line: 192,
            column: 7
          }
        }],
        line: 184
      },
      "23": {
        loc: {
          start: {
            line: 196,
            column: 6
          },
          end: {
            line: 200,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 196,
            column: 6
          },
          end: {
            line: 200,
            column: 7
          }
        }, {
          start: {
            line: 196,
            column: 6
          },
          end: {
            line: 200,
            column: 7
          }
        }],
        line: 196
      },
      "24": {
        loc: {
          start: {
            line: 202,
            column: 6
          },
          end: {
            line: 213,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 202,
            column: 6
          },
          end: {
            line: 213,
            column: 7
          }
        }, {
          start: {
            line: 202,
            column: 6
          },
          end: {
            line: 213,
            column: 7
          }
        }],
        line: 202
      },
      "25": {
        loc: {
          start: {
            line: 205,
            column: 8
          },
          end: {
            line: 212,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 205,
            column: 8
          },
          end: {
            line: 212,
            column: 9
          }
        }, {
          start: {
            line: 205,
            column: 8
          },
          end: {
            line: 212,
            column: 9
          }
        }],
        line: 205
      },
      "26": {
        loc: {
          start: {
            line: 219,
            column: 8
          },
          end: {
            line: 219,
            column: 41
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 219,
            column: 8
          },
          end: {
            line: 219,
            column: 41
          }
        }, {
          start: {
            line: 219,
            column: 8
          },
          end: {
            line: 219,
            column: 41
          }
        }],
        line: 219
      },
      "27": {
        loc: {
          start: {
            line: 220,
            column: 8
          },
          end: {
            line: 220,
            column: 38
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 220,
            column: 8
          },
          end: {
            line: 220,
            column: 38
          }
        }, {
          start: {
            line: 220,
            column: 8
          },
          end: {
            line: 220,
            column: 38
          }
        }],
        line: 220
      },
      "28": {
        loc: {
          start: {
            line: 221,
            column: 8
          },
          end: {
            line: 221,
            column: 39
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 221,
            column: 8
          },
          end: {
            line: 221,
            column: 39
          }
        }, {
          start: {
            line: 221,
            column: 8
          },
          end: {
            line: 221,
            column: 39
          }
        }],
        line: 221
      },
      "29": {
        loc: {
          start: {
            line: 222,
            column: 8
          },
          end: {
            line: 222,
            column: 43
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 222,
            column: 8
          },
          end: {
            line: 222,
            column: 43
          }
        }, {
          start: {
            line: 222,
            column: 8
          },
          end: {
            line: 222,
            column: 43
          }
        }],
        line: 222
      },
      "30": {
        loc: {
          start: {
            line: 223,
            column: 8
          },
          end: {
            line: 223,
            column: 39
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 223,
            column: 8
          },
          end: {
            line: 223,
            column: 39
          }
        }, {
          start: {
            line: 223,
            column: 8
          },
          end: {
            line: 223,
            column: 39
          }
        }],
        line: 223
      },
      "31": {
        loc: {
          start: {
            line: 224,
            column: 8
          },
          end: {
            line: 224,
            column: 39
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 224,
            column: 8
          },
          end: {
            line: 224,
            column: 39
          }
        }, {
          start: {
            line: 224,
            column: 8
          },
          end: {
            line: 224,
            column: 39
          }
        }],
        line: 224
      },
      "32": {
        loc: {
          start: {
            line: 225,
            column: 8
          },
          end: {
            line: 225,
            column: 40
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 225,
            column: 8
          },
          end: {
            line: 225,
            column: 40
          }
        }, {
          start: {
            line: 225,
            column: 8
          },
          end: {
            line: 225,
            column: 40
          }
        }],
        line: 225
      },
      "33": {
        loc: {
          start: {
            line: 226,
            column: 8
          },
          end: {
            line: 226,
            column: 36
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 226,
            column: 8
          },
          end: {
            line: 226,
            column: 36
          }
        }, {
          start: {
            line: 226,
            column: 8
          },
          end: {
            line: 226,
            column: 36
          }
        }],
        line: 226
      },
      "34": {
        loc: {
          start: {
            line: 227,
            column: 8
          },
          end: {
            line: 227,
            column: 36
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 227,
            column: 8
          },
          end: {
            line: 227,
            column: 36
          }
        }, {
          start: {
            line: 227,
            column: 8
          },
          end: {
            line: 227,
            column: 36
          }
        }],
        line: 227
      },
      "35": {
        loc: {
          start: {
            line: 228,
            column: 8
          },
          end: {
            line: 228,
            column: 40
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 228,
            column: 8
          },
          end: {
            line: 228,
            column: 40
          }
        }, {
          start: {
            line: 228,
            column: 8
          },
          end: {
            line: 228,
            column: 40
          }
        }],
        line: 228
      },
      "36": {
        loc: {
          start: {
            line: 229,
            column: 8
          },
          end: {
            line: 229,
            column: 38
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 229,
            column: 8
          },
          end: {
            line: 229,
            column: 38
          }
        }, {
          start: {
            line: 229,
            column: 8
          },
          end: {
            line: 229,
            column: 38
          }
        }],
        line: 229
      },
      "37": {
        loc: {
          start: {
            line: 230,
            column: 8
          },
          end: {
            line: 230,
            column: 42
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 230,
            column: 8
          },
          end: {
            line: 230,
            column: 42
          }
        }, {
          start: {
            line: 230,
            column: 8
          },
          end: {
            line: 230,
            column: 42
          }
        }],
        line: 230
      },
      "38": {
        loc: {
          start: {
            line: 242,
            column: 4
          },
          end: {
            line: 242,
            column: 58
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 242,
            column: 4
          },
          end: {
            line: 242,
            column: 58
          }
        }, {
          start: {
            line: 242,
            column: 4
          },
          end: {
            line: 242,
            column: 58
          }
        }],
        line: 242
      },
      "39": {
        loc: {
          start: {
            line: 243,
            column: 4
          },
          end: {
            line: 243,
            column: 52
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 243,
            column: 4
          },
          end: {
            line: 243,
            column: 52
          }
        }, {
          start: {
            line: 243,
            column: 4
          },
          end: {
            line: 243,
            column: 52
          }
        }],
        line: 243
      },
      "40": {
        loc: {
          start: {
            line: 244,
            column: 4
          },
          end: {
            line: 244,
            column: 49
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 244,
            column: 4
          },
          end: {
            line: 244,
            column: 49
          }
        }, {
          start: {
            line: 244,
            column: 4
          },
          end: {
            line: 244,
            column: 49
          }
        }],
        line: 244
      },
      "41": {
        loc: {
          start: {
            line: 246,
            column: 4
          },
          end: {
            line: 248,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 246,
            column: 4
          },
          end: {
            line: 248,
            column: 5
          }
        }, {
          start: {
            line: 246,
            column: 4
          },
          end: {
            line: 248,
            column: 5
          }
        }],
        line: 246
      },
      "42": {
        loc: {
          start: {
            line: 246,
            column: 7
          },
          end: {
            line: 246,
            column: 67
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 246,
            column: 7
          },
          end: {
            line: 246,
            column: 26
          }
        }, {
          start: {
            line: 246,
            column: 30
          },
          end: {
            line: 246,
            column: 47
          }
        }, {
          start: {
            line: 246,
            column: 51
          },
          end: {
            line: 246,
            column: 67
          }
        }],
        line: 246
      },
      "43": {
        loc: {
          start: {
            line: 253,
            column: 4
          },
          end: {
            line: 254,
            column: 57
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 253,
            column: 4
          },
          end: {
            line: 254,
            column: 57
          }
        }, {
          start: {
            line: 253,
            column: 4
          },
          end: {
            line: 254,
            column: 57
          }
        }],
        line: 253
      },
      "44": {
        loc: {
          start: {
            line: 254,
            column: 9
          },
          end: {
            line: 254,
            column: 57
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 254,
            column: 9
          },
          end: {
            line: 254,
            column: 57
          }
        }, {
          start: {
            line: 254,
            column: 9
          },
          end: {
            line: 254,
            column: 57
          }
        }],
        line: 254
      },
      "45": {
        loc: {
          start: {
            line: 257,
            column: 4
          },
          end: {
            line: 259,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 257,
            column: 4
          },
          end: {
            line: 259,
            column: 5
          }
        }, {
          start: {
            line: 257,
            column: 4
          },
          end: {
            line: 259,
            column: 5
          }
        }],
        line: 257
      },
      "46": {
        loc: {
          start: {
            line: 257,
            column: 7
          },
          end: {
            line: 257,
            column: 38
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 257,
            column: 7
          },
          end: {
            line: 257,
            column: 16
          }
        }, {
          start: {
            line: 257,
            column: 20
          },
          end: {
            line: 257,
            column: 38
          }
        }],
        line: 257
      },
      "47": {
        loc: {
          start: {
            line: 261,
            column: 4
          },
          end: {
            line: 263,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 261,
            column: 4
          },
          end: {
            line: 263,
            column: 5
          }
        }, {
          start: {
            line: 261,
            column: 4
          },
          end: {
            line: 263,
            column: 5
          }
        }],
        line: 261
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0,
      "60": 0,
      "61": 0,
      "62": 0,
      "63": 0,
      "64": 0,
      "65": 0,
      "66": 0,
      "67": 0,
      "68": 0,
      "69": 0,
      "70": 0,
      "71": 0,
      "72": 0,
      "73": 0,
      "74": 0,
      "75": 0,
      "76": 0,
      "77": 0,
      "78": 0,
      "79": 0,
      "80": 0,
      "81": 0,
      "82": 0,
      "83": 0,
      "84": 0,
      "85": 0,
      "86": 0,
      "87": 0,
      "88": 0,
      "89": 0,
      "90": 0,
      "91": 0,
      "92": 0,
      "93": 0,
      "94": 0,
      "95": 0,
      "96": 0,
      "97": 0,
      "98": 0,
      "99": 0,
      "100": 0,
      "101": 0,
      "102": 0,
      "103": 0,
      "104": 0,
      "105": 0,
      "106": 0,
      "107": 0,
      "108": 0,
      "109": 0,
      "110": 0,
      "111": 0,
      "112": 0,
      "113": 0,
      "114": 0,
      "115": 0,
      "116": 0,
      "117": 0,
      "118": 0,
      "119": 0,
      "120": 0,
      "121": 0,
      "122": 0,
      "123": 0,
      "124": 0,
      "125": 0,
      "126": 0,
      "127": 0,
      "128": 0,
      "129": 0,
      "130": 0,
      "131": 0,
      "132": 0,
      "133": 0,
      "134": 0,
      "135": 0,
      "136": 0,
      "137": 0,
      "138": 0,
      "139": 0,
      "140": 0,
      "141": 0,
      "142": 0,
      "143": 0,
      "144": 0,
      "145": 0,
      "146": 0,
      "147": 0,
      "148": 0,
      "149": 0,
      "150": 0,
      "151": 0,
      "152": 0,
      "153": 0,
      "154": 0,
      "155": 0,
      "156": 0,
      "157": 0,
      "158": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0, 0],
      "18": [0, 0],
      "19": [0, 0],
      "20": [0, 0],
      "21": [0, 0],
      "22": [0, 0],
      "23": [0, 0],
      "24": [0, 0],
      "25": [0, 0],
      "26": [0, 0],
      "27": [0, 0],
      "28": [0, 0],
      "29": [0, 0],
      "30": [0, 0],
      "31": [0, 0],
      "32": [0, 0],
      "33": [0, 0],
      "34": [0, 0],
      "35": [0, 0],
      "36": [0, 0],
      "37": [0, 0],
      "38": [0, 0],
      "39": [0, 0],
      "40": [0, 0],
      "41": [0, 0],
      "42": [0, 0, 0],
      "43": [0, 0],
      "44": [0, 0],
      "45": [0, 0],
      "46": [0, 0],
      "47": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

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
      cov_b7jydiney.f[0]++;
      cov_b7jydiney.s[0]++;

      if (millis === 1) {
        cov_b7jydiney.b[0][0]++;
        cov_b7jydiney.s[1]++;
        return "".concat(millis, " millisecond");
      } else {
        cov_b7jydiney.b[0][1]++;
      }

      cov_b7jydiney.s[2]++;

      if (millis < 1000) {
        cov_b7jydiney.b[1][0]++;
        cov_b7jydiney.s[3]++;
        return "".concat(millis, " milliseconds");
      } else {
        cov_b7jydiney.b[1][1]++;
      }

      cov_b7jydiney.s[4]++;

      if (millis === 1000) {
        cov_b7jydiney.b[2][0]++;
        cov_b7jydiney.s[5]++;
        return "".concat(millis / 1000, " second");
      } else {
        cov_b7jydiney.b[2][1]++;
      }

      cov_b7jydiney.s[6]++;
      return "".concat(millis / 1000, " seconds");
    }
  }, {
    key: "getHighStateLabel",
    value: function getHighStateLabel(hostname, hostResponse) {
      cov_b7jydiney.f[1]++;
      var anyFailures = (cov_b7jydiney.s[7]++, false);
      var anySkips = (cov_b7jydiney.s[8]++, false); // do not use Object.entries, that is not supported by the test framework

      cov_b7jydiney.s[9]++;

      var _arr = Object.keys(hostResponse);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];
        var task = (cov_b7jydiney.s[10]++, hostResponse[key]);
        cov_b7jydiney.s[11]++;

        if (task.result === null) {
          cov_b7jydiney.b[3][0]++;
          cov_b7jydiney.s[12]++;
          anySkips = true;
        } else {
          cov_b7jydiney.b[3][1]++;
          cov_b7jydiney.s[13]++;

          if (!task.result) {
            cov_b7jydiney.b[4][0]++;
            cov_b7jydiney.s[14]++;
            anyFailures = true;
          } else {
            cov_b7jydiney.b[4][1]++;
          }
        }
      }

      cov_b7jydiney.s[15]++;

      if (anyFailures) {
        cov_b7jydiney.b[5][0]++;
        cov_b7jydiney.s[16]++;
        return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_failure");
      } else {
        cov_b7jydiney.b[5][1]++;
      }

      cov_b7jydiney.s[17]++;

      if (anySkips) {
        cov_b7jydiney.b[6][0]++;
        cov_b7jydiney.s[18]++;
        return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_skips");
      } else {
        cov_b7jydiney.b[6][1]++;
      }

      cov_b7jydiney.s[19]++;
      return _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].getHostnameHtml(hostname, "host_success");
    }
  }, {
    key: "addChangesInfo",
    value: function addChangesInfo(taskDiv, task, indent) {
      cov_b7jydiney.f[2]++;
      cov_b7jydiney.s[20]++;

      if (!task.hasOwnProperty("changes")) {
        cov_b7jydiney.b[7][0]++;
        cov_b7jydiney.s[21]++;
        return 0;
      } else {
        cov_b7jydiney.b[7][1]++;
      }

      cov_b7jydiney.s[22]++;

      if ((cov_b7jydiney.b[9][0]++, _typeof(task.changes) !== "object") || (cov_b7jydiney.b[9][1]++, Array.isArray(task.changes))) {
        cov_b7jydiney.b[8][0]++;
        cov_b7jydiney.s[23]++;
        taskDiv.append(document.createElement("br"));
        cov_b7jydiney.s[24]++;
        taskDiv.append(document.createTextNode(indent + JSON.stringify(task.changes)));
        cov_b7jydiney.s[25]++;
        return 0;
      } else {
        cov_b7jydiney.b[8][1]++;
      }

      var changes = (cov_b7jydiney.s[26]++, 0);
      cov_b7jydiney.s[27]++;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(task.changes).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;
          cov_b7jydiney.s[28]++;
          changes = changes + 1;
          var change = (cov_b7jydiney.s[29]++, task.changes[key]);
          cov_b7jydiney.s[30]++;

          if ((cov_b7jydiney.b[11][0]++, typeof change === "string") && (cov_b7jydiney.b[11][1]++, change.includes("\n"))) {
            cov_b7jydiney.b[10][0]++;
            cov_b7jydiney.s[31]++;
            taskDiv.append(document.createElement("br")); // show multi-line text as a separate block

            cov_b7jydiney.s[32]++;
            taskDiv.append(document.createTextNode(indent + key + ":"));
            var lines = (cov_b7jydiney.s[33]++, change.trim().split("\n"));
            cov_b7jydiney.s[34]++;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var line = _step2.value;
                cov_b7jydiney.s[35]++;
                taskDiv.append(document.createElement("br"));
                cov_b7jydiney.s[36]++;
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

            cov_b7jydiney.s[37]++;
            continue;
          } else {
            cov_b7jydiney.b[10][1]++;
          }

          cov_b7jydiney.s[38]++;

          if (Array.isArray(change)) {
            cov_b7jydiney.b[12][0]++;
            cov_b7jydiney.s[39]++;

            for (var idx in change) {
              var _task = (cov_b7jydiney.s[40]++, change[idx]);

              cov_b7jydiney.s[41]++;
              taskDiv.append(document.createElement("br"));
              cov_b7jydiney.s[42]++;
              taskDiv.append(document.createTextNode(indent + key + "[" + idx + "]: " + JSON.stringify(_task)));
            }

            cov_b7jydiney.s[43]++;
            continue;
          } else {
            cov_b7jydiney.b[12][1]++;
          }

          cov_b7jydiney.s[44]++;

          if (_typeof(change) !== "object") {
            cov_b7jydiney.b[13][0]++;
            cov_b7jydiney.s[45]++;
            // show all other non-objects in a simple way
            taskDiv.append(document.createElement("br"));
            cov_b7jydiney.s[46]++;
            taskDiv.append(document.createTextNode(indent + key + ": " + JSON.stringify(change)));
            cov_b7jydiney.s[47]++;
            continue;
          } else {
            cov_b7jydiney.b[13][1]++;
          } // treat old->new first


          cov_b7jydiney.s[48]++;

          if ((cov_b7jydiney.b[15][0]++, change.hasOwnProperty("old")) && (cov_b7jydiney.b[15][1]++, change.hasOwnProperty("new"))) {
            cov_b7jydiney.b[14][0]++;
            cov_b7jydiney.s[49]++;
            taskDiv.append(document.createElement("br")); // place changes on one line
            // 25BA = BLACK RIGHT-POINTING POINTER
            // don't use arrows here, these are higher than a regular
            // text-line and disturb the text-flow

            cov_b7jydiney.s[50]++;
            taskDiv.append(document.createTextNode(indent + key + ": " + JSON.stringify(change.old) + " \u25BA " + JSON.stringify(change.new)));
            cov_b7jydiney.s[51]++;
            delete change.old;
            cov_b7jydiney.s[52]++;
            delete change.new;
          } else {
            cov_b7jydiney.b[14][1]++;
          } // then show whatever remains


          cov_b7jydiney.s[53]++;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = Object.keys(change).sort()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var taskkey = _step3.value;
              cov_b7jydiney.s[54]++;
              taskDiv.append(document.createElement("br"));
              cov_b7jydiney.s[55]++;
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
      cov_b7jydiney.f[3]++;
      // The tasks are in an (unordered) object with uninteresting keys
      // convert it to an array that is in execution order
      // first put all the values in an array
      var tasks = (cov_b7jydiney.s[56]++, []);
      cov_b7jydiney.s[57]++;
      Object.keys(hostResponse).forEach(function (taskKey) {
        cov_b7jydiney.f[4]++;
        cov_b7jydiney.s[58]++;
        hostResponse[taskKey].___key___ = taskKey;
        cov_b7jydiney.s[59]++;
        tasks.push(hostResponse[taskKey]);
      }); // then sort the array

      cov_b7jydiney.s[60]++;
      tasks.sort(function (a, b) {
        cov_b7jydiney.f[5]++;
        cov_b7jydiney.s[61]++;
        return a.__run_num__ - b.__run_num__;
      });
      var indent = (cov_b7jydiney.s[62]++, "    ");
      var div = (cov_b7jydiney.s[63]++, document.createElement("div"));
      var succeeded = (cov_b7jydiney.s[64]++, 0);
      var failed = (cov_b7jydiney.s[65]++, 0);
      var skipped = (cov_b7jydiney.s[66]++, 0);
      var total_millis = (cov_b7jydiney.s[67]++, 0);
      var changes = (cov_b7jydiney.s[68]++, 0);
      cov_b7jydiney.s[69]++;

      for (var _i2 = 0; _i2 < tasks.length; _i2++) {
        var task = tasks[_i2];
        var taskDiv = (cov_b7jydiney.s[70]++, document.createElement("div"));
        var span = (cov_b7jydiney.s[71]++, document.createElement("span"));
        cov_b7jydiney.s[72]++;

        if (task.result === null) {
          cov_b7jydiney.b[16][0]++;
          cov_b7jydiney.s[73]++;
          // 2714 = HEAVY CHECK MARK
          span.style.color = "yellow";
          cov_b7jydiney.s[74]++;
          span.innerText = "\u2714";
          cov_b7jydiney.s[75]++;
          skipped += 1;
        } else {
          cov_b7jydiney.b[16][1]++;
          cov_b7jydiney.s[76]++;

          if (task.result) {
            cov_b7jydiney.b[17][0]++;
            cov_b7jydiney.s[77]++;
            // 2714 = HEAVY CHECK MARK
            span.style.color = "green";
            cov_b7jydiney.s[78]++;
            span.innerText = "\u2714";
            cov_b7jydiney.s[79]++;
            succeeded += 1;
          } else {
            cov_b7jydiney.b[17][1]++;
            cov_b7jydiney.s[80]++;
            // 2718 = HEAVY BALLOT X
            span.style.color = "red";
            cov_b7jydiney.s[81]++;
            span.innerText = "\u2718";
            cov_b7jydiney.s[82]++;
            failed += 1;
          }
        }

        cov_b7jydiney.s[83]++;
        taskDiv.append(span);
        cov_b7jydiney.s[84]++;
        taskDiv.append(document.createTextNode(" "));
        cov_b7jydiney.s[85]++;

        if (task.name) {
          cov_b7jydiney.b[18][0]++;
          cov_b7jydiney.s[86]++;
          taskDiv.append(document.createTextNode(task.name));
        } else {
          cov_b7jydiney.b[18][1]++;
          cov_b7jydiney.s[87]++;
          // make sure that the checkbox/ballot-x is on a reasonable line
          // also for the next "from" clause (if any)
          taskDiv.append(document.createTextNode("(anonymous task)"));
        }

        cov_b7jydiney.s[88]++;

        if ((cov_b7jydiney.b[20][0]++, task.__id__) && (cov_b7jydiney.b[20][1]++, task.__id__ !== task.name)) {
          cov_b7jydiney.b[19][0]++;
          cov_b7jydiney.s[89]++;
          taskDiv.append(document.createTextNode(" id=" + encodeURIComponent(task.__id__)));
        } else {
          cov_b7jydiney.b[19][1]++;
        }

        cov_b7jydiney.s[90]++;

        if (task.__sls__) {
          cov_b7jydiney.b[21][0]++;
          cov_b7jydiney.s[91]++;
          taskDiv.append(document.createTextNode(" (from " + task.__sls__.replace(".", "/") + ".sls)"));
        } else {
          cov_b7jydiney.b[21][1]++;
        }

        var components = (cov_b7jydiney.s[92]++, task.___key___.split("_|-"));
        cov_b7jydiney.s[93]++;
        taskDiv.append(document.createElement("br"));
        cov_b7jydiney.s[94]++;
        taskDiv.append(document.createTextNode(indent + "Function is " + components[0] + "." + components[3]));
        cov_b7jydiney.s[95]++;

        if (task.comment) {
          cov_b7jydiney.b[22][0]++;
          cov_b7jydiney.s[96]++;
          taskDiv.append(document.createElement("br"));
          var txt = (cov_b7jydiney.s[97]++, task.comment); // trim extra whitespace

          cov_b7jydiney.s[98]++;
          txt = txt.replace(/[ \r\n]+$/g, ""); // indent extra lines

          cov_b7jydiney.s[99]++;
          txt = txt.replace(/[\n]+/g, "\n" + indent);
          cov_b7jydiney.s[100]++;
          taskDiv.append(document.createTextNode(indent + txt));
        } else {
          cov_b7jydiney.b[22][1]++;
        }

        cov_b7jydiney.s[101]++;
        changes += OutputSaltGuiHighstate.addChangesInfo(taskDiv, task, indent);
        cov_b7jydiney.s[102]++;

        if (task.hasOwnProperty("start_time")) {
          cov_b7jydiney.b[23][0]++;
          cov_b7jydiney.s[103]++;
          taskDiv.append(document.createElement("br"));
          cov_b7jydiney.s[104]++;
          taskDiv.append(document.createTextNode(indent + "Started at " + _Output__WEBPACK_IMPORTED_MODULE_0__["Output"].dateTimeStr(task.start_time)));
        } else {
          cov_b7jydiney.b[23][1]++;
        }

        cov_b7jydiney.s[105]++;

        if (task.hasOwnProperty("duration")) {
          cov_b7jydiney.b[24][0]++;
          var millis = (cov_b7jydiney.s[106]++, Math.round(task.duration));
          cov_b7jydiney.s[107]++;
          total_millis += millis;
          cov_b7jydiney.s[108]++;

          if (millis >= 10) {
            cov_b7jydiney.b[25][0]++;
            cov_b7jydiney.s[109]++;
            // anything below 10ms is not worth reporting
            // report only the "slow" jobs
            // it still counts for the grand total thought
            taskDiv.append(document.createElement("br"));
            cov_b7jydiney.s[110]++;
            taskDiv.append(document.createTextNode(indent + "Duration " + OutputSaltGuiHighstate.getDurationClause(millis)));
          } else {
            cov_b7jydiney.b[25][1]++;
          }
        } else {
          cov_b7jydiney.b[24][1]++;
        } // show any unknown attribute of a task
        // do not use Object.entries, that is not supported by the test framework


        cov_b7jydiney.s[111]++;

        var _arr2 = Object.keys(task);

        for (var _i3 = 0; _i3 < _arr2.length; _i3++) {
          var key = _arr2[_i3];
          var item = (cov_b7jydiney.s[112]++, task[key]);
          cov_b7jydiney.s[113]++;

          if (key === "___key___") {
            cov_b7jydiney.b[26][0]++;
            cov_b7jydiney.s[114]++;
            continue;
          } else {
            cov_b7jydiney.b[26][1]++;
          } // ignored, generated by us


          cov_b7jydiney.s[115]++;

          if (key === "__id__") {
            cov_b7jydiney.b[27][0]++;
            cov_b7jydiney.s[116]++;
            continue;
          } else {
            cov_b7jydiney.b[27][1]++;
          } // handled


          cov_b7jydiney.s[117]++;

          if (key === "__sls__") {
            cov_b7jydiney.b[28][0]++;
            cov_b7jydiney.s[118]++;
            continue;
          } else {
            cov_b7jydiney.b[28][1]++;
          } // handled


          cov_b7jydiney.s[119]++;

          if (key === "__run_num__") {
            cov_b7jydiney.b[29][0]++;
            cov_b7jydiney.s[120]++;
            continue;
          } else {
            cov_b7jydiney.b[29][1]++;
          } // handled, not shown


          cov_b7jydiney.s[121]++;

          if (key === "changes") {
            cov_b7jydiney.b[30][0]++;
            cov_b7jydiney.s[122]++;
            continue;
          } else {
            cov_b7jydiney.b[30][1]++;
          } // handled


          cov_b7jydiney.s[123]++;

          if (key === "comment") {
            cov_b7jydiney.b[31][0]++;
            cov_b7jydiney.s[124]++;
            continue;
          } else {
            cov_b7jydiney.b[31][1]++;
          } // handled


          cov_b7jydiney.s[125]++;

          if (key === "duration") {
            cov_b7jydiney.b[32][0]++;
            cov_b7jydiney.s[126]++;
            continue;
          } else {
            cov_b7jydiney.b[32][1]++;
          } // handled


          cov_b7jydiney.s[127]++;

          if (key === "host") {
            cov_b7jydiney.b[33][0]++;
            cov_b7jydiney.s[128]++;
            continue;
          } else {
            cov_b7jydiney.b[33][1]++;
          } // ignored, same as host


          cov_b7jydiney.s[129]++;

          if (key === "name") {
            cov_b7jydiney.b[34][0]++;
            cov_b7jydiney.s[130]++;
            continue;
          } else {
            cov_b7jydiney.b[34][1]++;
          } // handled


          cov_b7jydiney.s[131]++;

          if (key === "pchanges") {
            cov_b7jydiney.b[35][0]++;
            cov_b7jydiney.s[132]++;
            continue;
          } else {
            cov_b7jydiney.b[35][1]++;
          } // ignored, also ignored by cli


          cov_b7jydiney.s[133]++;

          if (key === "result") {
            cov_b7jydiney.b[36][0]++;
            cov_b7jydiney.s[134]++;
            continue;
          } else {
            cov_b7jydiney.b[36][1]++;
          } // handled


          cov_b7jydiney.s[135]++;

          if (key === "start_time") {
            cov_b7jydiney.b[37][0]++;
            cov_b7jydiney.s[136]++;
            continue;
          } else {
            cov_b7jydiney.b[37][1]++;
          } // handled


          cov_b7jydiney.s[137]++;
          taskDiv.append(document.createElement("br"));
          cov_b7jydiney.s[138]++;
          taskDiv.append(document.createTextNode(indent + key + " = " + JSON.stringify(item)));
        }

        cov_b7jydiney.s[139]++;
        div.append(taskDiv);
      } // add a summary line


      var line = (cov_b7jydiney.s[140]++, "");
      cov_b7jydiney.s[141]++;

      if (succeeded) {
        cov_b7jydiney.b[38][0]++;
        cov_b7jydiney.s[142]++;
        line += ", " + succeeded + " succeeded";
      } else {
        cov_b7jydiney.b[38][1]++;
      }

      cov_b7jydiney.s[143]++;

      if (skipped) {
        cov_b7jydiney.b[39][0]++;
        cov_b7jydiney.s[144]++;
        line += ", " + skipped + " skipped";
      } else {
        cov_b7jydiney.b[39][1]++;
      }

      cov_b7jydiney.s[145]++;

      if (failed) {
        cov_b7jydiney.b[40][0]++;
        cov_b7jydiney.s[146]++;
        line += ", " + failed + " failed";
      } else {
        cov_b7jydiney.b[40][1]++;
      }

      var total = (cov_b7jydiney.s[147]++, succeeded + skipped + failed);
      cov_b7jydiney.s[148]++;

      if ((cov_b7jydiney.b[42][0]++, total !== succeeded) && (cov_b7jydiney.b[42][1]++, total !== skipped) && (cov_b7jydiney.b[42][2]++, total !== failed)) {
        cov_b7jydiney.b[41][0]++;
        cov_b7jydiney.s[149]++;
        line += ", " + (succeeded + skipped + failed) + " total";
      } else {
        cov_b7jydiney.b[41][1]++;
      } // note that the number of changes may be higher or lower
      // than the number of tasks. tasks may contribute multiple
      // changes, or tasks may have no changes.


      cov_b7jydiney.s[150]++;

      if (changes === 1) {
        cov_b7jydiney.b[43][0]++;
        cov_b7jydiney.s[151]++;
        line += ", " + changes + " change";
      } else {
        cov_b7jydiney.b[43][1]++;
        cov_b7jydiney.s[152]++;

        if (changes) {
          cov_b7jydiney.b[44][0]++;
          cov_b7jydiney.s[153]++;
          line += ", " + changes + " changes";
        } else {
          cov_b7jydiney.b[44][1]++;
        }
      } // multiple durations and significant?


      cov_b7jydiney.s[154]++;

      if ((cov_b7jydiney.b[46][0]++, total > 1) && (cov_b7jydiney.b[46][1]++, total_millis >= 10)) {
        cov_b7jydiney.b[45][0]++;
        cov_b7jydiney.s[155]++;
        line += ", " + OutputSaltGuiHighstate.getDurationClause(total_millis);
      } else {
        cov_b7jydiney.b[45][1]++;
      }

      cov_b7jydiney.s[156]++;

      if (line) {
        cov_b7jydiney.b[47][0]++;
        cov_b7jydiney.s[157]++;
        div.append(document.createTextNode(line.substring(2)));
      } else {
        cov_b7jydiney.b[47][1]++;
      }

      cov_b7jydiney.s[158]++;
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
var cov_1k2japp0mn = function () {
  var path = "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputYaml.js";
  var hash = "70a974df139d473f87e9d699891986d330fc6ea8";

  var Function = function () {}.constructor;

  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/smarletta/sources/sma/SaltGUI/saltgui/static/scripts/output/OutputYaml.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 10,
          column: 5
        }
      },
      "1": {
        start: {
          line: 9,
          column: 6
        },
        end: {
          line: 9,
          column: 20
        }
      },
      "2": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 14,
          column: 5
        }
      },
      "3": {
        start: {
          line: 13,
          column: 6
        },
        end: {
          line: 13,
          column: 25
        }
      },
      "4": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 18,
          column: 5
        }
      },
      "5": {
        start: {
          line: 17,
          column: 6
        },
        end: {
          line: 17,
          column: 38
        }
      },
      "6": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 41,
          column: 5
        }
      },
      "7": {
        start: {
          line: 21,
          column: 23
        },
        end: {
          line: 21,
          column: 28
        }
      },
      "8": {
        start: {
          line: 24,
          column: 6
        },
        end: {
          line: 24,
          column: 48
        }
      },
      "9": {
        start: {
          line: 24,
          column: 35
        },
        end: {
          line: 24,
          column: 48
        }
      },
      "10": {
        start: {
          line: 26,
          column: 6
        },
        end: {
          line: 26,
          column: 50
        }
      },
      "11": {
        start: {
          line: 26,
          column: 32
        },
        end: {
          line: 26,
          column: 50
        }
      },
      "12": {
        start: {
          line: 28,
          column: 6
        },
        end: {
          line: 28,
          column: 46
        }
      },
      "13": {
        start: {
          line: 28,
          column: 28
        },
        end: {
          line: 28,
          column: 46
        }
      },
      "14": {
        start: {
          line: 30,
          column: 6
        },
        end: {
          line: 30,
          column: 46
        }
      },
      "15": {
        start: {
          line: 30,
          column: 28
        },
        end: {
          line: 30,
          column: 46
        }
      },
      "16": {
        start: {
          line: 31,
          column: 6
        },
        end: {
          line: 31,
          column: 46
        }
      },
      "17": {
        start: {
          line: 31,
          column: 28
        },
        end: {
          line: 31,
          column: 46
        }
      },
      "18": {
        start: {
          line: 33,
          column: 6
        },
        end: {
          line: 33,
          column: 46
        }
      },
      "19": {
        start: {
          line: 33,
          column: 28
        },
        end: {
          line: 33,
          column: 46
        }
      },
      "20": {
        start: {
          line: 34,
          column: 6
        },
        end: {
          line: 34,
          column: 46
        }
      },
      "21": {
        start: {
          line: 34,
          column: 28
        },
        end: {
          line: 34,
          column: 46
        }
      },
      "22": {
        start: {
          line: 35,
          column: 6
        },
        end: {
          line: 35,
          column: 46
        }
      },
      "23": {
        start: {
          line: 35,
          column: 28
        },
        end: {
          line: 35,
          column: 46
        }
      },
      "24": {
        start: {
          line: 37,
          column: 6
        },
        end: {
          line: 37,
          column: 66
        }
      },
      "25": {
        start: {
          line: 37,
          column: 48
        },
        end: {
          line: 37,
          column: 66
        }
      },
      "26": {
        start: {
          line: 39,
          column: 6
        },
        end: {
          line: 39,
          column: 35
        }
      },
      "27": {
        start: {
          line: 39,
          column: 22
        },
        end: {
          line: 39,
          column: 35
        }
      },
      "28": {
        start: {
          line: 40,
          column: 6
        },
        end: {
          line: 40,
          column: 31
        }
      },
      "29": {
        start: {
          line: 43,
          column: 4
        },
        end: {
          line: 45,
          column: 5
        }
      },
      "30": {
        start: {
          line: 44,
          column: 6
        },
        end: {
          line: 44,
          column: 24
        }
      },
      "31": {
        start: {
          line: 47,
          column: 4
        },
        end: {
          line: 50,
          column: 5
        }
      },
      "32": {
        start: {
          line: 49,
          column: 6
        },
        end: {
          line: 49,
          column: 19
        }
      },
      "33": {
        start: {
          line: 52,
          column: 4
        },
        end: {
          line: 55,
          column: 5
        }
      },
      "34": {
        start: {
          line: 54,
          column: 6
        },
        end: {
          line: 54,
          column: 19
        }
      },
      "35": {
        start: {
          line: 57,
          column: 4
        },
        end: {
          line: 57,
          column: 16
        }
      },
      "36": {
        start: {
          line: 67,
          column: 23
        },
        end: {
          line: 67,
          column: 24
        }
      },
      "37": {
        start: {
          line: 69,
          column: 16
        },
        end: {
          line: 69,
          column: 50
        }
      },
      "38": {
        start: {
          line: 70,
          column: 4
        },
        end: {
          line: 72,
          column: 5
        }
      },
      "39": {
        start: {
          line: 71,
          column: 6
        },
        end: {
          line: 71,
          column: 17
        }
      },
      "40": {
        start: {
          line: 74,
          column: 4
        },
        end: {
          line: 82,
          column: 5
        }
      },
      "41": {
        start: {
          line: 75,
          column: 16
        },
        end: {
          line: 75,
          column: 18
        }
      },
      "42": {
        start: {
          line: 76,
          column: 22
        },
        end: {
          line: 76,
          column: 24
        }
      },
      "43": {
        start: {
          line: 77,
          column: 6
        },
        end: {
          line: 80,
          column: 7
        }
      },
      "44": {
        start: {
          line: 78,
          column: 8
        },
        end: {
          line: 78,
          column: 84
        }
      },
      "45": {
        start: {
          line: 79,
          column: 8
        },
        end: {
          line: 79,
          column: 51
        }
      },
      "46": {
        start: {
          line: 81,
          column: 6
        },
        end: {
          line: 81,
          column: 17
        }
      },
      "47": {
        start: {
          line: 85,
          column: 14
        },
        end: {
          line: 85,
          column: 16
        }
      },
      "48": {
        start: {
          line: 86,
          column: 20
        },
        end: {
          line: 86,
          column: 22
        }
      },
      "49": {
        start: {
          line: 87,
          column: 4
        },
        end: {
          line: 101,
          column: 5
        }
      },
      "50": {
        start: {
          line: 88,
          column: 19
        },
        end: {
          line: 88,
          column: 29
        }
      },
      "51": {
        start: {
          line: 89,
          column: 6
        },
        end: {
          line: 89,
          column: 35
        }
      },
      "52": {
        start: {
          line: 90,
          column: 18
        },
        end: {
          line: 90,
          column: 51
        }
      },
      "53": {
        start: {
          line: 91,
          column: 6
        },
        end: {
          line: 99,
          column: 7
        }
      },
      "54": {
        start: {
          line: 92,
          column: 8
        },
        end: {
          line: 92,
          column: 25
        }
      },
      "55": {
        start: {
          line: 93,
          column: 13
        },
        end: {
          line: 99,
          column: 7
        }
      },
      "56": {
        start: {
          line: 94,
          column: 8
        },
        end: {
          line: 94,
          column: 89
        }
      },
      "57": {
        start: {
          line: 95,
          column: 13
        },
        end: {
          line: 99,
          column: 7
        }
      },
      "58": {
        start: {
          line: 96,
          column: 8
        },
        end: {
          line: 96,
          column: 115
        }
      },
      "59": {
        start: {
          line: 98,
          column: 8
        },
        end: {
          line: 98,
          column: 75
        }
      },
      "60": {
        start: {
          line: 100,
          column: 6
        },
        end: {
          line: 100,
          column: 49
        }
      },
      "61": {
        start: {
          line: 102,
          column: 4
        },
        end: {
          line: 102,
          column: 15
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 6,
            column: 3
          }
        },
        loc: {
          start: {
            line: 6,
            column: 33
          },
          end: {
            line: 58,
            column: 3
          }
        },
        line: 6
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 62,
            column: 2
          },
          end: {
            line: 62,
            column: 3
          }
        },
        loc: {
          start: {
            line: 62,
            column: 42
          },
          end: {
            line: 103,
            column: 3
          }
        },
        line: 62
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 10,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 10,
            column: 5
          }
        }, {
          start: {
            line: 8,
            column: 4
          },
          end: {
            line: 10,
            column: 5
          }
        }],
        line: 8
      },
      "1": {
        loc: {
          start: {
            line: 12,
            column: 4
          },
          end: {
            line: 14,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 12,
            column: 4
          },
          end: {
            line: 14,
            column: 5
          }
        }, {
          start: {
            line: 12,
            column: 4
          },
          end: {
            line: 14,
            column: 5
          }
        }],
        line: 12
      },
      "2": {
        loc: {
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        }, {
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        }],
        line: 16
      },
      "3": {
        loc: {
          start: {
            line: 17,
            column: 13
          },
          end: {
            line: 17,
            column: 37
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 17,
            column: 21
          },
          end: {
            line: 17,
            column: 27
          }
        }, {
          start: {
            line: 17,
            column: 30
          },
          end: {
            line: 17,
            column: 37
          }
        }],
        line: 17
      },
      "4": {
        loc: {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        }, {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        }],
        line: 20
      },
      "5": {
        loc: {
          start: {
            line: 24,
            column: 6
          },
          end: {
            line: 24,
            column: 48
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 24,
            column: 6
          },
          end: {
            line: 24,
            column: 48
          }
        }, {
          start: {
            line: 24,
            column: 6
          },
          end: {
            line: 24,
            column: 48
          }
        }],
        line: 24
      },
      "6": {
        loc: {
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 26,
            column: 50
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 26,
            column: 50
          }
        }, {
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 26,
            column: 50
          }
        }],
        line: 26
      },
      "7": {
        loc: {
          start: {
            line: 28,
            column: 6
          },
          end: {
            line: 28,
            column: 46
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 28,
            column: 6
          },
          end: {
            line: 28,
            column: 46
          }
        }, {
          start: {
            line: 28,
            column: 6
          },
          end: {
            line: 28,
            column: 46
          }
        }],
        line: 28
      },
      "8": {
        loc: {
          start: {
            line: 30,
            column: 6
          },
          end: {
            line: 30,
            column: 46
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 30,
            column: 6
          },
          end: {
            line: 30,
            column: 46
          }
        }, {
          start: {
            line: 30,
            column: 6
          },
          end: {
            line: 30,
            column: 46
          }
        }],
        line: 30
      },
      "9": {
        loc: {
          start: {
            line: 31,
            column: 6
          },
          end: {
            line: 31,
            column: 46
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 31,
            column: 6
          },
          end: {
            line: 31,
            column: 46
          }
        }, {
          start: {
            line: 31,
            column: 6
          },
          end: {
            line: 31,
            column: 46
          }
        }],
        line: 31
      },
      "10": {
        loc: {
          start: {
            line: 33,
            column: 6
          },
          end: {
            line: 33,
            column: 46
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 33,
            column: 6
          },
          end: {
            line: 33,
            column: 46
          }
        }, {
          start: {
            line: 33,
            column: 6
          },
          end: {
            line: 33,
            column: 46
          }
        }],
        line: 33
      },
      "11": {
        loc: {
          start: {
            line: 34,
            column: 6
          },
          end: {
            line: 34,
            column: 46
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 34,
            column: 6
          },
          end: {
            line: 34,
            column: 46
          }
        }, {
          start: {
            line: 34,
            column: 6
          },
          end: {
            line: 34,
            column: 46
          }
        }],
        line: 34
      },
      "12": {
        loc: {
          start: {
            line: 35,
            column: 6
          },
          end: {
            line: 35,
            column: 46
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 35,
            column: 6
          },
          end: {
            line: 35,
            column: 46
          }
        }, {
          start: {
            line: 35,
            column: 6
          },
          end: {
            line: 35,
            column: 46
          }
        }],
        line: 35
      },
      "13": {
        loc: {
          start: {
            line: 37,
            column: 6
          },
          end: {
            line: 37,
            column: 66
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 37,
            column: 6
          },
          end: {
            line: 37,
            column: 66
          }
        }, {
          start: {
            line: 37,
            column: 6
          },
          end: {
            line: 37,
            column: 66
          }
        }],
        line: 37
      },
      "14": {
        loc: {
          start: {
            line: 39,
            column: 6
          },
          end: {
            line: 39,
            column: 35
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 39,
            column: 6
          },
          end: {
            line: 39,
            column: 35
          }
        }, {
          start: {
            line: 39,
            column: 6
          },
          end: {
            line: 39,
            column: 35
          }
        }],
        line: 39
      },
      "15": {
        loc: {
          start: {
            line: 43,
            column: 4
          },
          end: {
            line: 45,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 43,
            column: 4
          },
          end: {
            line: 45,
            column: 5
          }
        }, {
          start: {
            line: 43,
            column: 4
          },
          end: {
            line: 45,
            column: 5
          }
        }],
        line: 43
      },
      "16": {
        loc: {
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 50,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 50,
            column: 5
          }
        }, {
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 50,
            column: 5
          }
        }],
        line: 47
      },
      "17": {
        loc: {
          start: {
            line: 47,
            column: 7
          },
          end: {
            line: 47,
            column: 49
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 47,
            column: 7
          },
          end: {
            line: 47,
            column: 27
          }
        }, {
          start: {
            line: 47,
            column: 31
          },
          end: {
            line: 47,
            column: 49
          }
        }],
        line: 47
      },
      "18": {
        loc: {
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 55,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 55,
            column: 5
          }
        }, {
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 55,
            column: 5
          }
        }],
        line: 52
      },
      "19": {
        loc: {
          start: {
            line: 52,
            column: 7
          },
          end: {
            line: 52,
            column: 63
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 52,
            column: 7
          },
          end: {
            line: 52,
            column: 28
          }
        }, {
          start: {
            line: 52,
            column: 32
          },
          end: {
            line: 52,
            column: 63
          }
        }],
        line: 52
      },
      "20": {
        loc: {
          start: {
            line: 62,
            column: 27
          },
          end: {
            line: 62,
            column: 40
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 62,
            column: 39
          },
          end: {
            line: 62,
            column: 40
          }
        }],
        line: 62
      },
      "21": {
        loc: {
          start: {
            line: 70,
            column: 4
          },
          end: {
            line: 72,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 70,
            column: 4
          },
          end: {
            line: 72,
            column: 5
          }
        }, {
          start: {
            line: 70,
            column: 4
          },
          end: {
            line: 72,
            column: 5
          }
        }],
        line: 70
      },
      "22": {
        loc: {
          start: {
            line: 74,
            column: 4
          },
          end: {
            line: 82,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 74,
            column: 4
          },
          end: {
            line: 82,
            column: 5
          }
        }, {
          start: {
            line: 74,
            column: 4
          },
          end: {
            line: 82,
            column: 5
          }
        }],
        line: 74
      },
      "23": {
        loc: {
          start: {
            line: 91,
            column: 6
          },
          end: {
            line: 99,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 91,
            column: 6
          },
          end: {
            line: 99,
            column: 7
          }
        }, {
          start: {
            line: 91,
            column: 6
          },
          end: {
            line: 99,
            column: 7
          }
        }],
        line: 91
      },
      "24": {
        loc: {
          start: {
            line: 93,
            column: 13
          },
          end: {
            line: 99,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 93,
            column: 13
          },
          end: {
            line: 99,
            column: 7
          }
        }, {
          start: {
            line: 93,
            column: 13
          },
          end: {
            line: 99,
            column: 7
          }
        }],
        line: 93
      },
      "25": {
        loc: {
          start: {
            line: 95,
            column: 13
          },
          end: {
            line: 99,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 95,
            column: 13
          },
          end: {
            line: 99,
            column: 7
          }
        }, {
          start: {
            line: 95,
            column: 13
          },
          end: {
            line: 99,
            column: 7
          }
        }],
        line: 95
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0,
      "60": 0,
      "61": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0, 0],
      "18": [0, 0],
      "19": [0, 0],
      "20": [0],
      "21": [0, 0],
      "22": [0, 0],
      "23": [0, 0],
      "24": [0, 0],
      "25": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

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
      cov_1k2japp0mn.f[0]++;
      cov_1k2japp0mn.s[0]++;

      if (value === null) {
        cov_1k2japp0mn.b[0][0]++;
        cov_1k2japp0mn.s[1]++;
        return "null";
      } else {
        cov_1k2japp0mn.b[0][1]++;
      }

      cov_1k2japp0mn.s[2]++;

      if (value === undefined) {
        cov_1k2japp0mn.b[1][0]++;
        cov_1k2japp0mn.s[3]++;
        return "undefined";
      } else {
        cov_1k2japp0mn.b[1][1]++;
      }

      cov_1k2japp0mn.s[4]++;

      if (typeof value === "boolean") {
        cov_1k2japp0mn.b[2][0]++;
        cov_1k2japp0mn.s[5]++;
        return value ? (cov_1k2japp0mn.b[3][0]++, "true") : (cov_1k2japp0mn.b[3][1]++, "false");
      } else {
        cov_1k2japp0mn.b[2][1]++;
      }

      cov_1k2japp0mn.s[6]++;

      if (typeof value === "string") {
        cov_1k2japp0mn.b[4][0]++;
        var needQuotes = (cov_1k2japp0mn.s[7]++, false); // simple number with extra 0's at the start is still a string

        cov_1k2japp0mn.s[8]++;

        if (value.match(/^0[0-9]+$/)) {
          cov_1k2japp0mn.b[5][0]++;
          cov_1k2japp0mn.s[9]++;
          return value;
        } else {
          cov_1k2japp0mn.b[5][1]++;
        }

        cov_1k2japp0mn.s[10]++;

        if (!isNaN(Number(value))) {
          cov_1k2japp0mn.b[6][0]++;
          cov_1k2japp0mn.s[11]++;
          needQuotes = true;
        } else {
          cov_1k2japp0mn.b[6][1]++;
        }

        cov_1k2japp0mn.s[12]++;

        if (value.match(/^$/)) {
          cov_1k2japp0mn.b[7][0]++;
          cov_1k2japp0mn.s[13]++;
          needQuotes = true;
        } else {
          cov_1k2japp0mn.b[7][1]++;
        }

        cov_1k2japp0mn.s[14]++;

        if (value.match(/^ /)) {
          cov_1k2japp0mn.b[8][0]++;
          cov_1k2japp0mn.s[15]++;
          needQuotes = true;
        } else {
          cov_1k2japp0mn.b[8][1]++;
        }

        cov_1k2japp0mn.s[16]++;

        if (value.match(/ $/)) {
          cov_1k2japp0mn.b[9][0]++;
          cov_1k2japp0mn.s[17]++;
          needQuotes = true;
        } else {
          cov_1k2japp0mn.b[9][1]++;
        }

        cov_1k2japp0mn.s[18]++;

        if (value.match(/^@/)) {
          cov_1k2japp0mn.b[10][0]++;
          cov_1k2japp0mn.s[19]++;
          needQuotes = true;
        } else {
          cov_1k2japp0mn.b[10][1]++;
        }

        cov_1k2japp0mn.s[20]++;

        if (value.match(/^`/)) {
          cov_1k2japp0mn.b[11][0]++;
          cov_1k2japp0mn.s[21]++;
          needQuotes = true;
        } else {
          cov_1k2japp0mn.b[11][1]++;
        }

        cov_1k2japp0mn.s[22]++;

        if (value.match(/^%/)) {
          cov_1k2japp0mn.b[12][0]++;
          cov_1k2japp0mn.s[23]++;
          needQuotes = true;
        } else {
          cov_1k2japp0mn.b[12][1]++;
        }

        cov_1k2japp0mn.s[24]++;

        if (!value.match(/^[-a-z0-9_()./:+ ]+$/i)) {
          cov_1k2japp0mn.b[13][0]++;
          cov_1k2japp0mn.s[25]++;
          needQuotes = true;
        } else {
          cov_1k2japp0mn.b[13][1]++;
        }

        cov_1k2japp0mn.s[26]++;

        if (!needQuotes) {
          cov_1k2japp0mn.b[14][0]++;
          cov_1k2japp0mn.s[27]++;
          return value;
        } else {
          cov_1k2japp0mn.b[14][1]++;
        }

        cov_1k2japp0mn.s[28]++;
        return "'" + value + "'";
      } else {
        cov_1k2japp0mn.b[4][1]++;
      }

      cov_1k2japp0mn.s[29]++;

      if (_typeof(value) !== "object") {
        cov_1k2japp0mn.b[15][0]++;
        cov_1k2japp0mn.s[30]++;
        return "" + value;
      } else {
        cov_1k2japp0mn.b[15][1]++;
      }

      cov_1k2japp0mn.s[31]++;

      if ((cov_1k2japp0mn.b[17][0]++, Array.isArray(value)) && (cov_1k2japp0mn.b[17][1]++, value.length === 0)) {
        cov_1k2japp0mn.b[16][0]++;
        cov_1k2japp0mn.s[32]++;
        // show the brackets for an empty array a bit wider apart
        return "[ ]";
      } else {
        cov_1k2japp0mn.b[16][1]++;
      }

      cov_1k2japp0mn.s[33]++;

      if ((cov_1k2japp0mn.b[19][0]++, !Array.isArray(value)) && (cov_1k2japp0mn.b[19][1]++, Object.keys(value).length === 0)) {
        cov_1k2japp0mn.b[18][0]++;
        cov_1k2japp0mn.s[34]++;
        // show the brackets for an empty object a bit wider apart
        return "{ }";
      } else {
        cov_1k2japp0mn.b[18][1]++;
      }

      cov_1k2japp0mn.s[35]++;
      return null;
    } // format an object as YAML
    // based on an initial indentation and an indentation increment

  }, {
    key: "formatYAML",
    value: function formatYAML(value) {
      var indentLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (cov_1k2japp0mn.b[20][0]++, 0);
      cov_1k2japp0mn.f[1]++;
      // indent each level with this number of spaces
      // note that list items are indented with 2 spaces
      // independently of this setting to match the prefix "- "
      var indentStep = (cov_1k2japp0mn.s[36]++, 2);
      var str = (cov_1k2japp0mn.s[37]++, OutputYaml.formatSimpleYAML(value));
      cov_1k2japp0mn.s[38]++;

      if (str !== null) {
        cov_1k2japp0mn.b[21][0]++;
        cov_1k2japp0mn.s[39]++;
        return str;
      } else {
        cov_1k2japp0mn.b[21][1]++;
      }

      cov_1k2japp0mn.s[40]++;

      if (Array.isArray(value)) {
        cov_1k2japp0mn.b[22][0]++;

        var _out = (cov_1k2japp0mn.s[41]++, "");

        var _separator = (cov_1k2japp0mn.s[42]++, "");

        cov_1k2japp0mn.s[43]++;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;
            cov_1k2japp0mn.s[44]++;
            _out += _separator + "-\xA0" + OutputYaml.formatYAML(item, indentLevel + 2);
            cov_1k2japp0mn.s[45]++;
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

        cov_1k2japp0mn.s[46]++;
        return _out;
      } else {
        cov_1k2japp0mn.b[22][1]++;
      } // regular object


      var out = (cov_1k2japp0mn.s[47]++, "");
      var separator = (cov_1k2japp0mn.s[48]++, "");
      cov_1k2japp0mn.s[49]++;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(value).sort()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          var _item = (cov_1k2japp0mn.s[50]++, value[key]);

          cov_1k2japp0mn.s[51]++;
          out += separator + key + ":";

          var _str = (cov_1k2japp0mn.s[52]++, OutputYaml.formatSimpleYAML(_item));

          cov_1k2japp0mn.s[53]++;

          if (_str !== null) {
            cov_1k2japp0mn.b[23][0]++;
            cov_1k2japp0mn.s[54]++;
            out += " " + _str;
          } else {
            cov_1k2japp0mn.b[23][1]++;
            cov_1k2japp0mn.s[55]++;

            if (Array.isArray(_item)) {
              cov_1k2japp0mn.b[24][0]++;
              cov_1k2japp0mn.s[56]++;
              out += "\n" + " ".repeat(indentLevel) + OutputYaml.formatYAML(_item, indentLevel);
            } else {
              cov_1k2japp0mn.b[24][1]++;
              cov_1k2japp0mn.s[57]++;

              if (_typeof(_item) === "object") {
                cov_1k2japp0mn.b[25][0]++;
                cov_1k2japp0mn.s[58]++;
                out += "\n" + " ".repeat(indentLevel + indentStep) + OutputYaml.formatYAML(_item, indentLevel + indentStep);
              } else {
                cov_1k2japp0mn.b[25][1]++;
                cov_1k2japp0mn.s[59]++;
                out += "x" + OutputYaml.formatYAML(_item, indentLevel + indentStep);
              }
            }
          }

          cov_1k2japp0mn.s[60]++;
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

      cov_1k2japp0mn.s[61]++;
      return out;
    }
  }]);

  return OutputYaml;
}();

/***/ }),

/***/ "./tests/unit sync recursive .js$":
/*!******************************!*\
  !*** ./tests/unit sync .js$ ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./index.js": "./tests/unit/index.js",
	"./output.js": "./tests/unit/output.js",
	"./parsecmdline.js": "./tests/unit/parsecmdline.js",
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

/***/ "./tests/unit/output.js":
/*!******************************!*\
  !*** ./tests/unit/output.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../saltgui/static/scripts/output/Output */ "./saltgui/static/scripts/output/Output.js");
/* harmony import */ var _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../saltgui/static/scripts/output/OutputDocumentation */ "./saltgui/static/scripts/output/OutputDocumentation.js");
/* harmony import */ var _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../saltgui/static/scripts/output/OutputJson */ "./saltgui/static/scripts/output/OutputJson.js");
/* harmony import */ var _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../saltgui/static/scripts/output/OutputNested */ "./saltgui/static/scripts/output/OutputNested.js");
/* harmony import */ var _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../saltgui/static/scripts/output/OutputYaml */ "./saltgui/static/scripts/output/OutputYaml.js");
var assert = __webpack_require__(/*! chai */ "chai").assert;






describe('Unittests for output.js', function () {
  it('test formatJSON', function (done) {
    var outputData, result;
    outputData = null;
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "null");
    outputData = undefined;
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "undefined");
    outputData = 123;
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "123");
    outputData = "txt";
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "\"txt\"");
    outputData = [];
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "[ ]");
    outputData = [1];
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "[\n" + "    1\n" + "]");
    outputData = [1, 2, 3, 4, 5];
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "[\n" + "    1,\n" + "    2,\n" + "    3,\n" + "    4,\n" + "    5\n" + "]");
    outputData = {};
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData);
    assert.equal(result, "{ }"); // unordered input

    outputData = {
      "a": 11,
      "c": 22,
      "b": 33
    };
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData); // ordered output

    assert.equal(result, "{\n" + "    \"a\": 11,\n" + "    \"b\": 33,\n" + "    \"c\": 22\n" + "}"); // a more complex object, unordered input

    outputData = {
      "ip6_interfaces": {
        "lo": ["::1"],
        "eth0": ["fe80::20d:3aff:fe38:576b"]
      }
    };
    result = _saltgui_static_scripts_output_OutputJson__WEBPACK_IMPORTED_MODULE_2__["OutputJson"].formatJSON(outputData); // ordered output

    assert.equal(result, "{\n" + "    \"ip6_interfaces\": {\n" + "        \"eth0\": [\n" + "            \"fe80::20d:3aff:fe38:576b\"\n" + "        ],\n" + "        \"lo\": [\n" + "            \"::1\"\n" + "        ]\n" + "    }\n" + "}");
    done();
  });
  it('test formatYAML', function (done) {
    var outputData, result;
    outputData = null;
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "null");
    outputData = undefined;
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "undefined");
    outputData = 123;
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "123");
    outputData = "txt";
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "txt");
    outputData = [];
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "[ ]");
    outputData = [1];
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "-\xA01");
    outputData = [1, 2, 3, 4, 5];
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "-\xA01\n" + "-\xA02\n" + "-\xA03\n" + "-\xA04\n" + "-\xA05");
    outputData = {};
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData);
    assert.equal(result, "{ }"); // unordered input

    outputData = {
      "a": 11,
      "c": 22,
      "b": 33
    };
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData); // ordered output

    assert.equal(result, "a: 11\n" + "b: 33\n" + "c: 22"); // a more complex object, unordered input

    outputData = {
      "ip6_interfaces": {
        "lo": ["::1"],
        "eth0": ["fe80::20d:3aff:fe38:576b"]
      }
    };
    result = _saltgui_static_scripts_output_OutputYaml__WEBPACK_IMPORTED_MODULE_4__["OutputYaml"].formatYAML(outputData); // ordered output

    assert.equal(result, "ip6_interfaces:\n" + "  eth0:\n" + "  -\xA0fe80::20d:3aff:fe38:576b\n" + "  lo:\n" + "  -\xA0::1");
    done();
  });
  it('test formatNESTED', function (done) {
    var outputData, result;
    outputData = null;
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "None");
    outputData = undefined;
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "undefined");
    outputData = 123;
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "123");
    outputData = "txt";
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "txt");
    outputData = [];
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "");
    outputData = [1];
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "-\xA01");
    outputData = [1, 2, 3, 4, 5];
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, "-\xA01\n" + "-\xA02\n" + "-\xA03\n" + "-\xA04\n" + "-\xA05");
    outputData = {};
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData);
    assert.equal(result, ""); // unordered input

    outputData = {
      "a": 11,
      "c": 22,
      "b": 33
    };
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData); // ordered output

    assert.equal(result, "a:\n" + "    11\n" + "b:\n" + "    33\n" + "c:\n" + "    22"); // a more complex object, unordered input

    outputData = {
      "ip6_interfaces": {
        "lo": ["::1"],
        "eth0": ["fe80::20d:3aff:fe38:576b"]
      }
    };
    result = _saltgui_static_scripts_output_OutputNested__WEBPACK_IMPORTED_MODULE_3__["OutputNested"].formatNESTED(outputData); // ordered output

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
    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isTrue(result); // wrong, does not match requested documentation

    outputData = {
      "host1": {
        "keyword": "explanation"
      }
    };
    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "another");
    assert.isFalse(result); // wrong, no resulting documentation

    outputData = {
      "host1": {
        "keyword": null
      }
    };
    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // wrong, value is not text

    outputData = {
      "host1": {
        "keyword": 123
      }
    };
    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // wrong, returned structure is not a dict

    outputData = {
      "host1": ["something"]
    };
    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // wrong, returned structure is not a dict

    outputData = {
      "host1": 123
    };
    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // wrong, returned structure is not a dict

    outputData = {
      "host1": "hello"
    };
    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isFalse(result); // first host ignored, second host ok

    outputData = {
      "host1": null,
      "host2": {
        "keyword": "explanation"
      }
    };
    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocumentationOutput(_saltgui_static_scripts_output_Output__WEBPACK_IMPORTED_MODULE_0__["Output"], outputData, "keyword");
    assert.isTrue(result);
    done();
  });
  it('test isDocuKeyMatch', function (done) {
    var result; // all documentation

    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocuKeyMatch("anything", null);
    assert.isTrue(result); // all documentation

    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocuKeyMatch("anything", "");
    assert.isTrue(result); // match one word

    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocuKeyMatch("foo.bar", "foo");
    assert.isTrue(result); // match two words

    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocuKeyMatch("foo.bar", "foo.bar");
    assert.isTrue(result); // wrong match

    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocuKeyMatch("foo", "bar");
    assert.isFalse(result); // wrong match (even though text prefix)

    result = _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].isDocuKeyMatch("food", "foo");
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
    _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
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
    _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
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
    _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
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
    _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
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
    _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].reduceDocumentationOutput(out, "DUMMY", "topic");
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
    _saltgui_static_scripts_output_OutputDocumentation__WEBPACK_IMPORTED_MODULE_1__["OutputDocumentation"].addDocumentationOutput(container, output);
    assert.isTrue(container.innerHTML.includes("<a href='https://www.freedesktop.org/software/systemd/man/systemd-run.html' target='_blank'><span style='color: yellow'>systemd-run(1)</span></a>"));
    done();
  });
});

/***/ }),

/***/ "./tests/unit/parsecmdline.js":
/*!************************************!*\
  !*** ./tests/unit/parsecmdline.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! chai */ "chai").assert; // create a global window so we can unittest the window.<x> functions


if (!global.window) global.window = new Object({});

__webpack_require__(/*! ../../saltgui/static/scripts/ParseCommandLine */ "./saltgui/static/scripts/ParseCommandLine.js");

describe('Unittests for parsecmdline.js', function () {
  it('test parseCommandLine', function (done) {
    var args = [],
        params = {},
        result; // GENERAL ERROR HANDLING
    // null means: it was all ok

    args = [];
    params = {};
    result = window.parseCommandLine("test", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "test");
    assert.equal(Object.keys(params).length, 0); // broken json will return a readable error message

    args = [];
    params = {};
    result = window.parseCommandLine("{\"test\"", args, params);
    assert.equal(result, "No valid dictionary found"); // GENERAL WHITESPACE HANDLING

    args = [];
    params = {};
    result = window.parseCommandLine(" name=true", args, params);
    assert.isNull(result);
    assert.equal(args.length, 0);
    assert.equal(Object.keys(params).length, 1);
    assert.equal(params.name, true);
    args = [];
    params = {};
    result = window.parseCommandLine("name=true ", args, params);
    assert.isNull(result);
    assert.equal(args.length, 0);
    assert.equal(Object.keys(params).length, 1);
    assert.equal(params.name, true); // NAMED PARAMETERS
    // name-value-pair without value is not ok

    args = [];
    params = {};
    result = window.parseCommandLine("test=", args, params);
    assert.equal(result, "Must have value for named parameter 'test'"); // name-value-pair without value is not ok
    // make sure it does not confuse it with furher parameters

    args = [];
    params = {};
    result = window.parseCommandLine("test= arg2 arg3", args, params);
    assert.equal(result, "Must have value for named parameter 'test'"); // DICTIONARY
    // a regular dictionary

    args = [];
    params = {};
    result = window.parseCommandLine("{\"a\":1}", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.deepEqual(args[0], {
      "a": 1
    });
    assert.equal(Object.keys(params).length, 0); // a broken dictionary

    args = [];
    params = {};
    result = window.parseCommandLine("{\"a}\":1", args, params);
    assert.equal(result, "No valid dictionary found"); // a regular dictionary with } in its name
    // test that the parser is not confused

    args = [];
    params = {};
    result = window.parseCommandLine("{\"a}\":1}", args, params);
    assert.equal(result, null); // a regular dictionary with } after its value

    args = [];
    params = {};
    result = window.parseCommandLine("{\"a}\":1}}", args, params);
    assert.equal(result, "Valid dictionary, but followed by text:}..."); // ARRAYS
    // a simple array

    args = [];
    params = {};
    result = window.parseCommandLine("[1,2]", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.deepEqual(args[0], [1, 2]);
    assert.equal(Object.keys(params).length, 0); // a simple array that is not closed

    args = [];
    params = {};
    result = window.parseCommandLine("[1,2", args, params);
    assert.equal(result, "No valid array found"); // STRINGS WITHOUT QUOTES
    // a simple string

    args = [];
    params = {};
    result = window.parseCommandLine("string", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "string");
    assert.equal(Object.keys(params).length, 0); // a number that looks like a jobid

    args = [];
    params = {};
    result = window.parseCommandLine("20180820003411338317", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "20180820003411338317");
    assert.equal(Object.keys(params).length, 0); // DOUBLE-QUOTED-STRINGS
    // a simple string

    args = [];
    params = {};
    result = window.parseCommandLine("\"string\"", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "string");
    assert.equal(Object.keys(params).length, 0); // an unclosed string

    args = [];
    params = {};
    result = window.parseCommandLine("\"string", args, params);
    assert.equal(result, "No valid double-quoted-string found"); // SINGLE-QUOTED-STRINGS (never supported!)
    // a single-quoted string is not supported
    // it evalueates as a string (the whole thing)

    args = [];
    params = {};
    result = window.parseCommandLine("\'string\'", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], "\'string\'");
    assert.equal(Object.keys(params).length, 0); // a single-quoted string is not supported
    // it evalueates as a string (the whole thing)
    // even when that looks rediculous

    args = [];
    params = {};
    result = window.parseCommandLine("\'string", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], "\'string");
    assert.equal(Object.keys(params).length, 0); // INTEGER

    args = [];
    params = {};
    result = window.parseCommandLine("0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0); // an integer that almost looks like a jobid, but one digit less

    args = [];
    params = {};
    result = window.parseCommandLine("2018082000341133831", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 2018082000341133831);
    assert.equal(Object.keys(params).length, 0); // an integer that almost looks like a jobid, but one digit more

    args = [];
    params = {};
    result = window.parseCommandLine("201808200034113383170", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 201808200034113383170);
    assert.equal(Object.keys(params).length, 0); // an integer that almost looks like a jobid, just not a true date-time

    args = [];
    params = {};
    result = window.parseCommandLine("20182820003411338317", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 20182820003411338317);
    assert.equal(Object.keys(params).length, 0); // FLOAT

    args = [];
    params = {};
    result = window.parseCommandLine("0.", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine(".0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("0.0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0.0);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("0.0.0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "0.0.0");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine(".", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], ".");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("-1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], -1e99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("+1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("1e-99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e-99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("1e+99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("1e999", args, params);
    assert.equal(result, "Numeric argument has overflowed or is infinity"); // NULL

    args = [];
    params = {};
    result = window.parseCommandLine("null", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("Null", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("NULL", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("NUll", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NUll");
    assert.equal(Object.keys(params).length, 0); // NONE

    args = [];
    params = {};
    result = window.parseCommandLine("none", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "none");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("None", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("NONE", args, params); // GENERAL WHITESPACE HANDLING

    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NONE");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("NOne", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NOne");
    assert.equal(Object.keys(params).length, 0); // BOOLEAN

    args = [];
    params = {};
    result = window.parseCommandLine("true", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("True", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("TRUE", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("TRue", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "TRue");
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("false", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("False", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("FALSE", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);
    args = [];
    params = {};
    result = window.parseCommandLine("FAlse", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "FAlse");
    assert.equal(Object.keys(params).length, 0);
    done();
  });
});

/***/ }),

/***/ "./tests/unit/utils.js":
/*!*****************************!*\
  !*** ./tests/unit/utils.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! chai */ "chai").assert; // create a global window so we can unittest the window.<x> functions


if (!global.window) global.window = new Object({});

__webpack_require__(/*! ../../saltgui/static/scripts/Utils */ "./saltgui/static/scripts/Utils.js");

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