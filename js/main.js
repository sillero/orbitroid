(function(){
  'use strict';

  var Game = require('./game');

  ///--------------------------
  ///--------------------------
  ///--------------------------

  var orbitroid = new Game(document.getElementById('WebGLCanvas'));
  // var gui = new dat.GUI();

  orbitroid
    .init()
    .instructions();

  window.orbitroid = orbitroid;

  // gui.add(orbitroide, 'stepX', 0.01, 1);
  // gui.add(orbitroide.ship.options.orbit, 'radius', 1, 4);
  // gui.add(orbitroide.ship.options.orbit, 'direction').listen();
  // gui.add(orbitroide.ship.options.orbit, 'degreesPerFrame', 1, 5);
  // gui.add(orbitroide.ship.options.orbit, 'registeredRadian').listen();
  // gui.add(orbitroide.ship.options.orbit, 'registeredDegree').listen();
})();
