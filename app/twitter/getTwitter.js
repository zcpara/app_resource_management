var fs = require('fs');
var child_process = require('child_process');
var path = require('path');
var http = require('http');
var cloudServer = require('../appconfig/cloudserver.js').server;
var cloudPort = require('../appconfig/cloudserver.js').port;

var io = require('../../main/highLevelAPI/io.js');
var sys = require('../../main/highLevelAPI/sys.js');

var logPrefix = '[user twitter getTwitter] ';

var lastMsg = null;
function action(msg) {
  if (msg=='') {
    return;
  }
  if (lastMsg != msg) {
    lastMsg = msg;
    //console.log(msg);
    try {
      process.send({'content':msg});
    } catch (ex) {
      console.log(logPrefix+'send to main process error');
      return;
    }

    sys.registerNotification(path.join(__dirname, 'media.json'), path.join(__dirname, 'app.js'));
  }
}

function query(cb) {
  var app = 'twitter';

  var options = {
    hostname: cloudServer,
    port: cloudPort,
    path: '/mug/?mugID='+mugID+'&app='+app,
    method: 'GET'
  };

  //var req = http.request(optionsProxy, function(res) {
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      if (!body.match(/^</)) {
        cb(body);
      }
    });
  });
  req.on('socket', function (socket) {
    socket.setTimeout(2000);
    socket.on('timeout', function() {
        req.abort();
    });
  });
  req.on('error', function(e) {
    //console.log('problem with request: ' + e.message);
  });
  req.end();
}
// Query info from web end

try {
  var mugID = fs.readFileSync('/etc/device_id', 'utf8');
} catch (ex) {
  console.log(logPrefix+'Cant get mug ID');
  return;
}

var timeIntervalEager = 1000;
var timeIntervalLazy = 600000;

var timerInterval = setInterval(function(){query(action)}, timeIntervalEager);

process.on('message', function(o) {
  if (o['InstantUpdate']) {
    //console.log(logPrefix+' instant update');
    query(action);
    clearInterval(timerInterval);
    timerInterval = setInterval(function(){query(action)}, timeIntervalEager);
  }
  if (o['ToBackEnd']) {
    clearInterval(timerInterval);
    timerInterval = setInterval(function(){query(action)}, timeIntervalLazy);
  }
});
