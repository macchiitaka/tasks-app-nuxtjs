<template>
  <form class="form" @submit.prevent="handleSubmit">
    <input
      v-model="title"
      class="input"
      type="text"
      name="task"
      :maxlength="maxLength"
      required
      autofocus
      placeholder="Add task"
      aria-label="New task"
    />
    <button type="submit" class="button">Add</button>
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

import { TaskModel } from '~/src/domain/models/task-model'

export default Vue.extend({
  props: (() => {
    const onSubmit: PropOptions<(title: TaskModel['title']) => void> = {
      type: Function,
      required: true,
    }

    return {
      onSubmit,
    }
  })(),
  data() {
    return {
      title: '',
    }
  },
  computed: {
    maxLength(): number {
      return 2 ** 16
    },
  },
  methods: {
    handleSubmit(): void {
      const title = this.title
      this.title = ''
      this.onSubmit(title)
    },
  },
})
</script>

<style scoped>
.form {
  display: grid;
  grid-template: 'input . submit' 32px / 1fr 8px max-content;
  align-items: center;
  width: 100%;
}

.form > :nth-child(1) {
  grid-area: input;
}

.form > :nth-child(2) {
  grid-area: submit;
}

.input {
  box-sizing: border-box;
  height: 32px;
  padding: 0 8px;
}

.button {
  height: 32px;
}
</style>
