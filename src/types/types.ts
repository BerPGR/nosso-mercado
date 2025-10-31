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

export type CartItem = {
  name: string,
  quantity: number,
  type: string
}

export type Group = {
  name: string,
  code: string,
  createdAt: Date,
  ownerId: string,
  memberIds: string[]
}

export type FirebaseUser = {
  name: string, 
  email: string,
  uid: string,
  type: boolean
}