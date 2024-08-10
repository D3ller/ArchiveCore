<script setup lang="ts">
import {useRouter} from "vue-router";
import axios from "axios";
import {ref} from "vue";
import {getSvgPath} from "figma-squircle";
import Tracks from "../../components/tracks.vue";
import Buttons from "../../components/button/buttons.vue";
import {Player} from "../../stores/account";
import ArtistBubble from "../../components/artist/ArtistBubble.vue";
let player = Player()

let router = useRouter()
let id = router.currentRoute.value.params.id
let playlist = ref(null)
let cover = ref(null)
let rounded = ref(null)

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

let getPlaylist = () => {
  axios.get(`http://localhost:5132/api/playlist/${id}`, {
    withCredentials: true
  }).then((response) => {
    playlist.value = response.data
    setTimeout(() => {
      roundedClipPath();
    }, 0.1);
  }).catch((error) => {
    console.error(error)
  })
}

getPlaylist();


let playPlaylist = () => {
  if(playlist.value.songs.length === 0) return;

  for (let i = playlist.value.songs.length - 1; i > 0; i--) {
    console.log(playlist.value)
    player.addToQueueFirst({
      title: playlist.value.songs[i].song.title,
      url: 'http://localhost:5132/file/song/' + playlist.value.songs[i].song.slug,
      duration: playlist.value.songs[i].song.duration,
      coverURL: 'http://localhost:5132/file/cover/' + playlist.value.slug,
      artist: playlist.value.songs[i].song.artist.name
    });
  }
  player.setSong({
    title: playlist.value.songs[0].song.title,
    url: 'http://localhost:5132/file/song/' + playlist.value.songs[0].song.slug,
    duration: playlist.value.songs[0].song.duration,
    coverURL: 'http://localhost:5132/file/cover/' + playlist.value.songs[0].song.slug,
    artist: playlist.value.songs[0].song.artist.name
  })
};


</script>

<template>
<div class="page_track">
  <div class="track" v-if="playlist">
    <div class="track-icon"
         :style="{ clipPath: rounded, backgroundImage: `url(${playlist.coverURL})` }"
         ref="cover"></div>

    <div class="track-content">
      <p class="paragraph text-sm">Playlist </p>
      <h1 class="track-title">{{ playlist.title }}</h1>
<artist-bubble class="mt-2" :to="`/user/${playlist.account.slug}`" :name="playlist.account.username" :avatar-u-r-l="playlist.account.avatarURL"></artist-bubble>
      <div class="mt-5">
        <buttons type="border" @click="playPlaylist">Play playlist</buttons>
      </div>
    </div>
  </div>

  <div v-if="playlist">
    <Tracks @update:modelValue="getPlaylist()" v-for="(s,i) in playlist.songs" :class="i >= 1 ? '' : 'once'" :to="{name: 'song', params: {slug: s.slug}}" :key="i" :trackNumber="i + 1" :song="s.song" :featured="s.song.Featurings" :artist="s.song.artist" :album="s.song.album" :delete-song="{songSlug: s.song.slug,playlistSlug: playlist.slug}"></Tracks>
  </div>

  <div v-else>
  </div>

</div>

</template>

<style scoped>

</style>