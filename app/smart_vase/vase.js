var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var utf8 = require('utf8');
var emitter = require('events').EventEmitter;

var io = require('../../main/highLevelAPI/io.js');
var sys = require('../../main/highLevelAPI/sys.js');
var ledDisp = require('../weChat/display.js').disp;
var forceTerminate = require('../weChat/display.js').forceTerminate;
var ledDispEmitter = new emitter();

var logPrefix = '[sys vase] ';
var appReady = false;
var index = 0;
// Temperature, Humidity, Body feeling temperature, CO2, TVOC, PM2.5, AQI, Light, Sound
var sensor = ["Temperature", "Humidity", "Body Feeling Temperature", "CO2", "TVOC", "PM2.5", "AQI", "Light", "Sound"];
var value = [];

function display (index) {
  var color = null;
  if (index == 0) {
    color = "blue";
  } else if (index == 1) {
    color = "blue";
  } else if (index == 2) {
    if (value[index] < -15) {
      color = "blue";
    } else if (value[index] >= -15 && value[index] < 0) {
      color = "blue";
    } else if (value[index] >= 0 && value[index] < 10) {
      color = "cyan";
    } else if (value[index] >= 10 && value[index] < 27) {
      color = "yellow";
    } else if (value[index] >= 27 && value[index] < 32) {
      color = "yellow";
    } else if (value[index] >= 32 && value[index] < 41) {
      color = "red";
    } else if (value[index] >= 41 && value[index] < 54) {
      color = "red";
    } else if (value[index] >= 54) {
      color = "red";
    }
  } else if (index == 3) {
    if (value[index] < 700) {
      color = "green";
    } else if (value[index] >= 700 && value[index] < 1000) {
      color = "green";
    } else if (value[index] >= 1000 && value[index] < 1500) {
      color = "yellow";
    } else if (value[index] >= 1500 && value[index] < 2000) {
      color = "red";
    } else if (value[index] >= 2000 && value[index] < 3000) {
      color = "red";
    } else if (value[index] >= 3000 && value[index] < 4000) {
      color = "red";
    } else if (value[index] >= 4000 && value[index] < 8000) {
      color = "red";
    } else if (value[index] >= 8000) {
      color = "red";
    }
  } else if (index == 4) {
    if (value[index] < 0.2) {
      color = "green";
    } else if (value[index] >= 0.2 && value[index] < 0.3) {
      color = "green";
    } else if (value[index] >= 0.3 && value[index] < 0.6) {
      color = "green";
    } else if (value[index] >= 0.6 && value[index] < 3) {
      color = "yellow";
    } else if (value[index] >= 3 && value[index] < 25) {
      color = "red";
    } else if (value[index] >= 25) {
      color = "red";
    }
  } else if (index == 5) {
    if (value[index] < 50) {
      color = "green";
    } else if (value[index] >= 50 && value[index] < 100) {
      color = "green";
    } else if (value[index] >= 100 && value[index] < 150) {
      color = "yellow";
    } else if (value[index] >= 150 && value[index] < 200) {
      color = "red";
    } else if (value[index] >= 200 && value[index] < 300) {
      color = "red";
    } else if (value[index] >= 300 && value[index] < 500) {
      color = "red";
    } else if (value[index] >= 500) {
      color = "red";
    }
  } else if (index == 6) {
    if (value[index] < 50) {
      color = "green";
    } else if (value[index] >= 50 && value[index] < 100) {
      color = "yellow";
    } else if (value[index] >= 100 && value[index] < 150) {
      color = "yellow";
    } else if (value[index] >= 150 && value[index] < 200) {
      color = "red";
    } else if (value[index] >= 200 && value[index] < 300) {
      color = "red";
    } else if (value[index] >= 300 && value[index] < 500) {
      color = "red";
    } else if (value[index] >= 500) {
      color = "red";
    }
  } else if (index == 7) {
    color = "blue";
  } else if (index == 8) {
    if (value[index] < 40) {
      color = "green";
    } else if (value[index] >= 40 && value[index] < 60) {
      color = "green";
    } else if (value[index] >= 60 && value[index] < 80) {
      color = "yellow";
    } else if (value[index] >= 80 && value[index] < 100) {
      color = "orange";
    } else if (value[index] >= 100 && value[index] < 110) {
      color = "orange";
    } else if (value[index] >= 110 && value[index] < 120) {
      color = "red";
    } else if (value[index] >= 120) {
      color = "red";
    }
  }

  var colorV = null;
  if (color == "red") {
    colorV = 1;
  } else if (color == "green") {
    colorV = 2;
  } else if (color == "yellow") {
    colorV = 3;
  } else if (color == "blue") {
    colorV = 4;
  } else if (color == "purple") {
    colorV = 5;
  } else if (color == "cyan") {
    colorV = 6;
  } else if (color == "white") {
    colorV = 7;
  }
  io.text2Img("  "+sensor[index]+":"+value[index], colorV, function(image) {
    ledDisp(JSON.stringify(image), 150, false, false, ledDispEmitter);
  });
}

var handler = function(msg) {
  console.log("sensor msg="+msg+"::end");
  var data = JSON.parse(msg);
  if (data.currentValue != undefined) {
    var old_value = value[index];

    var temp = JSON.parse(data.currentValue);
    value[0] = temp.T;
    value[1] = temp.H;
    value[2] = temp.FT;
    value[3] = temp.co2;
    value[4] = temp.tvoc;
    value[5] = temp.pm25;
    value[6] = temp.aqi;
    value[7] = temp.light;
    value[8] = temp.spl;

    // trigger alarm
    if (value[3] >= 3000) { //co2
      display(3);
      index = 3;
    } else if (value[6] >= 300) { //aqi
      display(6);
      index = 6;
    } else if (value[8] >= 120) { //spl
      display(8);
      index = 8;
    } else if (value[index] != old_value) { // Update display
      display(index);
    }
  } else if (data.fiveMinute != undefined) {
    var info = fs.readFileSync(path.join(__dirname, 'oneHour.json'), 'utf8');
    var oneHour = (info!='')?JSON.parse(info):{};
    delete oneHour[data.fiveMinute.index-12];
    var tempIndex = data.fiveMinute.index;
    delete data.fiveMinute.index;
    oneHour[tempIndex] = data.fiveMinute;
    console.log("write to oneHour="+JSON.stringify(oneHour));
    fs.writeFileSync(path.join(__dirname, 'oneHour.json'), JSON.stringify(oneHour));
  } else if (data.oneHour != undefined) {
    var input = data.oneHour;
    var tempIndx = data.oneHour.index;
    //input[data.oneHour.index] = data.oneHour;
    delete input.index;
    fs.appendFileSync(path.join(__dirname, 'history.json'), "tempIndx:"JSON.stringify(input)+',');
  }
};

var timerLastTouchEvent = null;
var index = 0;
var vase = function(app) {
  timerLastTouchEvent = (new Date()).getTime();

  var getContentProcess = child_process.fork(path.join(__dirname, 'getSensor.js'));
  getContentProcess.on('message', handler);
  
  display(index);

  app.get('/currentValue', function(req, res) {
    var msg = JSON.stringify({
      'T'    : value[0],
      'H'    : value[1],
      'FT'   : value[2],
      'co2'  : value[3],
      'tvoc' : value[4],
      'pm25' : value[5],
      'aqi'  : value[6],
      'light': value[7],
      'spl'  : value[8]});
    res.send(msg);
  });

  app.get('/oneHour', function(req, res) {
    var msg = fs.readFileSync(path.join(__dirname, './oneHour.json'), 'utf8');
    res.send(msg);
    //res.download(__dirname+'./oneHour.json');
  });
  app.get('/history', function(req, res) {
    var msg = fs.readFileSync(path.join(__dirname, './history.json'), 'utf8');
    var finalMsg = '{'+msg.substring(0, msg.length-1)+'}';
    res.send(finalMsg);
    //res.download(__dirname+'./history.json');
  });
}

setInterval(function(){
  // 5 minutes
  if ((timerLastTouchEvent-(new Date()).getTime())>300000) {
    timerLastTouchEvent = (new Date()).getTime();
    index++;
    display(index);
  }
}, 10000);

io.touchPanel.on('touchEvent', function(e, x, y, id) {
  timerLastTouchEvent = (new Date()).getTime();

  if (e == 'TOUCH_HOLD') {
    process.exit();
  }
});

io.touchPanel.on('gesture', function(gesture) {
  timerLastTouchEvent = (new Date()).getTime();

  if (gesture == 'MUG_SWIPE_RIGHT') {
    index = (index==0)?(sensor.length-1):(index-1);
    display(index);
  } else if (gesture == 'MUG_SWIPE_LEFT') {
    index = (index+1)==sensor.length?0:(index+1);
    display(index);
  }
});


module.exports = vase;
