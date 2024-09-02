<template>
  <div class="bg-background h-16 content-center">
    <v-icon
      class="text-primary text-4xl pl-7"
      @click="navigateBack()"
    >mdi-close</v-icon>
  </div>
  <div class=" h-full bg-window">
    <slot />
  </div>
</template>

<script setup>
const navigateBack = () => {
  navigateTo('/')
}
</script>