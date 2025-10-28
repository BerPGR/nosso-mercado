<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UHeader class="py-10">
    <template #left>
      <img alt="Logo" src="@/assets/logo.png" class="h-12"/>
      <h1 class="text-2xl font-bold">Merkadin</h1>
    </template>

    <UNavigationMenu class="gap-4" :items="items" />

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" />
    </template>

    <template v-if="user !== null" #right>
      <UButton :loading="loading" label="Sair" color="error" variant="soft" class="cursor-pointer" @click="loginOut"/>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { logout, user } = useAuth()
const route = useRoute()
const router = useRouter()

const loading = ref(false)

const loginOut = () => {
  loading.value = true
  setTimeout(() => {
    logout()
    loading.value = false
    router.replace('/login')
  }, 2000)
}

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Home',
  to: "/",
  icon: 'i-lucide-home',
  active: route.path == "/",
  class: 'p-4 md:p-3'
},
{
  label: 'Criar Lista',
  to: "/list",
  icon: 'i-lucide-file-plus',
  active: route.path.startsWith("/list"),
  class: 'my-4 p-4 md:p-3'
},
  /*{
    label: 'Dashboard',
    to: "/dashboard",
    icon: 'i-lucide-bar-chart-2',
    active: route.path.startsWith("/dashboard"),
    class: 'p-4 md:p-2'
  }*/
])
</script>
