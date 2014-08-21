var io = require('./highLevelAPI/io.js');
var child_process = require('child_process');
var path = require('path');

io.mug_touch_on(function(x, y, id) {
  console.log('touch event='+x+', '+y+', '+id);
  //mug_touch_on(x, y, id);
  //touchEmitter.emit("touch", x, y, id);
});
io.mug_gesture_on(io.MUG_GESTURE, function(g) {
  console.log('gesture event='+g);
  var gesture = null;
  switch(g) {
    case 1:
      gesture = 'MUG_GESTURE';
      break;
    case 2:
      gesture = 'MUG_SWIPE';
      break;
    case 3:
      gesture = 'MUG_SWIPE_LEFT';
      break;
    case 4:
      gesture = 'MUG_SWIPE_RIGHT';
      break;
    case 5:
      gesture = 'MUG_SWIPE_UP';
      break;
    case 6:
      gesture = 'MUG_SWIPE_DOWN';
      break;
    case 7:
      gesture = 'MUG_SWIPE_2';
      break;
    case 8:
      gesture = 'MUG_SWIPE_LEFT_2';
      break;
    case 9:
      gesture = 'MUG_SWIPE_RIGHT_2';
      break;
    case 10:
      gesture = 'MUG_SWIPE_UP_2';
      break;
    case 11:
      gesture = 'MUG_SWIPE_DOWN_2';
      break;
    case 12:
      gesture = 'MUG_HOLD';
      break;
    case 13:
      gesture = 'MUG_HOLD_2';
      break;
  }
  //mug_gesture_on(g);
  //touchEmitter.emit("gesture", gesture);
});

io.mug_run_touch_thread();

//var mainProcess = child_process.fork(path.join(__dirname, './main.js'));
