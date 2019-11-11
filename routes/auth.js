const router = require('express').Router()

const { gun } = require('../utils')
const user = gun.user()
user.recall({ sessionStorage: false })

router.post('/register', (req, res) => {
  const { email, passphare, hint } = req.body
  if (!email || !passphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })

  user.create(email, passphare, ack => {
    if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

    /** login */
    user.auth(email, passphare, ack => {
      if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

      /** create profile */
      const data = ack.sea
      const profile = { email, hint }
      data.profile = profile
      user.get('profile').put(profile, ack => {
        if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })
        return res.status(201).json({ success: true, message: 'User created successfully', data })
      })
    })
  })
})

router.post('/login', (req, res) => {
  const { email, passphare } = req.body
  if (!email || !passphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })

  user.auth(email, passphare, ack => {
    if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

    const data = ack.sea
    user.get('profile').once(profile => {
      delete profile._
      data.profile = profile
      return res.status(200).json({ success: true, message: 'User login successfully', data })
    })
  })
})

router.delete('/unregister', (req, res) => {
  const { email, passphare } = req.body
  if (!email || !passphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })

  user.auth(email, passphare, ack => {
    if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

    console.log('==ack', ack)
    // user.delete(email, passphare, ack => {
    //   if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })
    //   return res.status(201).json({ success: true, message: 'User deleted successfully', data: null })
    // })
  })
})

module.exports = router
