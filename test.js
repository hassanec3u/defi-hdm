AFRAME.registerComponent('enemy-spawner', {
    init: function() {
        var sceneEl = this.el;
        var enemyCount = 0;

        // Function to create a new enemy
        function createEnemy() {
            var enemyEl = document.createElement('a-entity');
            enemyEl.setAttribute('gltf-model', '#enemy');
            enemyEl.setAttribute('position', {
                x: Math.random() * 10 - 5,
                y: 1,
                z: -20 - enemyCount * 10 // Adjust the distance between enemies
            });
            enemyEl.setAttribute('scale', {
                x: 0.2,
                y: 0.2,
                z: 0.2
            });
            enemyEl.setAttribute('animation-mixer', 'clip: *'); // Add animation-mixer component for animation
            sceneEl.appendChild(enemyEl);
            enemyCount++;
        }

        // Use setInterval to create a new enemy every 5 seconds
        setInterval(createEnemy, 5000);
    }
});