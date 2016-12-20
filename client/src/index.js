'use strict'

const choo = require('../node_modules/choo')
const html = require('../node_modules/choo/html')
const http = require('xhr')
const app = choo()
const home = require('./home.js')
const competition = require('./competition.js')
const emptyState = require('./state')

app.model({
  state: window.state || emptyState,
  reducers: {
    setBasic: (state, data) => ({ competitions: data.competitions, user: data.user, joined: data.joined }),
    setStats: (state, data) => ({ stats: data })
  },
  effects: {
    getBasic: (state, data, send, done) => {
      http('/me', (err, res, body) => send('setBasic', body, done))
    },
    getStats: (state, data, send, done) => {
      http.get('/api/v2/stats', (err, res, body) => {
        body = JSON.parse(body)
        body.competitions = state.competitions.length
        send('setStats', body, done)
      })
    },
  }
})
app.model(require('./quiz').model)

app.router({ default: '/v2' }, [
  ['/v2', home.html],
  ['/v2/competition/:id/:tab', competition.html]
])

if (module && module.parent) {
  module.exports = app
} else {
  const tree = app.start()
  const root = document.getElementById("app")
  root.innerHTML = '';
  root.appendChild(tree)
}
