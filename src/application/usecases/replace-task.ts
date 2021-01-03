import { TaskModel } from '../../domain/models/task-model'
import { TaskRepositoryInterface } from '../repository-interface/task-repository-interface'

export class ReplaceTask {
  private readonly taskRepository: TaskRepositoryInterface

  constructor(taskRepository: TaskRepositoryInterface) {
    this.taskRepository = taskRepository
  }

  public readonly execute = ({
    id,
    ...data
  }: Omit<TaskModel, 'createdAt' | 'updatedAt'>) =>
    this.taskRepository.replace(id, data)
}
