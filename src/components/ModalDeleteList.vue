<template>
  <UModal title="Deletar lista" description="Voce esta deletando uma lista!" :close="{
    color: 'error',
    variant: 'outline',
    class: 'rounded-full cursor-pointer',
  }" :ui="{ footer: 'justify-end' }">
    <UButton icon="i-lucide-trash" color="error" size="md" variant="soft" class="cursor-pointer" />

    <template #footer>
      <UButton label="Deletar" :disabled="!props.id" color="error" @click="emit('delete', props.id)"
        class="cursor-pointer" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()
</script>
