process.env.NODE_ENV = 'test';
var issue = require('../../routes/issue');
var pool = require('../../config/pool');
var chai = require('chai');
var expect = chai.expect;

describe('issue', function () {

  describe('#index', function () {
    it('is a function', function () {
      expect(issue.index).to.be.function;
    });

    describe('when has 2 issues', function () {
      beforeEach(function(done) {
        pool.getConnection(function(err, connection) {
          var query = "INSERT INTO `kanban`.`issues` (`title`) VALUES (?);";
          connection.query(query, "yahoo", function() {
            connection.query(query, "some task", function() {
              connection.release();
              done();
            });
          });
        });
      });

      it('return issues', function() {
        var mockReq = null;
        var mockRes = {
          json: function(issues) {
            expect(issues).to.have.length(2);
            expect(issues[0].title).to.equal("yahoo");
            expect(issues[1].title).to.equal("some task");
          }
        };
        issue.index(mockReq, mockRes);
      });
    });
  });

  describe('#show', function () {
    it('is a function', function () {
      expect(issue.show).to.be.function;
    });

    describe('when has a issue', function () {
      beforeEach(function(done) {
        pool.getConnection(function(err, connection) {
          var query = "INSERT INTO `kanban`.`issues` (`title`) VALUES (?);";
          connection.query(query, "yahoo", function(err, rows, fields) {
            connection.release();
            done();
          });
        });
      });

      it('return issues', function() {
        var mockReq = {params: { id: "1" }};
        var mockRes = {
          json: function(issue) {
            expect(issue.title).to.equal("yahoo");
          }
        };
        issue.show(mockReq, mockRes);
      });
    });
  });

  describe('#create', function () {
    it('is a function', function () {
      expect(issue.create).to.be.function;
    });


    it('create issue', function() {
      var mockReq = {body: { title: "yahoo" }};
      var mockRes = {
        json: function(result) {
          expect(result.id).to.equal(1);
        }
      };
      issue.create(mockReq, mockRes);
    });
  });

  describe('#update', function () {
    it('is a function', function () {
      expect(issue.update).to.be.function;
    });

    describe('when has a issue', function () {
      beforeEach(function(done) {
        pool.getConnection(function(err, connection) {
          var query = "INSERT INTO `kanban`.`issues` (`title`) VALUES (?);";
          connection.query(query, "yahoo", function(err, rows, fields) {
            connection.release();
            done();
          });
        });
      });

      it('update issue', function() {
        var mockReq = {
          body: { title: "yahoo2", status: 1 },
          params: { id: 1 }
        };
        var mockRes = {
          json: function(result) {
            expect(result.state).to.equal(1);
          }
        };
        issue.update(mockReq, mockRes);
      });
    });
  });

  describe('#destroy', function () {
    it('is a function', function () {
      expect(issue.destroy).to.be.function;
    });

    describe('when has a issue', function () {
      beforeEach(function(done) {
        pool.getConnection(function(err, connection) {
          var query = "INSERT INTO `kanban`.`issues` (`title`) VALUES (?);";
          connection.query(query, "yahoo", function(err, rows, fields) {
            connection.release();
            done();
          });
        });
      });

      it('destroy a issue', function() {
        var mockReq = {params: { id: 1 }};
        var mockRes = {
          json: function(result) {
            expect(result.state).to.equal(1);
          }
        };
        issue.destroy(mockReq, mockRes);
      });
    });
  });

  afterEach(function(done) {
    pool.getConnection(function(err, connection) {
      connection.query("TRUNCATE `kanban`.`issues`;", function() {
        connection.release();
        done();
      });
    });
  });
});
