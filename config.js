require('dotenv').config()
const { description, version, license } = require('./package.json')
const apiDoc = 'https://pfalfa-ihub-api.pfalfa.io'

module.exports = {
  app: {
    port: process.env.PORT || 3003,
    host: 'localhost',
    route: '/api',
    sessionSecret: process.env.SESSION_SECRET || 'secret-key',
    openSslKeyPath: process.env.SSL_KEYPATH || null,
    openSslCertPath: process.env.SSL_CERTPATH || null,
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    pageLimit: 10,
  },
  db: {
    peers: process.env.DB_PEERS || ['https://pfalfa-ihub.pfalfa.io/gun'],
  },
  swagger: {
    swaggerDefinition: {
      openapi: '3.0.1',
      host: apiDoc,
      basePath: '/',
      info: {
        title: 'Identity Hub API Docs',
        version,
        description,
        // contact: { email: 'eksant@gmail.com' },
        license: {
          name: license,
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
      },
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          scheme: 'bearer',
          in: 'header',
        },
      },
      produces: ['application/json'],
      schemes: ['https'],
      servers: [{ url: apiDoc }],
    },
    apis: ['./docs/api/*.js'],
  },
}
