let timerInterval;
let timeLeft = 25 * 60; // Default Pomodoro time (1 minute for testing)
let isRunning = false;
let cycleCount = 0; // Tracks the number of cycles (Pomodoro + short break)
const pomodoroDuration = 25 * 60; // 25 minute for testing
const shortBreakDuration = 5 * 60; // 5 min for short break
const longBreakDuration = 15 * 60; // 15 min for long break

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const messageDisplay = document.getElementById("message"); // Element to display messages

// Audio for the notification sound
const notificationSound = new Audio("sound/button-2.wav"); // Local sound file (replace with your own)

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Update the timer display
function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

// Start the timer
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        handleCycle(); // Handle the next cycle or break
      }
    }, 1000);
  }
});

// Pause the timer
pauseBtn.addEventListener("click", () => {
  isRunning = false;
  clearInterval(timerInterval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

// Reset the timer
resetBtn.addEventListener("click", () => {
  isRunning = false;
  clearInterval(timerInterval);
  timeLeft = pomodoroDuration; // Reset to 1 minute (testing)
  cycleCount = 0; // Reset cycle count
  updateTimerDisplay();
  messageDisplay.textContent = ""; // Clear the message
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

// Handle the cycle logic
function handleCycle() {
  if (cycleCount < 4) {
    if (cycleCount % 2 === 0) {
      notificationSound.play(); // Play notification sound for Pomodoro completion
      messageDisplay.textContent = "Pomodoro is over! Time for a short break."; // Display message
      cycleCount++;
      timeLeft = shortBreakDuration; // Short break (10 seconds)
    } else {
      notificationSound.play(); // Play notification sound for Short break completion
      messageDisplay.textContent = "Short break is over! Time for the next Pomodoro."; // Display message
      cycleCount++;
      timeLeft = pomodoroDuration; // Pomodoro (1 minute)
    }
  } else if (cycleCount === 4) {
    notificationSound.play(); // Play notification sound for completing 4 cycles
    messageDisplay.textContent = "4 cycles completed! Time for a long break."; // Display message
    timeLeft = longBreakDuration; // Long break (30 seconds)
    cycleCount = 0; // Reset cycle count after the long break
  }

  // Restart the timer for the next cycle
  updateTimerDisplay();
  startTimer();
}

// Restart the timer
function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      handleCycle();
    }
  }, 1000);
}

// Initialize timer display
updateTimerDisplay();
