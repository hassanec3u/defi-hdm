AFRAME.registerComponent('bullet-collision', {
    init: function() {
        var bullet = this.el;
        var sceneEl = this.el.sceneEl;

        bullet.addEventListener('collide', function(event) {
            var targetEl = event.detail.body.el;

            if (targetEl.getAttribute('zombie') !== null) {
                console.log("Bullet hit a zombie");

                // Remove the bullet
                bullet.parentNode.removeChild(bullet);

                // Remove the zombie entity
                targetEl.parentNode.removeChild(targetEl);
            }
        });
    }
});









AFRAME.registerComponent('enemy-spawner', {
    init: function() {
        var zombieEntities = [];
        var scene = document.querySelector('a-scene');

        window.addEventListener('click', shoot);

        function shoot(event) {
            var crosshair = document.querySelector('#crosshair');
            var camera = document.querySelector('[camera]');
            var bulletEntity = document.createElement('a-entity');

            var bulletOffset = new THREE.Vector3(0, 0, -1).applyQuaternion(
                camera.object3D.quaternion
            );
            var bulletPosition = new THREE.Vector3()
                .copy(camera.object3D.position)
                .add(bulletOffset);
            bulletEntity.setAttribute('position', bulletPosition);

            var bulletRotation = new THREE.Euler().setFromQuaternion(
                camera.object3D.quaternion,
                'YXZ'
            );
            var bulletDirection = new THREE.Vector3(0, 0, -1).applyEuler(
                bulletRotation
            );
            var bulletSpeed = 5;
            var bulletMovement = bulletDirection.multiplyScalar(bulletSpeed);
            var finalPosition = bulletPosition.clone().add(bulletMovement);
            var bulletVelocity = bulletDirection.multiplyScalar(bulletSpeed);
            bulletEntity.setAttribute('velocity', bulletVelocity);

            var bulletLifespan = 1000;

            bulletEntity.setAttribute('rotation', {
                x: -90,
                y: THREE.Math.radToDeg(bulletRotation.y),
                z: 0
            });

            bulletEntity.setAttribute('animation', {
                property: 'position',
                to: `${finalPosition.x} ${finalPosition.y} ${finalPosition.z}`,
                dur: bulletLifespan,
                easing: 'linear'
            });

            bulletEntity.setAttribute('gltf-model', '#bulletModel');
            bulletEntity.setAttribute('bullet-collision', '');
            bulletEntity.setAttribute('dynamic-body', '');
            bulletEntity.setAttribute(
                'collision-filter',
                'group: bullets; collidesWith: zombies, player'
            );
            bulletEntity.setAttribute('sphere-collider', 'radius: 0.1');
            bulletEntity.setAttribute('sound', 'src', '#shootSound');
            bulletEntity.setAttribute('movement-controls', '');

            scene.appendChild(bulletEntity);

            setTimeout(function() {
                scene.removeChild(bulletEntity);
            }, bulletLifespan);
        }

        function spawnZombie(spawnPosition) {
            var zombieEntity = document.createElement('a-entity');
            zombieEntity.setAttribute('gltf-model', '#zombie');
            zombieEntity.setAttribute('animation-mixer', 'clip: *');
            zombieEntity.setAttribute('zombie', '');
            zombieEntity.setAttribute(
                'position',
                `${spawnPosition.x} ${spawnPosition.y} ${spawnPosition.z}`
            );

            zombieEntity.setAttribute('dynamic-body', '');
            zombieEntity.setAttribute('sphere-collider', 'radius: 0.5');
            scene.appendChild(zombieEntity);
            zombieEntities.push(zombieEntity);
        }

        var mapWidth = 100; // Adjust as needed
        var mapDepth = 100; // Adjust as needed
        var numberOfZombies = 11; // Adjust as needed

        for (var i = 0; i < numberOfZombies; i++) {
            var spawnPosition = {
                x: Math.random() * mapWidth - mapWidth / 2,
                y: 0,
                z: Math.random() * mapDepth - mapDepth / 2
            };
            spawnZombie(spawnPosition);
        }
    },
});

AFRAME.registerComponent('zombie', {
    init: function() {
        var zombie = this.el;
        zombie.setAttribute('kinematic-body', '');
        zombie.setAttribute('zombie-behavior', '');
    }
});


AFRAME.registerComponent('zombie-behavior', {
    init: function() {
        this.player = document.querySelector('.player');
        this.speed = 0.05; // Adjust the speed as needed
    },

    tick: function() {
        var playerPosition = this.player.getAttribute('position');
        var zombiePosition = this.el.getAttribute('position');

        var direction = new THREE.Vector3().copy(playerPosition).sub(zombiePosition);
        direction.y = 0;
        direction.normalize();

        var rotation = Math.atan2(direction.x, direction.z);

        this.el.object3D.rotation.y = rotation;
        this.el.object3D.position.add(direction.multiplyScalar(this.speed));
    },

    remove: function() {
        // Cleanup logic when zombie is removed
    }
});

window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        var player = document.querySelector('#player');
        player.components['jump-controls'].jump();
    }
});