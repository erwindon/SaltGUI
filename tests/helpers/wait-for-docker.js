const waitOn = require('wait-on');

console.log("waiting for docker setup to be ready");

var resources = {
  resources: [
    'http://localhost:3333/',
  ],
  timeout: 30000,
  followAllRedirects: true,
  followRedirect: true,
};

waitOn(resources, error => {
  if (error)
      console.error(error);
  else
      console.log("docker setup is ready");
});
