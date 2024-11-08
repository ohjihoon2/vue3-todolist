<template>
  <div v-if="loading">
    Loading ...
  </div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Todo Subject</label>
          <input v-model="todo.subject" type="text" class="form-control">
          <div style="color: red" v-if="subjectError">{{subjectError}}</div>
        </div>
      </div>
      <div v-if="editing" class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button type="button" class="btn" :class="todo.completed ? 'btn-success' : 'btn-danger'" @click="toggleTodoStatus">
              {{todo.completed ? 'Completed': 'Incomplete'}}
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea v-model="todo.body" class="form-control" cols="30" rows="10"></textarea>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated"> {{editing ? 'update': 'create'}}</button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">cancel</button>
  </form>
  <Toast v-if="showToast" :messages="toastMessages" :type="toastAlertType"/>
  <div id="jihoon">oh</div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { computed, ref, onBeforeMount, onMounted } from 'vue'
import _ from 'lodash'
import Toast from '@/components/Toast'
import { useToast } from '@/composables(hooks)/toast'

export default {
  components: {
    Toast
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    onBeforeMount(() => {
      console.log(document.querySelector('#jihoon'))
    })

    onMounted(() => {
      console.log(document.querySelector('#jihoon'))
    })

    const route = useRoute()
    const router = useRouter()
    const originalTodo = ref(null)
    const todo = ref({
      subject: '',
      computed: false,
      body: ''
    })

    const subjectError = ref('')
    const loading = ref(false)

    const todoId = route.params.id

    const {
      toastMessages,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast()

    const getTodo = async () => {
      try {
        loading.value = true
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`)
        todo.value = { ...res.data }
        originalTodo.value = { ...res.data }
        loading.value = false
      } catch (error) {
        // console.log(error)
        loading.value = false
        triggerToast('Something went wrong', 'danger')
      }
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
      subjectError.value = ''
      if (!todo.value.subject) {
        subjectError.value = 'Subject is required'
        return
      }
      try {
        let res
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body
        }
        if (props.editing) {
          res = await axios.put(`http://localhost:3000/todos/${todoId}`, data)
          originalTodo.value = { ...res.data }
        } else {
          res = await axios.post('http://localhost:3000/todos', data)
          todo.value.subject = ''
          todo.value.body = ''
        }
        const message = 'Successfully ' + (props.editing ? 'Updated' : 'Created')
        triggerToast(message)
      } catch (error) {
        triggerToast('Something went wrong', 'danger')
      }
    }

    if (props.editing) {
      getTodo()
    }

    return {
      todo,
      originalTodo,
      loading,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessages,
      toastAlertType,
      subjectError
    }
  }
}
</script>

<style scoped>

</style>
