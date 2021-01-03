import { TaskRepositoryInterface } from '../repository-interface/task-repository-interface'

export class ListTasks {
  private readonly taskRepository: TaskRepositoryInterface

  constructor(taskRepository: TaskRepositoryInterface) {
    this.taskRepository = taskRepository
  }

  public readonly execute = () => this.taskRepository.findAll()
}
