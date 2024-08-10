<script setup>
import {onMounted, ref, watch} from "vue";
import {Player, useAccount} from "../../stores/account.js";
import axios from "axios";

let accounts = useAccount();
let player = Player();
let audio = new Audio();
let state = ref('playing');
let progress = ref(0);
let volume = ref(1);

watch(() => player.currentSong, (newVal) => {
  console.log(newVal);
  if (newVal) {
    if (accounts.connected) {
      axios.post('http://localhost:5132/api/history/startListening', {
            songId: player.currentSong.slug
          },
          {withCredentials: true}).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.error(error);
      })
    }
    audio.src = newVal.url + '.mp3';
    audio.play();
    audio.volume = player.volume;
    state.value = 'playing';
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: newVal.title,
        artist: newVal.artist,
        artwork: [{src: newVal.coverURL, sizes: '96x96', type: 'image/png'}]
      });
    }
  }
})

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
}

audio.onended = () => {
  console.log(player)


  if (player.queue.length > 0) {
    if (accounts.connected) {
      axios.post('http://localhost:5132/api/history/add', {
            songId: player.currentSong.slug
          },
          {withCredentials: true}).then((response) => {
        player.addToPrevious(player.currentSong);
        player.currentSong = player.queue[0];
        player.queue.shift();
      }).catch((error) => {
        player.addToPrevious(player.currentSong);
        player.currentSong = player.queue[0];
        player.queue.shift();
      })
    }
    player.addToPrevious(player.currentSong);
    player.currentSong = player.queue[0];
    player.queue.shift();
  } else {

    if (accounts.connected) {
      axios.post('http://localhost:5132/api/history/add', {
            songId: player.currentSong.slug
          },
          {withCredentials: true}).then((response) => {
        console.log(response);
        console.log('No more songs in queue')
        player.currentSong = null;
        audio.pause();
        audio.currentTime = 0;
      }).catch((error) => {
        console.error(error);
        console.log('No more songs in queue')
        player.currentSong = null;
        audio.pause();
        audio.currentTime = 0;
      })
    }

    player.currentSong = null;
    audio.pause();
    audio.currentTime = 0;

  }
}

let audioToggle = () => {
  if (audio.paused) {
    audio.play();
    state.value = 'playing';
  } else {
    audio.pause();
    state.value = 'paused';
  }
}

let updateTime = (e) => {
  let width = e.target.clientWidth;
  let clickX = e.offsetX;
  let duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

let previousTrack = () => {
  if (player.prev.length > 0) {
    player.currentSong = player.prev[player.prev.length - 1];
    player.prev.pop();
  } else {
    player.currentSong = null;
    audio.pause();
    audio.currentTime = 0;
  }
}

let nextTrack = () => {
  if (player.queue.length > 0) {
    player.addToPrevious(player.currentSong);
    player.currentSong = player.queue[0];
    player.queue.shift();
  } else {
    player.currentSong = null;
    audio.pause();
    audio.currentTime = 0;
  }
}

let updateVolume = (e) => {
  console.log(e.target.value);
  volume.value = parseFloat(e.target.value);
  player.setVolume(volume.value);
}

window.addEventListener('keydown', (e) => {

  if (e.code === 'Space') {
    if (document.activeElement.tagName === 'INPUT') {
      return;
    }
    e.preventDefault();
    audioToggle();
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
    if (player.queue.length > 0) {
      player.addToPrevious(player.currentSong);
      player.currentSong = player.queue[0];
      player.queue.shift();
    } else {
      player.currentSong = null;
      audio.pause();
      audio.currentTime = 0;
    }
  }

  if (e.code === 'MediaPlayPause' || e.key === 'MediaPlayPause') {
    audioToggle();
  }

  if (e.code === 'MediaTrackNext' || e.key === 'MediaTrackNext') {
    nextTrack();
  }

  if (e.code === 'MediaTrackPrevious' || e.key === 'MediaTrackPrevious') {
    previousTrack();
  }

  if (e.code === 'ArrowLeft') {
    e.preventDefault();
    audio.currentTime -= 10;
  }
  if (e.code === 'ArrowRight') {
    e.preventDefault();
    audio.currentTime += 10;
  }
})
</script>

<template>
  <div class="player" v-if="player.currentSong">
    <div class="player-info">
      <div :style="{ backgroundImage: 'url(' + player.currentSong.coverURL + ')' }"
           class="bg-cover w-16 h-16 rounded-xl"></div>
      <div class="infos">
        <p class="player-title">{{ player.currentSong.title }}</p>
        <p class="player-artist">{{ player.currentSong.artist }}</p>
      </div>
    </div>
    <div class="player-controls">
      <div class="player-controls-icons"><span @click="previousTrack()"
                                               class="material-symbols-outlined">skip_previous</span>
        <span class="material-symbols-outlined" @click="audioToggle">{{
            state === 'paused' ? 'play_arrow' : 'pause'
          }}</span>
        <span class="material-symbols-outlined" @click="nextTrack()">skip_next</span></div>

      <div class="player-progress" @click="updateTime($event)">
        <div class="player-progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <div class="player-options">
      <div class="player-volume"><span class="material-symbols-outlined" v-if="volume === 0">volume_mute</span>
        <span class="material-symbols-outlined" v-else-if="volume > 0 && volume < 0.5">volume_down</span>
        <span class="material-symbols-outlined" v-else>volume_up</span>
        <input type="range" min="0" max="1" step="0.001" @input="updateVolume($event)" v-model="audio.volume"
               class="volume-range"></div>
    </div>
  </div>
</template>

<style scoped>

</style>