'use strict';
var mysql = require('mysql');
var pool = mysql.createPool({
  user: 'root',
  host: 'localhost',
  port: 3306,
  database: 'kanban'
});

module.exports = pool;
