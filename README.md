# Identity Hub API

A simple API for request user profile with public key.

## Usage 

```bash
# Install depedencies
$ npm install

# Run application
$ npm run start
```

## API Doc

| Endpoint    | Params          | Response                                                                   |
|-------------|-----------------|----------------------------------------------------------------------------|
| /api/users/ | pubkey (string) | status 200: {success: true, message: null, data: {...user}}                |
|             |                 | status 400: {success: false, message: "Example wrong message", data: null} |