var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var mysql        = require('mysql'); //konekd databases
var routes       = require('./routes/index');
var users        = require('./routes/users');
var app          = express();

//koneksi mysql
var pool = mysql.createPool({
  host : '127.0.0.1',
  user : 'root',
  password : 'root',
  database : 'data' //nama database;
});

//query string
var createTable = "CREATE TABLE data(id int(11) NOT NULL AUTO_INCREMENT,"+
    "nama varchar(20) DEFAULT NULL,"+

    "harga float(11) DEFAULT NULL,"+
    "PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1";

var insertRecord = 'INSERT INTO data(nama,harga) VALUE(?,?)';

var readTable = 'SELECT * FROM data';

var updateRecord = 'UPDATE data SET harga = ? WHERE nama=?';

var deleteRecord = 'DELETE FROM data WHERE nama=?';

var dropTable = 'DROP table data';

//crud-mysql
pool.getConnection(function(err, connection){
  //Ciptakaan tabel data
  connection.query(createTable,  function(err){
    if(err) throw err;
    else {
      console.log('membuat tabel');
    }
  });

  //Insert a record.
  connection.query(insertRecord,['herii',50000], function(err,res){
    if(err) throw err;
    else {
      console.log('data baru telah ditambahkan.');
    }
  });

  //Read table.
  connection.query(readTable, function(err, rows){
    if(err) throw err;
    else {
      console.log(rows);
    }
  });

  //Update a record.
  connection.query(updateRecord,[60000,'herii'], function(err, res){
    if(err) throw err;
    else {
      console.log('update data.');
    }
  });

  //Read table.
  connection.query(readTable, function(err, rows){
    if(err) throw err;
    else {
      console.log(rows);
    }
  });

  //Delete a record.
  connection.query(deleteRecord,['herii'], function(err, res){
    if(err) throw err;
    else {
      console.log('hapus data table');
    }
  });

  //Drop a table.
  connection.query(dropTable, function(err, res){
    if(err) throw err;
    else {
      console.log('hapus database data');
    }
  });

  connection.release();//release the connection
});

//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

app.listen(3000,function(){
  console.log('port 3000');
});