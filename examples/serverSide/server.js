let express = require('express');
const port = 3000

var ci = require("./lib/ColorImage");
var rgb = require("./lib/RGBColor");
var magicolors = require("./Magicolors");



//import fs from "fs.js";
// var readimage = require("readimage");
// import { RGBColor} from "./Magicolors.js";


//let c = new RGBColor(0,0,0);

var app = express();
app.get('/',function(req,res) {
    //res.send('Hello World!');

    // let imgA = new ci.ColorImage("d:/angularProjects/magicolors/examples/serverSide/lena.png");
    // let imgB = new ci.ColorImage();

    ci.loadImage("d:/angularProjects/magicolors/examples/serverSide/lena.png", rgb.RGBColor, (err, imgA) => {
        if(err) return null;

        ci.loadImage("d:/angularProjects/magicolors/examples/serverSide/apple.png", rgb.RGBColor, (err, imgB) => {
            if(err) return null;
            
            if(imgA !== 'undefined' || imgB !== 'undefined'){

                var resultImg = magicolors.blending['multiply'](imgA,imgB); //{Uint8ClampedArray, width, height}
                
                var dataUrl = ci.getDataURL(resultImg);
                // res.writeHead(200, {'Content-Type': 'image/png' });
                // res.end(ci.getBinary(resultImg), 'binary')
                res.send(`<img src=${dataUrl}>`);
            }
            else{
                res.sendFile('server/lena.png', { root: __dirname });
            }
        });
    });




    // if(imgA !== 'undefined' || imgB !== 'undefined'){

    //     var resultImg = magicolors.blending['multiply'](imgA.frames[0],imgB.frames[0]); //ImageData

    //     res.writeHead(200, {'Content-Type': 'image/png' });
    //     res.end(resultImg, 'binary')
    // }
    // else{
    //     res.sendFile('server/lena.png', { root: __dirname });
    // }
});
var server=app.listen(port,() => console.log(`Example app listening on port ${port}!`));