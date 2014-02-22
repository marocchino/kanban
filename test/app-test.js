process.env.NODE_ENV = 'test';
var app = require('../app');
var chai = require('chai');
var expect = chai.expect;

describe('app', function () {
  it('will be test env', function () {
    expect(app.get('env')).to.equal('test');
    expect(app.get('env')).to.not.equal('development');
  });
});
