<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import WelcomeSign from './components/WelcomeSign.vue'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
     isDarkMode.value = false
     document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">

    <main class="container mx-auto px-4 pb-8">
      <RouterView />
    </main>
  </div>
  <footer class="text-center p-4 text-sm text-gray-600">
    You're anonomysly tracked wiht umami; No personal data is collected nor saved. <br>
    Made with <span class="text-red-500">♥️</span> and Vue by <a href="space.reversed.dev" class="text-blue-500 hover:underline">Space</a> <br>
  </footer>
</template>

<style scoped>
/* Styles removed - using Tailwind now */
</style>
