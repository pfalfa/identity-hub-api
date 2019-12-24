const Gun = require('gun')
const config = require('../config')
require('gun/sea')
// require('gun/lib/webrtc')
// require('gun/lib/path')
// require('gun/lib/server')

const gun = Gun({ file: 'db', peers: config.db.peers })
const sea = Gun.SEA
const textRandom = val => {
  return Gun.text.random(val)
}

module.exports = { gun, sea, textRandom }
