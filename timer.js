import { db } from "./firebase_config.js"; 
import { doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Timer state variables
let timerInterval;
let timeLeft = 25 * 60; // Default Pomodoro time (25 minutes)
let isRunning = false;
let cycleCount = 0; // Tracks the number of cycles
const pomodoroDuration = 25 * 60; // 25 minute Pomodoro duration
const shortBreakDuration = 5 * 60; // 5 minute short break
const longBreakDuration = 15 * 60; // 15 minute long break

// DOM elements
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const messageDisplay = document.getElementById("message");
const roomCodeInput = document.getElementById("room-code-input");
const joinRoomBtn = document.getElementById("join-btn");
const createRoomBtn = document.getElementById("create-room-btn");
const roomIdDisplay = document.getElementById("room-id-display");

// Audio for notifications
const notificationSound = new Audio("sound/button-2.wav");

// Initialize room and creator IDs
let currentRoomId = null;
let creatorId = null;
let currentUserId = null; // Unique ID for the user (creator or viewer)

// Function to generate a unique user ID (for the creator)
function generateUserId() {
  return Math.random().toString(36).substring(2, 8); // Random 6-character ID
}

// Function to generate a unique room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8); // Random 6-character room ID
}

// Format time function
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Sync the timer state with Firebase for a specific room (only for the creator)
async function storeTimerState(roomId, timeLeft, cycleCount) {
  try {
    const timerDocRef = doc(db, "timers", roomId);
    await setDoc(timerDocRef, {
      timeLeft: timeLeft,
      cycleCount: cycleCount,
      creatorId: creatorId
    });
    console.log("Timer state successfully saved!");
  } catch (error) {
    console.error("Error saving timer state: ", error);
  }
}

// Sync the timer display with Firebase (UI update)
function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  // Store the updated timer state in Firestore if it's the creator
  if (currentRoomId && currentUserId === creatorId) {
    storeTimerState(currentRoomId, timeLeft, cycleCount);
  }
}

// Handle cycle logic (Pomodoro, short break, long break)
function handleCycle() {
  if (cycleCount < 4) {
    if (cycleCount % 2 === 0) {
      notificationSound.play();
      messageDisplay.textContent = "Pomodoro is over! Time for a short break.";
      cycleCount++;
      timeLeft = shortBreakDuration;
    } else {
      notificationSound.play();
      messageDisplay.textContent = "Short break is over! Time for the next Pomodoro.";
      cycleCount++;
      timeLeft = pomodoroDuration;
    }
  } else if (cycleCount === 4) {
    notificationSound.play();
    messageDisplay.textContent = "4 cycles completed! Time for a long break.";
    timeLeft = longBreakDuration;
    cycleCount = 0;
  }

  updateTimerDisplay();
  startTimer();
}

// Start the timer (only for the creator)
startBtn.addEventListener("click", () => {
  if (!isRunning && currentUserId === creatorId) {
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        handleCycle();
      }
    }, 1000);
  } else {
    console.log("Only the room creator can start the timer.");
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
  timeLeft = pomodoroDuration;
  cycleCount = 0;
  updateTimerDisplay();
  messageDisplay.textContent = "";
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

// Listen for Firebase timer state updates (sync timer across users)
function listenToRoomTimerUpdates() {
  if (currentRoomId) {
    const timerDocRef = doc(db, "timers", currentRoomId);
    onSnapshot(timerDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log("Snapshot received:", data);
        
        // Check if the new data differs from the current state
        if (data.timeLeft !== timeLeft || data.cycleCount !== cycleCount) {
          console.log("State change detected. Updating UI.");
          timeLeft = data.timeLeft;
          cycleCount = data.cycleCount;
          updateTimerDisplay();
        }
      } else {
        console.error("No data found for the room.");
      }
    });
  }
}

// Create Room
createRoomBtn.addEventListener("click", async () => {
  currentUserId = generateUserId(); // Generate unique ID for the creator
  const newRoomId = generateRoomId();
  creatorId = currentUserId; // Set the creator's ID

  const roomDocRef = doc(db, "timers", newRoomId);
  
  // Create room document
  await setDoc(roomDocRef, {
    creatorId: creatorId, // Store the creator's ID
    timeLeft: pomodoroDuration, // Initialize with default time
    cycleCount: 0,
  });

  roomIdDisplay.textContent = `Room Created! Room ID: ${newRoomId}`;
  currentRoomId = newRoomId;
  listenToRoomTimerUpdates();

  // Enable controls only for the creator
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = false;
});

// Join Room
joinRoomBtn.addEventListener("click", async () => {
  const roomId = roomCodeInput.value.trim();
  const roomDocRef = doc(db, "timers", roomId);

  const roomSnap = await getDoc(roomDocRef);
  if (roomSnap.exists()) {
    // Always set the current user to the creator if they're joining their own room
    currentUserId = roomSnap.data().creatorId; 
    currentRoomId = roomId;
    creatorId = roomSnap.data().creatorId;
    
    await getInitialTimerState();
    listenToRoomTimerUpdates();

    // If the current user is the creator
    if (currentUserId === creatorId) {
      // Enable all controls for the creator
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = false;
      roomIdDisplay.textContent = `Room ID: ${roomId}`;
    } else {
      // Disable controls for non-creators (viewers)
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      resetBtn.disabled = true;
    }
  } else {
    alert("Room not found!");
  }
});

// Fetch initial timer state when user joins
async function getInitialTimerState() {
  const docSnap = await getDoc(doc(db, "timers", currentRoomId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    timeLeft = data.timeLeft;
    cycleCount = data.cycleCount;
    updateTimerDisplay();
  } else {
    console.error("Room does not exist or timer data missing.");
  }
}

// Start timer function (added to support handleCycle method)
function startTimer() {
  if (currentUserId === creatorId) {
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

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
}