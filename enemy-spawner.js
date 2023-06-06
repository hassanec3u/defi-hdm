AFRAME.registerComponent('enemy-spawner', {
    init: function() {
        var sceneEl = this.el;

        // Fonction pour créer un nouvel ennemi
        function createEnemy() {
            var enemyEl = document.createElement('a-box');
            enemyEl.setAttribute('color', 'red');
            enemyEl.setAttribute('position', {
                x: 5,
                y: 1,
                z:5
            });
            sceneEl.appendChild(enemyEl);
        }

        // Utilisation de setInterval pour créer un nouvel ennemi toutes les 5 secondes
        setInterval(createEnemy, 5000);
        console.log("Le composant enemy-spawner est initialisé.");

    }
});

