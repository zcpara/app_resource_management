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
fiveMinute.index = parseInt((new Date()).getTime()/(5*60*1000)); //parseInt((new Date()).getMinutes()/5);
oneHour.index = parseInt((new Date()).getTime()/(60*60*1000)); //(new Date()).getHours();

var lastMsg = null;
setInterval(function() {
  var sensorMsg = io.get_vase_json();
  //var sensorMsg = JSON.stringify({T:123.34, H:8888, FT:-888, co2:4, tvoc:5, pm25:6, aqi:7, light:8, spl:9});

  var data = JSON.parse(sensorMsg);

  // data conversion
  if (data.T>=10000) data.T = 9999.9;
  if (data.T<=-1000) data.T = -999.9;
  data.T = parseFloat(data.T.toFixed(1));

  if (data.H>=10000) data.H = 9999.9;
  if (data.H<=-1000) data.H = -999.9;
  data.H = parseFloat(data.H.toFixed(1));

  if (data.FT>=10000) data.FT = 9999.9;
  if (data.FT<=-1000) data.FT = -999.9;
  data.FT = parseFloat(data.FT.toFixed(1));

  if (data.co2>=100000) data.co2 = 99999;
  if (data.co2<0) data.co2 = 0;
  data.co2 = parseInt(data.co2.toFixed(0));

  data.tvoc = data.tvoc/1000*4;
  if (data.tvoc>=1000) data.tvoc = 999;
  if (data.tvoc<0) data.tvoc = 0;
  data.tvoc = parseFloat(data.tvoc.toFixed(2));

  if (data.pm25>=10000) data.pm25 = 9999.9;
  if (data.pm25<=-1000) data.pm25 = -999.9;
  data.pm25 = parseFloat(data.pm25.toFixed(1));

  if (data.aqi>=100000) data.aqi = 99999;
  if (data.aqi<0) data.aqi = 0;
  data.aqi = parseInt(data.aqi.toFixed(0));

  if (data.light>=100000) data.light = 99999;
  if (data.light<0) data.light = 0;
  data.light = parseInt(data.light.toFixed(0));

  if (data.spl>=100000) data.spl = 99999;
  if (data.spl<=0) 
  {
       data.spl = 40 + 10.0*Math.random();
  }
  data.spl = parseInt(data.spl.toFixed(0));

  sensorMsg = JSON.stringify(data);

  if (lastMsg == null) {
    lastMsg = sensorMsg;
    process.send(JSON.stringify({'currentValue':sensorMsg}));
  } else if (lastMsg != sensorMsg) {
    process.send(JSON.stringify({'currentValue':sensorMsg}));
  }
  var data = JSON.parse(sensorMsg);

  var minuteIndex = parseInt((new Date()).getTime()/(5*60*1000)); //parseInt((new Date()).getMinutes()/5);
  if (minuteIndex != fiveMinute.index) {
    if (fiveMinute.count != 0) {
      process.send(JSON.stringify({'fiveMinute':{
        'T'    : fiveMinute.T/fiveMinute.count,
        'H'    : fiveMinute.H/fiveMinute.count,
        'FT'   : fiveMinute.FT/fiveMinute.count,
        'co2'  : fiveMinute.co2/fiveMinute.count,
        'tvoc' : fiveMinute.tvoc/fiveMinute.count,
        'pm25' : fiveMinute.pm25/fiveMinute.count,
        'aqi'  : fiveMinute.aqi/fiveMinute.count,
        'light': fiveMinute.light/fiveMinute.count,
        'spl'  : fiveMinute.spl/fiveMinute.count,
        'index': fiveMinute.index
      }}));
    }
    fiveMinute.T = data.T;
    fiveMinute.H = data.H;
    fiveMinute.FT = data.FT;
    fiveMinute.co2 = data.co2;
    fiveMinute.tvoc = data.tvoc;
    fiveMinute.pm25 = data.pm25;
    fiveMinute.aqi = data.aqi;
    fiveMinute.light = data.light;
    fiveMinute.spl = data.spl;
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
    fiveMinute.spl += data.spl;
    fiveMinute.count += 1;
    //fiveMinute.index = minuteIndex;
  }

  var hourIndex = parseInt((new Date()).getTime()/(60*60*1000));
//  var hourIndex = parseInt((new Date()).getTime()/(40*1000));
  if (hourIndex != oneHour.index) {
    if (oneHour.count != 0) {
      process.send(JSON.stringify({'oneHour':{
        'T'    : oneHour.T/oneHour.count,
        'H'    : oneHour.H/oneHour.count,
        'FT'   : oneHour.FT/oneHour.count,
        'co2'  : oneHour.co2/oneHour.count,
        'tvoc' : oneHour.tvoc/oneHour.count,
        'pm25' : oneHour.pm25/oneHour.count,
        'aqi'  : oneHour.aqi/oneHour.count,
        'light': oneHour.light/oneHour.count,
        'spl'  : oneHour.spl/oneHour.count,
        'index': oneHour.index
      }}));
    }
    oneHour.T = data.T;
    oneHour.H = data.H;
    oneHour.FT = data.FT;
    oneHour.co2 = data.co2;
    oneHour.tvoc = data.tvoc;
    oneHour.pm25 = data.pm25;
    oneHour.aqi = data.aqi;
    oneHour.light = data.light;
    oneHour.spl = data.spl;
    oneHour.count = 1;
    oneHour.index = hourIndex;
  } else {
    oneHour.T += data.T;
    oneHour.H += data.H;
    oneHour.FT += data.FT;
    oneHour.co2 += data.co2;
    oneHour.tvoc += data.tvoc;
    oneHour.pm25 += data.pm25;
    oneHour.aqi += data.aqi;
    oneHour.light += data.light;
    oneHour.spl += data.spl;
    oneHour.count += 1;
    //oneHour.index = minuteIndex;
  }
}, 1000);
