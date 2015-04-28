module.exports = (function(){
  var Ship = require('./game.ship');
  var Obstacle = require('./game.obstacle');
  var Game = function($el){
    var game = this;

    game.$el = $el;
    game.reset();
  };

  Game.prototype.reset = function(){
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
    game.obstacles = [];
  };

  Game.prototype.restart = function(){
    var game = this;

    window.cancelAnimationFrame(game.animFrameID);

    game.$el.innerHTML = '';

    game.reset();
    game.init();
  };

  Game.prototype.init = function(){
    var game = this;

    game.initializeScene();
    game.createShip();
    game.createObstacles();
    game.renderScene();
    game.bindDOM();

    return game;
  };

  Game.prototype.instructions = function(){
    alert('Para se movimentar, utilize as setas direita e esquerda.\n\nREGRAS: não saia dos limites da tela, não bata em nenhum obstáculo, o objetivo está em verde.');
  };

  Game.prototype.recalculateDimensions = function(){
    var game = this;
    var canvasRect = game.$el.getBoundingClientRect();

    game.canvasWidth = canvasRect.width;
    game.canvasHeight = canvasRect.height;
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

  Game.prototype.printObstacles = function(){
    var game = this;
    var str = [];

    game.obstacles.forEach(function(obstacle){
      str.push('game.obstacles.push(new Obstacle({ goal: ' + obstacle.isGoal + ', size: ' + obstacle.size + ', position: ['+obstacle.mesh.position.x+', '+obstacle.mesh.position.y+'] }));');
    });

    console.log(str.join('\n'));
  };

  Game.prototype.bindDOM = function(){
    var game = this;

    // window.addEventListener('resize', function(){
    //   window.cancelAnimationFrame(game.animFrameID);
    //
    //   game.recalculateDimensions();
    //   game.recalculateCamera();
    //   game.renderScene();
    // });

    window.addEventListener('keydown', function(e){
      if (e.which === 37) {
        e.preventDefault();
        game.ship.flipOrbit(1);
      }
      if (e.which === 39) {
        e.preventDefault();
        game.ship.flipOrbit(-1);
      }
    });

    window.addEventListener('click', function(e){
      if (window.location.hash != '#edit') return;

      var unitPerPixel = game.worldUnit / game.canvasHeight;
      var x = e.pageX - (game.canvasWidth / 2);
      var y = (game.canvasHeight - e.pageY) - (game.canvasHeight / 2);
      var size = Math.random() * (1.5 - 0.25) + 0.25

      x *= unitPerPixel;
      y *= unitPerPixel;

      var obstacle = new Obstacle({ goal: e.altKey, size: size, position: [x, y] });
      game.obstacles.push(obstacle);
      game.scene.add(obstacle.mesh);
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

    game.$el.appendChild(game.renderer.domElement);

    game.scene = new THREE.Scene();

    game.camera = new THREE.OrthographicCamera();

    game.recalculateCamera();

    game.scene.add(game.camera);
  };

  Game.prototype.createShip = function(){
    var game = this;

    game.ship = new Ship({ size: 0.5 });

    game.scene.add(game.ship.mesh);
  };

  Game.prototype.createObstacles = function(){
    var game = this;

    game.obstacles.push(new Obstacle({ size: 1.381454837450292, position: [-4.051355206847361, 0.18544935805991442] }));
    game.obstacles.push(new Obstacle({ size: 1.0342515961965546, position: [-2.6248216833095577, 2.9814550641940087] }));
    game.obstacles.push(new Obstacle({ size: 0.5943710331339389, position: [0, 4.1797432239657635] }));
    game.obstacles.push(new Obstacle({ size: 0.7710792867001146, position: [5.021398002853068, 4.094151212553495] }));
    game.obstacles.push(new Obstacle({ size: 0.5310246153967455, position: [3.4522111269614837, 3.5235378031383737] }));
    game.obstacles.push(new Obstacle({ size: 0.8122508004307747, position: [7.703281027104137, 1.1840228245363766] }));
    game.obstacles.push(new Obstacle({ size: 0.5651918656658381, position: [6.191155492154066, 0.5278174037089872] }));
    game.obstacles.push(new Obstacle({ size: 0.34267436544178054, position: [4.964336661911555, -2.0684736091298146] }));
    game.obstacles.push(new Obstacle({ size: 0.611407028103713, position: [2.282453637660485, -3.723252496433666] }));
    game.obstacles.push(new Obstacle({ size: 1.4069038321613334, position: [-2.282453637660485, -4.465049928673324] }));
    game.obstacles.push(new Obstacle({ size: 0.48154832917498425, position: [-4.165477888730385, -2.1540656205420827] }));
    game.obstacles.push(new Obstacle({ size: 1.1541530985268764, position: [7.988587731811698, 3.637660485021398] }));
    game.obstacles.push(new Obstacle({ size: 0.37421253573847935, position: [3.537803138373752, 8.63052781740371] }));
    game.obstacles.push(new Obstacle({ size: 0.47102966089732945, position: [-4.251069900142653, 7.689015691868759] }));
    game.obstacles.push(new Obstacle({ size: 0.5799095926922746, position: [0.08559201141226819, 7.831669044222539] }));
    game.obstacles.push(new Obstacle({ size: 1.107233383867424, position: [-6.476462196861626, 5.206847360912982] }));
    game.obstacles.push(new Obstacle({ size: 0.9535213825292885, position: [-9.671897289586306, 0.18544935805991442] }));
    game.obstacles.push(new Obstacle({ size: 0.2521520795417018, position: [-6.590584878744651, -5.14978601997147] }));
    game.obstacles.push(new Obstacle({ size: 0.6054403290036134, position: [3.7375178316690443, -8.63052781740371] }));
    game.obstacles.push(new Obstacle({ size: 1.1580846139113419, position: [7.275320970042796, -7.118402282453638] }));
    game.obstacles.push(new Obstacle({ size: 1.1412028052145615, position: [4.4507845934379455, -6.405135520684737] }));
    game.obstacles.push(new Obstacle({ size: 1.163676866039168, position: [-1.854493580599144, -7.7460770328102715] }));
    game.obstacles.push(new Obstacle({ size: 0.5616619886714034, position: [0.2282453637660485, -7.803138373751783] }));
    game.obstacles.push(new Obstacle({ size: 0.7432951740920544, position: [1.825962910128388, -6.718972895863053] }));
    game.obstacles.push(new Obstacle({ size: 1.4456633772933856, position: [-6.419400855920114, -2.3823109843081314] }));
    game.obstacles.push(new Obstacle({ size: 0.5103178605204448, position: [-9.358059914407988, -5.178316690442226] }));
    game.obstacles.push(new Obstacle({ size: 0.2591782066738233, position: [9.243937232524965, -2.268188302425107] }));
    game.obstacles.push(new Obstacle({ size: 0.8664964564959519, position: [7.417974322396576, -3.609129814550642] }));
    game.obstacles.push(new Obstacle({ size: 0.903499951295089, position: [10.185449358059914, 5.064194008559201] }));
    game.obstacles.push(new Obstacle({ size: 0.2775511498330161, position: [6.704707560627675, 6.975748930099858] }));
    game.obstacles.push(new Obstacle({ size: 1.1519419443211518, position: [2.168330955777461, 6.690442225392297] }));
    game.obstacles.push(new Obstacle({ size: 0.3878693516016938, position: [4.536376604850214, 6.576319543509273] }));
    game.obstacles.push(new Obstacle({ size: 0.9626860041171312, position: [10.613409415121255, 7.6034236804564905] }));
    game.obstacles.push(new Obstacle({ size: 1.1489550251862966, position: [-1.9971469329529246, 6.747503566333809] }));
    game.obstacles.push(new Obstacle({ size: 0.3128190452698618, position: [7.161198288159772, -1.783166904422254] }));
    game.obstacles.push(new Obstacle({ size: 0.6349648483446799, position: [4.679029957203994, -3.894436519258203] }));
    game.obstacles.push(new Obstacle({ size: 0.8647902476368472, position: [5.706134094151213, -2.8958630527817406] }));
    game.obstacles.push(new Obstacle({ size: 0.48055120778735727, position: [5.6776034236804565, -4.950071326676177] }));
    game.obstacles.push(new Obstacle({ size: 1.2509759027161635, position: [6.419400855920114, -0.47075606276747506] }));
    game.obstacles.push(new Obstacle({ size: 0.8641670676879585, position: [6.16262482168331, -2.0399429386590584] }));
    game.obstacles.push(new Obstacle({ size: 0.4487736520823091, position: [5.877318116975749, -3.609129814550642] }));
    game.obstacles.push(new Obstacle({ size: 1.3255420016357675, position: [4.679029957203994, -4.7218259629101285] }));
    game.obstacles.push(new Obstacle({ size: 0.985112193506211, position: [2.9101283880171187, -3.894436519258203] }));
    game.obstacles.push(new Obstacle({ size: 1.190638218598906, position: [2.5392296718972895, -5.577746077032811] }));
    game.obstacles.push(new Obstacle({ size: 0.793053200817667, position: [9.557774607703282, -0.3566333808844508] }));
    game.obstacles.push(new Obstacle({ size: 0.7588493274524808, position: [8.302425106990015, -1.0699001426533523] }));
    game.obstacles.push(new Obstacle({ size: 1.2874020785093307, position: [6.390870185449359, 2.268188302425107] }));
    game.obstacles.push(new Obstacle({ size: 1.196506759210024, position: [5.449358059914408, 5.720399429386591] }));

    game.obstacles.push(new Obstacle({ goal: true, size: 0.6272208889131434, position: [8.901569186875891, -8.059914407988588] }));

    game.obstacles.forEach(function(obstacle){
      game.scene.add(obstacle.mesh);
    });
  };

  Game.prototype.renderScene = function(){
    var game = this;

    if (game.stop) return;
    game.animFrameID = window.requestAnimationFrame(game.renderScene.bind(game));
    if (game.pause) return;

    // var newX = game.squareMesh.position.x + (game.direction * game.stepX);
    // var newY = 0;

    // if (newX < (game.limitLeft + 1) || newX > (game.limitRight - 1)) {
    //   game.direction *= -1;
    //   return;
    // }
    // game.squareMesh.position.set(newX, newY, 0);

    game.moveShip();

    game.renderer.render(game.scene, game.camera);

    if (
      game.ship.mesh.position.x > game.camera.right ||
      game.ship.mesh.position.x < game.camera.left ||
      game.ship.mesh.position.y > game.camera.top ||
      game.ship.mesh.position.y < game.camera.bottom
    ) {
      alert('GAME OVER!');
      game.restart();
    }

    game.obstacles.forEach(function(obstacle){
      if (game.ship.didCollide(obstacle)) {
        if (obstacle.isGoal) {
          alert('Você chegou ao destino final!!! Parabéns!');
        }
        else {
          alert('GAME OVER!');
        }
        game.restart();
      }
    });
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
