<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import AcSelect from '../input/ac-select.vue';
import Buttons from '../button/buttons.vue';

const props = defineProps({
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

const project = ref([]);
const currentProject = ref(null);
const emit = defineEmits(['update:modelValue', 'close']);

const fetchProjects = async () => {
  try {
    const response = await axios.post('https://192.168.1.158:5132/api/playlist/user', {}, {
      withCredentials: true
    });
    project.value = response.data;
    if (project.value.length > 0) {
      currentProject.value = project.value[0];
    }
  } catch (error) {
    console.error(error);
  }
};

const setCurrentPlaylist = (selectedProject) => {
  currentProject.value = selectedProject;
};

const closeMenu = () => {
  emit('close');
};

const sendToPlaylist = () => {
  emit('update:modelValue', currentProject.value);
  closeMenu();
};

onMounted(() => {
  document.body.style.overflow = 'hidden';
  fetchProjects();
  window.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
  window.removeEventListener('keydown', handleEscapeKey);
});

const handleEscapeKey = (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black/80 z-50" @click="closeMenu" v-if="project.length > 0">
    <div class="playListModal" @click.stop>
      <p class="pModal_title">{{ title }}</p>
      <p class="pModal_subtitle">{{ subtitle }}</p>
      <div class="mt-5">
        <ac-select :options="project" name="Playlist" @update:selectModal="setCurrentPlaylist"></ac-select>
      </div>
      <buttons class="mt-5 w-fit self-end" type="border" @click="sendToPlaylist">{{ confirmText }}</buttons>
    </div>
  </div>
</template>