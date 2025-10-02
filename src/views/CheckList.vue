<template>
  <q-page class="q-pa-lg q-pa-xl-md text-dark overflow-auto">
    <q-toolbar class="q-pa-none q-mb-md">
      <q-btn flat round icon="arrow_back" @click="router.back()" />
      <q-toolbar-title>{{ list?.title || 'Lista' }}</q-toolbar-title>
      <q-space />
      <q-btn
        flat
        round
        icon="delete"
        color="negative"
        :disable="!list"
        @click="onDelete"
      />
    </q-toolbar>

    <q-spinner v-if="loading" size="lg" class="q-mt-xl flex justify-center" />

    <q-banner v-else-if="error" class="bg-red-1 text-negative q-mb-lg">
      {{ error }}
    </q-banner>

    <div v-else>
      <div v-if="!list?.cart?.length" class="text-center q-mt-xl">
        <q-icon name="shopping_basket" size="48px" />
        <div class="q-mt-sm">Esta lista não possui itens.</div>
      </div>

      <div v-else class="q-gutter-y-xl">
        <!-- Loop pelos tipos (a partir do Set) -->
        <div v-for="type in typesArray" :key="type">
          <div class="text-h6 text-primary q-mb-sm">{{ type }}</div>

          <q-card flat bordered class="rounded-borders">
            <q-list separator>
              <q-item
                v-for="(it, idx) in grouped[type]"
                :key="`${type}-${idx}-${it.name}`"
                class="q-py-sm"
              >
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ it.name }}
                  </q-item-label>
                  <q-item-label caption>
                    Tipo: {{ it.type || 'Outros' }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-badge :label="`Qtd: ${it.quantity}`" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<!-- src/pages/MarketListView.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useListComposable } from '@/composables/useListComposable'

interface CartItem { name: string; type: string; quantity: number }
interface MarketList { id: string; title: string; cart: CartItem[] }

const props = defineProps<{ id: string }>() // <- recebe via props
const router = useRouter()
const $q = useQuasar()
const { deleteList } = useListComposable()

const loading = ref(true)
const error = ref<string | null>(null)
const list = ref<MarketList | null>(null)
const types = ref<Set<string>>(new Set())

onMounted(async () => {
  try {
    const snap = await getDoc(doc(db, 'lists', props.id))
    if (!snap.exists()) {
      error.value = 'Lista não encontrada.'
      return
    }
    const data = snap.data()
    list.value = {
      id: snap.id,
      title: data.title ?? 'Lista',
      cart: Array.isArray(data.cart) ? data.cart : [],
    }
    types.value = new Set((list.value.cart || []).map(i => i?.type?.trim() || 'Outros'))
  } catch (e) {
    console.error(e)
    error.value = 'Erro ao carregar a lista.'
  } finally {
    loading.value = false
  }
})

const typesArray = computed(() => Array.from(types.value).sort((a,b)=>a.localeCompare(b)))
const grouped = computed<Record<string, CartItem[]>>(() => {
  const map: Record<string, CartItem[]> = {}
  for (const it of (list.value?.cart ?? [])) {
    const key = it?.type?.trim() || 'Outros'
    ;(map[key] ||= []).push(it)
  }
  Object.values(map).forEach(arr => arr.sort((a,b)=>a.name.localeCompare(b.name)))
  return map
})

async function onDelete() {
  if (!list.value?.id) return
  $q.dialog({ title:'Excluir lista', message:`Excluir "${list.value.title}"?`, cancel:true, persistent:true })
    .onOk(async () => {
      await deleteList(list.value!.id)
      $q.notify({ type:'positive', message:'Lista excluída.' })
      router.push({ name:'home' })
    })
}
</script>


<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
