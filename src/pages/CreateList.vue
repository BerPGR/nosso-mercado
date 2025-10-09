<template>
  <UContainer>
    <UPageHeader class="text-4xl font-bold">Criar Lista</UPageHeader>
    <UForm :schema="schema" :state="state" class="space-y-4 mt-10" @submit="onSubmit">
      <UFormField class="text-2xl" label="Titulo">
        <UInput placeholder="Digite o titulo da lista" v-model="state.title" size="xl" />
      </UFormField>

      <UFormField class="text-2xl" label="Valor">
        <UInput placeholder="Digite o valor esperado" v-model.lazy="state.expected" size="xl" />
      </UFormField>

      <USeparator />

      <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <UFormField class="text-2xl font-semibold" label="Item">
          <UInput class="w-full font-normal" placeholder="Nome do item" v-model="cartItem.name" size="xl" />
        </UFormField>

        <UFormField class="text-2xl font-semibold" label="Tipo">
          <USelect aria-hidden="false" class="w-full font-normal" :items="types" v-model="cartItem.type" size="xl" />
        </UFormField>

        <UFormField class="text-2xl font-semibold" label="Quantidade">
          <UInputNumber class="w-full font-normal" v-model="cartItem.quantity" size="xl" />
        </UFormField>

      </div>
      <UButton @click="addToCard" class="text-lg cursor-pointer mr-10"
        v-if="cartItem.name != '' && cartItem.quantity > 0" label="Adicionar item" />
      <UButton color="info" type="submit" class="text-lg mt-10 cursor-pointer" label="Criar lista"
        v-if="state.cart && state.cart.length > 0" />
    </UForm>
    <USeparator class="mt-4" />
    <UCard class="mt-4">
      <template #header>
        <h1 class="text-2xl font-semibold">Meus itens</h1>
      </template>

      <ul>
        <li v-for="(item, i) in state.cart" :key="i">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-lg">{{ item.name }}</p>
              <p>{{ item.type }}</p>
            </div>
            <div class="flex items-center gap-4">
              <UButton icon="i-lucide-trash" size="md" color="error" variant="soft" @click="removeFromCart(i)" />
              <UBadge color="success" variant="solid" size="md">{{ item.quantity }}</UBadge>
            </div>
          </div>
          <USeparator v-if="state.cart?.length && i != (state.cart?.length - 1)" class="my-2" />
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import useListComposable from '@/composables/useListComposable'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive } from 'vue'
import * as z from 'zod'

const { saveListToFirebase } = useListComposable()

const toast = useToast()

const schema = z.object({
  title: z.string().min(1, 'Informe o titulo'),
  expected: z.coerce.number().positive('Informe um valor valido'),
  cart: z.array(z.object({
    name: z.string().min(1, 'Informe o nome'),
    quantity: z.coerce.number().int().positive('Quantidade > 0'),
    type: z.string().min(1),
  })).min(1, 'Adicione ao menos 1 item')
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
  console.log(event);

  const saved = await saveListToFirebase(event.data)
  if (saved) {
    toast.add({ title: 'Deu certo!', description: "Deu pra mandar essa bomba", color: 'success' })
  }
}

const removeFromCart = (index: number) => {
  state.cart?.splice(index, 1)
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
