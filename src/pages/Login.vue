<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UContainer class="min-h-[calc(100vh-12rem)] flex items-center justify-center p-6">
    <UCard class="max-w-xl w-full bg-green-100 shadow-xl">
      <template #header>
        <h1 class="text-3xl font-bold text-center">Bem-vindo!</h1>
      </template>

      <UTabs :items="items" size="xl">
        <template #login class="space-y-4">
          <UFormField label="E-Mail" class="text-lg mt-4">
            <UInput v-model="email" type="email" placeholder="Seu e-mail" size="xl" class="w-full" />
          </UFormField>
          <UFormField label="Senha" class="text-lg mt-4">
            <UInput v-model="password" type="password" placeholder="Sua senha" size="xl" class="w-full" />
          </UFormField>

          <UButton class="w-full cursor-pointer flex items-center justify-center mt-10 text-lg font-bold" :loading="loading"
            @click="handleEmailLogin" size="xl">Entrar
          </UButton>

          <!--<UButton size="xl" icon="i-lucide-google cursor-pointer" variant="outline" :loading="loading"
            @click="handleGoogle">
            Entrar com Google
          </UButton>-->

          <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
        </template>

        <template #register class="space-y-4">
          <UFormField label="Nome" class="text-lg mt-4">
            <UInput v-model="name" type="text" placeholder="Seu nome" size="xl" class="w-full" />
          </UFormField>

          <UFormField label="E-Mail" class="text-lg mt-4">
            <UInput v-model="email" type="email" placeholder="Seu e-mail" size="xl" class="w-full" />
          </UFormField>
          <UFormField label="Senha" class="text-lg mt-4">
            <UInput v-model="password" type="password" placeholder="Sua senha" size="xl" class="w-full" />
          </UFormField>

          <UButton class="w-full cursor-pointer mt-10 flex items-center justify-center text-lg font-bold"
            color="neutral" :loading="loading" size="xl" @click="handleRegister">
            Registrar
          </UButton>

          <!--<UButton size="xl" icon="i-lucide-google cursor-pointer" variant="outline" :loading="loading"
            @click="handleGoogle">
            Entrar com Google
          </UButton>-->

          <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
        </template>
      </UTabs>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import type { TabsItem } from "@nuxt/ui";

const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
const router = useRouter();
const route = useRoute();

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const items = ref<TabsItem[]>([
  { label: "Entrar", value: "login", slot: "login" },
  { label: "Registrar", value: "register", slot: "register" },
])

async function afterLoginRedirect() {
  const redirect = (route.query.redirect as string) || "/";
  await router.replace(redirect);
}

async function handleGoogle() {
  errorMsg.value = ""; loading.value = true;
  try {
    await loginWithGoogle();
    await afterLoginRedirect();
  } catch (e) {
    errorMsg.value = "Erro ao autenticar." + e;
  } finally {
    loading.value = false;
  }
}

async function handleEmailLogin() {
  errorMsg.value = ""; loading.value = true;
  try {
    await loginWithEmail(email.value, password.value);
    await afterLoginRedirect();
  } catch (e) {
    errorMsg.value = "Erro ao autenticar." + e;
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  errorMsg.value = ""; loading.value = true;
  try {
    await registerWithEmail(name.value, email.value, password.value);
    await afterLoginRedirect();
  } catch (e) {
    errorMsg.value = "Erro ao registrar." + e;
  } finally {
    loading.value = false;
  }
}
</script>
