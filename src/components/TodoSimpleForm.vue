<template>
  <form @submit.prevent="onsubmit">
    <div class="d-flex">
      <div class="flex-grow-1 mr-2">
        <input class="form-control" type="text" v-model="todo" placeholder="Type new to-do">
      </div>
      <div>
        <button class="btn btn-primary" type="submit">Add</button>
      </div>
    </div>
    <div v-show="hasError" style="color: red">
      error
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TodoSimpleForm',
  emits: ['add-todo'],
  setup (props, context) {
    const todo = ref('')

    const hasError = ref(false)

    const onsubmit = () => {
      if (todo.value === '') {
        hasError.value = true
      } else {
        context.emit('add-todo', {
          id: Date.now(),
          subject: todo.value,
          completed: false
        })
        hasError.value = false
        todo.value = ''
      }
    }

    return {
      todo,
      onsubmit,
      hasError
    }
  }
}
</script>

<style scoped>

</style>
