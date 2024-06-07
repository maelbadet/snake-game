export class Snake {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    drawSnake() {
        const { ctx, snakeParts, tileSize, headX, headY, tileCount } = this.gameManager;
        ctx.fillStyle = 'lightblue';
        for (let part of snakeParts) {
            ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
        }
        snakeParts.push({ x: headX, y: headY });
        while (snakeParts.length > this.gameManager.tailLength) {
            snakeParts.shift();
        }
        ctx.fillStyle = 'darkblue';
        ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
    }
}
