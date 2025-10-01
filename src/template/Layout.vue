<template>
    <q-layout view="lHh Lpr fFf">
        <q-header elevated class="bg-primary text-white" height-hint="98">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="drawerToggle" />
                <q-toolbar-title>
                    Nosso Mercado 🤍
                </q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-drawer side="left" v-model="drawerOpen" elevated>
            <q-list>
                <q-item to="/" clickable :active="true" v-ripple>
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>
                        Home
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item to="/about" clickable :active="true" v-ripple>
                    <q-item-section avatar>
                        <q-icon name="add" />
                    </q-item-section>
                    <q-item-section>
                        Adicionar lista
                    </q-item-section>
                </q-item>

            </q-list>
        </q-drawer>
        <q-page-container>
            <router-view />
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
