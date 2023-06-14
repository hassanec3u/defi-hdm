AFRAME.registerComponent('bullet-collision', {
    tick: function() {
        var bullet = this.el;
        var bulletPosition = bullet.getAttribute('position');
        var zombies = document.querySelectorAll('[zombie]');

        zombies.forEach(function(zombie) {
            var zombiePosition = zombie.getAttribute('position');

            var distance = Math.sqrt(
                Math.pow(bulletPosition.x - zombiePosition.x, 2) +
                Math.pow(bulletPosition.y - zombiePosition.y, 2) +
                Math.pow(bulletPosition.z - zombiePosition.z, 2)
            );

            if (distance < 1) {
                console.log("Bullet hit a zombie");
                bullet.parentNode.removeChild(bullet);
                zombie.parentNode.removeChild(zombie);
            }

        });
    }

});

AFRAME.registerComponent('enemy-spawner', {
    init: function() {
        var spawnPositions = [
            { x: -5, y: 0, z: -10 },
            { x: 3, y: 0, z: -12 },
            { x: 1, y: 0, z: -8 }
        ];

        var zombieEntities = [];

        window.addEventListener('click', shoot);

        function shoot(event) {
            var crosshair = document.querySelector('#crosshair');
            var camera = document.querySelector('[camera]');
            var bulletEntity = document.createElement('a-entity');

            var bulletOffset = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.object3D.quaternion);
            var bulletPosition = new THREE.Vector3().copy(camera.object3D.position).add(bulletOffset);
            bulletEntity.setAttribute('position', bulletPosition);

            var bulletRotation = new THREE.Euler().setFromQuaternion(camera.object3D.quaternion, 'YXZ');
            var bulletDirection = new THREE.Vector3(0, 0, -1).applyEuler(bulletRotation);
            var bulletSpeed = 5;
            var bulletMovement = bulletDirection.multiplyScalar(bulletSpeed);
            var finalPosition = bulletPosition.clone().add(bulletMovement);
            var bulletVelocity = bulletDirection.multiplyScalar(bulletSpeed);
            bulletEntity.setAttribute('velocity', bulletVelocity);

            bulletEntity.setAttribute('rotation', {
                x: -90,
                y: THREE.Math.radToDeg(bulletRotation.y),
                z: 0
            });

            bulletEntity.setAttribute('animation', {
                property: 'position',
                to: finalPosition.x + ' ' + finalPosition.y + ' ' + finalPosition.z,
                dur: bulletLifespan,
                easing: 'linear'
            });


            bulletEntity.setAttribute('gltf-model', '#bulletModel');
            bulletEntity.setAttribute('bullet-collision', '');

            bulletEntity.setAttribute('dynamic-body', '');
            zombieEntity.setAttribute('collision-filter', 'group: zombies; collidesWith: bullets, player');

            bulletEntity.setAttribute('sphere-collider', 'radius: 0.1');
            bulletEntity.setAttribute('sound', 'src', '#shootSound');
            bulletEntity.setAttribute('movement-controls', ''); // Add movement-controls component

            var scene = document.querySelector('a-scene');
            scene.appendChild(bulletEntity);

            var bulletLifespan = 1000;
            setTimeout(function() {
                scene.removeChild(bulletEntity);
            }, bulletLifespan);
        }

        for (var i = 0; i < spawnPositions.length; i++) {
            var spawnPosition = spawnPositions[i];
            var zombieEntity = document.createElement('a-entity');
            zombieEntity.setAttribute('gltf-model', '#zombie');
            zombieEntity.setAttribute('animation-mixer', 'clip: *');
            zombieEntity.setAttribute('zombie', '');
            zombieEntity.setAttribute('position', spawnPosition.x + ' ' + spawnPosition.y + ' ' + spawnPosition.z);

            zombieEntity.setAttribute('static-body', '');
            var scene = document.querySelector('a-scene');
            scene.appendChild(zombieEntity);
            zombieEntities.push(zombieEntity);
        }
    }
});

AFRAME.registerComponent('zombie', {
    init: function() {
        var zombie = this.el;
        zombie.setAttribute('dynamic-body', '');
        zombie.setAttribute('sphere-collider', 'radius: 0.5');

    }
});