const Gun = require('gun')
const router = require('express').Router()

const config = require('../config')
const gun = Gun({ file: 'db', peers: config.db.peers })

router.get('/:pubkey', (req, res) => {
  const { pubkey } = req.params
  if (!pubkey) return res.status(400).json({ success: false, message: 'Invalid format request', data: null })
  gun.user(pubkey).once(data => {
    console.log('==data', data)
    if (data) {
      return res.status(200).json({ success: true, message: null, data })
    } else {
      return res.status(400).json({ success: false, message: 'Something wrong', data: null })
    }
  })
})

module.exports = router
