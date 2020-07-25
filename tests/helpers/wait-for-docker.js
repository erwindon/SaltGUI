const request = require("request");

const url = "http://localhost:3333";

console.log("waiting for docker setup to be ready");

function waitfordocker() {
  request
    .get(url)
    .on("response", function(response) {
      console.log("docker setup is ready");
    })
    .on("error", function(err) {
      setTimeout(waitfordocker, 1000);
    });
}

waitfordocker();
