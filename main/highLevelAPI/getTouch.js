var fs = require('fs');
var path = require('path');

var io = require('./io.js');
var touchHandle = io.mug_touch_init();

io.mug_touch_event_on(touchHandle, io.TOUCH_HOLD, function(e, x, y, id) {
  process.send({"touchEvent":{"e":e, "x":x, "y":y, "id":id}});
});

io.mug_touch_event_on(touchHandle, io.TOUCH_CLICK, function(e, x, y, id) {
  process.send({"touchEvent":{"e":e, "x":x, "y":y, "id":id}});
});

io.mug_gesture_on(touchHandle, io.MUG_GESTURE, function(g, info) {
  process.send({"gesture":g});
});

io.mug_run_touch_thread(touchHandle);
