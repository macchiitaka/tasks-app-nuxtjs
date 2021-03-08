<template>
  <li class="item">
    <input
      :id="id"
      type="checkbox"
      class="input"
      :checked="done"
      @change="handleChangeDone"
    />
    <label class="label" :for="id">{{ title }}</label>
    <button type="button" class="button" @click="handleClickDelete">
      Delete
    </button>
  </li>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

import { TaskModel } from '~/src/domain/models/task-model'

export default Vue.extend({
  props: (() => {
    const id: PropOptions<TaskModel['id']> = {
      type: Number,
      required: true,
    }

    const title: PropOptions<TaskModel['title']> = {
      type: String,
      required: true,
    }

    const done: PropOptions<TaskModel['done']> = {
      type: Boolean,
      required: true,
    }

    const onChangeDone: PropOptions<(id: TaskModel['id']) => void> = {
      type: Function,
      required: true,
    }

    const onDeleteTask: PropOptions<(id: TaskModel['id']) => void> = {
      type: Function,
      required: true,
    }

    return {
      id,
      title,
      done,
      onChangeDone,
      onDeleteTask,
    }
  })(),
  methods: {
    handleChangeDone(): void {
      this.onChangeDone(this.id)
    },
    handleClickDelete(): void {
      if (confirm(`Are you OK to delete "${this.title || 'NO TITLE'}"`)) {
        this.onDeleteTask(this.id)
      }
    },
  },
})
</script>

<style scoped>
.item {
  display: grid;
  grid-template: 'input . text . delele' 32px / max-content 8px 1fr 8px max-content;
  align-items: center;
  width: 100%;
}

.item > :nth-child(1) {
  grid-area: input;
}

.item > :nth-child(2) {
  grid-area: text;
}

.item > :nth-child(3) {
  grid-area: delele;
}

.label {
  overflow: hidden;
  color: var(--color-black);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.input:checked + .label {
  color: var(--color-black-70);
  text-decoration: line-through;
}

.button {
  height: 32px;
}
</style>
