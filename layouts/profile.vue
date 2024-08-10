<template>
  <div class="h-full flex flex-col">
    <NuxtPage class="flex-grow" />
    <menuBar />
  </div>
</template>

<script setup>
import menuBar from '@/components/navigation/menuBar.vue'

const menuBarPages = ['/', '/:id']
</script>
