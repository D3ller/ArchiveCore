<script setup>
import ArtistBubble from "../components/artist/ArtistBubble.vue";
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {getSvgPath} from 'figma-squircle';
import Tracks from "../components/tracks.vue";
let route = useRoute();
let id = route.params.id;

let album = ref(null);
let cover = ref(null);
let rounded = ref(null);
let featured = ref([]);

function roundedClipPath() {
  if (cover.value) {
    const width = 240;
    const height = 240;

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


axios.get(`http://localhost:5132/api/album/find/${id}`, {
  withCredentials: true
})
    .then((response) => {
      album.value = response.data;
      for(let i = 0; i < response.data.songs.length; i++) {
        console.log(response.data.songs)
        for(let j = 0; j < response.data.songs[i].Featurings.length; j++) {
          featured.value.push([response.data.songs[i].Featurings[j].artist])
        }
      }
      setTimeout(() => {
        roundedClipPath();
      }, 0.1);
    })
    .catch((err) => {
      console.error(err);
    });


</script>

<template>
  <div class="page_track">
    <div class="track" v-if="album">
      <div class="track-icon" :style="{ clipPath: rounded }" ref="cover">
        <img :src="`http://localhost:5132/file/cover/${album.slug}`" alt="cover" v-if="album">
      </div>
      <div class="track-content" v-if="album">
        <p class="paragraph text-sm">Album </p>
        <h1>{{ album.title }}</h1>
        <artist-bubble :to="'/artist/' + album.artist.slug" class="mt-2" :artist="album.artist.name"
                       :avatarURL="album.artist.avatarURL" :name="album.artist.name"></artist-bubble>
      </div>

    </div>

    <tracks v-if="album" v-for="(track, i) in album.songs" :class="i >= 1 ? '' : 'once'" :to="{name: 'song', params: {id: track.slug}}"
            :trackNumber="i+1" :album="album" :song="track" :key="track.id" :artist="album.artist" :featured="track.Featurings">
    </tracks>

  </div>
</template>

<style scoped>

</style>