var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var utf8 = require('utf8');

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

  io.text2Img(sensor[index]+":"+value[index], color, function(image) {
    ledDisp(JSON.stringify(image), 150, false, false, ledDispEmitter);
  });
}

var handler = function(msg) {
  var data = JSON.parse(msg);
  if (typeof data.currentValue != undefined) {
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
    /*if (value) {
      display();
      index = ;
    }*/
  } else if (typeof data.fiveMinute != undefined) {
    
  } else if (typeof data.oneHour != undefined) {

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
    res.download(__dirname+'./oneHour.json');
  });
  app.get('/history', function(req, res) {
    res.download(__dirname+'./history.json');
  });
}

io.touchPanel.on('touchEvent', function(e, x, y, id) {
  if (e == 'TOUCH_HOLD') {
    process.exit();
  }
});

io.touchPanel.on('gesture', function(gesture) {
  if (gesture == 'MUG_SWIPE_RIGHT') {
    index = (index==0)?(sensor.length-1):(index-1);
    display(index);
  } else if (gesture == 'MUG_SWIPE_LEFT') {
    index = (index+1)==sensor.length?0:(index+1);
    display(index);
  }
});


module.exports = vase;
