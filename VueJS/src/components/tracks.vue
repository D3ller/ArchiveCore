<script setup>
import {Player, useAccount} from "../stores/account.js";
import SelectModal from "./modal/select-modal.vue";
import {ref} from "vue";
import axios from "axios";
import router from "../router/index.js";

let player = Player();
let accounts = useAccount();
let modal = ref(false);
let project = ref(null);
let emit = defineEmits(['update:modelValue']);

let props = defineProps({
  trackNumber: {
    type: Number,
    required: true
  },
  song: {
    type: Object,
    required: true
  },
  to: {
    type: Object,
    required: false
  },
  featured: {
    type: Array,
    required: false
  },
  artist: {
    type: Object,
    required: false
  },
  deleteSong: {
    type: Object,
    required: false
  }
})

function msToSecAndMin(ms) {
  let min = Math.floor(ms / 60000);
  let sec = ((ms % 60000) / 1000).toFixed(0);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

let addToPlaylist = (value) => {
  modal.value = false;
  axios.post('https://192.168.1.158:5132/api/playlist/add', {
    playlistSlug: value.slug,
    SongSlug: props.song.slug
  }, {
    withCredentials: true
  }).then((response) => {
    console.log(response);
  }).catch((err) => {
    if (err.response.status === 401 && err.response.data.message === 'User is not logged in') {
      accounts.set(false);
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.value.fullPath
        }
      });
    }
  });
}

let deleteSongFromPL = (songSlug, playlistSlug) => {
  console.log(songSlug, playlistSlug);
  axios.post('https://192.168.1.158:5132/api/playlist/delete', {
    playlistSlug: playlistSlug,
    songSlug: props.song.slug
  }, {
    withCredentials: true
  }).then((response) => {
    emit('update:modelValue', 'reload');
  }).catch((err) => {
    if (err.response.status === 401 && err.response.data.message === 'User is not logged in') {
      accounts.set(false);
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.value.fullPath
        }
      });
    }
  });
}

</script>

<template>

  <div class="tracks">
    <div class="flex items-center gap-5 w-1/3">
      <div class="track-number">{{ trackNumber }}.</div>
      <div class="track-cover">
        <img :src="'https://192.168.1.158:5132/file/cover/'+song.album.slug" v-if="song.album" alt="cover"/>
        <img
            :src="`https://192.168.1.158:5132/file/${song.coverURL === 'null' || song.coverURL === null ? 'artist' : 'cover'}/${song.coverURL === 'null' || song.coverURL === null ? song.artist.slug : song.slug}`"
            v-else alt="cover"/>
      </div>
      <div>
        <router-link v-if="to" :to="to" class="track-title">{{ song.title }}</router-link>
        <div v-else class="track-title">{{ song.title }}</div>
        <div v-if="featured && featured.length > 0">
          <div class="track-artist">
          <span>
            <router-link :to="'/artist/'+artist.slug">{{ artist.name }}</router-link>
            <span
                v-if="featured">, </span>
          </span>
            <span v-for="(a, index) in featured" :key="index">
          <router-link :to="'/artist/'+`${a.slug === undefined ? a.artist.slug : a.slug}`">{{
              a.name === undefined ? a.artist.name : a.name
            }}</router-link>
          <span v-if="index < featured.length - 1">, </span>
        </span>
          </div>
        </div>
        <div class="track-artist" v-else>
          <router-link :to="'/artist/'+song.artist.slug">{{ song.artist.name }}</router-link>
        </div>
      </div>
    </div>
    <div class="track-duration">{{ msToSecAndMin(song.duration) }}</div>

    <select-modal confirm-text="Add to Playlist" subtitle="Select the playlist you want to add this song to"
                  :title="`Add ${song.title} to Playlist`" v-if="modal && accounts.connected"
                  @update:modelValue="addToPlaylist" @close="modal = false"></select-modal>

    <div class="track-actions">

      <div v-if="accounts.connected" title="Add to Playlist" @click="modal = true">
<span class="material-symbols-outlined">
playlist_add
</span>
      </div>

      <div title="Add to Queue"
           @click="$event.target.blur();player.addToQueue({title: song.title, url: `https://192.168.1.158:5132/file/song/${song.slug}`,duration: song.duration, coverURL: `https://192.168.1.158:5132/file/${song.coverURL === 'null' || song.coverURL === null ? 'artist' : 'cover'}/${(song.album && song.album.coverURL) ? song.album.coverURL.slice(12) : (song.coverURL === 'null' || song.coverURL === null ? song.artist.slug : song.slug)}`, artist: song.artist.name, slug: song.slug})">
        <span class="material-symbols-outlined">queue_music</span></div>
      <div
          title="Play Song"
          @click="$event.target.blur();player.setSong({title: song.title, url: `https://192.168.1.158:5132/file/song/${song.slug}`,duration: song.duration, coverURL: `https://192.168.1.158:5132/file/${song.coverURL === 'null' || song.coverURL === null ? 'artist' : 'cover'}/${(song.album && song.album.coverURL) ? song.album.coverURL.slice(12) : (song.coverURL === 'null' || song.coverURL === null ? song.artist.slug : song.slug)}`, artist: song.artist.name, slug: song.slug})">
        <span class="material-symbols-outlined">play_arrow</span></div>

      <div v-if="deleteSong" title="Delete Song" @click="deleteSongFromPL(deleteSong.songSlug, deleteSong.playlistSlug)">
        <span class="material-symbols-outlined">delete</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>