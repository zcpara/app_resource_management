var childProcess = require('child_process');

var system = function(){}

var sys = new system();
sys.exit = require('./exitApp.js');
sys.escape = require('./escapeApp.js');
sys.newApp = require('./newApp.js');

module.exports = sys;