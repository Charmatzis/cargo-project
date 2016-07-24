var express = require('express');
var app = express();
var port = process.env.port || 1337

app.get('/', function (req, res) {
    res.write('<p>Hello from Node' </p>');
  res.write('<ul>');
  res.write('<li><label>bing: </label>'+ process.env.bing_key +' </li>');
  res.write('<li><label>google :</label>'+ process.env.google_key +' </li>');
  res.write('</ul>');
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
