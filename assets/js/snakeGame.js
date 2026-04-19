import { ScoreManager } from './scoreManager.js';

export class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreManager = new ScoreManager();

        this.gridSize = 20;
        this.cellSize = this.canvas.width / this.gridSize;
        this.baseStepDuration = 150;
        this.minStepDuration = 72;
        this.stepDuration = this.baseStepDuration;
        this.lastTimestamp = 0;
        this.accumulator = 0;
        this.animationFrameId = null;

        this.state = 'ready';
        this.direction = { x: 1, y: 0 };
        this.pendingDirection = { x: 1, y: 0 };
        this.snake = [];
        this.apple = { x: 8, y: 8 };
        this.score = 0;
        this.bestScore = this.scoreManager.getHighScore();

        this.scoreElement = document.getElementById('score');
        this.highscoreElement = document.getElementById('highscore');
        this.liveScoreElement = document.getElementById('liveScore');
        this.liveBestElement = document.getElementById('liveBest');
        this.liveLengthElement = document.getElementById('liveLength');
        this.liveSpeedElement = document.getElementById('liveSpeed');
        this.statusTextElement = document.getElementById('statusText');
        this.missionTextElement = document.getElementById('missionText');

        this.overlay = document.getElementById('gameOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');
        this.startButton = document.getElementById('startButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.replayButton = document.getElementById('replayButton');

        this.nameForm = document.getElementById('nameForm');
        this.playerNameInput = document.getElementById('playerName');
        this.submitNameButton = document.getElementById('submitName');
        this.scoreList = document.getElementById('scoreList');

        this.introModal = document.getElementById('introModal');
        this.openIntroButton = document.getElementById('openIntro');
        this.closeIntroButton = document.getElementById('closeIntro');
        this.dismissIntroButton = document.getElementById('dismissIntro');
        this.toggleMusicButton = document.getElementById('toggleMusic');
        this.controlButtons = Array.from(document.querySelectorAll('.control-button'));

        this.musicEnabled = false;
        this.music = new Audio('music/jaime-sonic.mp3');
        this.music.loop = true;
        this.music.volume = 0.18;

        this.eatSound = new Audio('music/eat.mp3');
        this.eatSound.volume = 0.4;

        this.bindEvents();
        this.resetRound();
        this.renderScores();
        this.updateStats();
        this.draw();
        this.setOverlay('Appuie sur jouer', "Le serpent attend tes ordres. Lance la simulation pour commencer.", true);
        this.openModal();
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.replayButton.addEventListener('click', () => this.restartGame());
        this.submitNameButton.addEventListener('click', () => this.submitScore());

        document.addEventListener('keydown', (event) => this.handleKeydown(event));

        this.openIntroButton.addEventListener('click', () => this.openModal());
        this.closeIntroButton.addEventListener('click', () => this.closeModal());
        this.dismissIntroButton.addEventListener('click', () => this.closeModal());
        this.introModal.addEventListener('click', (event) => {
            if (event.target.dataset.closeModal === 'true') {
                this.closeModal();
            }
        });

        this.toggleMusicButton.addEventListener('click', () => this.toggleMusic());
        this.controlButtons.forEach((button) => {
            button.addEventListener('click', () => this.setDirection(button.dataset.direction));
        });
    }

    resetRound() {
        this.snake = [
            { x: 7, y: 10 },
            { x: 6, y: 10 },
            { x: 5, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.pendingDirection = { x: 1, y: 0 };
        this.apple = this.getRandomApplePosition();
        this.score = 0;
        this.stepDuration = this.baseStepDuration;
        this.accumulator = 0;
        this.lastTimestamp = 0;
        this.statusTextElement.textContent = 'Prêt';
        this.missionTextElement.textContent = 'Collecte la prochaine pomme';
        this.nameForm.classList.add('hidden');
        this.playerNameInput.value = '';
        this.updateStats();
    }

    startGame() {
        if (this.state === 'running') {
            return;
        }

        if (this.state === 'gameover') {
            this.resetRound();
        }

        this.state = 'running';
        this.statusTextElement.textContent = 'En mission';
        this.setOverlay('', '', false);
        this.loop(performance.now());
    }

    restartGame() {
        cancelAnimationFrame(this.animationFrameId);
        this.resetRound();
        this.state = 'ready';
        this.draw();
        this.setOverlay('Nouvelle tentative', "Réinitialisé. Repars pour défendre la ligne temporelle.", true);
    }

    togglePause() {
        if (this.state === 'running') {
            this.state = 'paused';
            cancelAnimationFrame(this.animationFrameId);
            this.statusTextElement.textContent = 'Pause';
            this.setOverlay('Pause', "La chronologie est figée. Reprends quand tu veux.", true);
            return;
        }

        if (this.state === 'paused') {
            this.state = 'running';
            this.statusTextElement.textContent = 'En mission';
            this.setOverlay('', '', false);
            this.lastTimestamp = 0;
            this.loop(performance.now());
        }
    }

    handleKeydown(event) {
        const key = event.key.toLowerCase();

        if (key === ' ') {
            event.preventDefault();
            if (this.state === 'ready') {
                this.startGame();
            } else {
                this.togglePause();
            }
            return;
        }

        const directionByKey = {
            arrowup: 'up',
            z: 'up',
            w: 'up',
            arrowdown: 'down',
            s: 'down',
            arrowleft: 'left',
            q: 'left',
            a: 'left',
            arrowright: 'right',
            d: 'right'
        };

        const nextDirection = directionByKey[key];
        if (nextDirection) {
            event.preventDefault();
            this.setDirection(nextDirection);
        }
    }

    setDirection(directionName) {
        const directions = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        };

        const nextDirection = directions[directionName];
        if (!nextDirection) {
            return;
        }

        const isReverse =
            this.direction.x + nextDirection.x === 0 &&
            this.direction.y + nextDirection.y === 0;

        if (isReverse) {
            return;
        }

        this.pendingDirection = nextDirection;

        if (this.state === 'ready') {
            this.startGame();
        }
    }

    loop(timestamp) {
        if (this.state !== 'running') {
            return;
        }

        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
        }

        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        this.accumulator += delta;

        while (this.accumulator >= this.stepDuration) {
            this.accumulator -= this.stepDuration;
            this.step();
            if (this.state !== 'running') {
                break;
            }
        }

        this.draw();
        this.animationFrameId = requestAnimationFrame((nextTimestamp) => this.loop(nextTimestamp));
    }

    step() {
        this.direction = this.pendingDirection;

        const head = this.snake[0];
        const nextHead = {
            x: (head.x + this.direction.x + this.gridSize) % this.gridSize,
            y: (head.y + this.direction.y + this.gridSize) % this.gridSize
        };

        if (this.snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
            this.handleGameOver();
            return;
        }

        this.snake.unshift(nextHead);

        if (nextHead.x === this.apple.x && nextHead.y === this.apple.y) {
            this.score += 10;
            this.stepDuration = Math.max(this.minStepDuration, this.stepDuration - 4);
            this.apple = this.getRandomApplePosition();
            this.playEatSound();
            this.missionTextElement.textContent = 'Pomme sécurisée. Cherche la suivante.';
        } else {
            this.snake.pop();
        }

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.scoreManager.setHighScore(this.bestScore);
        }

        this.updateStats();
    }

    handleGameOver() {
        this.state = 'gameover';
        cancelAnimationFrame(this.animationFrameId);
        this.statusTextElement.textContent = 'Échec';
        this.missionTextElement.textContent = 'Collision détectée. La simulation doit redémarrer.';
        this.updateStats();

        const qualifies = this.score > 0 && this.scoreManager.qualifies(this.score);
        if (qualifies) {
            this.nameForm.classList.remove('hidden');
        }

        this.setOverlay(
            'Chronologie rompue',
            qualifies
                ? 'Ton score entre au classement local. Enregistre ton pseudo puis relance une partie.'
                : 'Tu as heurté ta propre trajectoire. Relance une nouvelle simulation.',
            true
        );
    }

    submitScore() {
        const playerName = this.playerNameInput.value.trim();
        if (playerName.length < 3) {
            this.playerNameInput.focus();
            return;
        }

        this.scoreManager.saveScore(playerName, this.score);
        this.renderScores();
        this.nameForm.classList.add('hidden');
        this.playerNameInput.value = '';
        this.setOverlay('Score enregistré', 'Le classement local a été mis à jour. Tu peux rejouer.', true);
    }

    updateStats() {
        const level = Math.max(1, Math.round((this.baseStepDuration - this.stepDuration) / 10) + 1);
        this.scoreElement.textContent = String(this.score);
        this.highscoreElement.textContent = String(this.bestScore);
        this.liveScoreElement.textContent = String(this.score);
        this.liveBestElement.textContent = String(this.bestScore);
        this.liveLengthElement.textContent = String(this.snake.length);
        this.liveSpeedElement.textContent = String(level);
    }

    renderScores() {
        const scores = this.scoreManager.getHighScores();
        this.scoreList.innerHTML = '';

        if (scores.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'score-empty';
            empty.textContent = 'Aucun score enregistré pour le moment.';
            this.scoreList.appendChild(empty);
            return;
        }

        scores.forEach((entry, index) => {
            const item = document.createElement('li');
            item.className = 'score-item';
            item.innerHTML = `
                <span class="score-rank">${index + 1}</span>
                <span class="score-name">${this.escapeHtml(entry.name)}</span>
                <span class="score-points">${entry.score} pts</span>
            `;
            this.scoreList.appendChild(item);
        });
    }

    getRandomApplePosition() {
        let position;

        do {
            position = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some((segment) => segment.x === position.x && segment.y === position.y));

        return position;
    }

    draw() {
        this.drawBoard();
        this.drawApple();
        this.drawSnake();
    }

    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#10253a');
        gradient.addColorStop(1, '#153a58');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = 'rgba(255,255,255,0.045)';
        this.ctx.lineWidth = 1;

        for (let index = 1; index < this.gridSize; index++) {
            const offset = index * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(offset, 0);
            this.ctx.lineTo(offset, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, offset);
            this.ctx.lineTo(this.canvas.width, offset);
            this.ctx.stroke();
        }
    }

    drawSnake() {
        this.snake
            .slice()
            .reverse()
            .forEach((segment, reverseIndex) => {
                const index = this.snake.length - 1 - reverseIndex;
                const x = segment.x * this.cellSize;
                const y = segment.y * this.cellSize;
                const inset = index === 0 ? 4 : 6;
                const size = this.cellSize - inset * 2;
                const radius = index === 0 ? 12 : 10;

                const gradient = this.ctx.createLinearGradient(x, y, x + this.cellSize, y + this.cellSize);
                gradient.addColorStop(0, index === 0 ? '#d8fff0' : '#7df9c6');
                gradient.addColorStop(1, index === 0 ? '#7df9c6' : '#39d98a');

                this.roundRect(x + inset, y + inset, size, size, radius);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();

                if (index === 0) {
                    this.drawSnakeHead(x, y);
                }
            });
    }

    drawSnakeHead(x, y) {
        const centerX = x + this.cellSize / 2;
        const centerY = y + this.cellSize / 2;
        const eyeRadius = 3.2;
        const eyeSpread = 7;
        const eyeForward = 5;
        const pupilShiftX = this.direction.x * eyeForward;
        const pupilShiftY = this.direction.y * eyeForward;

        this.ctx.fillStyle = '#05101d';
        this.ctx.beginPath();
        this.ctx.arc(centerX - eyeSpread + pupilShiftX, centerY - eyeSpread + pupilShiftY, eyeRadius, 0, Math.PI * 2);
        this.ctx.arc(centerX + eyeSpread + pupilShiftX, centerY - eyeSpread + pupilShiftY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawApple() {
        const centerX = this.apple.x * this.cellSize + this.cellSize / 2;
        const centerY = this.apple.y * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize * 0.27;

        this.ctx.save();
        this.ctx.shadowColor = 'rgba(255, 96, 96, 0.45)';
        this.ctx.shadowBlur = 24;

        const appleGradient = this.ctx.createRadialGradient(
            centerX - 5,
            centerY - 7,
            3,
            centerX,
            centerY,
            radius + 8
        );
        appleGradient.addColorStop(0, '#ffd8d8');
        appleGradient.addColorStop(0.42, '#ff7b7b');
        appleGradient.addColorStop(1, '#d83d3d');

        this.ctx.fillStyle = appleGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX - 5, centerY, radius, 0, Math.PI * 2);
        this.ctx.arc(centerX + 5, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = '#5f3b18';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - radius - 6);
        this.ctx.quadraticCurveTo(centerX + 2, centerY - radius - 20, centerX + 8, centerY - radius - 18);
        this.ctx.stroke();

        this.ctx.fillStyle = '#7df9c6';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 10, centerY - radius - 6, 8, 4, -0.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.closePath();
    }

    setOverlay(title, message, visible) {
        this.overlayTitle.textContent = title;
        this.overlayMessage.textContent = message;
        this.overlay.classList.toggle('hidden', !visible);
    }

    openModal() {
        this.introModal.classList.add('is-open');
        this.introModal.setAttribute('aria-hidden', 'false');
    }

    closeModal() {
        this.introModal.classList.remove('is-open');
        this.introModal.setAttribute('aria-hidden', 'true');
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;

        if (this.musicEnabled) {
            this.music.play().catch(() => {
                this.musicEnabled = false;
                this.toggleMusicButton.textContent = 'Musique: off';
            });
        } else {
            this.music.pause();
            this.music.currentTime = 0;
        }

        this.toggleMusicButton.textContent = this.musicEnabled ? 'Musique: on' : 'Musique: off';
    }

    playEatSound() {
        this.eatSound.currentTime = 0;
        this.eatSound.play().catch(() => {});
    }

    escapeHtml(value) {
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
}
