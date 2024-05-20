class Game {
    constructor() {
        this.world = new World();
    }

    update() {
        this.world.update();
    }
}

class World {
    constructor(friction = 0.85, gravity = 2) {
        this.collider = new Collider();

        this.friction = friction;
        this.gravity = gravity;

        this.player = new Player();
    }
}

class Collider {}

class Player {}

export default Game;
