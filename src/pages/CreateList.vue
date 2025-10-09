<template>
  <UContainer>
    <UPageHeader class="text-4xl font-bold">Criar Lista</UPageHeader>
    <UForm :schema="schema" :state="state" class="space-y-4 mt-10" @submit.prevent="onSubmit">
      <UFormField class="text-2xl" label="Titulo">
        <UInput placeholder="Digite o titulo da lista" v-model="state.title" />
      </UFormField>

      <UFormField class="text-2xl" label="Valor">
        <UInput placeholder="Digite o valor gasto esperado" v-model="state.expected" />
      </UFormField>

      <USeparator />

      <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <UFormField class="text-2xl font-semibold" label="Item">
          <UInput class="w-full" placehold="Nome do item" v-model="cartItem.name" />
        </UFormField>

        <UFormField class="text-2xl font-semibold" label="Tipo">
          <USelect class="w-full" :items="types" v-model="cartItem.type" />
        </UFormField>

        <UFormField class="text-2xl font-semibold" label="Quantidade">
          <UInputNumber class="w-full" v-model="cartItem.quantity" />
        </UFormField>

      </div>
      <div class="flex items-center justify-between">
        <UButton @click="addToCard" class="text-lg" v-if="cartItem.name != '' && cartItem.quantity > 0"
          label="Adicionar item" />

        <UButton color="primary" type="submit" class="text-lg" v-if="state.cart?.length" label="Criar lista" />
      </div>
    </UForm>
    <USeparator class="mt-4" />
    <UCard class="mt-4">
      <template #header>
        <h1>Meus itens</h1>
      </template>

      <ul>
        <li v-for="(item, i) in state.cart" :key="i">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-lg">{{ item.name }}</p>
              <p>{{ item.type }}</p>
            </div>
            <UBadge color="success" variant="subtle">{{ item.quantity }}</UBadge>
          </div>
          <USeparator v-if="state.cart?.length && i != (state.cart?.length - 1)" />
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive } from 'vue'
import * as z from 'zod'

const toast = useToast()

const schema = z.object({
  title: z.string(),
  expected: z.number(),
  cart: z.array(z.object({
    name: z.string(),
    quantity: z.number().int(),
    type: z.string(),
  }))
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: "",
  expected: undefined,
  cart: []
})

const types = [
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

const cartItem = reactive({
  name: "",
  quantity: 0,
  type: types[0],
})


const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  toast.add({ title: 'Deu certo!', description: "Deu pra mandar essa bomba", color: 'success' })
}

const addToCard = () => {
  state.cart?.push({
    name: cartItem.name,
    quantity: cartItem.quantity,
    type: cartItem.type ?? "",
  })

  cartItem.name = ""
  cartItem.quantity = 0
  cartItem.type = types[0]
}
</script>
