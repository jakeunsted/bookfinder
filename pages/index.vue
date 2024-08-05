<template>
  <div class="h-full">
    <menuBar />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});

import menuBar from '@/components/navigation/menuBar.vue'
</script>