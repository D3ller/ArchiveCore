<script setup>
import axios from "axios";
import {computed, ref} from "vue";
import router from "../../router/index.js";
import Buttons from "../../components/button/buttons.vue";
import TrackDetails from "../../components/track-details.vue";

let account = ref(null)


axios.get('http://localhost:5132/api/account/get', {
  withCredentials: true
})
    .then((response) => {
      account.value = response.data.user;
      console.log(account.value);

      const maxPerLine = 4;
      const remainingTrackDetailsCount = computed(() => {
        const currentCount = account.value.subscription.length;
        return maxPerLine - (currentCount % maxPerLine) || 0; // Si le reste est 0, retourner 0 pour ne pas ajouter d'invisibles
      });
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
      <p class="paragraph mt-2" v-if="account.subscription.length === 0">No favorite artist yet</p>
      <div class="mt-5 grid grid-cols-12 gap-2" v-else>
        <track-details
            v-for="sub in account.subscription"
            :key="sub.artist.id"
        class="mt-5 col-span-3"
        :to="{ name: 'artist', params: { id: sub.artist.slug } }"
        :title="sub.artist.name"
        :cover-url="'http://localhost:5132' + sub.artist.avatarURL"
        ></track-details>

        <track-details
            v-for="n in remainingTrackDetailsCount"
            :key="'invisible-' + n"
        class="invisible"
        title="No song"
        cover-url="ddd"
        ></track-details>

      </div>
      </div>
    </div>


</template>

<style scoped>

</style>