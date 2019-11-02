# Identity Hub API

A brigde API for request identity hub with public key.

## Usage

```bash
# Install depedencies
$ npm install

# Run application
$ npm run start
```

## Using Docker

```bash
# Build docker image
$ docker build -t pfalfa-ihub-api .

# Run docker container
$ docker run --name pfalfa-ihub-api -d -p 3003:3003 pfalfa-ihub-api
```

## API Doc

API : http://localhost:3003

| Endpoint    | Params        | Response                                                                   |
| ----------- | ------------- | -------------------------------------------------------------------------- |
| /api/users/ | pubkey (hash) | status 200: {success: true, message: null, data: {...user}}                |
|             |               | status 400: {success: false, message: "Example wrong message", data: null} |
