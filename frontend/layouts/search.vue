<template>
  <closeBar @closeBarClicked="handleCloseBarClick" />
  <div class=" h-full bg-window">
    <slot />
  </div>
</template>

<script setup>
import closeBar from '~/components/navigation/CloseBar.vue';
</script>