import { http } from './http'

type TaskRecord = {
  id: number
  created_at: string // RFC3339
  updated_at: string // RFC3339
  title: string
  done: boolean
}

export const getTaskAll = async () =>
  await http.get<{ items: TaskRecord[] }>('/tasks')

export const getTask = async (params: { id: number }) =>
  await http.get<TaskRecord>(`/tasks/${params.id}`)

export const createTask = async (_: {}, data: { title: string }) =>
  await http.post<TaskRecord>('/tasks', data)

export const updateTask = async (
  params: { id: number },
  data: { title: string; done: boolean },
) => await http.put<TaskRecord>(`/tasks/${params.id}`, data)

export const deleteTask = async (params: { id: number }) =>
  await http.delete<void>(`/tasks/${params.id}`)
