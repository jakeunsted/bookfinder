<template>
  <div class="h-full flex flex-col">
    <div class="flex-grow items-center">
      <v-avatar>
        <v-img
          alt="John"
          src="https://cdn.vuetifyjs.com/images/john.jpg"
        ></v-img>
      </v-avatar>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});

import menuBar from '@/components/navigation/menuBar.vue'
</script>