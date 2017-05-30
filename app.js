var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var app = express();

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/BECA');

app.use(function(req, res, next) {
    req.db = db;
    next();
});

var srcPath = __dirname + '/scss', destPath = __dirname + '/public/stylesheets';
app.use('/stylesheets', sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed'
    })
);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/home.html"));
})

app.listen(3000, function() {
    console.log('listening on 3000');
});
