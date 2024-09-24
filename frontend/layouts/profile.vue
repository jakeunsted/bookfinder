<template>
  <div class="h-full flex flex-col">
    <div class="pb-32 flex-grow overflow-auto">
      <slot />
    </div>
    <menuBar class="w-full fixed bottom-0" />
  </div>
</template>

<script setup>
import menuBar from '@/components/navigation/menuBar.vue';

// const menuBarPages = ['/', '/:id'];
</script>
