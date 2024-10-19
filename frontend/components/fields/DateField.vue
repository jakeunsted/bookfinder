<template>
  <div>
    <div class="flex">
      <h1 class="text-xl">{{ label }}</h1>
      <v-btn 
        append-icon="mdi-calendar-range"
        variant="plain"
        density="compact"
        class="ml-auto lowercase"
        @click="editingDate = true"
      >
        Set date
      </v-btn>
    </div>
    <v-card :flat="true" color="grey5" rounded="xl" class="text-left">
      <v-card-text>
        <p v-if="date">{{ formattedDate }}</p>
        <p v-else>{{ falseMessage }}</p>
      </v-card-text>
    </v-card>

    <div 
      v-if="editingDate" 
      class="
        fixed z-10 inset-0 flex items-center 
        justify-center bg-black/50
      "
      @click="editingDate = false"
    >
      <div @click.stop>
        <v-date-picker
          color="primary"
          v-model="dateObj"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update-date']);

const props = defineProps({
  date: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
  falseMessage: {
    type: String,
    required: true,
  },
});

const { date, label } = toRefs(props);
const editingDate = toRef(false);

const dateObj = toRef(date.value ? new Date(date.value) : new Date());

watch(() => dateObj.value, (newDate) => {
  emit('update-date', newDate);
  editingDate.value = false;
});

const formattedDate = computed(() => {
  if (date.value) {
    return dateObj.value.toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    });
  }
  return '';
});
</script>