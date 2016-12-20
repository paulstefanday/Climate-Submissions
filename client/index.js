'use strict'

const choo = require('choo')
const html = require('choo/html')
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
      http.get('/api/stats', (err, res, body) => {
        body = JSON.parse(body)
        body.competitions = state.competitions.length
        send('setStats', body, done)
      })
    },
  }
})
app.model(require('./quiz').model)

app.router({ default: '/' }, [
  ['/', home.html],
  ['/competition/:id/:tab', competition.html]
])

if (module && module.parent) {
  module.exports = app
} else {
  const tree = app.start()
  const root = document.getElementById("app")
  root.innerHTML = '';
  root.appendChild(tree)
}
