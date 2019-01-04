var express = require('express');
const port = 3000

var fs = require("fs");
// var readimage = require("readimage");



var app = express();
app.get('/',function(req,res) {
    //res.send('Hello World!');
    res.sendFile('server/lena.png', { root: __dirname });
});
var server=app.listen(port,() => console.log(`Example app listening on port ${port}!`));