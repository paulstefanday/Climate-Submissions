'use strict'

module.exports = function *() {

  const client = require('./src')
  const { m, r } = require(`${__base}api/models/thinky`)
  const { User, Competition } = require(`${__base}api/models`)
  const { me } = require(`${__base}api/appv2/me`)
  let state = require('./src/state')

  // Get current competitions
  let body = yield me(true)
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

  let html = client.toString(this.url || '/v2', state)
  this.body = yield this.render('client/appv2/index.jade', { html, state, env: process.env.NODE_ENV });

}
