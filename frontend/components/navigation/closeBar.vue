<template>
  <div class="bg-background h-16 content-center">
    <v-icon
      class="text-primary text-4xl pl-7"
      @click="closeAndEmit"
    >mdi-close</v-icon>
  </div>
</template>

<script setup>
const emit = defineEmits(['closeBarClicked']);

const closeAndEmit = () => {
  emit('closeBarClicked');
};
</script>
