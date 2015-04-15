module.exports = (function(){
  var Ship = require('./game.ship');
  var Game = function(){
    var game = this;

    game.animFrameID = null;
    game.stop = false;
    game.scene = null;
    game.camera = null;
    game.renderer = null;
    game.ship = null;
    game.canvasWidth = null; //window.innerWidth;
    game.canvasHeight = null; //window.innerHeight;
    game.aspectRatio = null; //canvasWidth / canvasHeight;
    game.worldUnit = 20; // height in units
    game.limitLeft = null;//- (worldUnit * aspectRatio) / 2;
    game.limitRight = null; //(worldUnit * aspectRatio) / 2;
    game.stepX = 0.2;
  };

  Game.prototype.init = function(){
    var game = this;

    game.initializeScene();
    game.createShip();
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
  };

  Game.prototype.bindDOM = function(){
    var game = this;

    window.addEventListener('resize', function(){
      window.cancelAnimationFrame(game.animFrameID);

      game.recalculateDimensions();
      game.recalculateCamera();
      game.renderScene();
    });
  };

  Game.prototype.initializeScene = function(){
    var game = this;

    if (window.WebGLRenderingContext) {
      game.renderer = new THREE.WebGLRenderer({antialias:true});
    }
    else {
      renderer = new THREE.CanvasRenderer();
    }

    game.renderer.setClearColor(0xFFFFFF, 1);

    game.recalculateDimensions();

    document.getElementById("WebGLCanvas").appendChild(game.renderer.domElement);

    game.scene = new THREE.Scene();

    game.camera = new THREE.OrthographicCamera();

    game.recalculateCamera();

    game.scene.add(game.camera);
  };

  Game.prototype.createShip = function(){
    var game = this;

    game.ship = new Ship();

    game.scene.add(game.ship.mesh);
  };

  Game.prototype.createObjects = function(){
    // var game = this;
    // var blackMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x000000,
    //   side: THREE.DoubleSide
    // });
    // // var squareGeometry = new THREE.Geometry();
    // var shipGeometry = new THREE.Geometry();
    //
    // // squareGeometry.vertices.push(new THREE.Vector3(-1, 1));
    // // squareGeometry.vertices.push(new THREE.Vector3( -1, -1));
    // // squareGeometry.vertices.push(new THREE.Vector3( 1, 1));
    // // squareGeometry.vertices.push(new THREE.Vector3(1, -1));
    // // squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
    // // squareGeometry.faces.push(new THREE.Face3(2, 1, 3));
    // //
    // // game.squareMesh = new THREE.Mesh(squareGeometry, blackMaterial);
    // // game.squareMesh.position.set(0, 0, 0);
    // // game.scene.add(game.squareMesh);
    //
    // shipGeometry.vertices.push(new THREE.Vector3(0, 0.5));
    // shipGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5));
    // shipGeometry.vertices.push(new THREE.Vector3(0.5, -0.5));
    // shipGeometry.faces.push(new THREE.Face3(0, 1, 2));
    //
    // game.ship = new THREE.Mesh(shipGeometry, blackMaterial);
    // game.ship.position.set(-game.orbit.radius, 0, 0);
    // game.scene.add(game.ship);

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

    game.ship.move();
  };

  return Game;
})();
