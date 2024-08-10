<script setup lang="ts">
import Buttons from "../button/buttons.vue";
import {lowerCase} from "lodash";
import axios, {AxiosError, AxiosResponse} from "axios";

let props = defineProps<{
  user: string,
  status: string,
  avatar: string
}>()

let acceptedFriends = () : void => {
axios.post('https://192.168.1.158:5132/api/friends/accept',  {
  username: props.user
}, {
  withCredentials: true
})
    .then((response: AxiosResponse) => {
      console.log(response.data);
    })
    .catch((err : AxiosError) => {
      console.log(err.response.data);
    })
}
</script>

<template>
<div class="friends-list">
  <div class="flex items-center gap-5">
    <div class="friends-avatar"><img :src="props.avatar" alt="avatar"></div>
    <div class="flex flex-col"><p class="friends-user">{{ props.user }}</p>
      <p class="friends-status">{{ props.status }}</p></div>
  </div>

  <div class="friends-buttons" v-if="lowerCase(status) === 'pending'">
    <buttons type="border" @click="acceptedFriends">Add friend</buttons>
    <buttons type="border">Cancel</buttons>
  </div>
</div>
</template>

<style scoped>

</style>