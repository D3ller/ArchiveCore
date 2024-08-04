<script setup>
import {onMounted} from "vue";
import {useAccount} from "../../stores/account.js";
import axios from "axios";
import router from "../../router/index.js";
let account = useAccount();

onMounted(() => {
  axios.post('http://localhost:5132/api/auth/logout', {}, {
    withCredentials: true
  }).then((response) => {
    if(response.status === 200) {
      account.set(false);
      router.push({name: 'home'})
    }
  }
  )

})
</script>

<template>

</template>

<style scoped>

</style>