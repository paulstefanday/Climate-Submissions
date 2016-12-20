'use strict'

// Router Vars
const Router = require('koa-router')
const api = new Router()
const user = require(`${__base}api/settings/permissions`)
const { me } = require(`./`)

// Permissions
const validUser = user.is('logged in')
const validAdmin = [ validUser, user.is('admin') ]

api
  // User
  .get('/', function *() { this.body = { message: "Welcome to the API"} })
  .get('/stats', me.stats)
  .get('/me', me.me)

module.exports = api.middleware()
