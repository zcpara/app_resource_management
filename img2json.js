var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;
var path = require('path');
var JPEG = require('jpeg-js');
var BMP = require('bmp-js');

var mediaJSON = {};
var count = -1;
var isReady = true;

function compressImage(p) {
  var image = [];

  for (var x=0; x<p.data.length; x+=8) {
    var pixels = 0;
    var R = p.data[x]>128?1:0;
    var G = p.data[x+1]>128?1:0;
    var B = p.data[x+2]>128?1:0;
    pixels += R+G*2+B*4;

    R = p.data[x+4]>128?1:0;
    G = p.data[x+5]>128?1:0;
    B = p.data[x+6]>128?1:0;
    pixels += (R+G*2+B*4)*16;

    image.push(pixels);
  }
  return image;
}

function writeFile() {
  mediaJSON.numberOfImg = process.argv.length-2;
  for (var i=2; i<process.argv.length; i++) {
    var imgs = [];
    var file = process.argv[i];
    if (file.match(/.jpg$/)) {
      var compressedData = compressImage(JPEG.decode(fs.readFileSync(file)));
      for (var j=0; j<compressedData.length; j++) {
        imgs.push(compressedData[j]);
      }
    } else if (file.match(/.bmp$/)) {
      var compressedData = compressImage(BMP.decode(fs.readFileSync(file)));
      for (var j=0; j<compressedData.length; j++) {
        imgs.push(compressedData[j]);
      }
    } else {
      return;
    }
    mediaJSON['img'+(i-2)] = imgs;
  }

  //this.disp_raw_N(imgs, files.length, interval);
  fs.writeFile(path.join('media.json'), JSON.stringify(mediaJSON), function (err) {if (err) throw err; console.log('It\'s saved!');});
};

/*function createJSON() {
  if (isReady) {
    isReady = false;
    count++;
    //console.log('path'+process.argv[count+2]);
    if (!(count<(process.argv.length-2))) return;
    //fs.readFile(path.join(__dirname, process.argv[count+2]), function(err, data) {
    fs.readFile(path.join(process.argv[count+2]), function(err, data) {
      if (err) throw err;
      var image = [];
      var img = new Image; // Create a new Image
      img.src = data;

      var canvas = new Canvas(16, 12);
      var ctx = canvas.getContext('2d');
      //ctx.drawImage(img, 2, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var p = ctx.getImageData(0, 0, 16, 12);
      for (var x=0; x<p.data.length; x+=8) {
        //console.log(p.data[x]+' '+p.data[x+1]+' '+p.data[x+2]);
        var pixels = 0;
        var R = p.data[x]>128?1:0;
        var G = p.data[x+1]>128?1:0;
        var B = p.data[x+2]>128?1:0;
        //if (!(R==1 && G==1 && B==1)) {
          pixels += R+G*2+B*4;
        //}

        //console.log(p.data[x+4]+' '+p.data[x+5]+' '+p.data[x+6]);
        R = p.data[x+4]>128?1:0;
        G = p.data[x+5]>128?1:0;
        B = p.data[x+6]>128?1:0;
        //if (!(R==1 && G==1 && B==1)) {
          pixels += (R+G*2+B*4)*16;
        //}
        image.push(pixels);
      }
      mediaJSON['img'+count] = image;
      isReady = true;
      console.log('set ready:'+'img'+count);
    });
    setTimeout(createJSON, 100);
  } else {
    setTimeout(createJSON, 100);
  }
}

mediaJSON.numberOfImg = process.argv.length-2;

function writeFile() {
  for (var i=2; i<process.argv.length; i++) {
    console.log('check ready:'+'img'+(i-2));
    if (!mediaJSON['img'+(i-2)]) break;
  }
  if (i<process.argv.length) {setTimeout(writeFile, 500); return;}
  //fs.writeFile(path.join(__dirname, 'media.json'), JSON.stringify(mediaJSON), function (err) {if (err) throw err; console.log('It\'s saved!');});
  fs.writeFile(path.join('media.json'), JSON.stringify(mediaJSON), function (err) {if (err) throw err; console.log('It\'s saved!');});
}
createJSON();
*/

writeFile();
