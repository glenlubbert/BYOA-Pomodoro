class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.totalTime = 25 * 60;
        this.timerId = null;
        this.isRunning = false;
        this.completedSessions = 0;
        
        // DOM elements
        this.timeDisplay = document.querySelector('.time-display');
        this.timerLabel = document.querySelector('.timer-label');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.modeButtons = document.querySelectorAll('.mode');
        this.completedDisplay = document.querySelector('.completed');
        this.progressCircle = document.querySelector('.timer-progress');
        
        // Calculate circumference for the progress circle
        const radius = this.progressCircle.r.baseVal.value;
        this.circumference = radius * 2 * Math.PI;
        this.progressCircle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.progressCircle.style.strokeDashoffset = this.circumference;
        
        // Bind event listeners
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.modeButtons.forEach(button => {
            button.addEventListener('click', () => this.setMode(button));
        });
        
        this.updateDisplay();
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.playAlarm();
                    this.completedSessions++;
                    this.completedDisplay.textContent = `Completed: ${this.completedSessions}`;
                    this.reset();
                }
            }, 1000);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startButton.disabled = false;
            this.pauseButton.disabled = true;
            clearInterval(this.timerId);
        }
    }
    
    reset() {
        this.pause();
        const activeMode = document.querySelector('.mode.active');
        this.totalTime = parseInt(activeMode.dataset.time) * 60;
        this.timeLeft = this.totalTime;
        this.updateDisplay();
    }
    
    setMode(button) {
        this.modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update timer label based on mode
        const modeText = button.querySelector('.mode-text').textContent;
        this.timerLabel.textContent = modeText;
        
        this.reset();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress circle
        const offset = this.circumference - (this.timeLeft / this.totalTime) * this.circumference;
        this.progressCircle.style.strokeDashoffset = offset;
    }
    
    playAlarm() {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        audio.play();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 