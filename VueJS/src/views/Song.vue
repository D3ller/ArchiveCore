<script setup>
import {useRoute} from 'vue-router';
import {getCurrentInstance, onMounted, ref} from "vue";
import axios from "axios";
import ArtistBubble from "@/components/artist/ArtistBubble.vue";
import {getSvgPath} from "figma-squircle";
import Tracks from "@/components/tracks.vue";

const route = useRoute();
const id = route.params.id;
let song = ref(null);
let cover = ref(null);
let rounded = ref(null);
let error = ref(null);

onMounted(() => {

  if (cover.value) {
    console.log(cover.value)
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
    } catch (error) {
      console.error('Erreur lors de la récupération du chemin SVG:', error);
    }
  }

  axios.get(`http://localhost:5132/api/song/find/${id}`, {
    withCredentials: true
  }).then((response) => {
    console.log(response.data);
    song.value = response.data;
  }).catch((error) => {
    console.log(error);
  })


})

let msToSecAndMin = (ms) => {
  let min = Math.floor(ms / 60000);
  let sec = ((ms % 60000) / 1000).toFixed(0);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

</script>

<template>
  <div class="page_track">
    <div class="track" v-if="!error">
      <div class="track-icon" :style="{clipPath: rounded}" ref="cover">
        <img :src="'http://localhost:5132'+song.coverURL" alt="cover" v-if="song">
      </div>
      <div class="track-content" v-if="song">
        <p class="paragraph text-sm">Track — {{ msToSecAndMin(song.duration) }}</p>
        <h1>{{ song.title }}</h1>
        <artist-bubble class="mt-2" :avatarURL="song.artist.avatarURL" :name="song.artist.name"></artist-bubble>
      </div>
    </div>

    <tracks class="once" :trackNumber="1" :title="song.title" :duration="msToSecAndMin(song.duration)" v-if="song"></tracks>

  </div>
</template>

<style scoped>

</style>