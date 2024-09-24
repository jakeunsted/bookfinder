<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <v-avatar class="mb-4" size="64" color="primary">
          <span>{{ user.username.charAt(0).toUpperCase() }}</span>
        </v-avatar>
      </v-col>
      <v-col cols="12" class="text-center">
        <div>{{ user.username }}</div>
      </v-col>
      <v-col cols="12" class="text-center">
        <div>{{ capitalizedRole }}</div>
      </v-col>
      <v-col cols="12" class="text-center">
        <div><strong>Member since:</strong> {{ formattedSignupDate }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const formattedSignupDate = computed(() => {
  const date = new Date(props.user.signupDate);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const capitalizedRole = computed(() => {
  return props.user.role.charAt(0).toUpperCase() + props.user.role.slice(1);
});
</script>