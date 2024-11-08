<template>
  <v-dialog v-model="showBottomDrawer" max-width="400">
    <v-card>
      <v-card-title class="text-h5">Quick Actions</v-card-title>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="item in drawerItems"
          :key="item.value"
          @click="handleItemClick(item)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn text @click="showBottomDrawer = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

</script>