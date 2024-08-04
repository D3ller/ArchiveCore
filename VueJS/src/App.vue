<script lang="ts" setup>
import {RouterLink, RouterView} from 'vue-router'
import Navbar from "./components/layouts/navbar.vue";
import {onMounted} from "vue";
import axios from "axios";
import {useAccount} from './stores/account.js';
import AsideBar from "./components/layouts/asideBar.vue";
import Player from "./components/layouts/player.vue";
import Minimize from "./components/icon/minimize.vue";
import Checkbox from "./components/icon/checkbox.vue";
import Close from "./components/icon/close.vue";

const account = useAccount();

onMounted(() => {
  axios.get('http://localhost:5132/api/auth', {
    withCredentials: true
  })
      .then((response) => {
        if (response.status === 200) {
          account.set(true)
        }
      })
      .catch((error) => {
        console.log(error);
      })
})

let closeApp = () => {
  window.ipcRenderer.send('closeApp');
}

let minimizeApp = () => {
  window.ipcRenderer.send('minimizeApp');
}

let maximizeApp = () => {
  window.ipcRenderer.send('maximizeApp');
}
</script>

<template>
  <div
      class="electron-navbar">
    <div class="electron-items" @click="minimizeApp">
      <minimize :width="16" :height="16"></minimize>
    </div>
    <div class="electron-items" @click="maximizeApp">
      <checkbox :width="16" :height="16"></checkbox>
    </div>
    <div class="electron-items" @click="closeApp">
      <close :width="16" :height="16"></close>
    </div>
  </div>
  <player></player>
  <navbar></navbar>
  <main>
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-9 py-20">
        <RouterView/>
      </div>
      <div class="col-span-3 relative">
        <aside-bar></aside-bar>
      </div>
    </div>
  </main>

  <div class="fixed bottom-0 left-0 pointer-events-none bg-white bg-opacity-35 z-50 blur-[150px] w-56 h-56"></div>
    <div class="fixed -top-12 pointer-events-none -right-12 bg-white bg-opacity-35 z-50 blur-[150px] w-56 h-56"></div>
</template>

<style scoped>

</style>
