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
          @click="addList"
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
            <div class="text-caption text-grey-7">{{ card.subtitle }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-md">
            <div class="text-body2">
              {{ card.description }}
            </div>
          </q-card-section>

          <!-- empurra as ações para o fim do card -->
          <div class="q-space"></div>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat icon="edit" label="Editar" />
            <q-btn flat color="negative" icon="delete" label="Remover" @click="removeList(i)" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Estado vazio elegante -->
      <div v-if="!lists.length" class="col-12">
        <q-banner inline-actions class="bg-grey-2">
          Você ainda não tem listas. Clique em <strong>Adicionar lista</strong> para criar a primeira.
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type ListCard = { title: string; subtitle?: string; description?: string }
const lists = ref<ListCard[]>([
  { title: 'Nova lista #1', subtitle: 'Rascunho', description: 'Clique em editar para personalizar.' },
  { title: 'Nova lista #2', subtitle: 'Rascunho', description: 'Clique em editar para personalizar.' },
  { title: 'Nova lista #3', subtitle: 'Rascunho', description: 'Clique em editar para personalizar.' },
  { title: 'Nova lista #4', subtitle: 'Rascunho', description: 'Clique em editar para personalizar.' },
])

function addList() {
  lists.value.unshift({
    title: `Nova lista #${lists.value.length + 1}`,
    subtitle: 'Rascunho',
    description: 'Clique em editar para personalizar.'
  })
}

function removeList(i: number) {
  lists.value.splice(i, 1)
}
</script>
