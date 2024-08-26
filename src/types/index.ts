export type Task = {
  id: number
  title: string
  difficulty?: string
  description?: string
  usersId?: number[]
}

export type Column = {
  id: number
  title: string
  tasks?: Task[]
}

export type User = {
  id: number
  name: string
  email: string
}

export type Difficulty = 'low' | 'medium' | 'high'
export type HexColor = `#${string}`

export type Dashboard = {
  id: number
  title: string
  columns: Column[]
  difficulty: Difficulty[]
  users: User[]
  background?: HexColor
  useColorForBg: Boolean
}
