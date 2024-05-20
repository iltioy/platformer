const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
};

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                })
            );
        }
    });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                    height: 16,
                })
            );
        }
    });
});

const gravity = 0.1;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./assets/background.png",
});

const player = new Player({
    position: {
        x: 100,
        y: 300,
    },
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: "./assets/sprites/warrior/Idle.png",
    framerate: 8,
    animations: {
        Idle: {
            imageSrc: "./assets/sprites/warrior/Idle.png",
            framerate: 8,
            frameBuffer: 15,
        },
        IdleLeft: {
            imageSrc: "./assets/sprites/warrior/IdleLeft.png",
            framerate: 8,
            frameBuffer: 15,
        },
        Run: {
            imageSrc: "./assets/sprites/warrior/Run.png",
            framerate: 8,
            frameBuffer: 15,
        },
        RunLeft: {
            imageSrc: "./assets/sprites/warrior/RunLeft.png",
            framerate: 8,
            frameBuffer: 15,
        },
        Jump: {
            imageSrc: "./assets/sprites/warrior/Jump.png",
            framerate: 2,
            frameBuffer: 2,
        },
        JumpLeft: {
            imageSrc: "./assets/sprites/warrior/JumpLeft.png",
            framerate: 2,
            frameBuffer: 2,
        },
        Fall: {
            imageSrc: "./assets/sprites/warrior/Fall.png",
            framerate: 2,
            frameBuffer: 2,
        },
        FallLeft: {
            imageSrc: "./assets/sprites/warrior/FallLeft.png",
            framerate: 2,
            frameBuffer: 2,
        },
    },
});

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
};

const bgImageHeight = 432;

const camera = {
    position: {
        x: 0,
        y: -bgImageHeight + scaledCanvas.height,
    },
};

const animate = () => {
    window.requestAnimationFrame(animate);

    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.scale(4, 4);
    c.translate(camera.position.x, camera.position.y);
    background.update();
    // collisionBlocks.forEach((block) => block.update());
    // platformCollisionBlocks.forEach((block) => block.update());

    player.checkForHorizontalCanvasCollision();
    player.update();

    player.velocity.x = 0;
    if (keys.d.pressed) {
        player.switchSprite("Run");
        player.velocity.x = 1;
        player.lastDirection = "right";
        player.shouldPinCameraToTheLeft({ canvas, camera });
    } else if (keys.a.pressed) {
        player.switchSprite("RunLeft");
        player.velocity.x = -1;
        player.lastDirection = "left";
        player.shouldPinCameraToTheRight({ canvas, camera });
    } else if (player.velocity.y === 0) {
        if (player.lastDirection === "right") player.switchSprite("Idle");
        else player.switchSprite("IdleLeft");
    }

    if (player.velocity.y < 0) {
        player.shouldPinCameraDown({ camera, canvas });
        if (player.lastDirection === "right") player.switchSprite("Jump");
        else player.switchSprite("JumpLeft");
    } else if (player.velocity.y > 0) {
        player.shouldPinCameraUp({ camera, canvas });
        if (player.lastDirection === "right") player.switchSprite("Fall");
        else player.switchSprite("FallLeft");
    }
    c.restore();
};

animate();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = true;
            break;
        case "a":
            keys.a.pressed = true;
            break;
        case "w":
            player.velocity.y = -4;
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
    }
});
