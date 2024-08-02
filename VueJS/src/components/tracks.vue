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
    type: String,
    required: true
  }
})
</script>

<template>
<div class="tracks">
  <div class="track-number">{{ trackNumber }}.</div>
  <div class="track-title">{{ title }}</div>
  <div class="track-duration">{{ duration }}</div>
  <div class="track-actions">
    <button @click="playTrack"><span class="material-symbols-outlined">play_arrow</span></button>
  </div>
</div>
</template>

<style scoped>

</style>