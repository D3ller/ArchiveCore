<script lang="ts" setup>
import { getSvgPath } from "figma-squircle";
import { getCurrentInstance, onMounted, ref } from "vue";

let trending = ref<HTMLElement | null>(null);
const uid = getCurrentInstance()?.uid;
let rounded = ref<string | null>(null);

onMounted( () => {
  if (trending.value) {
    const width = trending.value.clientWidth;
    const height = trending.value.clientHeight;

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
});
</script>

<template>
  <div class="page_home">
    <div class="w-full">
    <h1 class="mb-5">Trend Artist and Song</h1>
      <div class="trending-artist" ref="trending" :style="{ clipPath: rounded }">
        <div class="trend-content">
          <p>TRENDING ARTIST</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trending-artist {
  transition: clip-path 0.3s ease;
}
</style>
