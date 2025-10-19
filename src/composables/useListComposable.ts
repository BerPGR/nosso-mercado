import { db } from '@/firebase'
import type { Lista } from '@/types/types'
import {
  addDoc,
  collection,
  where,
  query,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore'
import { useAuth } from '@/composables/useAuth'

interface ListaFirebase {
  title: string
  expected: number
  cart: Array<object>
}

export default function useListComposable() {
  const { user } = useAuth()
  const actualDate = new Date()
  const dataToDB = `${actualDate.getFullYear()}-${actualDate.getMonth().toString().padStart(2, '0')}-${actualDate.getDate().toString().padStart(2, '0')}`

  async function saveListToFirebase(list: ListaFirebase) {
    const listsRef = collection(db, 'lists')
    const lista = await addDoc(listsRef, {
      ...list,
      total: 0,
      status: false,
      createdAt: dataToDB,
      uid: user.value?.uid,
    })
    if (lista) {
      return true
    }

    return false
  }

  async function getOpenListsFromFirebase(): Promise<Lista[]> {
    const { user } = useAuth()
    const q = await query(
      collection(db, 'lists'),
      where('status', '==', false),
      where('uid', '==', user.value?.uid),
      orderBy('createdAt', 'desc'),
    )

    const listsDocs = await getDocs(q)

    if (listsDocs.docs.length === 0) return []
    return listsDocs.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        cart: data.cart,
        expected: data.expected ?? 0,
        status: data.status ?? false,
        total: data.total,
        createdAt: data.createdAt ?? '',
      }
    })
  }

  async function getClosedListsFromFirebase(): Promise<Lista[]> {
    const { user } = useAuth()
    const q = await query(
      collection(db, 'lists'),
      where('status', '==', true),
      where('uid', '==', user.value?.uid),
      orderBy('createdAt', 'desc'),
    )
    const listsDocs = await getDocs(q)
    if (listsDocs.docs.length === 0) return []
    return listsDocs.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        cart: data.cart,
        expected: data.expected ?? 0,
        status: data.status ?? false,
        total: data.total,
        createdAt: data.createdAt ?? '',
      }
    })
  }

  async function checkListAsDone(id: string, value: number) {
    const listRef = doc(db, 'lists', id)
    await updateDoc(listRef, { status: true, total: value })
  }

  async function deleteListById(id: string) {
    const listRef = doc(db, 'lists', id)
    await deleteDoc(listRef)
  }

  return {
    saveListToFirebase,
    getOpenListsFromFirebase,
    getClosedListsFromFirebase,
    checkListAsDone,
    deleteListById,
  }
}
