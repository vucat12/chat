export function useChatScroll(messages: Ref<any[]>, status: Ref<string>) {
  const container = ref<HTMLElement | null>(null)
  const shouldAutoScroll = ref(true)

  const checkScrollPosition = () => {
    if (!container.value) return

    const scrollPosition = container.value.scrollTop + container.value.clientHeight
    const scrollHeight = container.value.scrollHeight

    // If we're within 100px of the bottom, enable auto-scroll
    shouldAutoScroll.value = scrollHeight - scrollPosition < 100
  }

  const scrollToBottom = (element?: HTMLElement | null) => {
    const target = element || container.value
    if (!target) return

    target.scrollTop = target.scrollHeight
  }

  // Watch for new messages
  watch(() => messages.value.length, () => {
    if (shouldAutoScroll.value) {
      nextTick(() => scrollToBottom(container.value))
    }
  })

  // Watch for streaming status
  watch(() => status.value, (newStatus) => {
    // When streaming starts or continues
    if (newStatus === 'streaming' && shouldAutoScroll.value) {
      nextTick(() => scrollToBottom(container.value))
    }
  })

  // Watch for content changes during streaming
  watch(() => messages.value, () => {
    if (status.value === 'streaming' && shouldAutoScroll.value) {
      requestAnimationFrame(() => scrollToBottom(container.value))
    }
  }, { deep: true })

  // Initial scroll to bottom
  onMounted(() => {
    nextTick(() => scrollToBottom(container.value))
  })

  return {
    container,
    shouldAutoScroll,
    checkScrollPosition,
    scrollToBottom
  }
}
