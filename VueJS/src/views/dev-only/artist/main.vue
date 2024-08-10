<script setup lang="ts">

import Buttons from "../../../components/button/buttons.vue";
import Modal from "../../../components/modal/modal.vue";
import {ref} from "vue";
import axios from "axios";
import Alerts from "../../../components/alerts.vue";

let modal = ref({
  error: {
    message: '',
    type: ''
  },
  addModal: {
    open: false,
    name: '',
    slug: ''
  }
})

function addArtist() {
  modal.value.addModal.open = false;
  axios.post('http://localhost:5132/api/artist/add', {
        name: modal.value.addModal.name,
        slug: modal.value.addModal.slug
      }, {
        withCredentials: true
      }
  ).then(res => {
    modal.value.addModal.name = '';
    modal.value.addModal.slug = '';
    modal.value.error.message = ''
    modal.value.error.type = ''
  }).catch(err => {
    modal.value.addModal.name = '';
    modal.value.addModal.slug = '';
    modal.value.error.message = err.response.data.message;
    modal.value.error.type = 'danger';
  })
}
</script>

<template>
  <div class="flex justify-between items-center">
    <h1>Admin Artist</h1>

    <alerts v-if="modal.error.message" :type="modal.error.type">{{ modal.error.message }}</alerts>

    <buttons class="mt-5" type="border" @click="modal.addModal.open = true">Add Artist</buttons>

    <modal confirm-text="Add" title="Add artist" subtitle="Create an artist" v-if="modal.addModal.open"
           @close="modal.addModal.open = false" @send="addArtist">
      <div class="mt-5">
        <label class="modal-label" for="artistName">Artist name</label>
        <input type="text" class="modal-input" v-model="modal.addModal.name"/>
      </div>
      <div class="mt-5">
        <label class="modal-label" for="artistImage">Artist Slug</label>
        <input type="text" class="modal-input" v-model="modal.addModal.slug"/>
      </div>
    </modal>
  </div>
</template>

<style scoped>

</style>