const Gun = require('gun')
const router = require('express').Router()

const config = require('../config')
const gun = Gun({ file: 'db', peers: config.db.peers })

router.get('/:pubkey', (req, res) => {
  const { pubkey } = req.params
  if (!pubkey) return res.status(400).json({ success: false, message: 'Invalid format request', data: null })

  gun.user(pubkey).once(data => {
    if (data) {
      return res.status(200).json({ status: 200, success: true, message: null, data })
    } else {
      return res
        .status(403)
        .json({ status: 403, success: false, message: 'You do not have enough permission to perform this action', data: null })
    }
  })
})

module.exports = router
