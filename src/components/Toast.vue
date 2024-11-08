<template>
  <div class="alert toast-box" :class="`alert-${type}`" role="alert">
    {{ messages }}
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    messages: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    }
  }
}
</script>

<style scoped>
  .toast-box {
    position: fixed;
    top: 10px;
    right: 10px;
  }
</style>
