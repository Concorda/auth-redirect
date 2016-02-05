'use strict'

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe

var Code = require('code')
var expect = Code.expect

describe('Dummy Test', (done) => {
  expect('this').to.only.include(['this'])
  return done
})
