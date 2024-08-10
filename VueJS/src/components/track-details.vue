<script setup>
import {getSvgPath} from "figma-squircle";
import {onMounted, ref} from "vue";

let cover = ref(null);
let rounded = ref(null);

function roundedClipPath() {
  if (cover.value) {
    const width = cover.value.clientWidth;
    const height = cover.value.clientHeight;

    try {
      const svgPath = getSvgPath({
        width,
        height,
        cornerRadius: 48,
        cornerSmoothing: 1,
      });

      rounded.value = `path('${svgPath}')`;
    } catch (error) {
      console.error('Erreur lors de la récupération du chemin SVG:', error);
    }
  }
}

onMounted(() => {
  roundedClipPath();
  window.addEventListener('resize', roundedClipPath);
})

let props = defineProps({
  coverUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  artist: {
    type: Object,
    required: false
  },
  to: {
    type: Object,
    required: false,
    default: {name: 'home'}
  },
  album: {
    type: Object,
    required: false
  },
  artistAvatar: {
    type: String,
    required: false
  }
})
</script>

<template>
<router-link :to="to" class="track-details">
  <div
      class="track-icon"
      :style="{
        clipPath: rounded,
        backgroundImage: `url(${album && album.coverURL ? 'http://localhost:5132' + album.coverURL : coverUrl && coverUrl !== 'null' ? 'http://localhost:5132' + coverUrl : artist ? 'http://localhost:5132' + artist.avatarURL : 'http://localhost:5132' +artistAvatar})`
    }"
      ref="cover">
  </div>
  <div class="track-info">
    <p class="track-title" v-if="title">{{ title }}</p>
    <p class="track-artist" v-if="artist">{{ artist.name }}</p>
  </div>
</router-link>
</template>

<style scoped>

</style>