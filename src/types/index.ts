export type Item = {
  id: number
  title: string
  categoryId: number
  difficulty?: string
  description?: string
  usersId?: number[]
}

export type Category = {
  id: number
  title: string
}

export type User = {
  id: number
  name: string
  email: string
}

export type Difficulty = 'low' | 'medium' | 'high'
