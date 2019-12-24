require('dotenv').config()
const fs = require('fs')
const os = require('os')
const path = require('path')
const cors = require('cors')
const http = require('http')
const https = require('https')
const logger = require('morgan')
const helmet = require('helmet')
const cluster = require('cluster')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const session = require('express-session')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const config = require('./config')
const routes = require('./routes')
const app = express().set('port', config.app.port)

/** express server */
app.use(cors())
app.use(bodyParser.urlencoded({ limit: '30mb', extended: false }))
app.use(bodyParser.json({ limit: '30mb', extended: false }))
app.use(helmet())
app.use(compression())
app.use(logger('dev'))
app.use(session({ secret: config.app.sessionSecret, resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }))

/** api docs */
const swaggerConfig = swaggerJSDoc(config.swagger)
const swaggerOptions = {
  customSiteTitle: 'Identity Hub API',
  customCss: '.topbar { display: none }',
}
const swaggerUiSetup = swaggerUi.setup(swaggerConfig, swaggerOptions)

app.get(config.app.route + '/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerConfig)
})
app.get(
  config.app.route,
  (req, res) => {
    res.sendfile(path.join(__dirname, './html/apidoc.html'))
  },
  swaggerUiSetup
)

/** router */
routes(app, swaggerUi, swaggerUiSetup)

/** clustering server */
const server =
  !config.app.openSslKeyPath && !config.app.openSslCertPath
    ? http.createServer(app)
    : https.createServer(
        {
          key: fs.readFileSync(config.app.openSslKeyPath),
          cert: fs.readFileSync(config.app.openSslCertPath),
        },
        app
      )
if (cluster.isMaster) {
  const cpus = os.cpus().length
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }
  console.log(`Mode Cluster. Forking for ${cpus} CPUs`)
} else {
  const port = config.app.port
  server.listen(port, () => {
    console.log(`Start Express Server on Port ${port} Handled by Process ${process.pid}`)
    return
  })

  process.on('SIGINT', () => {
    server.close(err => {
      if (err) {
        console.error(`Error Express Server : ${err}`)
        process.exit(1)
        return
      }
      console.log(`Close Express Server on Port ${port} Handled by Process ${process.pid}`)
      process.exit(0)
    })
  })
}

module.exports = app
