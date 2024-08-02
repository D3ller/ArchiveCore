<script setup>
import axios from "axios";
import {ref} from "vue";
import router from "@/router/index.js";
import Buttons from "@/components/button/buttons.vue";

let account = ref(null)

axios.get('http://localhost:5132/api/account/get', {
  withCredentials: true
})
    .then((response) => {
      account.value = response.data.user;
      console.log(account.value);
    })
    .catch((error) => {
      if (error.response.status === 401) {
        router.push({name: 'login'});
      }
      console.log(error);
    })
</script>

<template>
  <div class="page_profile" v-if="account">
    <div class="profile_banner" :style="{backgroundImage: `url(${account.bannerURL})`}">
      <div class="profile_avatar" :style="{backgroundImage: `url(${account.avatarURL})`}"></div>
    </div>
    <div class="mt-24 flex justify-between items-start">
      <div>
        <h2>{{ account.username }}</h2>
        <p class="paragraph mt-2">{{ account.bio }}</p>
      </div>

      <buttons class="h-fit"  type="rounded">Edit profile</buttons>

    </div>

    <div class="mt-10">
      <h3>Your favorite Artist</h3>
      <p class="paragraph mt-2">No favorite artist yet</p>
    </div>


  </div>
</template>

<style scoped>

</style>