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
  <div class="track-number">{{ trackNumber }}.</div>
  <div class="track-cover" v-if="type === 'album'">
    <img :src="'http://localhost:5132'+coverURL" alt="cover" />
  </div>
  <router-link :to="to" class="track-title" v-if="type === 'album'">{{ title }}</router-link>
  <div class="track-title" v-else>{{ title }}</div>
  <div class="track-duration">{{ msToSecAndMin(duration) }}</div>
  <div class="track-actions">
    <button @click="playTrack"><span class="material-symbols-outlined">play_arrow</span></button>
  </div>
</div>
</template>

<style scoped>

</style>