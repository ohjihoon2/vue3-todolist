<template>
  <div class="card mt-2" v-for="(todo, index) in todos" :key="todo.id">
    <div class="card-body p-2 d-flex aline-items-center" style="cursor: pointer" @click="moveToPage(todo.id)">
      <div class="flex-grow-1">
        <input class="ml-2 mr-2" type="checkbox" :checked="todo.completed" @change="toggleTodo(index, $event)" @click.stop/>
        <span :class="{todo: todo.completed}">{{todo.subject}}</span>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click.stop="deleteTodo(index)">delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'TodoList',
  props: ['todos'],
  emits: ['toggle-todo', 'delete-todo'],

  setup (props, { emit }) {
    const router = useRouter()

    const toggleTodo = (index, event) => {
      emit('toggle-todo', index, event.target.checked)
    }

    const deleteTodo = (index) => {
      emit('delete-todo', index)
    }

    const moveToPage = (todoId) => {
      // router.push('/todos/' + todoId)
      router.push({
        name: 'Todo',
        params: {
          id: todoId
        }
      })
    }

    return {
      toggleTodo,
      deleteTodo,
      moveToPage
    }
  }
}
</script>

<style scoped>

</style>
