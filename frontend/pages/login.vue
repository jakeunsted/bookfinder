<template>
  <ion-page>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card>
            <v-card-title class="headline">Login</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="onSubmit">
                <v-text-field
                  v-model="username"
                  label="Username"
                  type="username"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <v-btn type="submit" color="primary" block>Login</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </ion-page>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

const username = ref('');
const password = ref('');
const { login } = useAuth();

const onSubmit = async () => {
  try {
    await login(username.value, password.value);
    // navigateTo('/');
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
};
</script>

<style scoped>

</style>