<template>
  <CloseBar @closeBarClicked="goBack" />
  <div class="h-full bg-window">
    <slot />
  </div>
</template>

<script setup>
import CloseBar from '~/components/navigation/CloseBar.vue';

const goBack = () => {
  window.history.back();
};
</script>