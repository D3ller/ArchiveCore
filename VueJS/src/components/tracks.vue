<script setup>
import {onMounted} from "vue";
import {Player} from "@/stores/account.js";
let player = Player();

let props = defineProps({
  trackNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'single'
  },
  cover: {
    type: String,
    required: false
  },
  song: {
    type: String,
    required: false
  },
  slug: {
    type: String,
    required: true
  },
  to: {
    type: Object,
    required: false
  },
  featured: {
    type: Object,
    required: false
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: Object,
    required: false
  }
})

function msToSecAndMin(ms) {
  let min = Math.floor(ms / 60000);
  let sec = ((ms % 60000) / 1000).toFixed(0);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

onMounted(() => {
console.log(props.song)
})



</script>

<template>
<div class="tracks">
  <div class="flex items-center gap-5">
    <div class="track-number">{{ trackNumber }}.</div>
    <div class="track-cover" v-if="type === 'album'">
      <img :src="'http://localhost:5132/file/cover/'+album.slug" v-if="album" alt="cover"/>
      <img :src="'http://localhost:5132/file/cover/'+slug" v-else alt="cover"/>
    </div>
    <router-link :to="to" class="track-title" v-if="type === 'album'">{{ title }}</router-link>
    <div v-else>
      <div class="track-title">{{ title }}</div>
      <div class="track-artist" v-if="featured.length > 0">
        <span v-for="(artist, index) in featured" :key="index">
          <router-link :to="'/artist/'+artist.slug">{{ artist.name || artist.artist.name }}</router-link>
          <span v-if="index < featured.length - 1">, </span>
        </span>
    </div>
    </div>
  </div>
  <div class="track-duration">{{ msToSecAndMin(duration) }}</div>
  <div class="track-actions">

    <button @click="player.addToQueue({title: title, url: `http://localhost:5132/file/song/${slug}`,duration: duration, coverURL: `http://localhost:5132/file/cover/${album ? album.slug : props.slug}`,slug: slug, artist: artist});"><span class="material-symbols-outlined">playlist_add</span></button>
    <button @click="player.setSong({title: title, url: `http://localhost:5132/file/song/${slug}`,duration: duration, coverURL: `http://localhost:5132/file/cover/${album ? album.slug : props.slug}`,slug: slug, artist: artist});"><span class="material-symbols-outlined">play_arrow</span></button>
  </div>
</div>
</template>

<style scoped>

</style>