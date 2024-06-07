import { SnakeGame } from './snakeGame.js';
import { ScoreManager } from './scoreManager.js';
import { ModalNavigation } from './modalNavigation.js';
import { AudioManager } from './musicManager.js';

document.addEventListener("DOMContentLoaded", () => {
    const scoreManager = new ScoreManager();
    const audioManager = new AudioManager('music/jaime-sonic.mp3');

    new ModalNavigation(audioManager);
    new SnakeGame(scoreManager);
});
