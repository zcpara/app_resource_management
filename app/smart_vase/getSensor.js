var fs = require('fs');
var path = require('path');
var http = require('http');
var child_process = require('child_process');

var io = require('../../main/highLevelAPI/io.js');
var sys = require('../../main/highLevelAPI/sys.js');

io.vase_init();

var fiveMinute = {
      'T'    : 0,
      'H'    : 0,
      'FT'   : 0,
      'co2'  : 0,
      'tvoc' : 0,
      'pm25' : 0,
      'aqi'  : 0,
      'light': 0,
      'spl'  : 0,
      'count': 0,
      'index': -1};
var oneHour = {
      'T'    : 0,
      'H'    : 0,
      'FT'   : 0,
      'co2'  : 0,
      'tvoc' : 0,
      'pm25' : 0,
      'aqi'  : 0,
      'light': 0,
      'spl'  : 0,
      'count': 0,
      'index': -1};
fiveMinute.index = parseInt((new Date()).getMinutes()/5);
oneHour.indx = (new Date()).getHoure();

var lastMsg = null;
setInterval(function() {
  //var sensorMsg = io.get_vase_json();
  var sensorMsg = JSON.stringify({T:1, H:2, FT:3, co2:4, tvoc:5, pm25:6, aqi:7, light:8, spl:9});
  if (lastMsg == null) {
    lastMsg = sensorMsg;
    //process.send({'content':JSON.stringify({'sensor':sensorMsg})});
    process.send(JSON.stringify({'currentValue':sensorMsg}));
  } else if (lastMsg != sensorMsg) {
    //process.send({'content':JSON.stringify({'sensor':sensorMsg})});
    process.send({'currentValue':sensorMsg}));
  }
  var data = JSON.parse(sensorMsg);

  var minuteIndex = parseInt((new Date()).getMinutes()/5);
  if (minuteIndex != fiveMinute.index) {
    process.send(JSON.stringify({'fiveMinute:'{
      'T'    : fiveMinute.T/fiveMinute.count,
      'H'    : fiveMinute.H/fiveMinute.count,
      'FT'   : fiveMinute.FT/fiveMinute.count,
      'co2'  : fiveMinute.co2/fiveMinute.count,
      'tvoc' : fiveMinute.tvoc/fiveMinute.count,
      'pm25' : fiveMinute.pm25/fiveMinute.count,
      'aqi'  : fiveMinute.aqi/fiveMinute.count,
      'light': fiveMinute.light/fiveMinute.count,
      'spl'  : fiveMinute.spl/fiveMinute.count
    }}));
    fiveMinute.T = data.T;
    fiveMinute.H = data.H;
    fiveMinute.FT = data.FT;
    fiveMinute.co2 = data.co2;
    fiveMinute.tvoc = data.tvoc;
    fiveMinute.pm25 = data.pm25;
    fiveMinute.aqi = data.aqi;
    fiveMinute.light = data.light;
    fiveMinute.sql = data.sql;
    fiveMinute.count = 1;
    fiveMinute.index = minuteIndex;
  } else {
    fiveMinute.T += data.T;
    fiveMinute.H += data.H;
    fiveMinute.FT += data.FT;
    fiveMinute.co2 += data.co2;
    fiveMinute.tvoc += data.tvoc;
    fiveMinute.pm25 += data.pm25;
    fiveMinute.aqi += data.aqi;
    fiveMinute.light += data.light;
    fiveMinute.sql += data.sql;
    fiveMinute.count += 1;
    //fiveMinute.index = minuteIndex;
  }

  if ((new Date()).getHour() != oneHour.index) {
    process.send(JSON.stringify({'oneHour:'{
      'T'    : oneHour.T/oneHour.count,
      'H'    : oneHour.H/oneHour.count,
      'FT'   : oneHour.FT/oneHour.count,
      'co2'  : oneHour.co2/oneHour.count,
      'tvoc' : oneHour.tvoc/oneHour.count,
      'pm25' : oneHour.pm25/oneHour.count,
      'aqi'  : oneHour.aqi/oneHour.count,
      'light': oneHour.light/oneHour.count,
      'spl'  : oneHour.spl/oneHour.count
    }}));
    oneHour.T = data.T;
    oneHour.H = data.H;
    oneHour.FT = data.FT;
    oneHour.co2 = data.co2;
    oneHour.tvoc = data.tvoc;
    oneHour.pm25 = data.pm25;
    oneHour.aqi = data.aqi;
    oneHour.light = data.light;
    oneHour.sql = data.sql;
    oneHour.count = 1;
    oneHour.index = (new Date()).getHour();
  } else {
    oneHour.T += data.T;
    oneHour.H += data.H;
    oneHour.FT += data.FT;
    oneHour.co2 += data.co2;
    oneHour.tvoc += data.tvoc;
    oneHour.pm25 += data.pm25;
    oneHour.aqi += data.aqi;
    oneHour.light += data.light;
    oneHour.sql += data.sql;
    oneHour.count += 1;
    //oneHour.index = minuteIndex;
  }
}, 1000);
