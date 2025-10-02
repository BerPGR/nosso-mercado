<template>
  <q-page class="q-pa-lg q-pa-xl-md text-dark overflow-auto">
    <h3 class="text-center">Vamos criar a lista!</h3>
    <q-input outlined label="Nome da lista" v-model="title" class="q-mt-lg" />

    <!-- Formulário do item -->
    <div class="q-mt-xl q-pa-md bg-grey-2 rounded-borders">
      <h5 class="text-center">Adicionar item</h5>

      <q-input outlined label="Nome do item" v-model="item.name" class="q-mt-md" />

      <q-select outlined label="Tipo" :options="options" v-model="item.type" class="q-mt-md" />

      <q-input outlined type="number" label="Quantidade" v-model.number="item.quantity" class="q-mt-md" />

      <div class="flex justify-center q-mt-lg">
        <q-btn color="primary" label="Adicionar ao carrinho" @click="addItem" />
      </div>
    </div>

    <!-- Lista dos itens adicionados -->
    <div v-if="cartItems.length" class="q-mt-xl">
      <h5 class="text-center text-secondary">Itens no carrinho</h5>

      <q-list bordered separator>
        <q-item v-for="(cartItem, index) in cartItems" :key="index">
          <q-item-section>
            <q-item-label>{{ cartItem.name }} ({{ cartItem.type }})</q-item-label>
            <q-item-label caption>Qtd: {{ cartItem.quantity }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat dense round icon="delete" color="negative" @click="removeItem(index)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Botão para salvar lista -->
    <div class="flex justify-center q-mt-xl">
      <q-btn color="positive" label="Salvar lista" @click="saveList" :disable="!title || !cartItems.length" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useListComposable } from '@/composables/useListComposable';

interface CartItem {
  name: string;
  type: string;
  quantity: number;
}

const title = ref<string>('');
const item = ref<CartItem>({
  name: '',
  type: '',
  quantity: 1
});

const options: string[] = ['Açougue', 'Bebidas', 'Frios', 'Hortifruti', 'Higiene Pessoal', 'Laticinios', 'Limpeza', 'Mercearia', 'Padaria'];

const { addToCart, getListItems, addList } = useListComposable();
const cartItems = ref<CartItem[]>([]);

function addItem() {
  if (!item.value.name || !item.value.type || item.value.quantity <= 0) return;

  addToCart({ ...item.value });
  cartItems.value = getListItems();

  // limpa os inputs
  item.value = { name: '', type: '', quantity: 1 };
}

function removeItem(index: number) {
  cartItems.value.splice(index, 1);
}

async function saveList() {
  const response = await addList(title.value);
  if (response?.status === 'success') {
    title.value = '';
    cartItems.value = [];
  }
}
</script>
