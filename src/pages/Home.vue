<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UContainer>
    <div class="flex items-center justify-between">
      <h1 class="text-5xl font-bold">Suas Listas</h1>
      <UButton label="Adicionar Lista" icon="i-lucide-plus" class="text-lg font-semibold" />
    </div>

    <div class="grid grid-cols-3 mt-10">
      <UCard v-for="lista in listas" :key="lista.title" class="bg-[#f3f3f3]">
        <template #header>
          <h1>{{ lista.title }}</h1>
        </template>

        <div>
          <h1>{{ lista.cart.length }} items</h1>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            Criado por Bernardo
            <UButton label="Acessar lista" to="/check-list" />
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Lista } from '@/types/types';

const listas = ref<Lista[] | []>([])

onMounted(async () => {
  const allLists = await getDocs(collection(db, 'lists'))

  listas.value = allLists.docs.map((doc) => {
    const data = doc.data()
    return {
      title: data.title,
      cart: data.cart
    }
  })
})
</script>
