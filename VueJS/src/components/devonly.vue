<script setup lang="ts">
import {computed} from "vue";

const isDev = computed(() => process.env.NODE_ENV === 'development');

</script>

<template>
<div v-if="isDev">
  <div class="devonly">
    <slot></slot>
  </div>
</div>
</template>

<style scoped>

</style>