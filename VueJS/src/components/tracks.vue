<script setup>
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
  coverURL: {
    type: String,
    default: '',
    required: false
  },
  to: {
    type: Object,
    required: false
  },
  featured: {
    type: Array,
    required: false
  }
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
    <div class="track-cover" v-if="type === 'album'">
      <img :src="'http://localhost:5132'+coverURL" alt="cover"/>
    </div>
    <router-link :to="to" class="track-title" v-if="type === 'album'">{{ title }}</router-link>
    <div v-else>
      <div class="track-title">{{ title }}</div>
      <div class="track-artist" v-if="featured.length > 0">
        <span v-for="(artist, index) in featured" :key="index">
          <router-link :to="'/artist/'+artist.slug">{{ artist.name }}</router-link>
          <span v-if="index < featured.length - 1">, </span>
        </span>
    </div>
    </div>
  </div>
  <div class="track-duration">{{ msToSecAndMin(duration) }}</div>
  <div class="track-actions">
    <button @click="playTrack"><span class="material-symbols-outlined">play_arrow</span></button>
  </div>
</div>
</template>

<style scoped>

</style>