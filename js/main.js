(function(){
  'use strict';

  var Game = require('./game');

  ///--------------------------
  ///--------------------------
  ///--------------------------

  var pyramid = new Game();
  var gui = new dat.GUI();

  gui.add(pyramid, 'stepX', 0.01, 1);
  gui.add(pyramid.ship.options.orbit, 'degreesPer60Frames', 1, 180);
  gui.add(pyramid.ship.options.orbit, 'registeredDegree').listen();

  pyramid.init();

  window.pyramid = pyramid;
})();
