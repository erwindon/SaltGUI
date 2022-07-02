# Development environment with Docker

To make life a bit easier for testing SaltGUI or setting up a local development environment you can use the provided docker-compose setup in this repository to run a saltmaster with three minions, including SaltGUI:

```
cd docker
docker-compose up
```

Then browse to [http://localhost:3333/](http://localhost:3333/), you can login with `salt:salt`.

