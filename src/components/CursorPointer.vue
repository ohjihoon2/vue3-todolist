<template>
  <a style="cursor: pointer" v-bind="$attrs">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'CursorPointer'
}
</script>

<style scoped>

</style>
