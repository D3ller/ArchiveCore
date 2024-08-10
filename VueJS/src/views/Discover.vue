<script setup lang="ts">
import lodash from 'lodash';
import {ref} from "vue";
import axios from "axios";
import Tracks from "../components/tracks.vue";

let s = ref('');
let results: any = ref([]);
let artist = ref([]);
let search = lodash.debounce(() => {
  artist.value = [];
  axios.get('http://localhost:5132/api/search/' + s.value, {
    withCredentials: true
  }).then((response) => {
        results.value = response.data;
        if (response.data.songs.length === 0) {
          artist.value.push([]);
        } else {
          for (let i = 0; i < response.data.songs.length; i++) {
            artist.value.push([]);
            for (let j = 0; j < response.data.songs[i].Featurings.length; j++) {
              artist.value[i].push(response.data.songs[i].Featurings[j].artist);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
}, 500);

</script>

<template>
  <div class="page_discover">
    <h1 v-if="!s">Discover</h1>
    <h1 v-if="s">Results for "{{ s }}"</h1>

    <input type="text" v-model="s" placeholder="Search a song, an album, an artist"
           class="w-full my-5 p-4 bg-[#121212] placeholder:text-[#727475] font-medium rounded-lg text-white"
           @input="search()">

    <div class="text-white" v-if="s && results">
      <div class="mt-5">
        <h2>Songs</h2>
        <div class="mt-5 flex flex-col">
          <tracks :to="{name: 'song', params: {id: song.slug}}" :song="song" :featured="artist[i]"
                  v-for="(song, i) in results?.songs" :artist="song.artist" :track-number="i+1"></tracks>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>