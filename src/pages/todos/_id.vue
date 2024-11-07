<template>
  <h1>To-Do Page</h1>
  <div v-if="loading">
    Loading ...
  </div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Todo Subject</label>
          <input v-model="todo.subject" type="text" class="form-control">
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button type="button" class="btn" :class="todo.completed ? 'btn-success' : 'btn-danger'" @click="toggleTodoStatus">
                {{todo.completed ? 'Completed': 'Incomplete'}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">save</button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">cancel</button>
  </form>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { computed, ref } from 'vue'
import _ from 'lodash'
export default {
  setup () {
    const route = useRoute()
    const router = useRouter()
    const originalTodo = ref(null)
    const todo = ref(null)
    const loading = ref(true)
    const todoId = route.params.id

    const getTodo = async () => {
      const res = await axios.get(`http://localhost:3000/todos/${todoId}`)
      todo.value = { ...res.data }
      originalTodo.value = { ...res.data }
      loading.value = false
    }

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed
    }

    const moveToTodoListPage = () => {
      router.push({
        name: 'Todos'
      })
    }

    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value)
    })

    const onSave = async () => {
      const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
        subject: todo.value.subject,
        completed: todo.value.completed
      })

      originalTodo.value = { ...res.data }
    }
    getTodo()

    return {
      todo,
      originalTodo,
      loading,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
      todoUpdated
    }
  }
}
</script>

<style scoped>

</style>
