export class leaderScoreManager {
    constructor(scoreElement, highScoreElement, replayButton, nameForm, scoreList, scoreManager) {
        this.scoreElement = scoreElement;
        this.highScoreElement = highScoreElement;
        this.replayButton = replayButton;
        this.nameForm = nameForm;
        this.scoreList = scoreList;
        this.scoreManager = scoreManager;

        this.replayButton.addEventListener('click', () => {
            this.resetGame();
            this.drawGame();
        });

        this.updateHighScoreTable();
    }

    drawScore(score) {
        this.scoreElement.textContent = `Score: ${score}`;
    }

    updateHighScoreTable() {
        const scores = this.scoreManager.getHighScores();
        if (scores.length === 0) {
            this.scoreManager.fetchHighScoresFromAPI(this.updateHighScoreTable.bind(this));
        } else {
            this.scoreList.innerHTML = '';
            scores.forEach((entry) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.name}: ${entry.score} points`;
                listItem.classList.add('score-item');
                this.scoreList.appendChild(listItem);
            });
        }
    }
}
