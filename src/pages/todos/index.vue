<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2>TO-DO List</h2>
      <button class="btn btn-primary" @click="moveToCreatePage">create todo</button>
    </div>
    <input class="form-control" type="text" v-model="searchText" placeholder="Search" @keydown.enter="searchTodo">
<!--    <TodoSimpleForm @add-todo="addTodo"/>-->
    <div style="color: red">{{ error }}</div>

    <div v-if="!todos.length">
      검색된 Todo가 없습니다.
    </div>
    <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo"/>
    <hr />
    <Pagination v-if="todos.length" :numberOfPages="numberOfPages" :currentPage="currentPage" @click="getTodos"/>

  </div>
</template>

<script>
// import TodoSimpleForm from '@/components/TodoSimpleForm.vue'
import TodoList from '@/components/TodoList.vue'
import { ref, computed, watch } from 'vue'
import axios from '@/axios'
import { useToast } from '@/composables(hooks)/toast'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination'

export default {
  components: {
    TodoList,
    Pagination
    // TodoSimpleForm,
  },
  setup () {
    const router = useRouter()
    const todos = ref([])
    const error = ref('')
    const numberOfTodos = ref(0)
    const currentPage = ref(1)
    const limit = 5

    const searchText = ref('')

    // const showToast = ref(false)
    // const toastTimeOut = ref(null)
    // const toastMessages = ref('')
    // const toastAlertType = ref('')
    // const triggerToast = (message, type = 'success') => {
    //   toastMessages.value = message
    //   showToast.value = true
    //   toastAlertType.value = type
    //
    //   toastTimeOut.value = setTimeout(() => {
    //     toastMessages.value = ''
    //     showToast.value = false
    //     toastAlertType.value = ''
    //     console.log('hello')
    //   }, 3000)
    // }

    const {
      toastMessages,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast()

    // watchEffect(() => {
    //   console.log(currentPage.value)
    // })
    // const a = reactive({
    //   b: 1,
    //   c: 3
    // })

    // watch(() => [a.b, a.c], (current, prev) => {
    //   console.log(current, prev)
    // })
    // a.b = 3
    // watch([currentPage, numberOfTodos], (currentPage, prev) => {
    //   console.log(currentPage, prev)
    // })
    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit)
    })

    const moveToCreatePage = () => {
      router.push({
        name: 'TodoCreate'
      })
    }

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page
      try {
        const res = await axios.get(`todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`)
        numberOfTodos.value = res.headers['x-total-count']
        todos.value = res.data
      } catch (err) {
        error.value = 'Something wrong!'
        triggerToast('Something went wrong', 'danger')
      }
    }

    getTodos()

    const addTodo = async (todo) => {
      error.value = ''
      try {
        await axios.post('todos', {
          id: todo.id,
          subject: todo.subject,
          completed: todo.completed
        })
        await getTodos(1)
      } catch (err) {
        console.log(err)
        error.value = 'Something wrong!'
        triggerToast('Something went wrong', 'danger')
      }
      // .then(res => {
      //   todos.value.push(res.data)
      // }).catch(err => {
      //   console.log(err)
      //   error.value = 'Something wrong!'
      // })
    }

    const deleteTodo = async (id) => {
      error.value = ''
      console.log(id)
      try {
        await axios.delete(`todos/${id}`)
        await getTodos(1)
      } catch (err) {
        error.value = 'Something wrong!'
        triggerToast('Something went wrong', 'danger')
      }
    }

    const toggleTodo = async (index, checked) => {
      console.log(checked)
      error.value = ''
      const id = todos.value[index].id

      try {
        await axios.patch(`todos/${id}`, {
          completed: checked
        })
        todos.value[index].completed = checked
      } catch (err) {
        error.value = 'Something wrong!'
        triggerToast('Something went wrong', 'danger')
      }
    }

    let timeout = null

    const searchTodo = () => {
      clearTimeout(timeout)
      getTodos(1)
    }

    watch(searchText, () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        getTodos(1)
      }, 1000)
    })

    // const filteredTodes = computed(() => {
    //   if (searchText.value) {
    //     return todos.value.filter(todo => {
    //       return todo.subject.includes(searchText.value)
    //     })
    //   }
    //
    //   return todos.value
    // })
    return {
      todos,
      deleteTodo,
      searchTodo,
      addTodo,
      toggleTodo,
      searchText,
      // filteredTodes,
      error,
      numberOfPages,
      currentPage,
      getTodos,
      showToast,
      toastMessages,
      toastAlertType,
      triggerToast,
      moveToCreatePage
    }
  }
}
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>
