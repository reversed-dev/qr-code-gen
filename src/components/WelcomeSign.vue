<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="text-center lg:text-left">
    <h1 class="text-3xl font-medium text-green-600 dark:text-green-400 mb-2">{{ msg }}</h1>
    <p class="text-base text-gray-700 dark:text-gray-300">
      The probably first QR Code Generator that does not require any register. 
    </p>
  </div>
</template>

<style scoped>
/* Styles removed - using Tailwind now */
</style>
