var express = require('express');
var app = express();
var port = process.env.port || 1337
var path = require('path');

app.get('/', function (req, res) {
    //res.send('Hello ' + process.env.bing_key );
    res.sendFile(path.join(__dirname + '/example/index.html'));

    
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});