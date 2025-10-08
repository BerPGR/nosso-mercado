<script setup lang="ts">
import Header from './components/Header.vue';
</script>

<template>
  <UApp>
    <Header />

    <UMain class="p-4">
      <router-view />
    </UMain>
  </UApp>
</template>
