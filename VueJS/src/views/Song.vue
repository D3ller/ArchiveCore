<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import ArtistBubble from "../components/artist/ArtistBubble.vue";
import { getSvgPath } from 'figma-squircle';
import Tracks from "../components/tracks.vue";
import Notfound from "../components/notfound.vue";
import Buttons from "../components/button/buttons.vue";
import {Player} from "../stores/account.js";

let player = Player();
const route = useRoute();
const router = useRouter();
const song = ref(null);
const cover = ref(null);
const rounded = ref(null);
const error = ref(null);
const artist = ref([]);
const lyrics = ref(null);

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

function fetchSongData(id) {
  axios.get(`http://localhost:5132/api/song/find/${id}`, {
    withCredentials: true
  })
      .then((response) => {
        song.value = response.data;
        artist.value = [];
        for (let i = 0; i < response.data.Featurings.length; i++) {
          artist.value.push(response.data.Featurings[i].artist);
          console.log(artist.value);
        }
        setTimeout(() => {
          roundedClipPath();
        }, 0.1);

        axios.post('http://localhost:5132/api/song/lyric', {artist: song.value.artist.name, title: song.value.title}, {
          withCredentials: true
        }).then((response) => {
          lyrics.value = response.data.lyrics.replace(/\n/g, '<br>');
        }).catch((err) => {
          console.error(err);
        });


      })
      .catch((err) => {
        error.value = true;
      });
}

const msToSecAndMin = (ms) => {
  let min = Math.floor(ms / 60000);
  let sec = ((ms % 60000) / 1000).toFixed(0);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

onMounted(() => {
  fetchSongData(route.params.id);
});

watch(() => route.params.id, (newId) => {
  fetchSongData(newId);
});

const playSingle = () => {
  player.setSong({
    title: song.value.title,
    url: `http://localhost:5132/file/song/${song.value.slug}`,
    duration: song.value.duration,
    coverURL: `http://localhost:5132/file/${song.value.coverURL === 'null' || song.value.coverURL === null ? 'artist' : 'cover'}/${song.value.coverURL === 'null' || song.value.coverURL === null ? song.value.artist.slug : song.slug}`,
    artist: song.value.artist.name
  });
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
        <buttons class="w-fit mt-5" type="border" @click="playSingle()">Play Single</buttons>
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

    <div class="mt-10" v-if="lyrics">
      <p class="paragraph" v-html="lyrics">
      </p>
    </div>
  </div>
</template>