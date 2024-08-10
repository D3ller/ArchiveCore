<script setup lang="ts">
import router from "../../router";
import Devonly from "../../components/devonly.vue";

if(process.env.NODE_ENV !== 'development') {
  router.push('/');
}
</script>

<template>
  <devonly>
<div>
  <h1>Admin Dashboard</h1>

  <div class="mt-10">

    <div class="grid grid-cols-12 gap-2">
      <router-link to="/dev/account" class="border border-solid border-[#212121] p-8 col-span-4 text-white rounded-xl">
        <h2>Account</h2>
        <p class="paragraph">Manage user's account</p>
      </router-link>

      <router-link to="/dev/playlist" class="border border-solid border-[#212121] p-8 col-span-4 text-white rounded-xl">
        <h2>Playlist</h2>
        <p class="paragraph">Manage user's playlist</p>
      </router-link>

      <router-link to="/dev/song" class="border border-solid border-[#212121] p-8 col-span-4 text-white rounded-xl">
        <h2>Song</h2>
        <p class="paragraph">Manage songs</p>
      </router-link>

      <router-link to="/dev/album" class="border border-solid border-[#212121] p-8 col-span-4 text-white rounded-xl">
        <h2>Album</h2>
        <p class="paragraph">Manage albums</p>
      </router-link>

      <router-link to="/dev/artist" class="border border-solid border-[#212121] p-8 col-span-4 text-white rounded-xl">
        <h2>Artist</h2>
        <p class="paragraph">Manage artists</p>
      </router-link>

      <router-link to="/dev/genre" class="border border-solid border-[#212121] p-8 col-span-4 text-white rounded-xl">
        <h2>Genre</h2>
        <p class="paragraph">Manage genres</p>
      </router-link>

      </div>
    </div>
  </div>
  </devonly>
</template>

<style scoped>

</style>