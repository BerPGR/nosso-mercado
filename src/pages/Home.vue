<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UContainer>
    <div class="md:flex items-center justify-between sm:flex-col md:flex-row">
      <h1 class="text-4xl font-bold my-10">Listas Pendentes</h1>
      <UButton to="/list" icon="i-lucide-plus"
        class="inline-flex items-center w-full md:w-max text-lg font-semibold cursor-pointer text-center">
        Adicionar Lista</UButton>
    </div>

    <div v-if="loading" class="flex items-center justify-between">
      <UProgress size="md" />
    </div>

    <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-10" v-if="openListas.length > 0 && loading === false">
      <UCard v-for="lista in openListas" :key="lista.title" class="bg-green-100 shadow-2xl">
        <template #header>
          <h1 class="text-xl font-semibold">{{ lista.title }}</h1>
        </template>

        <div>
          <h2 class="text-xl md:text-4xl">{{ lista.cart.length }} itens</h2>
          <p>Gasto esperado de <span class="text-2xl text-red-400 font-semibold">{{ formattedValue(lista.expected)
              }}</span>
          </p>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <p class="text-xs md:text-lg">Criado em {{ createdAtFormatted(lista.createdAt) }}</p>
            <UButton label="Acessar lista" size="md" @click="goToList(lista)" class="cursor-pointer text-lg" />
          </div>
        </template>
      </UCard>
    </div>

    <UPageCard spotlight title="Ops!" description="Parece que voce ainda nao possui listas"
      v-if="loading === false && openListas.length === 0" class="md:w-1/3 mx-auto mt-10">
      <img src="@/assets/carrinho.png" />
    </UPageCard>

    <div class="mt-20" v-if="closedLists.length > 0">
      <h1 class="text-4xl font-bold mb-10">Listas Feitas</h1>
      <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-10 my-10" v-if="closedLists.length > 0">
        <UCard v-for="lista in closedLists" :key="lista.title" class="bg-green-100 shadow-2xl">
          <template #header>
            <div class="flex items-center justify-between">
              <h1 class="text-xl font-semibold">{{ lista.title }}</h1>
              <ModalDeleteList />
            </div>
          </template>

          <div>
            <h2 class="text-xl md:text-4xl">{{ lista.cart.length }} itens</h2>
            <p>Gasto esperado de <span class="text-2xl text-red-400 font-semibold">{{ formattedValue(lista.expected)
            }}</span>
            </p>
            <p class="mt-2">Gasto total de <span class="text-2xl text-green-600 font-semibold">{{
              formattedValue(lista.total)
                }}</span>
            </p>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <p class="text-xs md:text-lg">Criado em {{ createdAtFormatted(lista.createdAt) }}</p>
              <UButton label="Acessar lista" size="md" @click="goToList(lista)" class="cursor-pointer text-lg" />
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <UPageCard spotlight title="Ops!" description="Parece que voce ainda nao possui listas"
      v-if="loading === false && closedLists.length === 0" class="md:w-1/3 mx-auto mt-10">
      <img src="@/assets/carrinho.png" />
    </UPageCard>
  </UContainer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { Lista } from '@/types/types';
import { useListsStore } from '@/stores/lists';
import { useRouter } from 'vue-router';
import useListComposable from '@/composables/useListComposable'

const router = useRouter()
const listsStore = useListsStore()
const loading = ref(true)
const openListas = ref<Lista[] | []>([])
const closedLists = ref<Lista[] | []>([])
const { getOpenListsFromFirebase, getClosedListsFromFirebase } = useListComposable()

onMounted(async () => {
  openListas.value = await getOpenListsFromFirebase()
  closedLists.value = await getClosedListsFromFirebase()
  loading.value = false
})

function goToList(lista: Lista) {
  listsStore.setSelected(lista)
  router.push('/check-list')
}

const dateFormatter = Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit'
})

function createdAtFormatted(date: Date | string) {
  return dateFormatter.format(new Date(date))
}

const formatter = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

function formattedValue(value: number) {
  return formatter.format(value)
}
</script>
