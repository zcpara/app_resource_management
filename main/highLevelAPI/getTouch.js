var fs = require('fs');
var path = require('path');
var io = require('./io.js');
var touchHandle = io.mug_touch_init();

//var touchEventEmitter = require('../resManagerEventEmitter.js').touchEventEmitter;
/*io.mug_touch_on(function(x, y, id) {
  fs.appendFileSync(path.join(__dirname, '../touchEvent.json'), JSON.stringify({'touch':[x, y, id]})+'\n');
});
*/
/*
io.mug_touch_event_on(touchHandle, io.TOUCH_HOLD, function(e, x, y, id) {
  //fs.appendFileSync(path.join(__dirname, '../touchEvent.json'), JSON.stringify({'touchEvent':[e, x, y, id]})+'\n');
  touchEventEmitter.emit("touchEvent", e, x, y, id);
});

io.mug_touch_event_on(touchHandle, io.TOUCH_CLICK, function(e, x, y, id) {
  //fs.appendFileSync(path.join(__dirname, '../touchEvent.json'), JSON.stringify({'touchEvent':[e, x, y, id]})+'\n');
  touchEventEmitter.emit("touchEvent", e, x, y, id);
});

io.mug_gesture_on(touchHandle, io.MUG_GESTURE, function(g, info) {
  //fs.appendFileSync(path.join(__dirname, '../touchEvent.json'), JSON.stringify({'gesture':g})+'\n');
  touchEmitter.emit("gesture", g);
});

io.mug_run_touch_thread(touchHandle);
*/


io.mug_touch_event_on(touchHandle, io.TOUCH_HOLD, function(e, x, y, id) {
  fs.appendFileSync(path.join(__dirname, '../touchEvent.json'), JSON.stringify({'touchEvent':[e, x, y, id]})+'\n');
});

io.mug_touch_event_on(touchHandle, io.TOUCH_CLICK, function(e, x, y, id) {
  fs.appendFileSync(path.join(__dirname, '../touchEvent.json'), JSON.stringify({'touchEvent':[e, x, y, id]})+'\n');
});

io.mug_gesture_on(touchHandle, io.MUG_GESTURE, function(g, info) {
  fs.appendFileSync(path.join(__dirname, '../touchEvent.json'), JSON.stringify({'gesture':g})+'\n');
});

io.mug_run_touch_thread(touchHandle);

