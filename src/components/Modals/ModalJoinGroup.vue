<template>
    <UModal title="Entrar em grupo" description="Digite o código do grupo para entrar em um!" v-model:open="props.isJoinGroupOpen" :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer',
        onClick: () => props.close()
    }" :ui="{ footer: 'justify-end'}">
    <template #body>
        <UPinInput otp :length="6" size="xl" v-model="groupCode" class="flex justify-center"/>
    </template>

    <template #footer>
        <UButton label="Entrar" size="xl" color="info" @click="joinGroupWithCode"/>
    </template>
    </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import useGroup from '@/composables/useGroup';

const {joinGroup} = useGroup()
const props = defineProps<{
    close: () => void,
    isJoinGroupOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'load'): void
}>()

const groupCode = ref<string[]>([])

const joinGroupWithCode = async () => {
    const code = groupCode.value.join('')

    await joinGroup(code)
    emit('load')
    props.close()
}
</script>