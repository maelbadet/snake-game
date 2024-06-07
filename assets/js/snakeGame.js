import { GameManager } from './gameManager.js';
import { Snake } from './snake.js';
import { Apple } from './apple.js';
import { leaderScoreManager } from './leaderScoreManager.js';
import { AudioManager } from './musicManager.js';
import { ScoreManager } from './scoreManager.js';

export class SnakeGame {
    constructor(scoreManager) {
        this.canvas = document.getElementById('gameCanvas');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highscore');
        this.replayButton = document.getElementById('replayButton');
        this.nameForm = document.getElementById('nameForm');
        this.playerNameInput = document.getElementById('playerName');
        this.submitNameButton = document.getElementById('submitName');
        this.scoreList = document.getElementById('scoreList');

        this.audioManager = new AudioManager('music/eat.mp3');
        this.scoreManager = new ScoreManager();
        this.highScore = this.scoreManager.getHighScore();
        console.log(this.highScore);

        this.gameManager = new GameManager(this.canvas, 20, 7, 'music/eat.mp3');
        this.snake = new Snake(this.gameManager);
        this.apple = new Apple(this.gameManager);
        this.uiManager = new leaderScoreManager(this.scoreElement, this.highScoreElement, this.replayButton, this.nameForm, this.scoreList, this.scoreManager);

        this.submitNameButton.addEventListener('click', () => {
            const playerName = this.playerNameInput.value;
            if (playerName.length >= 6 && playerName.length <= 20) {
                this.scoreManager.saveScore(playerName, this.gameManager.score);
                this.uiManager.updateHighScoreTable();
                this.gameManager.resetGame();
                this.startGame();
            }
        });

        this.replayButton.addEventListener('click', () => {
            this.gameManager.resetGame();
            this.replayButton.style.display = 'none';
            this.nameForm.style.display = 'none';
            this.startGame();
        });

        document.body.addEventListener('keydown', this.keyDown.bind(this));
        this.uiManager.updateHighScoreTable();
        this.startGame();
    }

    startGame() {
        this.drawGame();
    }

    drawGame() {
        this.gameManager.changeSnakePosition();
        if (this.isGameOver()) {
            this.showGameOver();
            return;
        }

        this.clearScreen();
        this.apple.checkAppleCollision();
        this.apple.drawApple();
        this.snake.drawSnake();
        this.uiManager.drawScore(this.gameManager.score);

        if (this.gameManager.score > this.highScore) {
            this.highScore = this.gameManager.score;
            this.scoreManager.setHighScore(this.highScore);
            this.uiManager.highScoreElement.textContent = `Meilleur Score: ${this.highScore} points`;
        }

        setTimeout(this.drawGame.bind(this), 1000 / this.gameManager.speed);
    }

    clearScreen() {
        this.gameManager.ctx.fillStyle = 'darkgreen';
        this.gameManager.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    isGameOver() {
        let gameOver = false;

        if (this.gameManager.yVelocity === 0 && this.gameManager.xVelocity === 0) {
            return false;
        }

        for (let part of this.gameManager.snakeParts) {
            if (part.x === this.gameManager.headX && part.y === this.gameManager.headY) {
                gameOver = true;
                break;
            }
        }

        return gameOver;
    }

    showGameOver() {
        this.gameManager.ctx.fillStyle = 'white';
        this.gameManager.ctx.font = '50px Verdana';
        this.gameManager.ctx.fillText('Game Over!', this.canvas.width / 6.5, this.canvas.height / 2);
        this.replayButton.style.display = 'block';

        const highScores = this.scoreManager.getHighScores();
        if (highScores.length < 20 || this.gameManager.score > highScores[highScores.length - 1].score) {
            this.nameForm.style.display = 'block';
        } else {
            this.uiManager.showHighScoreTable();
        }
    }

    keyDown(event) {
        if ((event.keyCode === 38 || event.keyCode === 87) && this.gameManager.yVelocity !== 1) {
            this.gameManager.yVelocity = -1;
            this.gameManager.xVelocity = 0;
        }

        if ((event.keyCode === 40 || event.keyCode === 83) && this.gameManager.yVelocity !== -1) {
            this.gameManager.yVelocity = 1;
            this.gameManager.xVelocity = 0;
        }

        if ((event.keyCode === 37 || event.keyCode === 65) && this.gameManager.xVelocity !== 1) {
            this.gameManager.yVelocity = 0;
            this.gameManager.xVelocity = -1;
        }

        if ((event.keyCode === 39 || event.keyCode === 68) && this.gameManager.xVelocity !== -1) {
            this.gameManager.yVelocity = 0;
            this.gameManager.xVelocity = 1;
        }
    }
}
