<template>
  <q-page class="q-pa-lg q-pa-xl-md text-dark overflow-auto">
    <!-- Cabeçalho responsivo -->
    <div class="row items-start items-center-md justify-between q-gutter-sm q-mb-lg">
      <div class="col-12 col-md-auto">
        <h1 class="text-h5 text-weight-bold q-mb-none q-mb-sm-md">Nosso mercado</h1>
      </div>

      <div class="col-12 col-md-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar lista"
          unelevated
          class="full-width q-px-md q-px-lg-md"
          to="/create-list"
        />
      </div>
    </div>

    <!-- Grid responsivo: 1col xs | 2col sm | 3col md+ -->
    <div class="row q-col-gutter-md items-stretch">
      <div
        v-for="(card, i) in lists"
        :key="i"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat bordered class="">
          <q-card-section>
            <div class="text-h6">{{ card.title }}</div>
          </q-card-section>

          <q-separator />

          <!-- empurra as ações para o fim do card -->
          <div class="q-space"></div>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat icon="check" color="primary" label="Ver Lista" :to="{name:'list.view', params: {id: card.id}}" />
            <q-btn flat color="negative" icon="delete" label="Deletar" @click="removeList(i)" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Estado vazio elegante -->
      <div v-if="!lists.length" class="col-12 row items-center justify-center">
        <q-banner inline-actions class="bg-grey-2">
          Nenhuma lista registrada. Clique em <strong>Adicionar lista</strong> para criar a primeira.
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useListComposable } from '@/composables/useListComposable'

const { getLists, deleteList } = useListComposable()

type ListCard = { id: string; title: string }

const lists = ref<ListCard[]>([])

onMounted(async () => {
  const data = await getLists()
  lists.value = (data || []).map((d) => {
    const item = d as unknown as ListCard
    return { id: item.id, title: item.title || 'Lista' }
  })
})

async function removeList(i: number) {
  const id = lists.value[i]?.id
  if (!id) return
  await deleteList(id)
  lists.value.splice(i, 1)
}
</script>
