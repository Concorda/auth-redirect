'use strict'

// external modules
var _ = require('lodash')
var S = require('string')

module.exports = function (opt) {
  var seneca = this

  var options = opt || {}

  function redirect (args, cb) {
    var req = this.fixedargs.req$
    var kind = args.kind

    var shouldRedirect = false
    var ct = (req.headers['content-type'] || '').split(';')[0]

    if (options.always) {
      shouldRedirect = true
    }
    else if (options[kind] && options[kind].always) {
      shouldRedirect = true
    }
    else if (!_.isUndefined(req.query.redirect)) {
      shouldRedirect = S(req.query.redirect).toBoolean()
    }
    else if ('application/json' === ct) {
      shouldRedirect = false
    }
    else shouldRedirect = false

    var redirect
    if (shouldRedirect) {
      redirect = {
        win: _.isString(req.query.win) ? req.query.win : (options[kind] ? options[kind].win : undefined),
        fail: _.isString(req.query.fail) ? req.query.fail : (options[kind] ? options[kind].fail : undefined)
      }
    }

    cb(null, redirect)
  }

  seneca.add({role: 'auth', cmd: 'redirect'}, redirect)
}
