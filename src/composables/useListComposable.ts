import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { ref } from "vue";

interface CartItem {
  name: string;
  type: string;
  quantity: number;
}

export function useListComposable() {
  const cart = ref<CartItem[]>([]);

  function addToCart(item: CartItem) {
    cart.value.push(item);
  }

  function getListItems() {
    return cart.value
  }

  async function addList(title: string) {
    try {
      const docRef = await addDoc(collection(db, "lists"), {
        title,
        cart: cart.value
      })

      if (docRef != null || docRef != undefined) {
        return {
          status: "success",
          message: "Lista criada com sucesso!",
        }
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async function getLists() {
    const querySnapshot = await getDocs(collection(db, "lists"));
    const listas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return listas;
  }

  async function deleteList(id: string) {
    await deleteDoc(doc(db, "lists", id));
  }
  return { addToCart, addList, getLists, deleteList, getListItems }
}
