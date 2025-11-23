/* global */

/* istanbul ignore file */
import {Router} from "./Router.js";
window.addEventListener("load", () => new Router());

/* eslint-disable func-names */
// Make sure the errors are shown during regression testing
window.onerror = function (msg, url, lineNo, columnNo, error) {
  /* eslint-disable no-console */
  console.log("JS Error:" + msg + ",error:" + error + ",url:" + url + "@" + lineNo + ":" + columnNo);
  /* eslint-enable no-console */
  if (error && error.stack) {
    /* eslint-disable no-console */
    console.log("Stack:" + error.stack);
    /* eslint-enable no-console */
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
