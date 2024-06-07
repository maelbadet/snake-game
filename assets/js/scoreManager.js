export class ScoreManager {
    getHighScore() {
        return localStorage.getItem('highscore') || 0;
    }

    setHighScore(score) {
        localStorage.setItem('highscore', score);
    }

    saveScore(name, score) {
        let scores = this.getHighScores();
        scores.push({ name, score });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 20);
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    getHighScores() {
        return JSON.parse(localStorage.getItem('scores') || '[]');
    }

    fetchHighScoresFromAPI(callback) {
        fetch("https://randomuser.me/api/?nat=fr&results=30")
            .then(response => response.json())
            .then(data => {
                const scores = [];
                data.results.forEach(user => {
                    const name = `${user.name.first} ${user.name.last}`;
                    const score = Math.floor(Math.random() * 22 + 20) * 10;
                    scores.push({ name, score });
                });
                scores.sort((a, b) => b.score - a.score);
                scores.splice(20);
                localStorage.setItem('scores', JSON.stringify(scores));
                callback();
            })
            .catch(error => console.error('Erreur lors de la récupération des scores :', error));
    }
}
