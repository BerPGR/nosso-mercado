export type Lista = {
  id: string
  title: string
  cart: Cart[]
  status: boolean
  expected: number
  total: number
  createdAt: Date
}

export type Cart = {
  name: string
  quantity: number
  type: string
  status: boolean
}
