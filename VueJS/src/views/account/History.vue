<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";
import Tracks from "../../components/tracks.vue";
let songs = ref(null);
import {useAccount} from "../../stores/account";
import router from "../../router";
let account = useAccount();

axios.get('https://192.168.1.158:5132/api/history/get', {
  withCredentials: true
})
    .then((response) => {
      songs.value = response.data;
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401 && err.response.data.message === 'User is not logged in') {
        account.set(false);
        router.push({
          name: 'login',
          query: {
            redirect: router.currentRoute.value.fullPath
          }
        });
      }
    });
</script>

<template>
<div class="page_history">
  <h1>Rencently Played</h1>

  <div class="text-white" v-if="songs">

    <tracks v-for="(song, i) in songs" :to="{name: 'song', params: {id: song.song.slug}}" :key="i" :trackNumber="i + 1" :class="i >= 1 ? '' : 'once'" :song="song.song" :album="song.song.album"></tracks>
  </div>
</div>

</template>

<style scoped>

</style>