<script setup lang="ts">
import axios from "axios";
import router from "../../router";
import {useAccount} from "../../stores/account";
import {ref} from "vue";
import TrackDetails from "../../components/track-details.vue";
let account = useAccount();
let playlists = ref(null);

let createPlaylist = () => {
  axios.post('https://192.168.1.158:5132/api/playlist/create', {
  }, {
    withCredentials: true
  }).then((response) => {
    console.log(response.data.slug);
    router.push(`/playlist/${response.data.slug}`);
  }).catch((err) => {
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
  }

let getPlaylists = () => {
  axios.post('https://192.168.1.158:5132/api/playlist/user', {}, {
    withCredentials: true
  }).then((response) => {
    console.log(response.data);
    playlists.value = response.data;
  }).catch((err) => {
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
}

getPlaylists();
</script>

<template>
  <div class="page_playlist">
    <div class="flex items-center justify-between"><h1>Playlists</h1> <span class="material-symbols-outlined text-white cursor-pointer" @click="createPlaylist()">
add
</span></div>

    <div class="grid grid-cols-12 gap-x-2 gap-y-5 mt-10">
      <track-details :to="{name: 'playlistView', params: {id: playlist.slug}}" class="col-span-3" v-for="(playlist, i) in playlists" :key="i" :title="playlist.title"
                     :cover-url="playlist.coverURL"></track-details>
    </div>
  </div>
</template>

<style scoped>

</style>