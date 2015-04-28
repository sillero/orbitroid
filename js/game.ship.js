module.exports = (function(){
  var Ship = function(options){
    var ship = this;
    options = options || {};

    ship.options = options;

    ship.size = options.size;

    var halfSize = ship.size / 2;

    options.orbit = options.orbit || {
      direction: 1,
      center: { x: 0, y: 0 },
      radius: 2,
      degreesPerFrame: 1.5,
      getRadiansPerFrame: function(){ return this.degreesPerFrame * Math.PI / 180; },
      registeredRadian: 0,
      registeredDegree: 0
    };

    var blackMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });

    ship.geometry = new THREE.Geometry();

    ship.geometry.vertices.push(new THREE.Vector3(0, halfSize));
    ship.geometry.vertices.push(new THREE.Vector3(-halfSize, -halfSize));
    ship.geometry.vertices.push(new THREE.Vector3(halfSize, -halfSize));
    ship.geometry.faces.push(new THREE.Face3(0, 1, 2));

    ship.mesh = new THREE.Mesh(ship.geometry, blackMaterial);
    ship.mesh.position.set(-options.orbit.radius, 0, 0);
  };

  Ship.prototype.didCollide = function(obstacle){
    var ship = this;
    var getBoundingVertices = function(entity){
      var halfSize = entity.size / 2;
      
      return {
        V1: {
          x: entity.mesh.position.x - halfSize,
          y: entity.mesh.position.y + halfSize
        },
        V3: { 
          x: entity.mesh.position.x + halfSize,
          y: entity.mesh.position.y - halfSize
        }
      };
    };
    var A = getBoundingVertices(ship);
    var B = getBoundingVertices(obstacle);
    
    if (B.V1.y < A.V3.y) { return false; }

    if (B.V3.y > A.V1.y) { return false; }

    if (B.V1.x > A.V3.x) { return false; }

    return (B.V3.x >= A.V1.x);
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

  Ship.prototype.flipOrbit = function(intendedDirection){
    if (intendedDirection === this.options.orbit.direction) {
      return false;
    }

    var ship = this;
    var orbit = ship.options.orbit;
    var newCenter = { x: 0, y: 0 };
    var quarterRadian = Math.PI/2;
    var quadrant = Math.ceil(orbit.registeredRadian / quarterRadian);
    var deltaRadian, newRadian;
    var setNewOrbit = function(deltaRadian, newRadian, quadModifiers){
      orbit.center.x = ship.mesh.position.x + (quadModifiers.x * orbit.radius * Math.cos(deltaRadian));
      orbit.center.y = ship.mesh.position.y + (quadModifiers.y * orbit.radius * Math.sin(deltaRadian));
      orbit.direction *= -1;
      orbit.registeredRadian = newRadian;
    };

    if (quadrant == 1) {
      deltaRadian = orbit.registeredRadian;
      newRadian = Math.PI + deltaRadian;
      quadModifiers = { x: 1, y: 1 };
    }
    if (quadrant == 2) {
      deltaRadian = Math.PI - orbit.registeredRadian;
      newRadian = Math.PI + orbit.registeredRadian;
      quadModifiers = { x: -1, y: 1 };
    }
    if (quadrant == 3) {
      deltaRadian = orbit.registeredRadian - Math.PI;
      newRadian = deltaRadian;
      quadModifiers = { x: -1, y: -1 };
    }
    if (quadrant == 4) {
      deltaRadian = Math.PI * 2 - orbit.registeredRadian;
      newRadian = Math.PI - deltaRadian;
      quadModifiers = { x: 1, y: -1 };
    }
    if (!deltaRadian || !newRadian) { debugger; }
    setNewOrbit(deltaRadian, newRadian, quadModifiers);
  };

  Ship.prototype.movement = {};
  Ship.prototype.movement.inertia = function(){};
  Ship.prototype.movement.orbit = function(){
    var ship = this;
    var orbit = ship.options.orbit;
    var frameRadian = orbit.getRadiansPerFrame();

    // rotation over time
    orbit.registeredRadian += frameRadian * orbit.direction;

    if (orbit.registeredRadian > 2 * Math.PI) {
      orbit.registeredRadian -= 2 * Math.PI;
    }
    if (orbit.registeredRadian < 0) {
      orbit.registeredRadian = 2 * Math.PI - orbit.registeredRadian;
    }

    orbit.registeredDegree = orbit.registeredRadian * 180 / Math.PI;

    var cos = Math.cos(orbit.registeredRadian);
    var sin = Math.sin(orbit.registeredRadian);
    var newX = orbit.center.x + (orbit.radius * cos);
    var newY = orbit.center.y + (orbit.radius * sin);

    // rotate triangle old school
    ship.geometry.vertices.forEach(function(vertex){
      var fixedCos = Math.cos(frameRadian * orbit.direction);
      var fixedSin = Math.sin(frameRadian * orbit.direction);
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
    ship.mesh.position.set(newX, newY, 0);
  };

  return Ship;
})();
