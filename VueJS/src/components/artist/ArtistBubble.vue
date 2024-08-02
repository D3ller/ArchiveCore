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
  <div class="artist-bubble">
    <div class="artist-bubble__avatar" :style="{backgroundImage: `url(${avatarURL})`}"></div>
    <p>{{ name }}</p>
  </div>
</template>

<style scoped>

</style>