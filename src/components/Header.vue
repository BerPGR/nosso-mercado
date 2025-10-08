<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UHeader class="py-10">
    <template #left>
      <h1 class="text-2xl font-bold">Nosso Mercado</h1>
    </template>

    <template #right>
      <UButton v-for="item in items" :key="item.label" class="px-4 py-2 mx-2" :to="item.to" :label="item.label"
        :color="item.active ? 'success' : 'neutral'" :variant="item.active ? 'solid' : 'outline'" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const items = computed(() => [{
  label: 'Home',
  to: "/",
  icon: 'i-lucide-home',
  active: route.path.match(/^\/$/)
},
{
  label: 'Criar Lista',
  to: "/list",
  icon: 'i-lucide-home',
  active: route.path.startsWith("/list")
},
{
  label: 'Dashboard',
  to: "/dashboard",
  icon: 'i-lucide-bar-chart-2',
  active: route.path.startsWith("/dashboard")
},
])
</script>
