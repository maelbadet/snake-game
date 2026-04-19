export class ScoreManager {
    constructor() {
        this.highScoreKey = 'snake.highscore';
        this.scoresKey = 'snake.scores';
        this.maxScores = 10;
    }

    getHighScore() {
        return Number(localStorage.getItem(this.highScoreKey) || 0);
    }

    setHighScore(score) {
        localStorage.setItem(this.highScoreKey, String(score));
    }

    getHighScores() {
        return JSON.parse(localStorage.getItem(this.scoresKey) || '[]');
    }

    saveScore(name, score) {
        const normalizedName = name.trim().slice(0, 16);
        if (!normalizedName) {
            return;
        }

        const scores = this.getHighScores();
        scores.push({
            name: normalizedName,
            score,
            createdAt: new Date().toISOString()
        });

        scores.sort((a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt));
        const topScores = scores.slice(0, this.maxScores);

        localStorage.setItem(this.scoresKey, JSON.stringify(topScores));
    }

    qualifies(score) {
        const scores = this.getHighScores();
        return scores.length < this.maxScores || score > scores[scores.length - 1].score;
    }
}
