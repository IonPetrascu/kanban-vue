import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Dashboard, Task, User, Column } from '../types'

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboards = ref<Dashboard[]>([
    {
      id: 0,
      title: 'Frontend',
      columns: [
        {
          id: 0,
          title: 'To Do',
          tasks: []
        }
      ],
      difficulty: ['low', 'medium', 'high'],
      users: [
        {
          id: 0,
          name: 'Andrei',
          email: 'andreipiatra@gmail.com'
        },
        {
          id: 1,
          name: 'Ana',
          email: 'ana@gmail.com'
        },
        {
          id: 2,
          name: 'Diva',
          email: 'divaSaya@gmail.com'
        }
      ],
      background: '#2b2b36',
      useColorForBg: false
    },
    {
      id: 1,
      title: 'Home',
      columns: [
        {
          id: 0,
          title: 'To Do',
          tasks: [
            {
              id: 0,
              title: 'new task',
              difficulty: 'low',
              description:
                "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              usersId: [0, 1]
            },
            {
              id: 44,
              title: 'new task',
              difficulty: 'low',
              description:
                "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              usersId: [1]
            }
          ]
        }
      ],
      difficulty: ['low', 'medium', 'high'],
      users: [
        {
          id: 0,
          name: 'Andrei',
          email: 'andreipiatra@gmail.com'
        },
        {
          id: 1,
          name: 'Ana',
          email: 'ana@gmail.com'
        },
        {
          id: 2,
          name: 'Diva',
          email: 'divaSaya@gmail.com'
        }
      ],
      background: '#2b2b36',
      useColorForBg: true
    },
    {
      id: 2,
      title: 'Training',
      columns: [],
      difficulty: ['low', 'medium', 'high'],
      users: [
        {
          id: 0,
          name: 'Andrei',
          email: 'andreipiatra@gmail.com'
        },
        {
          id: 1,
          name: 'Ana',
          email: 'ana@gmail.com'
        },
        {
          id: 2,
          name: 'Diva',
          email: 'divaSaya@gmail.com'
        }
      ],
      background: '#2b2b36',
      useColorForBg: true
    }
  ])

  const currentTask = ref<Task | null>(null)
  const currentDashboardId = ref<number | null>(null)
  const currentColumnId = ref<number | null>(null)

  const findDashboard = (): Dashboard | undefined => {
    return dashboards.value.find((d) => d.id === currentDashboardId.value)
  }

  const findColumn = (dashboard: Dashboard, columnId: number): Column | undefined => {
    return dashboard.columns.find((col) => col.id === columnId)
  }

  const getCurentValuesDetails = (): {
    task?: Task
    column?: Column
    dashboard?: Dashboard
  } | null => {
    if (currentDashboardId.value !== null && currentColumnId.value !== null) {
      const dashboard = dashboards.value.find((d) => d.id === currentDashboardId.value)

      if (dashboard) {
        const column = dashboard.columns.find((col) => col.id === currentColumnId.value)

        if (column) {
          const task = column.tasks?.find((t) => t.id === currentTask.value?.id)

          return { task, column, dashboard }
        }
      }
    }

    return null
  }

  const setCurrentDashboardId = (id: number): void => {
    currentDashboardId.value = id
  }

  const setCurrentColumnId = (id: number): void => {
    currentColumnId.value = id
  }

  const setCurrentTask = (columnId: number, taskId: number): void => {
    const dashboard = findDashboard()
    if (dashboard) {
      const column = dashboard.columns.find((c) => c.id === columnId)
      if (column?.tasks) {
        currentTask.value = column.tasks.find((t) => t.id === taskId) || null
      }
    }
  }

  const updateColumnTitle = (columnId: number, newTitle: string): void => {
    const dashboard = findDashboard()

    if (!dashboard) return

    const column = findColumn(dashboard, columnId)

    if (!column) return

    column.title = newTitle
  }

  const addNewTask = (columnId: number, newTask: Task): void => {
    const dashboard = findDashboard()

    if (!dashboard) return

    if (dashboard) {
      const findColumn = dashboard.columns.find((col) => col.id === columnId)

      if (findColumn?.tasks) {
        findColumn.tasks.push(newTask)
      }
    }
  }

  const getUserInTask = (taskUserId: number): User | undefined => {
    const dashboard = findDashboard()
    if (dashboard) {
      return dashboard.users.find((user) => user.id === taskUserId)
    }
    return
  }

  const addUserToTask = (userId: number): void => {
    const details = getCurentValuesDetails()

    if (details?.task) {
      details.task.usersId = details.task.usersId ? [...details.task.usersId, userId] : [userId]
    }
  }

  const removeUserFromTask = (userId: number): void => {
    const details = getCurentValuesDetails()

    if (details?.task?.usersId) {
      details.task.usersId = details.task.usersId.filter((id: number) => id !== userId)
    }
  }

  const changeDifficulty = (newDifficulty: string): void => {
    const details = getCurentValuesDetails()

    if (details?.task) {
      details.task.difficulty = newDifficulty
    }
  }

  const changeDescription = (newDescription: string): void => {
    const details = getCurentValuesDetails()

    if (details?.task) {
      details.task.description = newDescription
    }
  }

  const changeTaskTitle = (newTitle: string): void => {
    const details = getCurentValuesDetails()

    if (details?.task) {
      details.task.title = newTitle
    }
  }

  const changeColumnOfTask = (oldColumnId: number, newColumnId: number): void => {
    const dashboard = findDashboard()

    if (!dashboard) return

    const oldColumn = dashboard.columns.find((column) => column.id === oldColumnId)
    const newColumn = dashboard.columns.find((column) => column.id === newColumnId)

    if (!oldColumn?.tasks || !newColumn?.tasks || !currentTask.value) {
      return
    }

    oldColumn.tasks = oldColumn.tasks.filter((task) => task.id !== currentTask.value?.id)
    newColumn.tasks = [...newColumn.tasks, currentTask.value]
  }

  const createNewColumn = (): void => {
    const newId = Date.now()

    const newColumn: Column = {
      id: newId,
      title: 'New title',
      tasks: []
    }

    const dashboard = findDashboard()
    dashboard?.columns.push(newColumn)
  }

  const createNewDashboard = (): void => {
    const newId = Date.now()

    const newDashboard: Dashboard = {
      id: newId,
      title: 'New Dashboard',
      columns: [],
      difficulty: ['low', 'medium', 'high'],
      users: [],
      background: '#2b2b36',
      useColorForBg: false
    }

    dashboards.value.push(newDashboard)
  }

  return {
    dashboards,
    currentTask,
    currentDashboardId,
    currentColumnId,
    updateColumnTitle,
    setCurrentDashboardId,
    addNewTask,
    setCurrentTask,
    setCurrentColumnId,
    getUserInTask,
    addUserToTask,
    removeUserFromTask,
    changeDifficulty,
    changeDescription,
    changeColumnOfTask,
    changeTaskTitle,
    createNewColumn,
    createNewDashboard
  }
})
