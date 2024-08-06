<template>
  <div>
    <!-- <div v-if="showDrawer" class="fixed inset-0 bg-black opacity-50 z-30" @click="onExitClick"></div> -->
    
    <v-navigation-drawer 
      v-model="showDrawer"
      location="bottom"
      :class="{ 'drawer w-5/6 left-1/2 transform -translate-x-1/2': true, 'z-40': showDrawer, '-bottom-96': !showDrawer }"
    >
      <v-container class="flex justify-center items-center">
        <v-sheet :height="7" :width="100" class="bg-gray-400 z-50 rounded-full"></v-sheet>
      </v-container>
      <v-list>
        <v-list-item v-for="item in addItems" :key="item.value" @click="handleItemClick(item)">
          <template v-slot:prepend>
            <span class="mr-2">
              <v-icon>{{ item.icon }}</v-icon>
            </span>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div class="relative h-24">
      <div class="absolute left-1/2 transform -translate-x-1/2 bottom-0 mb-15 z-10">
        <div class="flex items-center justify-center rounded-full w-16 h-16 bg-gray-600">
          <v-btn 
            @click="onPlusClick" 
            variant="text"
            class="rounded-circle h-16"
          >
            <v-icon class="text-white text-4xl">mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="absolute bottom-0 w-5/6 mb-8 left-1/2 transform -translate-x-1/2 flex justify-between items-center rounded-full py-2 px-8 bg-gray-400 z-0">
        <v-btn
          @click="onHomeClick"
          :ripple="false"
          variant="text"
          class="text-white text-2xl"
          icon="mdi-home" 
        />
        <v-btn
          @click="onCreationClick"
          :ripple="false"
          variant="text"
          class="text-white text-2xl"
          icon="mdi-creation"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showDrawer = ref(false);

const onPlusClick = () => {
  showDrawer.value = true;
};

const onHomeClick = () => {
  console.log('Home button clicked');
};

const onCreationClick = () => {
  console.log('Creation button clicked');
};

const onExitClick = () => {
  showDrawer.value = false;
};

const handleItemClick = (item) => {
  console.log(`Item clicked: ${item.title}`);
  showDrawer.value = false;
};

const addItems = [
  {
    title: 'Search by title',
    value: 'search',
    icon: 'mdi-magnify'
  },
  {
    title: 'Scan barcode',
    value: 'scan',
    icon: 'mdi-barcode-scan'
  },
  {
    title: 'Add book manually',
    value: 'manual',
    icon: 'mdi-book-plus'
  }
];
</script>

<style scoped>
.drawer {
  border-radius: 1rem;
  margin-bottom: 2rem;
  z-index: 1004 !important; /* Ensure the drawer is above the overlay */
}
.drawer-closed {
  bottom: -100px !important;
}
</style>
