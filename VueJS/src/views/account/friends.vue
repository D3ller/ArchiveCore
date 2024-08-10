<script setup lang="ts">
import socket from "../../socket";
import Buttons from "../../components/button/buttons.vue";
import {Ref, ref} from "vue";
import Modal from "../../components/modal/modal.vue";
import axios, {AxiosResponse} from "axios";
import router from "../../router";
import {useAccount} from "../../stores/account";
import FriendList from "../../components/friends/friend-list.vue";
let accounts = useAccount();

let message : Ref<string> = ref('');
let modal : Ref<{open: boolean}> = ref({open: false});
let friends : Ref<{pending: any[], friends: any[]}> = ref({pending: [], friends: []});

axios.get('https://192.168.1.158:5132/api/friends/get', {
  withCredentials: true
})
    .then((response) => {
      friends.value = response.data;
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

const addFriend = (): void => {
axios.post('https://192.168.1.158:5132/api/friends/add', {
  username: message.value
}, {
  withCredentials: true
})
    .then((response : AxiosResponse) => {
      console.log(response.data);
      modal.value.open = false;
      socket.emit('friendRequest', message.value);
      message.value = '';
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


  <div v-if="friends.pending.length > 0" class="mt-10">
    <h3 class="mb-5">Pending Request</h3>
    <friend-list v-for="p in friends.pending" :avatar="p.requester.avatarURL" status="Pending" :user="p.requester.username">sss</friend-list>
  </div>

  <div v-if="friends.friends.length > 0" class="mt-10">
    <h3 class="mb-5">Friends</h3>
    <friend-list v-for="f in friends.friends" :avatar="f.requester.avatarURL" status="Friend" :user="f.requester.username">sss</friend-list>
  </div>

</template>

<style scoped>

</style>