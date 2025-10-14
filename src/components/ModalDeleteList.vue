<template>
  <UModal title="Deletar lista" description="Voce esta deletando uma lista!" :close="{
    color: 'error',
    variant: 'outline',
    class: 'rounded-full'
  }" :ui="{ footer: 'justify-end' }">
    <UButton icon="i-lucide-trash" color="error" size="md" variant="soft" />

    <template #footer>
      <UButton label="Deletar" color="error" @click="$emit('delete')" />
    </template>
  </UModal>
</template>
