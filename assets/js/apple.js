export class Apple {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    drawApple() {
        const { ctx, tileCount, tileSize, appleX, appleY } = this.gameManager;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
    }

    checkAppleCollision() {
        const { appleX, appleY, headX, headY, score, tileCount, tailLength } = this.gameManager;
        if (appleX === headX && appleY === headY) {
            this.gameManager.audioManager.play();
            this.gameManager.appleX = Math.floor(Math.random() * tileCount);
            this.gameManager.appleY = Math.floor(Math.random() * tileCount);
            this.gameManager.tailLength++;
            this.gameManager.score += 10;
            setTimeout(() => {
                this.gameManager.audioManager.stop();
            }, 1000);
        }
    }
}
