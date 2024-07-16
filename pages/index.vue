<template>
  <div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
const router = useRouter();

const { data, error } = await useAsyncApi('user', 'http://localhost:3001/user/check-status');

onMounted(() => {
  console.log('Fetching user status...');
  if (error) {
    isAuthenticated.value = false;
  }
  if (data.value && data.value !== 'Unauthorized') {
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
    router.push('/login');
  }
});
</script>
