<template>
    <UModal title="Editar item" :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer',
    }" :ui="{ footer: 'justify-end' }">
        <UButton class="cursor-pointer" icon="i-lucide-pencil" size="md" color="warning" variant="soft" />

        <template #body>
            <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
                <UFormField class="text-2xl font-semibold" label="Item">
                    <UInput class="w-full font-normal" placeholder="Nome do item" v-model="editItem.name" size="xl" />
                </UFormField>

                <UFormField class="text-2xl font-semibold" label="Tipo">
                    <USelect aria-hidden="false" class="w-full font-normal" :items="types" v-model="editItem.type"
                        size="xl" />
                </UFormField>

                <UFormField class="text-2xl font-semibold" label="Quantidade">
                    <UInputNumber class="w-full font-normal" v-model="editItem.quantity" size="xl" />
                </UFormField>

            </div>
        </template>

        <template #footer="{close}">
            <UButton label="Editar" color="warning" class="cursor-pointer" @click="edit(close)"/>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import type { CartItem } from '@/types/types';
import { ref } from 'vue';

const props = defineProps<{
    i: number,
    item: CartItem
}>()

const editItem = ref<CartItem>({
    name: props.item.name,
    quantity: props.item.quantity,
    type: props.item.type
})

const types: string[] = [
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

const emit = defineEmits<{
    (e: 'insertEditted', index: number, item: CartItem): void,
}>()

const edit = (close: () => void) => {
    console.log('Testando');
    emit('insertEditted', props.i, editItem.value)
    close()
}
</script>
