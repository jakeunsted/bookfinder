<template>
  <closeBar />
  <div class="h-full bg-window">
    <slot />
  </div>
</template>

<script setup>
import closeBar from '@/components/navigation/closeBar.vue';
</script>