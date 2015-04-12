module.exports = (function(){
  var Ship = function(options){
    var ship = this;

    ship.options = options;

    options.orbit = options.orbit || {
      direction: 1,
      center: { x: 0, y: 0 },
      radius: 4,
      degreesPer60Frames: 5,
      angleSpeed: function(){ return this.degreesPer60Frames * Math.PI / 180; }, // radians / second
      registeredRadian: 0,
      registeredDegree: 0
    };



    var blackMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });

    ship.geometry = new THREE.Geometry();

    ship.geometry.vertices.push(new THREE.Vector3(0, 0.5));
    ship.geometry.vertices.push(new THREE.Vector3(-0.5, -0.5));
    ship.geometry.vertices.push(new THREE.Vector3(0.5, -0.5));
    ship.geometry.faces.push(new THREE.Face3(0, 1, 2));

    ship.mesh = new THREE.Mesh(shipGeometry, blackMaterial);
    ship.mesh.position.set(-options.orbit.radius, 0, 0);
  };

  Ship.prototype.move = function(){
    var ship = this;

    if (ship.options.direction) {
      ship.movement.inertia.bind(ship)();
    }
    else {
      ship.movement.orbit.bind(ship)();
    }
  };

  Ship.prototype.movement = {};
  Ship.prototype.movement.inertia = function(){};
  Ship.prototype.movement.orbit = function(){
    // x = R cos(orbit.step * t);
    // y = R sin(orbit.step * t);

    // 5 degrees / second
    // 5 degrees / 60 frames
    //
    var ship = this;
    var orbit = ship.options.orbit;
    var frameRadian = orbit.angleSpeed() / 60;

    // rotation over time
    orbit.registeredRadian += frameRadian;

    if (orbit.registeredRadian > 2 * Math.PI) {
      orbit.registeredRadian -= 2 * Math.PI;
    }

    orbit.registeredDegree = orbit.registeredRadian * 180 / Math.PI;

    var cos = Math.cos(orbit.registeredRadian);
    var sin = Math.sin(orbit.registeredRadian);
    var newX = orbit.center.x + (orbit.radius * cos);
    var newY = orbit.center.y + (orbit.radius * sin);

    // rotate triangle old school
    ship.geometry.vertices.forEach(function(vertex){
      var fixedCos = Math.cos(frameRadian);
      var fixedSin = Math.sin(frameRadian);
      var newX = vertex.x * fixedCos - vertex.y * fixedSin;
      var newY = vertex.x * fixedSin + vertex.y * fixedCos;
      vertex.x = newX;
      vertex.y = newY;
    });

    // var rotationMatrix = (new THREE.Matrix3())
    //   .set(
    //     cos, -sin, 0,
    //     sin,  cos, 0,
    //       0,    0, 1
    //   );
    //
    // game.ship.geometry.vertices.forEach(function(vertex){
    //   vertex.applyMatrix3(rotationMatrix);
    // });

    ship.geometry.verticesNeedUpdate = true;
    ship.position.set(newX, newY, 0);
  };

  return Ship;
})();
