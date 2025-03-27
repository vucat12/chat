<script lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { Message } from '@ai-sdk/vue'

interface ChatMessagesProps {
  messages: Message[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
}
</script>

<script setup lang="ts">
const props = defineProps<ChatMessagesProps>()

const el = ref<HTMLElement | null>(null)
const parent = ref<HTMLElement | null>(null)
const shouldAutoScroll = ref(true)

function scrollToBottom(element?: HTMLElement | null) {
  const target = element || parent.value
  if (!target) {
    return
  }

  target.scrollTop = target.scrollHeight
}

// Consolidated scroll logic with debounced scrolling
const debouncedScroll = useDebounceFn(() => {
  if (shouldAutoScroll.value) {
    scrollToBottom(parent.value)
  }
}, 10)

// Watch for new messages or content changes
watch(
  () => [props.messages.length, props.status],
  ([_, newStatus]) => {
    // Only auto-scroll when appropriate
    if (shouldAutoScroll.value && (newStatus === 'streaming' || newStatus === 'submitted')) {
      nextTick(debouncedScroll)
    }
  }
)

// Watch for content changes during streaming (for when message content updates)
watch(
  () => props.messages,
  () => {
    if (props.status === 'streaming' && shouldAutoScroll.value) {
      debouncedScroll()
    }
  },
  { deep: true }
)

function checkScrollPosition() {
  if (!parent.value) {
    return
  }

  const scrollPosition = parent.value.scrollTop + parent.value.clientHeight
  const scrollHeight = parent.value.scrollHeight

  // If we're within 100px of the bottom, enable auto-scroll
  shouldAutoScroll.value = scrollHeight - scrollPosition < 100
}

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
</script>

<template>
  <div ref="el" class="w-full flex flex-col flex-1 pb-4">
    <div class="flex flex-col flex-1 gap-4 sm:gap-6 w-full">
      <UPageCard
        v-for="message in messages"
        :key="message.id"
        :variant="message.role === 'assistant' ? 'naked' : 'soft'"
        :class="[
          message.role === 'assistant'
            ? 'me-auto'
            : 'ms-auto rounded-full'
        ]"
        :ui="{ container: '!px-2.5 !py-1.5' }"
      >
        <MDC :value="message.content" :cache-key="message.id" class="*:first:mt-0 *:last:mb-0" />
      </UPageCard>

      <div v-if="status === 'submitted'" class="flex gap-1 max-w-[75%] me-auto px-2.5 py-5">
        <span class="size-2 rounded-full bg-(--ui-bg-accented) animate-bounce" />
        <span class="size-2 rounded-full bg-(--ui-bg-accented) animate-bounce [animation-delay:150ms]" />
        <span class="size-2 rounded-full bg-(--ui-bg-accented) animate-bounce [animation-delay:300ms]" />
      </div>
    </div>

    <div v-if="!shouldAutoScroll" class="sticky bottom-0 inset-x-0 flex justify-end pointer-events-none px-2.5">
      <UButton
        icon="i-lucide-arrow-down"
        color="neutral"
        variant="outline"
        class="pointer-events-auto rounded-full"
        @click="() => {
          scrollToBottom()

          shouldAutoScroll = true
        }"
      />
    </div>
  </div>
</template>
