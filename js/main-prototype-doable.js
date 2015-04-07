(function(){
  var animFrameID;
  var stop = false;
  var scene;
  var camera;
  var renderer;
  var squareMesh;
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight;
  var aspectRatio = canvasWidth / canvasHeight;
  var worldUnit = 20; // height in units
  var limitLeft = - (worldUnit * aspectRatio) / 2;
  var limitRight = (worldUnit * aspectRatio) / 2;
  var direction = -1;
  var stepX = 0.2;

  initializeScene();

  createObjects();

  renderScene();

  window.addEventListener('resize', onResize);

  function onResize(){
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    aspectRatio = canvasWidth / canvasHeight;
    limitLeft = - (worldUnit * aspectRatio) / 2;
    limitRight = (worldUnit * aspectRatio) / 2;

    renderer.setSize(canvasWidth, canvasHeight);
    camera.left = - (worldUnit * aspectRatio) / 2;
    camera.right = (worldUnit * aspectRatio) / 2;
    camera.top = worldUnit / 2;
    camera.bottom = - worldUnit / 2;
    camera.updateProjectionMatrix();

    camera.position.set(0, 0, 2);

    window.cancelAnimationFrame(animFrameID);
    renderScene();
  }

  function initializeScene(){
    // if(Detector.webgl){
      renderer = new THREE.WebGLRenderer({antialias:true});
    // } else {
    //   renderer = new THREE.CanvasRenderer();
    // }

    // Set the background color of the renderer to black, with full opacity
    renderer.setClearColor(0xFFFFFF, 1);

    // Get the size of the inner window (content area) to create a full size renderer


    // Set the renderers size to the content areas size
    renderer.setSize(canvasWidth, canvasHeight);

    document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    //create.camera(worldUnit)
    //understand cameras here https://www.packtpub.com/books/content/working-basic-components-make-threejs-scene

    camera = new THREE.OrthographicCamera(
      - (worldUnit * aspectRatio) / 2, (worldUnit * aspectRatio) / 2,
      worldUnit / 2, - worldUnit / 2,
      1, 2);

    // camera.position.x = 0;
    // camera.position.y = 0;
    // camera.position.z = 2;
    // camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
    camera.position.set(0, 0, 2);
    camera.lookAt(scene.position);
    scene.add(camera);
  }
  function createObjects(){
    // var triangleGeometry = new THREE.Geometry();
    // triangleGeometry.vertices.push(new THREE.Vector3( 0.0, 1.0, 0.0));
    // triangleGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
    // triangleGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0));
    // triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
    //
    // var triangleMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x000000,
    //   side: THREE.DoubleSide
    // });
    //
    // var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    //
    // triangleMesh.position.set(-1.5, 0.0, 4.0);
    // scene.add(triangleMesh);

    // create.square(vertex1, vertex2, vertex3, vertex4, color[, position]);
    // create(type, ...vertices, color[,position]);
    // return THREE.Mesh
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
    squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
    // -----------

    squareMesh.position.set(0, 0, 0);

    scene.add(squareMesh);
  }

  function renderScene(){
    animFrameID = window.requestAnimationFrame(renderScene);
    if (stop) return;
    // var newX = Math.round(Math.random() * 4 * 100) / 100;
    // var newY = Math.round(Math.random() * 4 * 100) / 100;
    // console.log(rand);
    // var newX = squareMesh.position.x + (direction * -1) + (direction * stepX);
    var newX = squareMesh.position.x + (direction * stepX);
    // console.log(direction, stepX);
    var newY = 0;

    if (newX < (limitLeft + 1) || newX > (limitRight - 1)) {
      direction *= -1;
      return;
    }
    // console.log(newX);
    squareMesh.position.set(newX, newY, 0);
    renderer.render(scene, camera);
  }

})();
