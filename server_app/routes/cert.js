var Jimp = require('jimp');
var fs = require('fs');


var certTemplateName = "Certificate_SJSU.jpg";
var imageCaption = 'Image caption';
var loadedImage;
var tempCertFile = "Certificate_SJSU_2.jpg";

function geFiletData(fileName) {
    return new Promise(function(resolve, reject){
      fs.readFile(fileName, (err, data) => {
          err ? reject(err) : resolve(data);
      });
    });
}

var generate = function(fName, lName, course, stream, date) {
    return new Promise(function(resolve, reject) {
        Jimp.read("Certificate_SJSU.jpg").then(function (image) {
            console.log("Template: "+certTemplateName+ " opened");
            /* File opened, load font */
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK); 
        })
        .then(function (font) {
            /* Write text to the image, and then write that to a file */
            loadedImage.print(font, 10, 10, imageCaption)
                        .write(tempCertFile);
            return geFiletData(tempCertFile);
        })
        .then(function(data){
            CertBase64String = Buffer.from(data).toString('base64');
            console.log(CertBase64String);
            resolve(CertBase64String);
        })
        .catch(function (err) {
            console.log(err);
            reject(err);
            // handle an exception 
        });    
    });
}

// var Certificate = function(fName, lName, course, stream, date)
// {
//     console.log("Certificate const ++");
    
//     /* Form data */
//     this.fName = fName;
//     this.lName = lName;
//     this.course = course;
//     this.stream = stream;
//     this.date = date;
//     this.CertBase64String = "";

//     this.
//     /* Certificate generation part */
//     console.log(Jimp);
 
//     Jimp.read("Certificate_SJSU.jpg").then(function (image) {
//         console.log("Template: "+certTemplateName+ " opened");
//         /* File opened, load font */
//         loadedImage = image;
//         return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK); 
//     })
//     .then(function (font) {
//         /* Write text to the image, and then write that to a file */
//         loadedImage.print(font, 10, 10, imageCaption)
//                     .write(tempCertFile);
//         return geFiletData(tempCertFile);
//     })
//     .then(function(data){
//         CertBase64String = Buffer.from(data).toString('base64');
//         console.log(CertBase64String);
//     })
//     .catch(function (err) {
//         console.log(err);
//         // handle an exception 
//     });
//     console.log("Certificate const --");
// }

module.exports.generate = generate;