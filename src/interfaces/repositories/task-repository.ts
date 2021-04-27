import { errorMap } from '../../../lib/error'
import { isAxiosError } from '../../../lib/type'
import { TaskRepositoryInterface } from '../../application/repository-interface/task-repository-interface'
import { TaskModel } from '../../domain/models/task-model'
import { API } from '../api'

type TaskRecord = {
  id: number
  // eslint-disable-next-line camelcase
  created_at: string // RFC3339
  // eslint-disable-next-line camelcase
  updated_at: string // RFC3339
  title: string
  done: boolean
}

const convertToModel = ({
  // eslint-disable-next-line camelcase
  created_at,
  // eslint-disable-next-line camelcase
  updated_at,
  ...rest
}: TaskRecord): TaskModel => ({
  ...rest,
  createdAt: new Date(created_at),
  updatedAt: new Date(updated_at),
})

const switchError = (error: Error): Error => {
  if (!isAxiosError(error)) {
    return error
  }

  const status = error?.response?.status

  if (typeof status === 'undefined') {
    return error
  }

  const MaybeError = errorMap.get(status)

  if (!MaybeError) {
    return error
  }

  return new MaybeError(error.response?.statusText ?? '')
}

/**
 * @todo clean error handlers
 */
export class TaskRepository implements TaskRepositoryInterface {
  private readonly api: API

  constructor(api: API) {
    this.api = api
  }

  public readonly findAll: TaskRepositoryInterface['findAll'] = async () => {
    try {
      return {
        success: true,
        data: (await this.api.getTaskAll()).data.items.map(convertToModel),
      }
    } catch (error) {
      return {
        success: false,
        error: switchError(error),
      }
    }
  }

  public readonly find: TaskRepositoryInterface['find'] = async (id) => {
    try {
      return {
        success: true,
        data: convertToModel((await this.api.getTask({ id })).data),
      }
    } catch (error) {
      return {
        success: false,
        error: switchError(error),
      }
    }
  }

  public readonly save: TaskRepositoryInterface['save'] = async (data) => {
    try {
      return {
        success: true,
        data: convertToModel((await this.api.createTask({}, data)).data),
      }
    } catch (error) {
      return {
        success: false,
        error: switchError(error),
      }
    }
  }

  public readonly replace: TaskRepositoryInterface['replace'] = async (
    id,
    data,
  ) => {
    try {
      return {
        success: true,
        data: convertToModel((await this.api.updateTask({ id }, data)).data),
      }
    } catch (error) {
      return {
        success: false,
        error: switchError(error),
      }
    }
  }

  public readonly delete: TaskRepositoryInterface['delete'] = async (
    id: number,
  ) => {
    try {
      await this.api.deleteTask({ id })

      return {
        success: true,
        data: null,
      }
    } catch (error) {
      return {
        success: false,
        error: switchError(error),
      }
    }
  }
}
