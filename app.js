"use strict";

var _ = require('lodash')

module.exports = function ( options ) {
  var seneca = this
  var plugin = 'seneca-auth-redirect'

  function redirect(args, cb){
    var req = args.req
    var res = args.res
    var kind = args.kind

    var redirect = false
    var ct = (req.headers['content-type']||'').split(';')[0]

    if( options.always ) {
      redirect = true
    }
    else if( !_.isUndefined(req.query.redirect) ) {
      redirect = S(req.query.redirect).toBoolean()
    }
    else if( 'application/x-www-form-urlencoded' == ct || 'multipart/form-data' == ct ) {
      redirect = true
    }
    else if( 'application/json' == ct ) {
      redirect = false
    }
    else redirect = true;

    if( redirect ) {
      redirect = {
        win:  _.isString(req.query.win) ? req.query.win : (options[kind]? options[kind].win: undefined) ,
        fail: _.isString(req.query.fail) ? req.query.fail : (options[kind]? options[kind].fail: undefined)
      }
    }else{
      redirect = {}
    }

    cb(null, redirect)
  }

  seneca.add({role: 'auth', cmd: 'redirect'}, redirect)

  return {
    name:plugin
  }
}
