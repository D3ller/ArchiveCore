<script setup lang="ts">
import Buttons from "../button/buttons.vue";

let props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    required: true
  }
});

let emit = defineEmits(["send", "close"]);

function send() {
  emit("send");
}

function closeMenu() {
  emit("close");
}
</script>

<template>
  <div class="fixed inset-0 bg-black/80 z-50" @click="closeMenu">
    <div class="playListModal w-full" @click.stop>
      <p class="pModal_title">{{ title }}</p>
      <p class="pModal_subtitle">{{ subtitle }}</p>
<slot></slot>
      <buttons class="mt-5 w-fit self-end" type="border" @click="send">{{ confirmText }}</buttons>
    </div>
  </div>
</template>

<style scoped>

</style>