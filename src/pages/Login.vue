<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UContainer class="min-h-screen flex items-center justify-center p-6">
    <UCard class="max-w-xl w-full bg-green-100 shadow-xl">
      <template #header>
        <h1 class="text-3xl text-center font-bold">Entrar</h1>
      </template>

      <div class="space-y-4">
        <UFormField label="E-Mail" class="text-lg">
          <UInput v-model="email" type="email" placeholder="Seu e-mail" size="xl" class="w-full" />
        </UFormField>
        <UFormField label="Senha" class="text-lg">
          <UInput v-model="password" type="password" placeholder="Sua senha" size="xl" class="w-full" />
        </UFormField>

        <div class="flex gap-2">
          <UButton class="w-1/2 cursor-pointer" :loading="loading" @click="handleEmailLogin" size="xl">Entrar</UButton>
          <UButton class="w-1/2 cursor-pointer" color="neutral" :loading="loading" size="xl" @click="handleRegister">
            Registrar
          </UButton>
        </div>

        <UDivider label="ou" />

        <UButton size="xl" icon="i-lucide-google cursor-pointer" variant="outline" :loading="loading"
          @click="handleGoogle">
          Entrar com Google
        </UButton>

        <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

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
    const name = email.value.split("@")[0] || "Usuario";
    await registerWithEmail(name, email.value, password.value);
    await afterLoginRedirect();
  } catch (e) {
    errorMsg.value = "Erro ao registrar." + e;
  } finally {
    loading.value = false;
  }
}
</script>
