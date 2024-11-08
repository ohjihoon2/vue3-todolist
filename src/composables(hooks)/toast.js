import { onUnmounted, ref } from 'vue'

export const useToast = () => {
  const toastMessages = ref('')
  const toastAlertType = ref('')
  const timeOut = ref(null)
  const showToast = ref(false)

  const triggerToast = (message, type = 'success') => {
    toastMessages.value = message
    showToast.value = true
    toastAlertType.value = type

    timeOut.value = setTimeout(() => {
      toastMessages.value = ''
      showToast.value = false
      toastAlertType.value = ''
      console.log('hello')
    }, 3000)
  }

  onUnmounted(() => {
    clearTimeout(timeOut.value)
  })

  return {
    toastMessages,
    toastAlertType,
    showToast,
    triggerToast

  }
}
