# Testing

We provide some functional tests and unit tests. They use the docker setup to run the functional tests. You will also need [yarn](https://yarnpkg.com) and [node.js](https://nodejs.org/en/) to run them. When you have docker, yarn and node.js installed, you can run the tests from the root of the repository like this:

```
./runtests.sh
```

To show the browser window + a debugger while running the functional tests you can run:

```
NIGHTMARE_DEBUG=1 ./runtests.sh
```

We use the following testing libraries:

- [nightmare.js](https://github.com/segmentio/nightmare), for functional/browser tests
- [mocha](https://mochajs.org/), a well documented testing framework for javascript
- [chai](http://www.chaijs.com/), the preferred assertion library for testing

You'll need at least:

- `docker-compose` 1.12 or above
- `nodejs` 8.11 or above
- `yarn` 1.7 or above
