import { db } from '@/firebase'
import { addDoc, collection } from 'firebase/firestore'

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
    const lista = await addDoc(listsRef, { ...list, createdAt: dataToDB })
    if (lista) {
      return true
    }

    return false
  }

  return { saveListToFirebase }
}
