import { db } from '@/firebase'
import type { Lista } from '@/types/types'
import { addDoc, collection, where, query, getDocs, updateDoc, doc } from 'firebase/firestore'

interface ListaFirebase {
  title: string
  expected: number
  cart: Array<object>
}

export default function useListComposable() {
  const actualDate = new Date()
  const dataToDB = `${actualDate.getFullYear()}-${actualDate.getMonth().toString().padStart(2, '0')}-${actualDate.getDate().toString().padStart(2, '0')}`

  async function saveListToFirebase(list: ListaFirebase) {
    const listsRef = collection(db, 'lists')
    const lista = await addDoc(listsRef, { ...list, total: 0, status: false, createdAt: dataToDB })
    if (lista) {
      return true
    }

    return false
  }

  async function getOpenListsFromFirebase(): Promise<Lista[]> {
    const q = await query(collection(db, 'lists'), where('status', '==', false))
    const listsDocs = await getDocs(q)
    return listsDocs.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        cart: data.cart,
        expected: data.expected ?? 0,
        status: data.status ?? false,
        total: 0,
        createdAt: data.createdAt ?? '',
      }
    })
  }

  async function checkListAsDone(id: string, value: number) {
    const listRef = doc(db, 'lists', id)
    await updateDoc(listRef, { status: true, total: value })
  }

  return { saveListToFirebase, getOpenListsFromFirebase, checkListAsDone }
}
