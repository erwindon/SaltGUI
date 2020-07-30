const request = require("request");

const url = "http://localhost:3333";

console.log("waiting for docker setup to be ready");

waitfordocker = () => {
  request
    .get(url)
    .on("response", (response) => {
      console.log("docker setup is ready");
    })
    .on("error", (err) => {
      setTimeout(waitfordocker, 1000);
    });
};

waitfordocker();
