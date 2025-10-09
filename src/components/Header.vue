<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UHeader class="py-10">
    <template #left>
      <h1 class="text-2xl font-bold">Nosso Mercado</h1>
    </template>

    <UNavigationMenu class="gap-4" :items="items" />

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="mx-2.5" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Home',
  to: "/",
  icon: 'i-lucide-home',
  active: route.path.match(/^\/$/)
},
{
  label: 'Criar Lista',
  to: "/list",
  icon: 'i-lucide-list',
  active: route.path.startsWith("/list")
},
{
  label: 'Dashboard',
  to: "/dashboard",
  icon: 'i-lucide-bar-chart-2',
  active: route.path.startsWith("/dashboard")
},
])

const windowSize = computed(() => {
  return document.body.clientWidth
})
</script>
