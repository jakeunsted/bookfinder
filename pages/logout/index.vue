<template>

</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});

const { logout } = useAuth();
logout();
</script>