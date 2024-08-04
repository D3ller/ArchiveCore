<script setup>
import {Player} from "../stores/account.js";

let player = Player();

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
  album: {
    type: Object,
    required: false
  },
})

function msToSecAndMin(ms) {
  let min = Math.floor(ms / 60000);
  let sec = ((ms % 60000) / 1000).toFixed(0);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

</script>

<template>
  <div class="tracks">
    <div class="flex items-center gap-5">
      <div class="track-number">{{ trackNumber }}.</div>
      <div class="track-cover">
        <img :src="'http://localhost:5132/file/cover/'+song.album.slug" v-if="song.album" alt="cover"/>
        <img
            :src="`http://localhost:5132/file/${song.coverURL === 'null' || song.coverURL === null ? 'artist' : 'cover'}/${song.coverURL === 'null' || song.coverURL === null ? song.artist.slug : song.slug}`"
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
          <router-link :to="'/artist/'+`${a.slug === undefined ? a.artist.slug : a.slug}`">{{ a.name === undefined ? a.artist.name : a.name }}</router-link>
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
    <div class="track-actions">

      <div
          @click="$event.target.blur();player.addToQueue({title: song.title, url: `http://localhost:5132/file/song/${song.slug}`,duration: duration, coverURL: `http://localhost:5132/file/cover/${album ? song.album.slug : song.slug}`,slug: song.slug, artist: song.artist.name});">
        <span class="material-symbols-outlined">playlist_add</span></div>
      <div
          @click="$event.target.blur();player.setSong({title: song.title, url: `http://localhost:5132/file/song/${song.slug}`,duration: duration, coverURL: `http://localhost:5132/file/cover/${album ? song.album.slug : song.slug}`,slug: song.slug, artist: song.artist.name});">
        <span class="material-symbols-outlined">play_arrow</span></div>
    </div>
  </div>
</template>

<style scoped>

</style>