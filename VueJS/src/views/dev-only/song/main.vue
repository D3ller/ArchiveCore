<!--suppress ALL -->



<script>
import Buttons from "../../../components/button/buttons.vue";
import Modal from "../../../components/modal/modal.vue";
import {ref} from "vue";
import axios from "axios";
import Alerts from "../../../components/alerts.vue";
import Cselect from "../../../components/input/cselect.vue";

let artist = ref(null)
let song = ref(null)

axios.post('https://192.168.1.158:5132/api/artist/all', {}, {
  withCredentials: true
}).then(res => {
  artist.value = res.data
}).catch(err => {
  console.log(err)
})

axios.post('https://192.168.1.158:5132/api/song/all', {}, {
  withCredentials: true
}).then(res => {
  song.value = res.data
}).catch(err => {
  console.log(err)
})

let modal = ref({
  error: {
    message: '',
    type: ''
  },
  addModal: {
    open: false,
    title: '',
    published: 'December 17, 1995 03:24:00',
    duration: parseInt(''),
    artist: '',
    slug: '',
    cover: false
  },
  featureModal: {
    open: false,
    songID: '',
    artistID: ''
  }

})

let addSong = () => {
  axios.post('https://192.168.1.158:5132/api/song/add', {
    title: modal.value.addModal.title,
    slugs: modal.value.addModal.slug,
    duration: parseInt(modal.value.addModal.duration),
    published: modal.value.addModal.published,
    artistid: parseInt(modal.value.addModal.artist),
    cover: modal.value.addModal.cover ? '/file/cover/' + modal.value.addModal.slug : 'null'
  }, {
    withCredentials: true
  }).then(res => {
    modal.value.addModal.open = false
    modal.value.addModal.title = ''
    modal.value.addModal.published = 'December 17, 1995 03:24:00'
    modal.value.addModal.duration = parseInt('')
    modal.value.addModal.artist = ''
    modal.value.addModal.slug = ''
  })
}

let addFeature = () => {
  axios.post('https://192.168.1.158:5132/api/song/addFeature', {
    songId: parseInt(modal.value.featureModal.songID),
    artistId: parseInt(modal.value.featureModal.artistID)
  }, {
    withCredentials: true
  }).then(res => {
    modal.value.featureModal.open = false
    modal.value.featureModal.songID = ''
    modal.value.featureModal.artistID = ''
  })
}
</script>

<template>
  <div class="flex justify-between items-center">
    <h1>Admin Song</h1>

    <div class="flex gap-2">
      <buttons type="border" @click="modal.addModal.open = true">Add Song</buttons>
      <buttons type="border" @click="modal.featureModal.open = true">Add Feature</buttons>
    </div>

    <modal confirm-text="Add" title="Add song" subtitle="Create a song" v-if="modal.addModal.open"
           @close="modal.addModal.open = false" @send="addSong">
      <div class="mt-5">
        <label class="modal-label" for="songName">Song title</label>
        <input type="text" class="modal-input" v-model="modal.addModal.title"/>
      </div>
      <div class="mt-5">
        <label class="modal-label" for="songImage">Song Slug</label>
        <input type="text" class="modal-input" v-model="modal.addModal.slug"/>
      </div>
      <div class="mt-5">
        <label class="modal-label" for="songDuration">Song duration</label>
        <input type="number" class="modal-input" v-model="modal.addModal.duration"/>
      </div>
      <div class="mt-5">
        <label class="modal-label" for="songArtist">Song published</label>
        <input type="text" class="modal-input" v-model="modal.addModal.published"/>
      </div>
      <div class="mt-5">
        <label class="modal-label" for="songArtist">Song cover</label>
        <input type="checkbox" class="modal-input" v-model="modal.addModal.cover"/>
      </div>
      <div class="mt-5">
        <label class="modal-label" for="songArtist">Song Artist</label>
        <cselect :options="artist" @select="modal.addModal.artist = artist[$event].id"/>
      </div>
    </modal>

    <modal confirm-text="Add" title="Add feature" subtitle="Add a feature to a song" v-if="modal.featureModal.open"
           @close="modal.featureModal.open = false" @send="addFeature">
      <div class="mt-5">
        <label class="modal-label" for="songName">Song title</label>
        <cselect :options="song" @select="modal.featureModal.songID = song[$event].id"/>
      </div>
      <div class="mt-5">
        <label class="modal-label" for="songName">Artist</label>
        <cselect :options="artist" @select="modal.featureModal.artistID = artist[$event].id"/>
      </div>
    </modal>
  </div>
</template>

<style scoped>

</style>