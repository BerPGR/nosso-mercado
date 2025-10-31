<template>
    <UModal title="Criar novo grupo" v-model:open="props.isCreateGroupOpen" :close="{
        color: 'error',
        variant: 'outline',
        class: 'rounded-full cursor-pointer',
        onClick: () => props.close()
    }" :ui="{ footer: 'justify-end' }">
        <template #body class="space-y-4">
            <UFormField label="Nome do grupo" class="text-xl">
                <UInput class="w-full" size="xl" v-model="createGroupForm.name" placeholder="Ex.: Família" />
            </UFormField>
        </template>

        <template #footer>
            <div class="flex items-center justify-end gap-2">
                <UButton variant="ghost" color="neutral" @click="props.close()">Cancelar</UButton>

                <UModal v-if="createGroupForm.name.length > 3" v-model:open="creatingGroup" title="Lista Criada!"
                    description="Compartilhe o código abaixo para outras pessoas acessarem sua lista!" :close="{
                        color: 'error',
                        variant: 'outline',
                        class: 'rounded-full cursor-pointer',
                        onClick: () => props.close()
                    }" :ui="{ footer: 'justify-end' }">
                    <UButton :loading="creatingGroup" icon="i-lucide-plus" @click="handleCreateGroup" class="cursor-pointer">
                        Criar
                    </UButton>

                    <template #body>
                        <h1 class="text-xl font-bold text-center">{{ groupCode }}</h1>
                    </template>

                    <template #footer>
                        <UButton label="Beleza!" @click="closeAll()" class="cursor-pointer"/>
                    </template>
                </UModal>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js';
import { generateRandomString } from '@/utils/utils';
import { ref } from 'vue';
import useGroup from '@/composables/useGroup';

const toast = useToast()
const {createGroup, createInviteCode} = useGroup()
const props = defineProps<{
    isCreateGroupOpen: boolean,
    close: () => void
}>()

const groupCode = ref<string>("")

const creatingGroup = ref(false)
const createGroupForm = ref({
    name: '',
})

async function handleCreateGroup() {
    groupCode.value = generateRandomString()
    if (!createGroupForm.value.name.trim()) {
        toast.add({
            title: 'Nome obrigatório',
            color: 'warning',
            icon: 'i-lucide-alert-triangle'
        })
        return
    }

    try {
        creatingGroup.value = true

        const id = await createGroup(createGroupForm.value.name, groupCode.value)

        if (id) {
            await createInviteCode(groupCode.value)
            toast.add({
                title: 'Grupo criado!',
                description: `“${createGroupForm.value.name}” foi criado com sucesso.`,
                color: 'success',
                icon: 'i-lucide-check-circle'
            })
        }
    } catch (e) {
        toast.add({
            title: 'Erro ao criar grupo',
            description: 'Tente novamente em instantes.',
            color: 'error',
            icon: 'i-lucide-bug'
        })
    }
}

function closeAll() {
    createGroupForm.value.name = ''
    creatingGroup.value = false
    props.close()
}
</script>