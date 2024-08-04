<script setup>
import {Player} from "../../stores/account.js";
import {ref, watch} from "vue";
let player = Player();
let queue = ref('');

watch(() => player.queue, (newVal) => {
  console.log(newVal);
  queue.value = newVal;
}, {deep: true})
</script>

<template>
<div class="aside">
<h2>Waiting List</h2>

  <div class="aside-content" v-if="queue.length > 0">
    <div v-for="song in queue" :key="song.id">
      <router-link :to="{name: 'song', params: {id: song.slug}}" class="waiting-item">
        <div class="w-10 h-10 rounded-lg waiting-image" :style="{backgroundImage: `url(${song.coverURL})`}"></div>
        <div class="waiting-item-content">
          <div class="waiting-title">{{ song.title }}</div>
          <div>{{ song.artist }}</div>
        </div>
      </router-link>
    </div>
  </div>

  <div class="aside-content" v-else>
    No song in queue
  </div>
</div>
</template>

<style scoped>

</style>