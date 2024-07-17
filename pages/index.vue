<template>
  <div>
    <h1>You're logged in</h1>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});
</script>