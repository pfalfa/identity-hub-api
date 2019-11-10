module.exports = {
  app: {
    port: process.env.PORT,
    host: 'localhost',
    mainRoute: '/api',
    modeServer: 'http',
    modeCluster: true,
    sessionSecret: process.env.SESSION_SECRET,
    openSslKeyPath: process.env.SSL_KEYPATH || null,
    openSslCertPath: process.env.SSL_CERTPATH || null,
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    pageLimit: 10,
  },
  db: {
    peers: process.env.DB_PEERS,
  },
}
