<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { getSvgPath } from 'figma-squircle';
import Tracks from "../components/tracks.vue";
import Notfound from "../components/notfound.vue";
import TrackDetails from "../components/track-details.vue";
import { useAccount } from "../stores/account.js";
import Buttons from "../components/button/buttons.vue";

let account = useAccount();

const route = useRoute();
const router = useRouter();
const artist = ref(null);
const feat = ref(null);
const cover = ref(null);
const rounded = ref(null);
const error = ref(null);
const subscription = ref(null);
const subscribed = ref(null);

function roundedClipPath() {
  if (cover.value) {
    const width = cover.value.clientWidth;
    const height = cover.value.clientHeight;

    try {
      const svgPath = getSvgPath({
        width,
        height,
        cornerRadius: 20,
        cornerSmoothing: 1,
      });

      rounded.value = `path('${svgPath}')`;
      console.log(rounded.value);
    } catch (error) {
      console.error('Erreur lors de la récupération du chemin SVG:', error);
    }
  }
}

function fetchArtistData(id) {
  axios.get(`https://192.168.1.158:5132/api/artist/find/${id}`, {
    withCredentials: true
  })
      .then((response) => {
        artist.value = response.data;
        subscription.value = response.data.subscribed;
        subscribed.value = response.data._count.subscription;
        setTimeout(() => {
          roundedClipPath();
        }, 0.1);
      })
      .catch((err) => {
        error.value = true;
      });
}

let toggleSubscription = () => {
  if (account.connected) {
    axios.post('https://192.168.1.158:5132/api/subscribe/toggle', {
      artistid: route.params.id,
    }, {
      withCredentials: true
    })
        .then((response) => {
          subscription.value = response.data.subscribed;
          response.data.subscribed ? subscribed.value++ : subscribed.value--;
        })
        .catch((err) => {
          if (err.response.status === 429) {
            subscription.value = 'Too many attempts';
          }
          if (err.response.status === 401) {
            router.push({ name: 'login', query: { redirect: route.fullPath } });
          }
        });
  } else {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
  }
};

onMounted(() => {
  fetchArtistData(route.params.id);
});

watch(() => route.params.id, (newId) => {
  fetchArtistData(newId);
});
</script>

<template>
  <div class="page_track">
    <div class="track" v-if="artist">
      <div class="track-icon"
           :style="{ clipPath: rounded, backgroundImage: `url(https://192.168.1.158:5132${artist.avatarURL})` }"
           ref="cover"></div>
      <div class="artist-content">
        <h1>{{ artist.name }}</h1>
        <p class="paragraph">{{ subscribed }} followers | {{artist.listener}} monthly listeners</p>
        <button
            :class="{

      'button button-border': true,
      'active': subscription === true || subscription === false,
      'error': subscription === 'Too many attempts'
    }" @click="toggleSubscription">
          <span v-if="subscription === true">Subscribed</span>
          <span v-else-if="subscription === false">Subscribe</span>
          <span v-else-if="subscription === 'Too many attempts'">Too many attempts</span>
          <span v-else>Subscribe</span>
        </button>
      </div>
    </div>


    <tracks v-for="(song, index) in artist.songs" :key="song.slug"
            :class="index >= 1 ? '' : 'once'"
            :track-number="index + 1"
            :to="{ name: 'song', params: { id: song.slug } }"
            :song="song"
            v-if="artist">
    </tracks>


    <div v-if="artist">
      <div class="release" v-if="artist.recentSongs.length > 0">
        <h2>Latest Release</h2>

        <div class="release-content">
          <track-details v-for="recent in artist.recentSongs" :to="{name: 'song', params: {id: recent.slug}}"
                         :title="recent.title"
                         :album="recent.album"
                         :artistAvatar="artist.avatarURL"
                         :cover-url="recent.coverURL"></track-details>
        </div>
      </div>

      <div class="flex justify-center items-center">
        <buttons class="w-fit mt-10" type="border">Discover More</buttons>
      </div>

      <div class="release" v-if="artist.Album.length > 0">
        <h2>Albums & EPs</h2>

        <div class="release-content">
          <track-details v-for="album in artist.Album" :to="{name: 'album', params: {id: album.slug}}"
                         :title="album.title" :album="album"
                         :cover-url="album.coverURL"></track-details>
        </div>

      </div>

      <div class="release" v-if="artist.feat.length > 0">
        <h2>Appears On</h2>

        <div class="release-content">

          <track-details v-for="(ft, i) in artist.feat" :to="{name: 'song', params: {id: ft.song.slug}}" :artist="ft.song.artist"
                         :title="ft.song.title" :album="ft.song.album" :cover-url="ft.song.coverURL">
          </track-details>
        </div>
      </div>

    </div>


    <div v-if="error" class="error-message">
      <notfound></notfound>
    </div>
  </div>

</template>

<style scoped>

</style>