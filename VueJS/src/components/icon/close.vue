<script setup lang="ts">
let props = defineProps({
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },

})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :height="height" viewBox="0 -960 960 960" :width="width" fill="#e8eaed">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
  </svg>
</template>

<style scoped>

</style>