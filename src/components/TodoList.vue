<template>
<!--  <div class="card mt-2" v-for="(todo, index) in todos" :key="todo.id">-->
  <List :items="todos">
<!--    <template #default="slotProps">-->
    <template #default="{ item, index }">
      <div class="card-body p-2 d-flex aline-items-center" style="cursor: pointer" @click="moveToPage(item.id)">
        <div class="flex-grow-1">
          <input class="ml-2 mr-2" type="checkbox" :checked="item.completed" @change="toggleTodo(index, $event)" @click.stop/>
          <span :class="{todo: item.completed}">{{item.subject}}</span>
        </div>
        <div>
          <button class="btn btn-danger btn-sm" @click.stop="openModal(item.id)">delete</button>
        </div>
      </div>
    </template>
  </List>
  <teleport to="#modal">
    <Modal v-if="showModal" @close="closeModal" @delete="deleteTodo">
      <template v-slot:title>
        Delete Todo!
      </template>
      <template v-slot:body>
        Are you sure you want to delete this todo?
      </template>
      <template v-slot:footer>
        <button type="button" class="btn btn-secondary" @click="onClose">Close</button>
        <button type="button" class="btn btn-danger" @click="onDelete">Delete</button>
      </template>
    </Modal>
  </teleport>
</template>

<script>
import { useRouter } from 'vue-router'
import Modal from '@/components/DeleteModal'
import { getCurrentInstance, ref } from 'vue'
import List from '@/components/List'

export default {
  components: {
    Modal,
    List
  },
  name: 'TodoList',
  props: ['todos'],
  emits: ['toggle-todo', 'delete-todo'],

  setup () {
    const { emit } = getCurrentInstance()
    const router = useRouter()
    const todoDeleteId = ref(null)

    const showModal = ref(false)

    const toggleTodo = (index, event) => {
      emit('toggle-todo', index, event.target.checked)
    }

    const openModal = (id) => {
      todoDeleteId.value = id
      showModal.value = true
    }

    const closeModal = () => {
      todoDeleteId.value = null
      showModal.value = false
    }

    const deleteTodo = () => {
      emit('delete-todo', todoDeleteId.value)

      showModal.value = false
      todoDeleteId.value = null
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
      moveToPage,
      showModal,
      openModal,
      closeModal
    }
  }
}
</script>

<style scoped>

</style>
