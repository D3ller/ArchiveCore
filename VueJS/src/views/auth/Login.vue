<script lang="ts" setup>
import {ref} from "vue";
import axios from "axios";
import Alerts from "../../components/alerts.vue";
import {useAccount} from "../../stores/account";
import Buttons from "../../components/button/buttons.vue";
import router from "../../router";
import socket from "../../socket";

const account = useAccount();

let input :any  = ref({
  username: 'koradubinks',
  password: 'cacadeFou04'
})

let alert : any = ref({
  message: '',
  error: false
})

const loginIn = () => {
  if (input.value.username === '' || input.value.password === '') {
    alert.value.message = 'Please fill in all fields';
    alert.value.error = true;
    return;
  }

  axios.post('https://192.168.1.158:5132/api/auth/login', input.value, {
    withCredentials: true
  })
      .then((response) => {
        if (response.status === 200) {
          account.set(true);
          socket.emit('login', response.data.userId);
          if (router.currentRoute.value.query.redirect) {
            console.log(router.currentRoute.value.query)
            router.push(router.currentRoute.value.query.redirect);
          } else {
            router.push({name: 'dashboard'});
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          account.set(true);
          router.push({name: 'dashboard'});
        } else {
          alert.value.message = error.response.data.message;
          alert.value.error = true;
        }
      })
}
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="mb-10">Connect to your account</h1>
    <form class="flex gap-5 w-full flex-col items-center max-w-[424px]" @submit.prevent="loginIn()">
      <alerts v-if="alert.message" :message="alert.message" :type="alert.error ? 'danger' : 'success'">
        {{ alert.message }}
      </alerts>
      <input class="input" type="text" v-model="input.username" placeholder="Email or Username">
      <input class="input" type="password" v-model="input.password" placeholder="Password">

      <p class="paragraph self-end font-medium">You don't have an account?
        <router-link class="ml-2 links" to="/register">Register</router-link>
      </p>

      <buttons class="w-full">Login In</buttons>
    </form>
  </div>
</template>

<style scoped>

</style>