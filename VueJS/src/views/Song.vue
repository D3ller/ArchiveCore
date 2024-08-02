<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import ArtistBubble from '@/components/artist/ArtistBubble.vue';
import { getSvgPath } from 'figma-squircle';
import Tracks from '@/components/tracks.vue';
import Notfound from '@/components/notfound.vue';

const route = useRoute();
const id = route.params.id;
const song = ref(null);
const cover = ref(null);
const rounded = ref(null);
const error = ref(null);

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
      console.log(response.data);
      song.value = response.data;
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
        <img :src="'http://localhost:5132' + song.coverURL" alt="cover" v-if="song">
      </div>
      <div class="track-content" v-if="song">
        <p class="paragraph text-sm">Track — {{ msToSecAndMin(song.duration) }}</p>
        <h1>{{ song.title }}</h1>
        <artist-bubble :to="'/artist/' + song.artist.slug" class="mt-2" :avatarURL="song.artist.avatarURL" :name="song.artist.name"></artist-bubble>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <notfound></notfound>
    </div>

    <tracks class="once" :trackNumber="1" :title="song.title" :duration="song.duration" v-if="song"></tracks>
  </div>
</template>