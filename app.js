var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var srcPath = __dirname + '/scss', destPath = __dirname + '/public/stylesheets';
app.use('/stylesheets', sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed'
    })
);
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', allowCrossDomain);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/home.html"));
})

app.listen(3000, function() {
    console.log('listening on 3000');
});
