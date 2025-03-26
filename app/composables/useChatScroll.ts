import type { Message } from '@ai-sdk/vue'

export function useChatScroll(messages: Ref<Message[]>, status: Ref<string>) {
  const el = ref<HTMLElement | null>(null)
  const parent = ref<HTMLElement | null>(null)
  const shouldAutoScroll = ref(true)

  function checkScrollPosition() {
    if (!parent.value) return

    const scrollPosition = parent.value.scrollTop + parent.value.clientHeight
    const scrollHeight = parent.value.scrollHeight

    // If we're within 100px of the bottom, enable auto-scroll
    shouldAutoScroll.value = scrollHeight - scrollPosition < 100
  }

  function scrollToBottom(element?: HTMLElement | null) {
    const target = element || parent.value
    if (!target) return

    target.scrollTop = target.scrollHeight
  }

  // Watch for new messages
  watch(() => messages.value.length, () => {
    if (shouldAutoScroll.value) {
      nextTick(() => scrollToBottom(parent.value))
    }
  })

  // Watch for streaming status
  watch(() => status.value, (newStatus) => {
    // When streaming starts or continues
    if (newStatus === 'streaming' && shouldAutoScroll.value) {
      nextTick(() => scrollToBottom(parent.value))
    }
  })

  // Watch for content changes during streaming
  watch(() => messages.value, () => {
    if (status.value === 'streaming' && shouldAutoScroll.value) {
      requestAnimationFrame(() => scrollToBottom(parent.value))
    }
  }, { deep: true })

  function getScrollParent(node: HTMLElement | null) {
    if (!node) {
      return null
    }

    if (node.scrollHeight > node.clientHeight) {
      return node
    } else {
      return getScrollParent(node.parentNode as HTMLElement)
    }
  }

  // Initial scroll to bottom
  onMounted(() => {
    parent.value = getScrollParent(el.value)

    if (parent.value) {
      // Add scroll event listener to detect when user scrolls manually
      parent.value.addEventListener('scroll', checkScrollPosition)
    }

    nextTick(() => scrollToBottom(parent.value))
  })

  // Clean up event listener
  onUnmounted(() => {
    if (parent.value) {
      parent.value.removeEventListener('scroll', checkScrollPosition)
    }
  })

  return {
    el,
    shouldAutoScroll,
    checkScrollPosition,
    scrollToBottom
  }
}
