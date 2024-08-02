<script lang="ts" setup>
import {RouterLink, RouterView} from 'vue-router'
import Navbar from "@/components/layouts/navbar.vue";
import {onMounted} from "vue";
import axios from "axios";
import {useAccount} from '@/stores/account.js'
import AsideBar from "@/components/layouts/asideBar.vue";

const account = useAccount();

onMounted(() => {
  axios.get('http://localhost:5132/api/auth', {
    withCredentials: true
  })
      .then((response) => {
        if (response.status === 200) {
          account.set(true)
        }
      })
      .catch((error) => {
        console.log(error);
      })
})
</script>

<template>
  <navbar></navbar>
  <main>
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-9 pt-20">
        <RouterView/>
      </div>
      <div class="col-span-3 relative">
        <aside-bar></aside-bar>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
