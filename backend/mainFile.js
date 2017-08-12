var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
// var http = require('http');
// var request = require("request");
// var form = require('formidable');
// var userRequests = require('./modules/userRequests.js');

var app = express();
//cria o ws e define q ele ira escutar na porta 4000
app.use(bodyParser.json()).listen(4000);
//conexao com banco
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: ""
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected Database");
// });

app.get('/findAllUsers', function(requisition, response){
  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    response.json(result);
  });
});

app.post('/findUser', function(requisition, response) {
  try {
    con.query("SELECT * FROM users WHERE email = '" + requisition.body.email + "' AND password = '" + requisition.body.password + "' AND status != '0'", function (err, result, fields) {
      // if (err) throw err;
      response.json(result);
    });
  } catch (e) {
    // throw e;
    console.log(e);
  } finally {

  }
});

app.post('/insertUser', function(requisition, response) {
  con.query("SELECT * FROM users WHERE email = '" + requisition.body.email + "'", function (err, result, fields) {
    if (err) throw err;
    if (result == 0) {
      con.query("INSERT INTO users (name, email, password) VALUES ('" + requisition.body.name + "', '" + requisition.body.email + "', '" + requisition.body.password + "')", function (err, result, fields) {
        if (err) throw err;
        response.json(result);
      });
    }else {
      response.sendStatus(204);
    }
  });

});
