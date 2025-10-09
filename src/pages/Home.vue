<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UContainer>
    <div class="flex items-center justify-between">
      <UPageHeader class="text-4xl font-bold">Suas Listas</UPageHeader>
      <UButton to="/list" label="Adicionar Lista" icon="i-lucide-plus" class="text-lg font-semibold cursor-pointer" />
    </div>

    <div class="grid md:grid-cols-3 sm:grid-cols-1 mt-10">
      <UCard v-for="lista in listas" :key="lista.title" class="bg-green-100 shadow-2xl">
        <template #header>
          <h1 class="text-xl font-semibold">{{ lista.title }}</h1>
        </template>

        <div>
          <h2 class="text-4xl">{{ lista.cart.length }} itens</h2>
          <p>Gasto esperado de <span class="text-2xl text-red-400 font-semibold">R${{ lista.expected.toFixed(2)
          }}</span>
          </p>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            Criado em {{ lista.createdAt }}
            <UButton label="Acessar lista" @click="goToList(lista)" class="cursor-pointer" />
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
import { useListsStore } from '@/stores/lists';
import { useRouter } from 'vue-router';

const router = useRouter()
const listsStore = useListsStore()
const listas = ref<Lista[] | []>([])

onMounted(async () => {
  const allLists = await getDocs(collection(db, 'lists'))

  listas.value = allLists.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      cart: data.cart,
      expected: data.expected ?? 0,
      status: data.status ?? false,
      total: 0,
      createdAt: data.createdAt ?? new Date()
    }
  })
})

function goToList(lista: Lista) {
  listsStore.setSelected(lista)
  router.push('/check-list')
}
</script>
