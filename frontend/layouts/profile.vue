<template>
  <div class="h-full flex flex-col">
    <div class="pb-32 flex-grow overflow-auto">
      <slot />
    </div>
    <MenuBar
      :centerIcon="'mdi-plus'"
      :leftIcon="'mdi-home'"
      :rightIcon="'mdi-creation'"
      :menuItems="addItems"
      @left-click="onHomeClick"
      @right-click="onSuggestClick"
      @menu-item-click="handleItemClick"
    />
  </div>
</template>

<script setup>
import MenuBar from '~/components/navigation/menuBar.vue';

// Define your menu items
const addItems = [
  {
    title: 'Search by title',
    value: 'search',
    icon: 'mdi-magnify',
  },
  {
    title: 'Scan barcode',
    value: 'scan',
    icon: 'mdi-barcode-scan',
  },
  {
    title: 'Add book manually',
    value: 'manual',
    icon: 'mdi-book-plus',
  },
];

// Methods to handle events
const onHomeClick = () => {
  navigateTo('/');
};

const onSuggestClick = () => {
  window.alert('suggest button clicked');
};

const handleItemClick = (item) => {
  if (item.value === 'search') {
    navigateTo('/books/search');
  } else if (item.value === 'scan') {
    // navigateTo('/scan');
    window.alert('Scan not implemented');
  } else if (item.value === 'manual') {
    // navigateTo('/add');
    window.alert('Add not implemented');
  }
};
</script>
