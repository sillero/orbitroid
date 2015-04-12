(function(){
  'use strict';

  var Game = function(){
    var game = this;

    game.animFrameID = null;
    game.stop = false;
    game.scene = null;
    game.camera = null;
    game.renderer = null;
    // game.squareMesh = null;
    game.ship = null;
    game.canvasWidth = null; //window.innerWidth;
    game.canvasHeight = null; //window.innerHeight;
    game.aspectRatio = null; //canvasWidth / canvasHeight;
    game.worldUnit = 20; // height in units
    game.limitLeft = null;//- (worldUnit * aspectRatio) / 2;
    game.limitRight = null; //(worldUnit * aspectRatio) / 2;
    game.direction = -1;
    game.stepX = 0.2;
    game.orbit = {
      direction: 1,
      center: { x: 0, y: 0 },
      radius: 4,
      degreesPer60Frames: 5,
      angleSpeed: function(){ return this.degreesPer60Frames * Math.PI / 180; }, // radians / second
      registeredRadian: 0,
      registeredDegree: 0
    };
  };

  Game.prototype.init = function(){
    var game = this;

    game.initializeScene();
    game.createObjects();
    game.renderScene();
    game.bindDOM();
  };

  Game.prototype.recalculateDimensions = function(){
    var game = this;

    game.canvasWidth = window.innerWidth;
    game.canvasHeight = window.innerHeight;
    game.aspectRatio = game.canvasWidth / game.canvasHeight;
    game.limitLeft = - (game.worldUnit * game.aspectRatio) / 2;
    game.limitRight = (game.worldUnit * game.aspectRatio) / 2;
    game.renderer.setSize(game.canvasWidth, game.canvasHeight);
  };

  Game.prototype.recalculateCamera = function(){
    var game = this;

    game.camera.left = - (game.worldUnit * game.aspectRatio) / 2;
    game.camera.right = (game.worldUnit * game.aspectRatio) / 2;
    game.camera.top = game.worldUnit / 2;
    game.camera.bottom = - game.worldUnit / 2;
    game.camera.near = 0;
    game.camera.far = 2;
    game.camera.updateProjectionMatrix();
    game.camera.position.set(0, 0, 2);
    game.camera.lookAt(game.scene.position);
  }

  Game.prototype.bindDOM = function(){
    var game = this;

    window.addEventListener('resize', function(){
      game.recalculateDimensions();
      game.recalculateCamera();

      window.cancelAnimationFrame(game.animFrameID);
      game.renderScene();
    });
  };

  Game.prototype.initializeScene = function(){
    var game = this;
    // if(Detector.webgl){
      game.renderer = new THREE.WebGLRenderer({antialias:true});
    // } else {
    //   renderer = new THREE.CanvasRenderer();
    // }

    game.renderer.setClearColor(0xFFFFFF, 1);

    game.recalculateDimensions();

    document.getElementById("WebGLCanvas").appendChild(game.renderer.domElement);

    game.scene = new THREE.Scene();

    game.camera = new THREE.OrthographicCamera();

    game.recalculateCamera();

    game.scene.add(game.camera);
  };

  Game.prototype.createObjects = function(){
    var game = this;
    var blackMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });
    // var squareGeometry = new THREE.Geometry();
    var shipGeometry = new THREE.Geometry();

    // squareGeometry.vertices.push(new THREE.Vector3(-1, 1));
    // squareGeometry.vertices.push(new THREE.Vector3( -1, -1));
    // squareGeometry.vertices.push(new THREE.Vector3( 1, 1));
    // squareGeometry.vertices.push(new THREE.Vector3(1, -1));
    // squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
    // squareGeometry.faces.push(new THREE.Face3(2, 1, 3));
    //
    // game.squareMesh = new THREE.Mesh(squareGeometry, blackMaterial);
    // game.squareMesh.position.set(0, 0, 0);
    // game.scene.add(game.squareMesh);

    shipGeometry.vertices.push(new THREE.Vector3(0, 0.5));
    shipGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5));
    shipGeometry.vertices.push(new THREE.Vector3(0.5, -0.5));
    shipGeometry.faces.push(new THREE.Face3(0, 1, 2));

    game.ship = new THREE.Mesh(shipGeometry, blackMaterial);
    game.ship.position.set(-game.orbit.radius, 0, 0);
    game.scene.add(game.ship);

  };

  Game.prototype.renderScene = function(){
    var game = this;

    game.animFrameID = window.requestAnimationFrame(game.renderScene.bind(game));
    if (game.stop) return;

    // var newX = game.squareMesh.position.x + (game.direction * game.stepX);
    // var newY = 0;

    // if (newX < (game.limitLeft + 1) || newX > (game.limitRight - 1)) {
    //   game.direction *= -1;
    //   return;
    // }
    // game.squareMesh.position.set(newX, newY, 0);

    game.moveShip();

    game.renderer.render(game.scene, game.camera);
  };

  /**
   * [moveShip description]
   */
  Game.prototype.moveShip = function(){
    var game = this;

    if (game.orbit.direction) {
      game.shipAction.orbitate(game.orbit.direction);
    }
    else {
      game.shipAction.inertia();
    }

  };
  Game.prototype.shipAction = {};
  /**
   * Orbitate the ship, creating a singularity
   * @param  {Number} side [-1=left, 1=right]
   * @return {[type]}      [description]
   */
  Game.prototype.shipAction.orbitate = function(side){
    // x = R cos(orbit.step * t);
    // y = R sin(orbit.step * t);

    // 5 degrees / second
    // 5 degrees / 60 frames
    //
    var game = this;
    var frameRadian = game.orbit.angleSpeed() / 60;

    // rotation over time
    game.orbit.registeredRadian += frameRadian;

    if (game.orbit.registeredRadian > 2 * Math.PI) {
      game.orbit.registeredRadian -= 2 * Math.PI;
    }

    game.orbit.registeredDegree = game.orbit.registeredRadian * 180 / Math.PI;

    var cos = Math.cos(game.orbit.registeredRadian);
    var sin = Math.sin(game.orbit.registeredRadian);
    var newX = game.orbit.center.x + (game.orbit.radius * cos);
    var newY = game.orbit.center.y + (game.orbit.radius * sin);

    // rotate triangle old school
    game.ship.geometry.vertices.forEach(function(vertex){
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

    game.ship.geometry.verticesNeedUpdate = true;
    game.ship.position.set(newX, newY, 0);

  };

  ///--------------------------
  ///--------------------------
  ///--------------------------

  var pyramid = new Game();
  var gui = new dat.GUI();

  gui.add(pyramid, 'stepX', 0.01, 1);
  gui.add(pyramid.orbit, 'degreesPer60Frames', 1, 180);
  gui.add(pyramid.orbit, 'registeredDegree').listen();

  pyramid.init();

  window.pyramid = pyramid;
})();
