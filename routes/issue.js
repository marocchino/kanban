'use strict';
var pool = require('../config/pool');

var issue = {
  index: function (req, res) {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT * FROM `kanban`.`issues`', function (err, rows) {
        connection.release();
        if (err) {
          throw err;
        }
        var issues = rows;
        res.json(issues);
      });
    });
  },

  show: function (req, res) {
    pool.getConnection(function (err, connection) {
      var query = 'SELECT * FROM `kanban`.`issues` WHERE `id` = ?';
      connection.query(query, req.params.id, function (err, rows) {
        connection.release();
        if (err) {
          throw err;
        }
        var issue = rows[0];
        res.json(issue);
      });
    });
  },

  create: function (req, res) {
    pool.getConnection(function (err, connection) {
      var query = "INSERT INTO `kanban`.`issues` SET ?;";
      connection.query(query, {title: req.body.title}, function (err, result) {
        if (err) {
          throw err;
        }
        connection.release();
        res.json({status: 0, title: req.body.title, id: result.insertId});
      });
    });
  },

  update: function (req, res) {
    pool.getConnection(function (err, connection) {
      var query = "UPDATE `kanban`.`issues` " +
        "SET ? WHERE `id` = ?;";
      var attrs = {
        title: req.body.title,
        status: req.body.status,
        id: req.params.id
      };
      var options = [attrs, req.params.id];
      connection.query(query, options, function (err, result) {
        if (err) {
          throw err;
        }
        connection.release();
        res.json({state: 1});
      });
    });
  },

  destroy: function (req, res) {
    pool.getConnection(function (err, connection) {
      var query = "DELETE FROM `kanban`.`issues` WHERE `id` = ?;";
      connection.query(query, req.params.id, function (err, result) {
        if (err) {
          throw err;
        }
        connection.release();
        res.json({state: 1});
      });
    });
  }
};
module.exports = issue;
