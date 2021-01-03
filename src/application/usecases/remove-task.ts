import { TaskModel } from '../../domain/models/task-model'
import { TaskRepositoryInterface } from '../repository-interface/task-repository-interface'

export class RemoveTask {
  private readonly taskRepository: TaskRepositoryInterface

  constructor(taskRepository: TaskRepositoryInterface) {
    this.taskRepository = taskRepository
  }

  public readonly execute = (id: TaskModel['id']) =>
    this.taskRepository.delete(id)
}
