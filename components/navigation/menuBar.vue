<template>
  <div>
    <v-navigation-drawer 
      v-model="showDrawer"
      location="bottom"
      :class="[
        'drawer w-5/6 left-1/2 transform -translate-x-1/2 bg-background',
        showDrawer ? 'z-40 bottom-0' : '-bottom-96'
      ]"
    >
      <v-container class="flex justify-center items-center">
        <v-sheet 
          v-touch:swipe.down="onExitClick"
          :height="7"
          :width="100"
          color=""
          class="bg-grey z-50 rounded-full"
        ></v-sheet>
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
        <div class="flex items-center justify-center rounded-full w-16 h-16 bg-links">
          <v-btn 
            @click="onPlusClick" 
            variant="text"
            class="rounded-circle h-16 drop-shadow-lg"
          >
            <v-icon class="text-white text-4xl">mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
      <div 
        class="absolute bottom-0 w-5/6 mb-8 left-1/2 transform -translate-x-1/2 flex justify-between items-center rounded-full py-2 px-8 bg-primary z-0 drop-shadow-lg"
      >
        <v-btn
          @click="onHomeClick"
          :ripple="false"
          variant="text"
          class="text-white text-2xl"
          icon="mdi-home" 
        />
        <v-btn
          @click="onSuggestClick"
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
  navigateTo('/');
};

const onSuggestClick = () => {
  console.log('Creation button clicked');
};

const onExitClick = () => {
  showDrawer.value = false;
};

const handleItemClick = (item) => {
  console.log(`Item clicked: ${item.title}`);
  showDrawer.value = false;
  if (item.value === 'search') {
    navigateTo('/books/search');
  } else if (item.value === 'scan') {
    // navigateTo('/scan');
  } else if (item.value === 'manual') {
    // navigateTo('/add');
  }
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
.v-navigation-drawer__scrim {
  position: fixed !important
}
</style>
