<template>
  <ion-page>
    <v-container class="fill-height w-full" fluid>
      <v-row align="center" justify="center">
        <v-card class="w-[80%]">
          <v-card-title>Register</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="username"
                label="Username"
                type="text"
                required
                :rules="[
                  v => v.length >= 3 || 
                    'Username must be at least 3 characters'
                ]"
              />
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :error-messages="
                  showPasswordStrengthError 
                    ? 'Password must be at least 8 characters long, ' +
                      'contain at least one uppercase letter, ' +
                      'one lowercase letter, and ' +
                      'one number' 
                    : ''
                "
                required
                @blur="checkPasswordStrength"
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                :error-messages="showPasswordMatchError ? passwordError : ''"
                required
                @blur="checkMatchingPasswords"
              />
              <v-text-field
                v-model="registerToken"
                label="Registration Token"
                type="text"
                :error-messages="showRegistrationTokenError"
                required
              />
              <v-btn type="submit" color="primary" block>Register</v-btn>
              <v-btn 
                variant="text" 
                size="x-small"
                block 
                class="mt-2"
                to="/login"
              >
                Already have an account? Login here
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </ion-page>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

const { checkRegistrationToken, register } = useAuth();

const username = ref('');
const password = ref('');
const email = ref('');
const confirmPassword = ref('');
const registerToken = ref('');
const showPasswordStrengthError = ref(false);
const showPasswordMatchError = ref(false);
const showRegistrationTokenError = ref(false);

const checkPasswordStrength = () => {
  // min 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  showPasswordStrengthError.value = !regex.test(password.value);
};

const passwordsMatch = computed(
  () => password.value === confirmPassword.value,
);

const passwordError = computed(
  () => !passwordsMatch.value ? 'Passwords do not match' : '',
);

const checkMatchingPasswords = () => {
  showPasswordMatchError.value = !passwordsMatch.value;
};

const checkRegistrationTokenValid = async () => {
  const isValid = await checkRegistrationToken(registerToken.value);
  showRegistrationTokenError.value = 
    !isValid ? 'Invalid registration token' : '';
};

const onSubmit = async () => {
  await checkRegistrationTokenValid();
  if (showRegistrationTokenError.value) {
    return;
  }
  const userId = await register(username.value, password.value, email.value);
  if (userId) {
    reloadNuxtApp({
      path: '/login',
    });
  }
};
</script>
