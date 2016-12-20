'use strict'

const { Competition } = require('climate-core/models')
const { r, m } = require('climate-core/models/thinky')
const user = require(`climate-core/settings/permissions`)

exports.stats = function *() {
  let journalists = yield r.table('users').count()
  let articles = yield r.table('submissions').count()

  this.body = { journalists, articles }
}


exports.me = function *(direct) {

  let joined
  let competitions
  if(this && this.user) {
    joined = yield r.table('competitions_users').filter({ user_id: this.user.id })
    competitions = yield Competition
      .orderBy({index: r.desc('start')})
      .filter({ hidden: false })
      .getJoin({ parts: {
        submissions: {
          _apply: sequence => sequence.filter(item => item('userId').eq(this.user.id)),
          reviews: true
        }
      }})
  } else {
    joined = []
    competitions = yield Competition
      .orderBy({index: r.desc('start')})
      .filter({ hidden: false })
      .getJoin({
        parts: true,
        users: { _apply: sequence => sequence.count(), _array: false }
      });
  }

  let body = {
    competitions,
    joined
  }

  if(direct === true) return body
  this.body = body
}
