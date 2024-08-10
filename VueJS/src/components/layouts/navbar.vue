<script setup>
import {useAccount} from "../../stores/account.js";
import Devonly from "../devonly.vue";
import socket from "../../socket.ts";
import {ref} from "vue";

const account = useAccount();
let pendingRequests = ref(0);

socket.on('pendingRequests', (data) => {
  pendingRequests.value = data;
})

socket.on('friendRequest', () => {
  console.log('New friend request');
  pendingRequests.value++;
})
</script>

<template>

  <header>
    <nav class="navbar">

      <div class="navbar-brand">
        <img src="../../assets/image/favicon/favicon.ico" alt="logo"/>
      </div>

      <div class="navbar-title">Browse</div>
      <div class="navbar-menu">
        <router-link to="/" class="navbar-item"><span class="material-symbols-outlined">home</span>Home
        </router-link>
        <router-link to="/discover" class="navbar-item"><span class="material-symbols-outlined">equalizer</span>Discover
        </router-link>

        <devonly>
          <router-link to="/dev/dashboard" class="navbar-item"><span class="material-symbols-outlined">code</span>Dev
          </router-link>
        </devonly>
      </div>

      <div v-if="!account.connected">
        <div class="navbar-title">Account</div>
        <div class="navbar-menu">
          <router-link :to="{name: 'login'}" class="navbar-item"><span class="material-symbols-outlined">login</span>Login
          </router-link>
          <router-link :to="{name: 'register'}" class="navbar-item"><span
              class="material-symbols-outlined">person_add</span>Register
          </router-link>
        </div>
      </div>

      <div v-else>
        <div class="navbar-title">My Music</div>

        <div class="navbar-menu">
          <router-link :to="{name: 'history'}" class="navbar-item"><span
              class="material-symbols-outlined">schedule</span>Recent Played
          </router-link>
          <div class="navbar-item"><span class="material-symbols-outlined">bookmark</span>Bookmark</div>
          <router-link :to="{name: 'playlist'}" class="navbar-item"><span class="material-symbols-outlined">
playlist_play
</span>Playlists
          </router-link>
        </div>

        <div class="navbar-title">Account</div>

        <div class="navbar-menu">
          <router-link :to="{name: 'dashboard'}" class="navbar-item"><span class="material-symbols-outlined">account_circle</span>Profile
          </router-link>
          <router-link to="/friends" class="navbar-item"><span class="material-symbols-outlined">artist</span>Friends
            <span
                v-if="pendingRequests > 0" class="badge">{{ pendingRequests }}</span>
          </router-link>
          <div class="navbar-item"><span class="material-symbols-outlined">settings</span>Settings</div>
          <router-link :to="{name: 'logout'}" class="navbar-item"><span class="material-symbols-outlined">logout</span>Logout
          </router-link>
        </div>
      </div>


    </nav>
  </header>
</template>

<style scoped>

</style>