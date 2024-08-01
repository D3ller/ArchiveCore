<script lang="ts" setup>
let props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => {
      return ['info', 'success', 'warning', 'danger'].includes(value);
    }
  }
});
</script>

<template>
<div :class="'alerts-'+type">
  <slot></slot>
</div>
</template>

<style scoped>

</style>