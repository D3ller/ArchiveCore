<script setup>
import ArtistBubble from "../components/artist/ArtistBubble.vue";
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {getSvgPath} from 'figma-squircle';
import Tracks from "../components/tracks.vue";
import Buttons from "../components/button/buttons.vue";
import {Player} from "../stores/account.js";

let player = Player();
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


axios.get(`https://192.168.1.158:5132/api/album/find/${id}`, {
  withCredentials: true
})
    .then((response) => {
      album.value = response.data;
      for(let i = 0; i < response.data.songs.length; i++) {
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

let playAlbum = () => {
  for (let i = album.value.songs.length - 1; i > 0; i--) {
    player.addToQueueFirst({
      title: album.value.songs[i].title,
      url: 'https://192.168.1.158:5132/file/song/' + album.value.songs[i].slug,
      duration: album.value.songs[i].duration,
      coverURL: 'https://192.168.1.158:5132/file/cover/' + album.value.slug,
      artist: album.value.artist.name
    });
  }
  player.setSong({
    title: album.value.songs[0].title,
    url: 'https://192.168.1.158:5132/file/song/' + album.value.songs[0].slug,
    duration: album.value.songs[0].duration,
    coverURL: 'https://192.168.1.158:5132/file/cover/' + album.value.slug,
    artist: album.value.artist.name
  })
};




</script>

<template>
  <div class="page_track">
    <div class="track" v-if="album">
      <div class="track-icon" :style="{ clipPath: rounded }" ref="cover">
        <img :src="`https://192.168.1.158:5132/file/cover/${album.slug}`" alt="cover" v-if="album">
      </div>
      <div class="track-content" v-if="album">
        <p class="paragraph text-sm">Album </p>
        <h1>{{ album.title }}</h1>
        <artist-bubble :to="'/artist/' + album.artist.slug" class="mt-2" :artist="album.artist.name"
                       :avatarURL="album.artist.avatarURL" :name="album.artist.name"></artist-bubble>
        <buttons class="w-fit mt-5" type="border" @click="playAlbum()">Play Album</buttons>
      </div>

    </div>

    <tracks v-if="album" v-for="(track, i) in album.songs" :class="i >= 1 ? '' : 'once'" :to="{name: 'song', params: {id: track.slug}}"
            :trackNumber="i+1" :album="album" :song="track" :key="track.id" :artist="album.artist" :featured="track.Featurings">
    </tracks>

  </div>
</template>

<style scoped>

</style>