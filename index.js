'use strict'

const { app, thinky, models, user } = require('../climate-core')
const serve = require('koa-static')
const route = require('koa-route')
const mount = require('koa-mount')

// Static files
app.use(require('koa-render')(__dirname, 'jade', { jade: 'jade' }))
app.use(mount('/static/', serve('static/')))

// API
const api = require('./api')
app.use(route.get('/api/stats', api.stats))
app.use(route.get('/api/me', api.me))

// Render App
app.use(route.get('/*', function *() {

  const client = require('./client')
  const { m, r } = thinky
  const { User, Competition } = models
  let state = require('./client/state')

  // Get current competitions
  let body = yield api.me(true)
  state.competitions = body.competitions || []
  // Load extra competition if missing
  if(this.url.indexOf('/competition/') !== -1) {
      // check if id exists in state.competitions
      var test = this.url.match("competition\/(.*)\/")
      let id = test[1]
      let loaded = state.competitions.filter(comp => comp.id === id)[0]
      if(!loaded) {
        let extra = yield Competition.get(id).getJoin({
          parts: true,
          users: { _apply: sequence => sequence.count(), _array: false }
        })
        state.competitions.push(extra)
      }
  }
	console.log(this.url)
  let html = client.toString(this.url || '/', state)
  this.body = yield this.render('index.jade', { html, state, env: process.env.NODE_ENV });

}))

// Start Server
app.listen(3000, () => console.log('API on localhost:3000'))
