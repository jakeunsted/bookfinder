<template>
  <v-card class="mb-5 fixed bottom-0">
    <div class="flex flex-row justify-center items-center w-full">
      <div class="basis-1/3 grow flex justify-center items-center">
        <v-btn prepend-icon="mdi-home" stacked value="home" rounded="xl">
          <span>Home</span>
        </v-btn>
      </div>
      
      <div class="basis-1/3 grow flex justify-center items-center">
        <v-btn value="add" color="primary" class="rounded-circle" style="width: 56px; height: 56px;">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>

      <div class="basis-1/3 grow flex flex-col justify-center items-center">
        <v-btn prepend-icon="mdi-creation" stacked value="suggest" rounded="xl">
          <span>Suggest</span>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup>

</script>