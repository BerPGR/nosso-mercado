<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UContainer>
    <div class="md:flex items-center justify-between sm:flex-col md:flex-row">
      <h1 class="text-4xl font-bold my-10">Suas Listas</h1>
      <UButton to="/list" icon="i-lucide-plus"
        class="inline-flex items-center w-full md:w-max text-lg font-semibold cursor-pointer text-center">
        Adicionar Lista</UButton>
    </div>

    <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-10 mt-10" v-if="listas.length > 0">
      <UCard v-for="lista in listas" :key="lista.title" class="bg-green-100 shadow-2xl">
        <template #header>
          <h1 class="text-xl font-semibold">{{ lista.title }}</h1>
        </template>

        <div>
          <h2 class="text-4xl">{{ lista.cart.length }} itens</h2>
          <p>Gasto esperado de <span class="text-2xl text-red-400 font-semibold">{{ formattedValue(lista.expected)
          }}</span>
          </p>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            Criado em {{ lista.createdAt }}
            <UButton label="Acessar lista" size="md" @click="goToList(lista)" class="cursor-pointer text-lg" />
          </div>
        </template>
      </UCard>
    </div>

    <UPageCard spotlight title="Ops!" description="Parece que voce ainda nao possui listas" v-else
      class="w-1/3 mx-auto">
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
const listas = ref<Lista[] | []>([])
const { getOpenListsFromFirebase } = useListComposable()

onMounted(async () => {
  listas.value = await getOpenListsFromFirebase()
})

function goToList(lista: Lista) {
  listsStore.setSelected(lista)
  router.push('/check-list')
}

const formatter = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

function formattedValue(value: number) {
  return formatter.format(value)
}
</script>
