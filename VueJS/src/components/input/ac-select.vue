<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const open = ref(false);
const selectedOption = ref(null);
const emit = defineEmits(['update:selectModal']);

onMounted(() => {
  if (props.options.length > 0) {
    selectedOption.value = props.options[0].title;
  }
});

const selectOption = (index) => {
  emit('update:selectModal', props.options[index]);
  selectedOption.value = props.options[index].title;
  open.value = false;
};

watch(() => props.options, (newOptions) => {
  if (newOptions.length > 0) {
    selectedOption.value = newOptions[0].title;
  } else {
    selectedOption.value = '';
  }
}, { immediate: true });
</script>

<template>
  <div class="relative" v-if="options.length > 0">
    <div class="w-full h-10 px-3 py-2 bg-black border border-[#212121] border-solid rounded flex items-center justify-between cursor-pointer" @click="open = !open">
      {{ selectedOption }}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-4 w-4 opacity-50" aria-hidden="true">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    </div>
    <div class="absolute top-12 w-full bg-black border border-[#212121] border-solid rounded max-h-[180px] overflow-y-scroll flex flex-col gap-3 px-3 py-3 no-scrollbar" v-if="open">
      <div v-for="(option, index) in options" :key="index" class="px-3 py-2 rounded hover:bg-[#212121] cursor-pointer" @click="selectOption(index)">
        {{ option.title }}
      </div>
    </div>
  </div>
</template>

