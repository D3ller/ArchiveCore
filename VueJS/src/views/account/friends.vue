<script setup lang="ts">
import socket from "../../socket";
import Buttons from "../../components/button/buttons.vue";
import {ref} from "vue";
import Modal from "../../components/modal/modal.vue";
import axios from "axios";
import router from "../../router";
import {useAccount} from "../../stores/account";
let accounts = useAccount();

let message = ref('');
let modal = ref({
  open: false
})

axios.get('http://localhost:5132/api/friends/get', {
  withCredentials: true
})
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      if (err.response.status === 401 && err.response.data.message === 'User is not logged in') {
        accounts.set(false);
        router.push({
          name: 'login',
          query: {
            redirect: router.currentRoute.value.fullPath
          }
        });
      }
})

const addFriend = () => {
axios.post('http://localhost:5132/api/friends/add', {
  username: message.value
}, {
  withCredentials: true
})
    .then((response) => {
      console.log(response.data);
      modal.value.open = false;
    })
    .catch((err) => {
      console.log(err.response.data);
    })
}
</script>

<template>
  <div class="flex justify-between items-center"><h1>Friends</h1>
  <buttons type="border" @click="modal.open = true">Add friend</buttons>
  </div>

  <modal confirm-text="Send request" subtitle="You can add your friends with their username or email address." title="Add your friends" @close="modal.open = false" @send="addFriend" v-if="modal.open">
    <div class="mt-5"><input type="text" class="modal-input" placeholder="Username or email address" v-model="message"/></div>
  </modal>

</template>

<style scoped>

</style>