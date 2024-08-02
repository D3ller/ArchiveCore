<script setup>
let props = defineProps({
  type: {
    type: String,
    default: 'primary'
  },
})
</script>

<template>
<button class="button" :class="'button-'+type">
  <slot></slot>
</button>
</template>

<style scoped>

</style>