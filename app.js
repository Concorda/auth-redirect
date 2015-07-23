"use strict";

var _ = require('lodash')

module.exports = function ( options ) {
  var seneca = this
  var plugin = 'seneca-auth-redirect'

  function redirect(args, cb){
    var req = this.fixedargs.req$
    var kind = args.kind

    var shouldRedirect = false
    var ct = (req.headers['content-type']||'').split(';')[0]

    if( options.always ) {
      shouldRedirect = true
    }
    else if( !_.isUndefined(req.query.redirect) ) {
      shouldRedirect = S(req.query.redirect).toBoolean()
    }
    else if( 'application/x-www-form-urlencoded' == ct || 'multipart/form-data' == ct ) {
      shouldRedirect = true
    }
    else if( 'application/json' == ct ) {
      shouldRedirect = false
    }
    else shouldRedirect = false;

    var redirect
    if( shouldRedirect ) {
      redirect = {
        win:  _.isString(req.query.win) ? req.query.win : (options[kind]? options[kind].win: undefined) ,
        fail: _.isString(req.query.fail) ? req.query.fail : (options[kind]? options[kind].fail: undefined)
      }
    }

    cb(null, redirect)
  }

  seneca.add({role: 'auth', cmd: 'redirect'}, redirect)

  return {
    name:plugin
  }
}
