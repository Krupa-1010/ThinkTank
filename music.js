const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const pauseResumeBtn = document.getElementById('pauseResumeBtn'); 
const nextBtn = document.getElementById('nextBtn');
const musicSelect = document.getElementById('musicSelect');

// Array of music file paths (replace with your actual paths)
const musicList = [
  'music/educational-music-learning-study-school-knowledge-background-intro-277941.mp3',
  'music/lofi-study-beat-20-247595.mp3',
  'music/mars-lofi-study-beat-beats-to-relax-chillhop-122874.mp3',
  'music/study-110111.mp3',
  'music/study-music-181044.mp3',
  'music/valley-of-hope-ambient-meditation-study-sleep-music-115453.mp3'
];

let currentSongIndex = 0; 
let isPlaying = false;

// Populate the musicSelect dropdown
musicList.forEach((song, index) => {
  const option = document.createElement('option');
  option.value = song;
  option.text = `Song ${index + 1}`; 
  musicSelect.appendChild(option);
});

// Initial audio source
audioPlayer.src = musicList[currentSongIndex]; 

playBtn.addEventListener('click', () => {
  if (!isPlaying) {
    audioPlayer.play();
    isPlaying = true;
    pauseResumeBtn.textContent = "Pause"; 
  }
});

pauseResumeBtn.addEventListener('click', () => {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    pauseResumeBtn.textContent = "Resume"; 
  } else {
    audioPlayer.play();
    isPlaying = true;
    pauseResumeBtn.textContent = "Pause"; 
  }
});

nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % musicList.length;
  audioPlayer.src = musicList[currentSongIndex];
  audioPlayer.play();
  isPlaying = true;
  pauseResumeBtn.textContent = "Pause"; 
});

musicSelect.addEventListener('change', () => {
  audioPlayer.src = musicSelect.value;
  audioPlayer.play(); 
  isPlaying = true;
  pauseResumeBtn.textContent = "Pause"; 
});