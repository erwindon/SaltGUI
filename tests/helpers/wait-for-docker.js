/* global */

import request from "request";

const url = "http://localhost:3333";

/* eslint-disable no-console */
console.log("waiting for docker setup to be ready");
/* eslint-enable no-console */

const waitfordocker = () => {
  /* eslint-disable no-console */
  request.
    get(url).
    on("response", () => {
      console.log("docker setup is ready");
    }).
    on("error", (err) => {
      console.log("docker setup is NOT ready yet:", err.code);
      setTimeout(waitfordocker, 1000);
    });
  /* eslint-enable no-console */
};

waitfordocker();
