<script lang="ts">
import type { Message } from '@ai-sdk/vue'

interface ChatMessagesProps {
  messages: Message[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
}
</script>

<script setup lang="ts">
const props = defineProps<ChatMessagesProps>()

const { el, shouldAutoScroll, scrollToBottom } = useChatScroll(toRef(props, 'messages'), toRef(props, 'status'))
</script>

<template>
  <div ref="el" class="w-full flex flex-col flex-1 relative">
    <div class="flex flex-col flex-1 gap-4 w-full">
      <div
        v-for="message in messages"
        :key="message.id"
        class="max-w-[75%]"
        :class="[
          message.role === 'assistant'
            ? 'me-auto px-4.5'
            : 'ms-auto px-2.5'
        ]"
      >
        <MDC :value="message.content" />
      </div>

      <div v-if="status === 'submitted'" class="flex gap-1 max-w-[75%] me-auto px-4.5 my-5">
        <span class="size-2 rounded-full bg-(--ui-bg-accented) animate-bounce" />
        <span class="size-2 rounded-full bg-(--ui-bg-accented) animate-bounce [animation-delay:150ms]" />
        <span class="size-2 rounded-full bg-(--ui-bg-accented) animate-bounce [animation-delay:300ms]" />
      </div>
    </div>

    <Transition name="fade">
      <div v-if="!shouldAutoScroll" class="fixed left-1/2 -translate-x-1/2 top-[79%]">
        <UButton
          class=" z-10 rounded-full"
          icon="i-lucide-arrow-down"
          color="neutral"
          variant="outline"
          @click="scrollToBottom()"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
