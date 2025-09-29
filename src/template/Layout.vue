<template>
    <q-layout view="hHh LpR fff">
        <q-header elevated class="bg-primary text-white" height-hint="98">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="drawerToggle" />
                <q-toolbar-title>
                    Nosso Mercado 🤍
                </q-toolbar-title>
            </q-toolbar>

            <q-drawer show-if-above side="left" v-model="drawerOpen" behaviour="mobile" elevated>
                <q-list>
                    <q-item clickable :active="true" v-ripple>
                        <q-item-section avatar>
                            <q-icon name="home" />
                        </q-item-section>
                        <q-item-section>
                            Home
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable :active="true" v-ripple>
                        <q-item-section avatar>
                            <q-icon name="add" />
                        </q-item-section>
                        <q-item-section>
                            Adicionar lista
                        </q-item-section>
                    </q-item>

                </q-list>
            </q-drawer>
        </q-header>
        <q-page-container>
            <slot />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawerOpen = ref<boolean>(false)

const drawerToggle = () => {
    drawerOpen.value = !drawerOpen.value
}
</script>