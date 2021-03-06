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

## How To Deploy

- Rename .env.example to .env
- Find line DB_PEERS  in file .env to change database peers connections
- Choose running application using npm or docker

## API Doc

Host API : http://localhost:3003/api

| Description             | Endpoint                      | Method  | Status  | Response                                                                                |
| ----------------------- | ----------------------------- | ------- | ------- | --------------------------------------------------------------------------------------- |
| Get User By Public Key  | /users/:pubkey                | GET     | 200     | ```{success: true, message: null, data: {alias: "xxx", epub: "xxx", pub: "xxx"}}```     |
|                         |                               |         | 403     | ```{success: false, message: "Example wrong message", data: null}```                    |
|                         | /users                        | GET     | 200     | ```{success: true, message: null, data: {alias: "xxx", epub: "xxx", pub: "xxx"}}```     |
|                         | Header Authorization: pubkey  |         | 403     | ```{success: false, message: "Example wrong message", data: null}```                    |


- Using headers
  - Required: Authorization pubkey

| Endpoint    | Method | Response                                                                   |
| ----------- | ------ | -------------------------------------------------------------------------- |
| /api/users  | GET    | status 200: {success: true, message: null, data: {alias, epub, pub}}       |
|             |        | status 400: {success: false, message: "Example wrong message", data: null} |
