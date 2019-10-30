const router = require('express').Router()

const { User } = require('../models')
const { passport } = require('../utils')

const state = { success: false, message: null }

/** home */
router.get('/', (req, res) => {
  res.render('index')
})

/** sign up */
router.get('/register', (req, res) => {
  if (req.isUnauthenticated()) res.render('signup', state)
  else res.redirect('users/dashboard')
})

router.post('/signup', (req, res) => {
  const { email, passphrase } = req.body
  User.create(email, passphrase)
    .then(result => {
      if (!result.success) res.render('signup', result)
      else {
        User.login(email, passphrase)
          .then(result => {
            const user = { ...result.data }
            req.login(user, err => {
              if (err) res.render('signup', { success: false, message: err })
              else res.redirect('users/dashboard')
            })
          })
          .catch(err => console.error(err))
      }
    })
    .catch(err => console.error(err))
})

router.get('/login', (req, res) => {
  if (req.isUnauthenticated()) res.render('login', state)
  else res.redirect('users/dashboard')
})

/** login */
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    if (!req.user.success) res.render('login', req.user)
    else {
      const user = { ...req.user.data }
      req.login(user, err => {
        if (err) res.render('login', { success: false, message: err })
        else res.redirect('users/dashboard')
      })
    }
  }
)

/** forgot password */
router.get('/forgot', (req, res) => {
  res.render('forgot', state)
})

router.post('/forgot', (req, res) => {
  const { email } = req.body
  User.resetPass(email)
})

module.exports = router
