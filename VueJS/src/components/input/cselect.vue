<script setup>
import { ref, computed } from "vue";

let props = defineProps({
  options: {
    type: Array,
    required: true
  }
});

let emit = defineEmits(["select"]);

let open = ref(false);
let selectedOption = ref(props.options[0]);
let searchQuery = ref("");
let searchInput = ref(null);

console.log(props.options[0])

emit('select', 0);

const filteredOptions = computed(() => {
  return props.options.filter(option => {
    const optionName = option.name ? option.name.toLowerCase() : null;
    const optionTitle = option.title ? option.title.toLowerCase() : null;
    return (optionName && optionName.includes(searchQuery.value.toLowerCase())) ||
        (optionTitle && optionTitle.includes(searchQuery.value.toLowerCase()));
  });
});


function selectOption(index) {
  selectedOption.value = filteredOptions.value[index];
  open.value = false;
  emit('select', props.options.indexOf(filteredOptions.value[index]));
}

function toggleMenu() {
  open.value = !open.value;
  if (open.value) {
    setTimeout(() => {
      searchInput.value.focus();
    }, 0);
  }
}
</script>

<template>
  <div class="relative" v-if="options.length > 0">
    <div class="w-full h-10 px-3 py-2 bg-black border border-[#212121] border-solid rounded flex items-center justify-between cursor-pointer text-white" @click="toggleMenu">
      {{ selectedOption.name ? selectedOption.name : selectedOption.title }}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-4 w-4 opacity-50" aria-hidden="true">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    </div>
    <div class="absolute top-12 w-full bg-black border border-[#212121] border-solid rounded max-h-[180px] overflow-y-scroll flex flex-col gap-3 px-3 py-3 no-scrollbar z-30" v-if="open">
      <div v-if="options.length > 5" class="px-3 pb-3">
        <input type="text" v-model="searchQuery" class="w-full h-10 px-3 py-2 bg-[#212121] border border-[#3a3a3a] rounded text-white" placeholder="Rechercher..." ref="searchInput" @keydown.enter="selectOption(0)"/>
      </div>
      <div v-for="(option, index) in filteredOptions" :key="index" class="px-3 py-2 rounded hover:bg-[#212121] cursor-pointer text-white" @click="selectOption(index)">
        {{ option.name ? option.name : option.title }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
