<script lang="ts" setup>
import {ref} from "vue";
import axios from "axios";
import router from "@/router";
import Alerts from "@/components/alerts.vue";
import {useAccount} from '@/stores/account.js'
const account = useAccount();

let input: Object = ref({
  username: 'koradubinks2',
  password: '55koRaffss'
})

let alert: Object = ref({
  message: '',
  error: false
})

const loginIn = () => {

  if(input.username === '' || input.password === '') {
    alert.value.message = 'Please fill in all fields';
    alert.value.error = true;
    return;
  }

  axios.post('http://localhost:5132/api/auth/login', input.value, {
withCredentials: true
  })
  .then((response) => {
    if(response.status === 200) {
      account.set(true);
      router.push({name: 'dashboard'});
    }
  })
  .catch((error) => {
    console.log(error);
    if(error.response.status === 409) {
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
        <input class="input" v-model="input.username" placeholder="Email">
        <input class="input" v-model="input.password" placeholder="Password">

        <button class="btn" type="submit">Login</button>
      </form>
    </div>
</template>

<style scoped>

</style>