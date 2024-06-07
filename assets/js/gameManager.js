import { AudioManager } from './musicManager.js';

export class GameManager {
    constructor(canvas, tileCount, speed, audioFilePath) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileCount = tileCount;
        this.tileSize = canvas.width / tileCount - 2;
        this.speed = speed;
        this.audioManager = new AudioManager(audioFilePath); // Initialiser AudioManager
        this.resetGame();
    }

    resetGame() {
        this.headX = 10;
        this.headY = 10;
        this.snakeParts = [];
        this.tailLength = 2;
        this.appleX = 5;
        this.appleY = 5;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.score = 0;
    }

    changeSnakePosition() {
        this.headX += this.xVelocity;
        this.headY += this.yVelocity;
        if (this.headX < 0) this.headX = this.tileCount - 1;
        if (this.headX >= this.tileCount) this.headX = 0;
        if (this.headY < 0) this.headY = this.tileCount - 1;
        if (this.headY >= this.tileCount) this.headY = 0;
    }

    drawSnake() {
        this.ctx.fillStyle = 'lightblue';
        for (let part of this.snakeParts) {
            this.ctx.fillRect(part.x * this.tileCount, part.y * this.tileCount, this.tileSize, this.tileSize);
        }

        this.snakeParts.push({ x: this.headX, y: this.headY });
        while (this.snakeParts.length > this.tailLength) {
            this.snakeParts.shift();
        }

        this.ctx.fillStyle = 'darkblue';
        this.ctx.fillRect(this.headX * this.tileCount, this.headY * this.tileCount, this.tileSize, this.tileSize);
    }

    drawApple() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.appleX * this.tileCount, this.appleY * this.tileCount, this.tileSize, this.tileSize);
    }

    checkAppleCollision() {
        if (this.appleX === this.headX && this.appleY === this.headY) {
            this.audioManager.play();
            this.appleX = Math.floor(Math.random() * this.tileCount);
            this.appleY = Math.floor(Math.random() * this.tileCount);
            this.tailLength++;
            this.score += 10;
            setTimeout(() => {
                this.audioManager.stop();
            }, 1000);
        }
    }

    isGameOver() {
        let gameOver = false;

        if (this.yVelocity === 0 && this.xVelocity === 0) {
            return false;
        }

        for (let part of this.snakeParts) {
            if (part.x === this.headX && part.y === this.headY) {
                gameOver = true;
                break;
            }
        }

        return gameOver;
    }

    clearScreen() {
        this.ctx.fillStyle = 'darkgreen';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawScore() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px Verdana';
        this.ctx.fillText('Score ' + this.score, this.canvas.width - 50, 10);
    }
}
