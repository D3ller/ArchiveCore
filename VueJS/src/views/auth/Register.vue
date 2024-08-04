<script lang="ts" setup>
import {ref} from "vue";
import axios from "axios";
import { useRouter } from 'vue-router';
import Alerts from "../../components/alerts.vue";
import Buttons from "../../components/button/buttons.vue";
import router from "../../router";

let input: Object = ref({
  email: '',
  username: '',
  password: '',
  confirm_password: ''
})

let alert: Object = ref({
  message: '',
  error: false
})

const register = () => {
  if (input.email === '' || input.username === '' || input.password === '' || input.confirm_password === '') {
    alert.value.message = 'Please fill in all fields';
    alert.value.error = true;
    return;
  }

  if (input.password !== input.confirm_password) {
    alert.value.message = 'Passwords do not match';
    alert.value.error = true;
    return;
  }

  axios.post('http://localhost:5132/api/auth/register', input.value, {
    withCredentials: true
  })
      .then((response) => {
        if (response.status === 201) {
          router.push({ name: 'login' }).catch(err => console.error('Redirection failed:', err));
        }
      })
      .catch((error) => {
        console.log(error);
        alert.value.message = error.response.data.message;
        alert.value.error = true;
      })
}
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="mb-10">Sign up to ArchiveCore</h1>
    <form class="flex gap-5 w-full flex-col items-center max-w-[424px]" @submit.prevent="register()">
      <alerts v-if="alert.message" :message="alert.message" :type="alert.error ? 'danger' : 'success'">
        {{ alert.message }}
      </alerts>
      <input class="input" type="email" v-model="input.email" placeholder="Email">
      <input class="input" type="text" v-model="input.username" placeholder="Username">
      <input class="input" type="password" v-model="input.password" placeholder="Password">
      <input class="input" type="password" v-model="input.confirm_password" placeholder="Confirm Password">

      <p class="paragraph self-end font-medium">You have an account?
        <router-link class="ml-2 links" :to="{name: 'login'}">Login</router-link>
      </p>

      <buttons>Login In</buttons>
    </form>
  </div>
</template>

<style scoped>

</style>