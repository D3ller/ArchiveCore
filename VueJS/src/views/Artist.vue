<script setup>
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import axios from 'axios';
import ArtistBubble from '@/components/artist/ArtistBubble.vue';
import {getSvgPath} from 'figma-squircle';
import Tracks from '@/components/tracks.vue';
import Notfound from '@/components/notfound.vue';
import Buttons from "@/components/button/buttons.vue";

const route = useRoute();
const id = route.params.id;
const artist = ref(null);
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
      console.log(response.data);
      artist.value = response.data;
      setTimeout(() => {
        roundedClipPath();
      }, 0.1);

    })
    .catch((err) => {
      error.value = true;
    });
</script>

<template>
  <div class="page_track">
    <div class="track" v-if="artist">
      <div class="track-icon" :style="{ clipPath: rounded, backgroundImage: `url(http://localhost:5132${artist.avatarURL})` }" ref="cover"></div>
      <div class="artist-content">
        <h1>{{ artist.name }}</h1>
        <p class="paragraph">123k followers</p>
        <buttons type="border">Subscribe</buttons>
      </div>
    </div>



  <tracks v-for="(song, index) in artist.songs" type="album" :class="index >= 1 ? '' : 'once'" :trackNumber="index+1"
          :to="{name: 'song', params: {id: song.slug}}" :title="song.title" :duration="song.duration" v-if="artist"
          :cover-u-r-l="song.coverURL"></tracks>

  <div class="lastest-release" v-if="artist">
    <h2>Lastest Release</h2>
  </div>


  <div v-if="error" class="error-message">
    <notfound></notfound>
  </div>
  </div>

</template>

<style scoped>

</style>