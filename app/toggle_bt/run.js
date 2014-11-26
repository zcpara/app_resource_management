var path = require('path');
var child_process = require('child_process');
var ui = require('../../main/highLevelAPI/io.js');
var sys = require('../../main/highLevelAPI/sys.js');
var logPrefix = '[app http] '
var os = require('os');
var IOLIB = require('../../../device');
var io = new IOLIB.IO();

var disp = io.mug_disp_init();
io.mug_disp_img(disp, __dirname + "/bt_on.bmp");
child_process.execFile("hciconfig", ["hci0", "up"], {'cwd':__dirname});

ui.touchPanel.on('touchEvent', function(e, x, y, id) {
  child_process.execFile("hciconfig", ["hci0", "down"], {'cwd':__dirname}, function(err, stdout, stderr) {
    process.exit();
  });
});
