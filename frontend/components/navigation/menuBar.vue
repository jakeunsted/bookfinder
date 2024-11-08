<template>
  <div class="sticky bottom-0">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="showDrawer"
      location="bottom"
      :class="[
        'drawer w-5/6 left-1/2 transform -translate-x-1/2 bg-background',
        showDrawer ? 'z-40 bottom-0' : '-bottom-96',
      ]"
    >
      <v-container class="flex justify-center items-center">
        <v-sheet
          v-touch:swipe.down="onExitClick"
          :height="7"
          :width="100"
          class="bg-grey z-50 rounded-full"
        ></v-sheet>
      </v-container>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          @click="handleItemClick(item)"
        >
          <template v-slot:prepend>
            <span class="mr-2">
              <v-icon>{{ item.icon }}</v-icon>
            </span>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Bottom Navigation Bar -->
    <div class="relative h-24">
      <!-- Floating Action Button -->
      <div
        class="absolute left-1/2 transform -translate-x-1/2 bottom-0 mb-15 z-10"
      >
        <div
          class="flex items-center justify-center rounded-full 
            w-16 h-16 bg-links"
        >
          <v-btn
            @click="onPlusClick"
            variant="text"
            class="rounded-circle h-16 drop-shadow-lg"
          >
            <v-icon class="text-white text-4xl">{{ centerIcon }}</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div
        class="absolute bottom-0 w-5/6 mb-8 left-1/2 transform 
          -translate-x-1/2 flex justify-between items-center 
          rounded-full py-2 px-8 bg-primary z-0 drop-shadow-lg"
      >
        <v-btn
          @click="onLeftButtonClick"
          :ripple="false"
          variant="text"
          class="text-white text-2xl"
        >
          <v-icon>{{ leftIcon }}</v-icon>
        </v-btn>
        <v-btn
          @click="onRightButtonClick"
          :ripple="false"
          variant="text"
          class="text-white text-2xl"
        >
          <v-icon>{{ rightIcon }}</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Define props
const props = defineProps({
  // Icons for the buttons
  centerIcon: {
    type: String,
    default: 'mdi-plus',
  },
  leftIcon: {
    type: String,
    default: 'mdi-home',
  },
  rightIcon: {
    type: String,
    default: 'mdi-creation',
  },
  // Menu items for the drawer
  menuItems: {
    type: Array,
    default: () => [],
  },
});
const { centerIcon, leftIcon, rightIcon, menuItems } = toRefs(props);

// Emit events
const emit = defineEmits([
  'left-click',
  'right-click',
  'center-click',
  'menu-item-click',
]);

// Component state
const showDrawer = ref(false);

const onPlusClick = () => {
  showDrawer.value = true;
  emit('center-click');
};

const onLeftButtonClick = () => {
  emit('left-click');
};

const onRightButtonClick = () => {
  emit('right-click');
};

const onExitClick = () => {
  showDrawer.value = false;
};

const handleItemClick = (item) => {
  showDrawer.value = false;
  emit('menu-item-click', item);
};
</script>

<style scoped>
.drawer {
  border-radius: 1rem;
  margin-bottom: 2rem;
  z-index: 1004 !important;
}
.v-navigation-drawer__scrim {
  position: fixed !important;
}
</style>
