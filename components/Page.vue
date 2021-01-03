<template>
  <main class="container">
    <h1>Tasks</h1>
    <NewTaskForm :on-submit="handleCrateTask" />
    <div class="listWrapper">
      <p v-if="pending">Loading...</p>
      <ul v-else class="list">
        <TaskLi
          v-for="task of tasks"
          :id="task.id"
          :key="task.id"
          :title="task.title"
          :done="task.done"
          :on-change-done="handleChangeDone"
          :on-delete-task="handleDeleteTask"
        />
      </ul>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskModel } from '~/src/domain/models/task-model'
import { ListTasks } from '~/src/application/usecases/list-tasks'
import { ReplaceTask } from '~/src/application/usecases/replace-task'
import { RemoveTask } from '~/src/application/usecases/remove-task'
import { CreateTask } from '~/src/application/usecases/create-task'
import { TaskRepository } from '~/src/interfaces/repositories/task-repository'
import { api } from '~/src/interfaces/api'

@Component
export default class Page extends Vue {
  @Prop({ required: true })
  onSubmit!: (title: string) => void

  tasks: TaskModel[] = []
  pending: boolean = true

  async mounted() {
    const res = await new ListTasks(new TaskRepository(api)).execute()

    if (!res.success) {
      throw res.error
    }

    this.tasks = res.data
    this.pending = false
  }

  private async fetchTasks(): Promise<void> {
    const res = await new ListTasks(new TaskRepository(api)).execute()

    if (!res.success) {
      return
    }

    this.tasks = res.data
  }

  async handleCrateTask(title: string): Promise<void> {
    const tempId = Math.random()
    const now = new Date()

    const newTask: TaskModel = {
      id: tempId,
      title,
      done: false,
      createdAt: now,
      updatedAt: now,
    }

    this.tasks = [newTask, ...this.tasks]

    const res = await new CreateTask(new TaskRepository(api)).execute(title)

    if (!res.success) {
      await this.fetchTasks()
      return
    }

    this.tasks = this.tasks.map((task) =>
      task.id === tempId ? res.data : task,
    )
  }

  async handleChangeDone(id: TaskModel['id']): Promise<void> {
    this.tasks = this.tasks.map((task) => {
      if (task.id !== id) {
        return task
      }

      return {
        ...task,
        done: !task.done,
      }
    })

    const task = this.tasks.find((task) => task.id === id)

    if (!task) {
      return task
    }

    const res = await new ReplaceTask(new TaskRepository(api)).execute({
      id: task.id,
      title: task.title,
      done: task.done,
    })

    if (!res.success) {
      await this.fetchTasks()
      return
    }

    this.tasks = this.tasks.map((task) => (task.id === id ? res.data : task))
  }

  async handleDeleteTask(id: TaskModel['id']): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id)

    const res = await new RemoveTask(new TaskRepository(api)).execute(id)

    if (!res.success) {
      await this.fetchTasks()
    }
  }
}
</script>

<style>
.container {
  padding: 8px 32px;
}

.listWrapper {
  padding-top: 16px;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list > :not(:first-child) {
  margin-top: 12px;
}
</style>
