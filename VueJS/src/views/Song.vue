<script setup>
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import axios from 'axios';
import ArtistBubble from "../components/artist/ArtistBubble.vue";
import {getSvgPath} from 'figma-squircle';
import Tracks from "../components/tracks.vue";
import Notfound from "../components/notfound.vue";

const route = useRoute();
const id = route.params.id;
const song = ref(null);
const cover = ref(null);
const rounded = ref(null);
const error = ref(null);
const artist = ref([]);

function roundedClipPath() {
  if (cover.value) {
    const width = cover.value.clientWidth;
    const height = cover.value.clientHeight;

    try {
      const svgPath = getSvgPath({
        width,
        height,
        cornerRadius: 48,
        cornerSmoothing: 1,
      });

      rounded.value = `path('${svgPath}')`;
      console.log(rounded.value);
    } catch (error) {
      console.error('Erreur lors de la récupération du chemin SVG:', error);
    }
  }
}

axios.get(`http://localhost:5132/api/song/find/${id}`, {
  withCredentials: true
})
    .then((response) => {
      song.value = response.data;
      for (let i = 0; i < response.data.Featurings.length; i++) {
        artist.value.push(response.data.Featurings[i].artist);
        console.log(artist.value);
      }

      setTimeout(() => {
        roundedClipPath();
      }, 0.1);

    })
    .catch((err) => {
      error.value = true;
    });

const msToSecAndMin = (ms) => {
  let min = Math.floor(ms / 60000);
  let sec = ((ms % 60000) / 1000).toFixed(0);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};
</script>


<template>
  <div class="page_track">
    <div class="track" v-if="song">
      <div class="track-icon" :style="{ clipPath: rounded }" ref="cover">
        <img :src="`http://localhost:5132/file/${song.coverURL === 'null' ? 'artist' : 'cover'}/${song.album ? song.album.slug : song.coverURL === 'null' ? song.artist.slug : song.slug}`" alt="cover" v-if="song">
      </div>
      <div class="track-content" v-if="song">
        <p class="paragraph text-sm">Track — {{ msToSecAndMin(song.duration) }}</p>
        <h1>{{ song.title }}</h1>
        <artist-bubble :to="'/artist/' + song.artist.slug" class="mt-2"
                       :avatarURL="song.artist.avatarURL" :name="song.artist.name"></artist-bubble>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <notfound></notfound>
    </div>

    <tracks class="once" :trackNumber="1" :album="song.album" :duration="song.duration" :featured="artist" :artist="song.artist" :slug="song.slug" :song="song" :type="'song'"
            v-if="song"></tracks>

    <p class="paragraph mt-5" v-if="song && song.album">
      <router-link :to="'/album/' + song.album.slug">Album — {{ song.album.title }}</router-link>
    </p>
  </div>
</template>