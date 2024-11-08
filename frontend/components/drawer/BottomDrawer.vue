<template>
  <div class="w-full">
    <transition name="v-navigation-drawer">
      <v-navigation-drawer
        location="bottom"
        v-model="isDrawerOpen"
        :class="[
          'drawer w-5/6 left-1/2 transform -translate-x-1/2 bg-background',
          isDrawerOpen ? 'z-40 bottom-0' : '-bottom-96',
        ]"
        @click:outside="onExitClick"
      >
        <v-container class="flex flex-col items-center">
          <v-sheet
            v-touch:swipe.down="onExitClick"
            :height="7"
            :width="100"
            class="bg-grey z-50 rounded-full"
          />
        </v-container>
        <v-list>
          <v-list-item
            v-for="item in drawerItems"
            :key="item.value"
            @click="handleItemClick(item)"
          >
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  drawerItems: {
    type: Array,
    default: () => [],
  },
  isDrawerOpen: {
    type: Boolean,
    default: false,
  },
});
const { drawerItems, isDrawerOpen } = toRefs(props);

const emit = defineEmits(['item-click', 'exit-click']);

const handleItemClick = (item) => {
  emit('item-click', item);
};

const onExitClick = () => {
  // isDrawerOpen.value = false;
  emit('exit-click');
};
</script>

<style scoped>
.drawer {
  border-radius: 1rem;
  margin-bottom: 2rem;
  z-index: 1006 !important;
}
.v-navigation-drawer__scrim {
  position: fixed !important;
  height: 100vh !important;
  width: 100vw !important;
}

.v-navigation-drawer {
  transition: transform 0.3s ease-in-out;
}

.v-navigation-drawer-enter-active,
.v-navigation-drawer-leave-active {
  transition: transform 0.3s ease-in-out;
}

.v-navigation-drawer-enter,
.v-navigation-drawer-leave-to {
  transform: translateY(100%);
}
</style>
