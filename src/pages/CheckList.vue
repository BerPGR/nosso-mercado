<template>
  <UContainer v-if="lista">
    <h1 class="text-5xl font-bold mb-6">{{ lista.title }}</h1>

    <div class="grid gap-4">
      <UCard v-for="cat in visibleCategories" :key="cat">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold">{{ cat }}</h2>
            <UBadge variant="soft">{{ grouped[cat]?.length }} itens</UBadge>
          </div>
        </template>

        <ul class="space-y-3">
          <li v-for="item in grouped[cat]" :key="`${item.name}-${item.type}`"
            class="flex items-center justify-between rounded-lg p-3 bg-gray-50">
            <div class="flex items-center gap-3">
              <UCheckbox v-model="item.status" />
              <div>
                <p class="font-medium leading-tight">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Qtd: {{ item.quantity }}</p>
              </div>
            </div>
            <UBadge v-if="item.status" color="green" variant="subtle">ok</UBadge>
          </li>
        </ul>
      </UCard>
    </div>
  </UContainer>

  <UContainer v-else>
    <p class="text-gray-500">Nenhuma lista selecionada. <RouterLink to="/">Voltar</RouterLink>
    </p>
  </UContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Cart } from '@/types/types'
import { useListsStore } from '@/stores/lists'

const CATEGORIES = [
  'Alimento',
  'Bebida',
  'Doce',
  'Frios',
  'Laticinio',
  'Limpeza',
  'Higiene Pessoal',
  'Mercearia',
  'Padaria',
  'Outros'
]

const store = useListsStore()
const lista = computed(() => store.selected)

// Agrupamento por tipo
const grouped = computed<Record<string, Cart[]>>(() => {
  const groups: Record<string, Cart[]> = Object.fromEntries(
    CATEGORIES.map(c => [c, [] as Cart[]])
  )

  if (!lista.value?.cart?.length) return groups

  for (const item of lista.value.cart) {
    const type = CATEGORIES.includes(item.type) ? item.type : 'Outros'
    groups[type]?.push(item)
  }
  return groups
})

const visibleCategories = computed(() =>
  CATEGORIES.filter(cat => grouped.value[cat]?.length)
)
</script>
