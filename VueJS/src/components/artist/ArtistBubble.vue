<script setup>
let props = defineProps({
  avatarURL: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
})
</script>

<template>
  <router-link :to="to" class="artist-bubble">
    <div class="artist-bubble__avatar" :style="{backgroundImage: `url(${avatarURL})`}"></div>
    <p>{{ name }}</p>
  </router-link>
</template>

<style scoped>

</style>