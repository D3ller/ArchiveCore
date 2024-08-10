<script setup>
let props = defineProps({
  avatarURL: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
  <router-link to="" class="artist-bubble">
    <div class="artist-bubble__avatar" :style="{ backgroundImage: `url(${avatarURL.startsWith('https://') ? avatarURL : 'https://192.168.1.158:5132' + avatarURL})` }"></div>
    <p>{{ name }}</p>
  </router-link>
</template>

<style scoped>

</style>