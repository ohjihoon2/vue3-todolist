<template>
  <div>
    <h2>TO-DO List</h2>
    <input class="form-control" type="text" v-model="searchText" placeholder="Search" @keydown.enter="searchTodo">
    <TodoSimpleForm @add-todo="addTodo"/>
    <div style="color: red">{{ error }}</div>

    <div v-if="!todos.length">
      검색된 Todo가 없습니다.
    </div>
    <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo"/>
    <hr />
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <CursorPointer class="page-link"  v-if="currentPage !== 1" @click="getTodos(currentPage -1)">
            Previous
          </CursorPointer>
        </li>
        <li class="page-item"
            :class="currentPage === page ? 'active' : ''"
            v-for="page in numberOfPages"
            :key="page"
        >
          <CursorPointer class="page-link" @click="getTodos(page)">{{page}}</CursorPointer>
        </li>
        <li class="page-item">
          <CursorPointer class="page-link"
                         v-if="numberOfPages !== currentPage"
                         @click="getTodos(currentPage+1)"
          >Next</CursorPointer>
        </li>
      </ul>
    </nav>
  </div>
  <Toast v-if="showToast" :messages="toastMessages" :type="toastAlertType"/>
</template>

<script>
import TodoSimpleForm from '@/components/TodoSimpleForm.vue'
import TodoList from '@/components/TodoList.vue'
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import CursorPointer from '@/components/CursorPointer'
import Toast from '@/components/Toast'
import { useToast } from '@/composables(hooks)/toast'

export default {
  components: {
    CursorPointer,
    TodoList,
    TodoSimpleForm,
    Toast
  },
  setup () {
    const todos = ref([])
    const error = ref('')
    const numberOfTodos = ref(0)
    const limit = 5
    const currentPage = ref(1)

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

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page
      try {
        const res = await axios.get(`http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`)
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
        await axios.post('http://localhost:3000/todos', {
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

    const deleteTodo = async (index) => {
      error.value = ''
      const id = todos.value[index].id
      console.log(id)
      try {
        await axios.delete(`http://localhost:3000/todos/${id}`)
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
        await axios.patch(`http://localhost:3000/todos/${id}`, {
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
      triggerToast
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
