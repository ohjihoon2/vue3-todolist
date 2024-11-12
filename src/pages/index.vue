<template>
  <div>Home page</div>
  <div>{{ count }}</div>
  <button @click="count++">Add</button>
</template>

<script>
import { useCount } from '@/composables(hooks)/count'
export default {
  setup () {
    const { count } = useCount()
    console.log(count)

    return {
      count
    }
  }
}
</script>

<style scoped>

</style>
