<script setup>
import axios from "axios";
import {computed, ref} from "vue";
import router from "../../router/index.js";
import Buttons from "../../components/button/buttons.vue";
import TrackDetails from "../../components/track-details.vue";
import {useAccount} from "../../stores/account.js";
let account = useAccount();
let accounts = ref(null)


axios.get('https://192.168.1.158:5132/api/account/get', {
  withCredentials: true
})
    .then((response) => {
      accounts.value = response.data.user;
      console.log(accounts.value);

      const maxPerLine = 4;
      const remainingTrackDetailsCount = computed(() => {
        const currentCount = accounts.value.subscription.length;
        return maxPerLine - (currentCount % maxPerLine) || 0; // Si le reste est 0, retourner 0 pour ne pas ajouter d'invisibles
      });
    })
    .catch((err) => {
      if (err.response.status === 401 && err.response.data.message === 'User is not logged in') {
        account.set(false);
        router.push({
          name: 'login',
          query: {
            redirect: router.currentRoute.value.fullPath
          }
        });
      }
    })


</script>

<template>
  <div class="page_profile" v-if="accounts">
    <div class="profile_banner" :style="{backgroundImage: `url(${accounts.bannerURL})`}">
      <div class="profile_avatar" :style="{backgroundImage: `url(${accounts.avatarURL})`}"></div>
    </div>
    <div class="mt-24 flex justify-between items-start">
      <div>
        <h2>{{ accounts.username }}</h2>
        <p class="paragraph mt-2">{{ accounts.bio }}</p>
      </div>

      <buttons class="h-fit"  type="rounded">Edit profile</buttons>

    </div>

    <div class="mt-10">
      <h3>Your favorite Artist</h3>
      <p class="paragraph mt-2" v-if="accounts.subscription.length === 0">No favorite artist yet</p>
      <div class="mt-5 grid grid-cols-12 gap-2" v-else>
        <track-details
            v-for="sub in accounts.subscription"
            :key="sub.artist.id"
        class="mt-5 col-span-3"
        :to="{ name: 'artist', params: { id: sub.artist.slug } }"
        :title="sub.artist.name"
        :cover-url="sub.artist.avatarURL"
        ></track-details>
      </div>
      </div>
    </div>


</template>

<style scoped>

</style>