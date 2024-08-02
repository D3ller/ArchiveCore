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
    <div class="artist-bubble__avatar" :style="{backgroundImage: `url(${artist[0].avatarURL})`}"></div>
    <p>{{ artist[0].name }}</p>
  </router-link>
</template>

<style scoped>

</style>