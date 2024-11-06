<template>
  <ion-page>
    <h1>Book details</h1>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'book',
});
</script>