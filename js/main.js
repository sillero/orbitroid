(function(){
  'use strict';

  var Game = require('./game');

  ///--------------------------
  ///--------------------------
  ///--------------------------

  var redmatter = new Game();
  var gui = new dat.GUI();

  redmatter.init();
  window.redmatter = redmatter;

  gui.add(redmatter, 'stepX', 0.01, 1);
  gui.add(redmatter.ship.options.orbit, 'radius', 1, 4);
  gui.add(redmatter.ship.options.orbit, 'direction');
  gui.add(redmatter.ship.options.orbit, 'degreesPer60Frames', 1, 180);
  gui.add(redmatter.ship.options.orbit, 'registeredRadian').listen();
  gui.add(redmatter.ship.options.orbit, 'registeredDegree').listen();
})();
