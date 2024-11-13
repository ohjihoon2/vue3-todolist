<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item">
        <CursorPointer class="page-link"  v-if="currentPage !== 1" @click="onClick(currentPage -1)">
          Previous
        </CursorPointer>
      </li>
      <li class="page-item"
          :class="currentPage === page ? 'active' : ''"
          v-for="page in numberOfPages"
          :key="page"
      >
        <CursorPointer class="page-link" @click="onClick(page)">{{page}}</CursorPointer>
      </li>
      <li class="page-item">
        <CursorPointer class="page-link"
                       v-if="numberOfPages !== currentPage"
                       @click="onClick(currentPage+1)"
        >Next</CursorPointer>
      </li>
    </ul>
  </nav>
</template>

<script>
import { getCurrentInstance } from 'vue'
import CursorPointer from '@/components/CursorPointer'

export default {
  components: {
    CursorPointer
  },
  props: {
    numberOfPages: {
      type: Number,
      require: true
    },
    currentPage: {
      type: Number,
      require: true
    }
  },
  emits: ['click'],
  setup () {
    const { emit } = getCurrentInstance()
    const onClick = (page) => {
      emit('click', page)
    }

    return {
      onClick
    }
  }
}
</script>

<style scoped>

</style>
