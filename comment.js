//create web server
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1234',
  database : 'comment'
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index');
});

app.get('/comment', function(req, res){
  res.render('comment');
});

app.post('/comment', function(req, res){
  var comment = req.body.comment;
  var name = req.body.name;
  var password = req.body.password;
  connection.query('INSERT INTO comment (name, comment, password) VALUES (?, ?, ?)', [name, comment, password], function(err, rows, fields){
    if(err){
      console.log(err);
    }else{
      res.redirect('/comment');
    }
  });
});

app.get('/commentList', function(req, res){
  connection.query('SELECT * FROM comment', function(err, rows, fields){
    if(err){
      console.log(err);
    }else{
      res.send(rows);
    }
  });
});

app.post('/commentList', function(req, res){
  var no = req.body.no;
  connection.query('SELECT * FROM comment WHERE no = ?', [no], function(err, rows, fields){
    if(err){
      console.log(err);
    }else{
      res.send(rows);
    }
  });
});

app.post('/delete', function(req, res){
  var no = req.body.no;
  var password = req.body.password;
  connection.query('DELETE FROM comment WHERE no = ? AND password = ?', [no, password], function(err, rows, fields){
    if(err){
      console.log(err);
    }else{
      res.redirect('/comment');
    }
  });
});

app.get('/update', function(req, res){
    res.render('update');
});

app.post('/update', function(req, res){
    var no = req.body.no;
    var password = req.body.password;
    connection.query('SELECT * FROM comment WHERE no = ?', [no], function(err, rows, fields){
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    });
});
//and the three dots ..., you can type control + enter 
//to bring up the GitHub Copilot completions panel.