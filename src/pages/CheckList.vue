<template>
  <UContainer v-if="lista">
    <div class="flex flex-col items-center justify-between">
      <h1 class="text-5xl font-bold mb-6">{{ lista.title }}</h1>
      <UFormField v-if="lista.status === false" label="Valor gasto" class="text-md">
        <UInput v-model="total" size="xl" placeholder="Digite o valor total gasto" class="w-48 text-lg font-normal"
          type="number" />
      </UFormField>
      <UButton v-if="lista.status === false" color="success" size="lg" label="Marcar como feito" icon="i-lucide-check" @click="checkList"
        class="text-lg md:mb-6 mt-4 cursor-pointer" />
    </div>

    <div class="grid gap-4 mt-4">
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
              <!--<UCheckbox v-model="item.status" />-->
              <div>
                <p class="font-medium leading-tight">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Quantidade: {{ item.quantity }}</p>
              </div>
            </div>
            <UBadge v-if="item.status" color="success" variant="subtle">ok</UBadge>
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
import { computed, ref } from 'vue'
import type { Cart } from '@/types/types'
import { useListsStore } from '@/stores/lists'
import useList from '@/composables/useList'
import { useRouter } from 'vue-router'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

const CATEGORIES = [
  'Alimento',
  'Bebida',
  'Doce',
  'Frios',
  'Laticinio',
  'Limpeza',
  'Higiene Pessoal',
  'Hortifruti',
  'Mercearia',
  'Padaria',
  'Outros'
]

const total = ref<number | null>(null)
const store = useListsStore()
const toast = useToast()
const { checkListAsDone } = useList()
const router = useRouter()
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

const checkList = async () => {
  if (!lista.value?.id || total.value === null) return
  await checkListAsDone(lista.value.id, total.value)
  toast.add({ title: 'Feito!', description: "Sua lista foi marcada como feita. Redirecionando...", color: 'success', icon: 'i-lucide-check' })
  setTimeout(() => {
    store.clearSelected()
    router.replace('/')
  }, 3000)
}
</script>
