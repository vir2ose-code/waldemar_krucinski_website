// vir2ose Studio Audio Player Engine
document.addEventListener('DOMContentLoaded', () => {
  const tracks = [
    {
      title: "NEW INDIAN WORLD - TERRA",
      artist: "Waldemar Krucinski (vir2ose)",
      src: "assets/audio/new_indian_world.mp3"
    },
    {
      title: "EDM PHANTOM",
      artist: "Waldemar Krucinski (vir2ose)",
      src: "assets/audio/edm_phantom.mp3"
    },
    {
      title: "MARV X 2 TS",
      artist: "Waldemar Krucinski (vir2ose)",
      src: "assets/audio/marv_x_2_ts.mp3"
    },
    {
      title: "Crocketts Theme (vir2ose)",
      artist: "Waldemar Krucinski (vir2ose)",
      src: "assets/audio/crocketts_theme.mp3"
    },
    {
      title: "Dance Of The Protons (with Melody)",
      artist: "Waldemar Krucinski (vir2ose)",
      src: "assets/audio/dance_of_the_protons.mp3"
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;

  const audio = document.getElementById('main-audio');
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentTitle = document.getElementById('current-title');
  const currentArtist = document.getElementById('current-artist');
  const trackCounter = document.getElementById('track-counter');
  const progressBar = document.getElementById('progress-bar');
  const progressContainer = document.getElementById('progress-container');
  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const playlistEl = document.getElementById('playlist');
  const visualizer = document.getElementById('visualizer');
  const playingPulse = document.getElementById('playing-pulse');

  // Build Playlist UI
  function renderPlaylist() {
    playlistEl.innerHTML = '';
    tracks.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-xs font-mono text-neutral-500 w-4">${index + 1}</span>
          <i class="fa-solid fa-compact-disc ${index === currentTrackIndex ? 'text-amber-400' : 'text-neutral-600'} text-sm"></i>
          <span class="track-name text-xs sm:text-sm font-medium text-neutral-300 truncate">${track.title}</span>
        </div>
        <span class="text-xs font-mono text-neutral-500">vir2ose</span>
      `;
      item.addEventListener('click', () => {
        loadTrack(index);
        playAudio();
      });
      playlistEl.appendChild(item);
    });
  }

  function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[currentTrackIndex];
    audio.src = track.src;
    currentTitle.textContent = track.title;
    currentArtist.innerHTML = `Komposition & Produktion: <span class="text-neutral-200">${track.artist}</span>`;
    trackCounter.textContent = `${currentTrackIndex + 1} / ${tracks.length}`;
    renderPlaylist();
  }

  function playAudio() {
    audio.play().then(() => {
      isPlaying = true;
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');
      visualizer.classList.add('is-playing');
      playingPulse.classList.remove('hidden');
    }).catch(e => {
      console.warn("Audio play prevented or error:", e);
    });
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    visualizer.classList.remove('is-playing');
    playingPulse.classList.add('hidden');
  }

  function togglePlay() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playAudio();
  }

  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playAudio();
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Update progress bar
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalDurationEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    nextTrack();
  });

  // Scrubbing
  progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  });

  // Volume
  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    updateMuteIcon();
  });

  function updateMuteIcon() {
    const icon = muteBtn.querySelector('i');
    if (audio.volume === 0 || audio.muted) {
      icon.className = 'fa-solid fa-volume-xmark text-amber-500';
    } else if (audio.volume < 0.5) {
      icon.className = 'fa-solid fa-volume-low text-neutral-300';
    } else {
      icon.className = 'fa-solid fa-volume-high text-neutral-300';
    }
  }

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateMuteIcon();
  });

  // Event Listeners
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prevTrack);
  nextBtn.addEventListener('click', nextTrack);

  // Initialize first track
  loadTrack(0);
  audio.volume = 0.85;
});
