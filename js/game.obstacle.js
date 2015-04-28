module.exports = (function(){
    var Obstacle = function(options){
        var obstacle = this;
        var blackMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000,
          side: THREE.DoubleSide
        });
        var greenMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          side: THREE.DoubleSide
        });
        var halfSize = options.size / 2;

        obstacle.options = options;
        obstacle.size = options.size;
        obstacle.isGoal = options.goal;

        obstacle.geometry = new THREE.Geometry();

        obstacle.geometry.vertices.push(new THREE.Vector3(-halfSize, halfSize));
        obstacle.geometry.vertices.push(new THREE.Vector3(-halfSize, -halfSize));
        obstacle.geometry.vertices.push(new THREE.Vector3(halfSize, -halfSize));
        obstacle.geometry.vertices.push(new THREE.Vector3(halfSize, halfSize));
        obstacle.geometry.faces.push(new THREE.Face3(0, 1, 3));
        obstacle.geometry.faces.push(new THREE.Face3(2, 1, 3));

        obstacle.mesh = new THREE.Mesh(obstacle.geometry, (options.goal ? greenMaterial : blackMaterial));
        obstacle.mesh.position.set(options.position[0], options.position[1], 0);
    };

    return Obstacle;
})();
