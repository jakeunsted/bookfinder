<template>
  <div class="h-full">
    <h1>You're logged in</h1>
    <menuBar class="" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});

import menuBar from '@/components/navigation/menuBar.vue'
</script>