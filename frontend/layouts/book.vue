<template>
  <CloseBar />
  <div class="h-full bg-window">
    <slot />
  </div>
</template>

<script setup>
import CloseBar from '~/components/navigation/CloseBar.vue';
</script>