(function(){
  'use strict';

  var Game = function(){
    var self = this;

    self.animFrameID = null;
    self.stop = false;
    self.scene = null;
    self.camera = null;
    self.renderer = null;
    self.squareMesh = null;
    self.canvasWidth = null; //window.innerWidth;
    self.canvasHeight = null; //window.innerHeight;
    self.aspectRatio = null; //canvasWidth / canvasHeight;
    self.worldUnit = 20; // height in units
    self.limitLeft = null;//- (worldUnit * aspectRatio) / 2;
    self.limitRight = null; //(worldUnit * aspectRatio) / 2;
    self.direction = -1;
    self.stepX = 0.2;
  };

  Game.prototype.init = function(){
    var self = this;

    self.initializeScene();
    self.createObjects();
    self.renderScene();
    self.bindDOM();
  };

  Game.prototype.recalculateDimensions = function(){
    var self = this;

    self.canvasWidth = window.innerWidth;
    self.canvasHeight = window.innerHeight;
    self.aspectRatio = self.canvasWidth / self.canvasHeight;
    self.limitLeft = - (self.worldUnit * self.aspectRatio) / 2;
    self.limitRight = (self.worldUnit * self.aspectRatio) / 2;
    self.renderer.setSize(self.canvasWidth, self.canvasHeight);
  };

  Game.prototype.recalculateCamera = function(){
    var self = this;
    
    self.camera.left = - (self.worldUnit * self.aspectRatio) / 2;
    self.camera.right = (self.worldUnit * self.aspectRatio) / 2;
    self.camera.top = self.worldUnit / 2;
    self.camera.bottom = - self.worldUnit / 2;
    self.camera.near = 1;
    self.camera.far = 2;
    self.camera.updateProjectionMatrix();
    self.camera.position.set(0, 0, 2);
    self.camera.lookAt(self.scene.position);
  }

  Game.prototype.bindDOM = function(){
    var self = this;

    window.addEventListener('resize', function(){
      self.recalculateDimensions();
      self.recalculateCamera();

      window.cancelAnimationFrame(self.animFrameID);
      self.renderScene();
    });
  };

  Game.prototype.initializeScene = function(){
    var self = this;
    // if(Detector.webgl){
      self.renderer = new THREE.WebGLRenderer({antialias:true});
    // } else {
    //   renderer = new THREE.CanvasRenderer();
    // }

    self.renderer.setClearColor(0xFFFFFF, 1);

    self.recalculateDimensions();

    document.getElementById("WebGLCanvas").appendChild(self.renderer.domElement);

    self.scene = new THREE.Scene();

    self.camera = new THREE.OrthographicCamera();

    self.recalculateCamera();

    self.scene.add(self.camera);
  };

  Game.prototype.createObjects = function(){
    var self = this;
    var squareGeometry = new THREE.Geometry();
    squareGeometry.vertices.push(new THREE.Vector3(-1.0, 1.0, 0.0));
    squareGeometry.vertices.push(new THREE.Vector3( -1.0, -1.0, 0.0));
    squareGeometry.vertices.push(new THREE.Vector3( 1.0, 1.0, 0.0));
    squareGeometry.vertices.push(new THREE.Vector3(1.0, -1.0, 0.0));
    squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
    squareGeometry.faces.push(new THREE.Face3(2, 1, 3));

    var squareMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });

    self.squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
    // -----------

    self.squareMesh.position.set(0, 0, 0);

    self.scene.add(self.squareMesh);
  };

  Game.prototype.renderScene = function(){
    var self = this;

    self.animFrameID = window.requestAnimationFrame(self.renderScene.bind(self));
    if (self.stop) return;

    var newX = self.squareMesh.position.x + (self.direction * self.stepX);
    var newY = 0;

    if (newX < (self.limitLeft + 1) || newX > (self.limitRight - 1)) {
      self.direction *= -1;
      return;
    }
    self.squareMesh.position.set(newX, newY, 0);
    self.renderer.render(self.scene, self.camera);
  };

  ///--------------------------
  ///--------------------------
  ///--------------------------

  var pyramid = new Game();
  var gui = new dat.GUI();

  gui.add(pyramid, 'stepX', 0.01, 1);

  pyramid.init();
})();
