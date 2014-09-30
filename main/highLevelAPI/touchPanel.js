// For end user app to receive touch screen event, only the front end app can receive
var util = require("util");
var EventEmitter = require("events").EventEmitter;

var context = require('./context.js');
//var escapeApp = require('./escapeApp.js');

var logPrefix = '[sys touchPanel] ';

var touchPanel = function() {};
util.inherits(touchPanel,EventEmitter);
var tp = new touchPanel();
//tp.disableTouch = false;
tp.touchEventListener = null;
tp.gestureListener = null;
//tp.appHandleEscape = false;

process.on('message', function(o) {
  //console.log(logPrefix+'tp.disableTouch='+tp.disableTouch+process.pid);
  // When re-enter one app, because when new aother app in this app, these will be set
  //if (o['enableTouch']) {
    //tp.disableTouch = false;
    if (tp.touchEventListener != null) {
      if (tp.listeners('touchEvent').length != 0) {
        console.log(logPrefix+'!! error touchEventListener');
      }
      while(true) {
        var length = tp.touchEventListener.length;
        for (var i=0; i<length; i++) {
          for (var j=(i+1); j<length; j++) {
            if (tp.touchEventListener[i] == tp.touchEventListener[j]) {
              tp.touchEventListener.splice(i, 1);
              //console.log('delete one repeat listener');
              break;
            }
          }
          if (j<length) {
            break;
          }
        }
        if (i==length) {
          break;
        }
      }
      for (var i=0; i<tp.touchEventListener.length; i++) {
        tp.on('touchEvent', tp.touchEventListener[i]);
        //console.log(logPrefix+'restore touchEventListener'+process.pid);
      }
      tp.touchEventListener = null;
    }
    if (tp.gestureListener != null) {
      if (tp.listeners('gesture').length != 0) {
        console.log(logPrefix+'!! error gesture');
      }
      while(true) {
        var length = tp.gestureListener.length;
        for (var i=0; i<length; i++) {
          for (var j=(i+1); j<length; j++) {
            if (tp.gestureListener[i] == tp.gestureListener[j]) {
              //console.log('delete one repeat listener');
              tp.gestureListener.splice(i, 1);
              break;
            }
          }
          if (j<length) {
            break;
          }
        }
        if (i==length) {
          break;
        }
      }
      for (var i=0; i<tp.gestureListener.length; i++) {
        tp.on('gesture', tp.gestureListener[i]);
        //console.log(logPrefix+'restore gestureListener'+process.pid);
      }
      tp.gestureListener = null;
    }
  //}

  //if (tp.disableTouch) {
  //  return;
  //}
  if (o['mug_touchevent_on']) {
    //console.log(logPrefix+'o[mug_touchevent_on]='+o['mug_touchevent_on'][0]);
    // OS in app handle the escape
    if (o['mug_touchevent_on'][0] == 'TOUCH_HOLD') {
      console.log(logPrefix+'send a escape to OS');
      process.send({'escape':context});
      //escapeApp();
    }
    if (o['mug_touchevent_on'][0] == 'IMPLICIT_NEW') {
      process.send({'newApp': {'app':o['mug_touchevent_on'][1], 'context':context}});
      o['mug_touchevent_on'][0] = 'TOUCH_HOLD';
      //process.send({'newApp':context});
    }

    tp.emit('touchEvent',
      o['mug_touchevent_on'][0],
      o['mug_touchevent_on'][1],
      o['mug_touchevent_on'][2],
      o['mug_touchevent_on'][3]);
  }
  if (o['mug_gesture_on']) {
    tp.emit('gesture', o['mug_gesture_on']);
  }
});

module.exports = tp;
