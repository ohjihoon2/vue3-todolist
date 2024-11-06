<template>
  <div class="card mt-2" v-for="(todo, index) in todos" :key="todo.id">
    <div class="card-body p-2 d-flex aline-items-center">
      <div class="form-check flex-grow-1">
        <input class="form-check-input" type="checkbox" :checked="todo.completed" @change="toggleTodo(index)"/>
        <label class="form-check-label" :class="{todo: todo.completed}">{{todo.subject}}</label>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click="deleteTodo(index)">delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoList',
  props: ['todos'],
  emits: ['toggle-todo', 'delete-todo'],

  setup (props, { emit }) {
    const toggleTodo = (index) => {
      emit('toggle-todo', index)
    }

    const deleteTodo = (index) => {
      emit('delete-todo', index)
    }

    return {
      toggleTodo,
      deleteTodo
    }
  }
}
</script>

<style scoped>

</style>
