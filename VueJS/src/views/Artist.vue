<script setup>
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {getSvgPath} from 'figma-squircle';
import Tracks from "../components/tracks.vue";
import Notfound from "../components/notfound.vue";
import TrackDetails from "../components/track-details.vue";
import {useAccount} from "../stores/account.js";
import router from "../router/index.js";

let account = useAccount();

const route = useRoute();
const id = route.params.id;
const artist = ref(null);
const feat = ref(null);
const cover = ref(null);
const rounded = ref(null);
const error = ref(null);
const subscription = ref(null);


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

axios.get(`http://localhost:5132/api/artist/find/${id}`, {
  withCredentials: true
})
    .then((response) => {
      artist.value = response.data;
      subscription.value = response.data.subscribed;
      setTimeout(() => {
        roundedClipPath();
      }, 0.1);

    })
    .catch((err) => {
      error.value = true;
    });

let toggleSubscription = () => {
  if (account.connected) {
    axios.post('http://localhost:5132/api/subscribe/toggle', {
      artistid: id,
    }, {
      withCredentials: true
    })
        .then((response) => {
          subscription.value = response.data.subscribed
        })
        .catch((err) => {
          if (err.response.status === 429) {
            subscription.value = 'Too many attempts';
          }
          if(err.response.status === 401) {
            router.push({name: 'login', query: {redirect: route.fullPath}});
          }
        });
  } else {
    router.push({name: 'login', query: {redirect: route.fullPath}});
  }
}
</script>

<template>
  <div class="page_track">
    <div class="track" v-if="artist">
      <div class="track-icon"
           :style="{ clipPath: rounded, backgroundImage: `url(http://localhost:5132${artist.avatarURL})` }"
           ref="cover"></div>
      <div class="artist-content">
        <h1>{{ artist.name }}</h1>
        <p class="paragraph">123k followers</p>
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
                         :cover-url="'http://localhost:5132/file/cover/'+`${recent.album ? recent.album.slug : recent.slug}`"></track-details>
          <track-details class="invisible" v-for="i in 4 - artist.recentSongs.length" :key="i" title="No song"
                         cover-url="ddd"></track-details>
        </div>
      </div>

      <div class="release" v-if="artist.Album.length > 0">
        <h2>Albums & EPs</h2>

        <div class="release-content">
          <track-details v-for="album in artist.Album" :to="{name: 'album', params: {id: album.slug}}"
                         :title="album.title"
                         :cover-url="'http://localhost:5132/file/cover/'+`${album.slug}`"></track-details>
          <track-details class="invisible" v-for="i in 4 - artist.Album.length" :key="i" title="No song"
                         cover-url="ddd"></track-details>
        </div>

      </div>

      <div class="release" v-if="artist.feat.length > 0">
        <h2>Appears On</h2>
      </div>

    </div>


    <div v-if="error" class="error-message">
      <notfound></notfound>
    </div>
  </div>

</template>

<style scoped>

</style>