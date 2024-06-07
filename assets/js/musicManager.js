export class AudioManager {
    constructor(audioFilePath) {
        this.audio = new Audio(audioFilePath);
        this.audio.loop = true;  // Loop the audio
    }

    play() {
        this.audio.play().catch(error => {
            console.error('Failed to play audio:', error);
        });
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setVolume(volume) {
        if (volume < 0) {
            volume = 0;
        } else if (volume > 1) {
            volume = 1;
        }
        this.audio.volume = volume;
    }
}
