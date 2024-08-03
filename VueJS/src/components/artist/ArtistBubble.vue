<script setup>
let props = defineProps({
  avatarURL: {
    type: String,
    required: true
  },
  artist: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <router-link to="" class="artist-bubble">
    <div class="artist-bubble__avatar" :style="{backgroundImage: `url(http://localhost:5132${avatarURL})`}"></div>
    <p>{{ artist }}</p>
  </router-link>
</template>

<style scoped>

</style>