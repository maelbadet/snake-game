import { AudioManager } from './musicManager.js';

export class ModalNavigation {
    constructor(audioManager) {
        this.modal = document.getElementById("myModal");
        this.pages = document.querySelectorAll(".page");
        this.currentPageIndex = 0;
        this.audioManager = audioManager;

        this.initModal();
    }

    initModal() {
        const closeBtn = document.getElementsByClassName("close")[0];
        closeBtn.addEventListener("click", () => {
            this.modal.style.display = "none";
            this.audioManager.setVolume(0.2);
            this.audioManager.play();
        });

        document.getElementById("prevBtn2").addEventListener("click", () => {
            if (this.currentPageIndex > 0) {
                this.currentPageIndex--;
                this.showPage(this.currentPageIndex);
            }
        });

        document.getElementById("nextBtn1").addEventListener("click", () => {
            this.currentPageIndex++;
            this.showPage(this.currentPageIndex);
        });

        document.getElementById("nextBtn2").addEventListener("click", () => {
            if (this.currentPageIndex < this.pages.length - 1) {
                this.currentPageIndex++;
                this.showPage(this.currentPageIndex);
            }
        });

        document.getElementById("prevBtn3").addEventListener("click", () => {
            this.currentPageIndex--;
            this.showPage(this.currentPageIndex);
        });

        document.getElementById("restartBtn").addEventListener("click", () => {
            this.modal.style.display = "none";
            this.audioManager.setVolume(0.2);
            this.audioManager.play();
        });

        this.modal.style.display = "block";
        this.showPage(this.currentPageIndex);
    }

    showPage(index) {
        this.pages.forEach((page, i) => {
            page.style.display = i === index ? "block" : "none";
        });
    }
}
