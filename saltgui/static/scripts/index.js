/* global */

/* istanbul ignore file */
import {Router} from "./Router.js";
window.addEventListener("load", () => new Router());

/* eslint-disable func-names */
// Make sure the errors are shown during regression testing
window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.log("JS Error:" + msg + ",error:" + error + ",url:" + url + "@" + lineNo + ":" + columnNo);
  if (error && error.stack) {
    console.log("Stack:" + error.stack);
  }
  return false;
};

// simple polyfill solution
if (!Object.fromEntries) {
  Object.fromEntries = function (pairs) {
    const obj = {};
    for (const pair of pairs) {
      obj[pair[0]] = pair[1];
    }
    return obj;
  }
}
/* eslint-enable func-names */
