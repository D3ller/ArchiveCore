<script setup lang="ts">
import { ref, Ref } from 'vue';
import axios, { AxiosResponse, AxiosError } from 'axios';
import lodash from 'lodash';
import { Song, Artist } from '../interface';
import Tracks from "../components/tracks.vue";

let s: Ref<string> = ref('');
let results: Ref<Song[]> = ref([]);
let artist: Ref<Artist[][]> = ref([]);

let search = lodash.debounce(() => {
  artist.value = [];

  axios.get<{ songs: Song[] }>('https://192.168.1.158:5132/api/search/' + s.value, {
    withCredentials: true
  })
      .then((response: AxiosResponse<{ songs: Song[] }>) => {
        results.value = response.data.songs;

        artist.value = response.data.songs.map(song =>
            song.featurings || []
        );
      })
      .catch((error: AxiosError) => {
        console.log('Erreur lors de la recherche:', error);
      });
}, 500);

</script>

<template>
  <div class="page_discover">
    <h1 v-if="!s">Discover</h1>
    <h1 v-if="s">Results for "{{ s }}"</h1>

    <input type="text" v-model="s" placeholder="Search a song, an album, an artist"
           class="w-full my-5 p-4 bg-[#121212] placeholder:text-[#727475] font-medium rounded-lg text-white"
           @input="search()">

    <div class="text-white" v-if="s && results.length">
      <div class="mt-5">
        <h2>Songs</h2>
        <div class="mt-5 flex flex-col">
          <tracks :to="{name: 'song', params: {id: song.slug}}" :song="song" :featured="artist[i]"
                  v-for="(song, i) in results" :artist="song.artist" :track-number="i+1"></tracks>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
