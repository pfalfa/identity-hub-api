const router = require('express').Router()

const { gun, util } = require('../utils')
const user = gun.user()
// user.recall({ sessionStorage: false })

router.post('/register', (req, res) => {
  const { email, passphare, hint } = req.body
  const sPassphare = passphare.toString().trim()
  if (!email || !sPassphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })

  user.create(email, sPassphare, ack => {
    if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

    /** login */
    user.auth(email, sPassphare, ack => {
      if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

      /** create profile */
      const data = ack.sea
      const profile = { email, hint }
      data.profile = profile
      user.get('profile').put(profile, ack => {
        if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

        /** create user */
        const userProfile = { email, hint: util.encrypt(hint), pwd: util.encrypt(sPassphare) }
        gun.get(`user/${email}`).put(userProfile, ack => {
          if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })
          return res.status(201).json({ success: true, message: 'User created successfully', data })
        })
      })
    })
  })
})

router.post('/login', (req, res) => {
  const { email, passphare } = req.body
  const sPassphare = passphare.toString().trim()
  if (!email || !sPassphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })

  user.auth(email, sPassphare, ack => {
    if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

    const data = ack.sea
    user.get('profile').once(profile => {
      delete profile._
      data.profile = profile
      return res.status(200).json({ success: true, message: 'User login successfully', data })
    })
  })
})

router.post('/forgot', (req, res) => {
  const { email, hint } = req.body
  if (!email || !hint) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })

  gun.get(`user/${email}`).once(data => {
    if (!data) return res.status(400).json({ success: false, message: 'User not found', data: null })
    if (util.decrypt(data.hint) !== hint) return res.status(400).json({ success: false, message: 'Recovery hint not correct', data: null })

    delete data._
    data.temp = util.randomPassword()
    // console.log('==forgot data', data)

    gun.get(`user/${email}`).put(data, ack => {
      if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })
      return res.status(200).json({ success: true, message: 'Temp password has been send', data: data.temp })
    })
  })
})

router.post('/reset', (req, res) => {
  const { email, oldPassphare, newPassphare } = req.body
  if (!email || !oldPassphare || !newPassphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })
  // console.log('==oldPassphare', oldPassphare)

  gun.get(`user/${email}`).once(data => {
    // console.log('==first data', data)

    if (!data) return res.status(400).json({ success: false, message: 'User not found', data: null })
    if (data.temp.toString().trim() !== oldPassphare.toString().trim())
      return res.status(400).json({ success: false, message: 'Temp password not correct', data: null })

    delete data._
    const pwd = util.decrypt(data.pwd)
    // console.log('==pwd', pwd)

    user.auth(
      email,
      pwd.toString().trim(),
      ack => {
        if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

        delete data.temp
        data.pwd = util.encrypt(newPassphare)
        // console.log('==last data', data)
        gun.get(`user/${email}`).put(data, ack => {
          if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })
          return res.status(200).json({ success: true, message: 'Reset password successfully', data: null })
        })
      },
      { change: newPassphare }
    )
  })
})

router.post('/change-password', (req, res) => {
  const { email, oldPassphare, newPassphare } = req.body
  if (!email || !oldPassphare || !newPassphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })

  user.auth(
    email,
    oldPassphare,
    ack => {
      if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

      const data = { email, pwd: util.encrypt(newPassphare) }
      gun.get(`user/${email}`).put(data, ack => {
        if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })
        return res.status(200).json({ success: true, message: 'Change password successfully', data: null })
      })
    },
    { change: newPassphare }
  )
})

router.delete('/unregister', (req, res) => {
  const { email, passphare } = req.body
  if (!email || !passphare) return res.status(400).json({ success: false, message: 'Invalid payload', data: null })

  user.auth(email, passphare, ack => {
    if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })

    console.log('==ack', ack)
    return res.status(500).json({ success: false, message: 'Stil on develop', data: null })
    // user.delete(email, passphare, ack => {
    //   if (ack && ack.err) return res.status(400).json({ success: false, message: ack.err, data: null })
    //   return res.status(201).json({ success: true, message: 'User deleted successfully', data: null })
    // })
  })
})

module.exports = router
