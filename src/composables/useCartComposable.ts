import { ref } from "vue";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

export function useCartComposable() {
  const cart = ref<CartItem[]>([]);
}
