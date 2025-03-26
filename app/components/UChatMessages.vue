<script lang="ts">
import type { UseChatHelpers } from '@ai-sdk/vue'

interface ChatMessagesProps {
  messages: UseChatHelpers['messages']['value']
  status: UseChatHelpers['status']['value']
  shouldAutoScroll: boolean
  scrollToBottom: () => void
}
</script>

<script setup lang="ts">
const props = defineProps<ChatMessagesProps>()
</script>

<template>
  <div class="relative w-full">
    <div class="flex flex-col gap-4 w-full">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'max-w-[75%]',
          message.role === 'assistant'
            ? 'me-auto px-4.5'
            : 'ms-auto px-2.5'
        ]"
      >
        <MDC :value="message.content" />
      </div>

      <!-- Typing indicator when streaming -->
      <div
        v-if="status === 'streaming'"
        class="p-3 rounded-lg max-w-[80%] bg-gray-100 me-auto"
      >
        <div class="flex gap-1">
          <span class="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0ms" />
          <span class="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 150ms" />
          <span class="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 300ms" />
        </div>
      </div>

      <!-- Invisible element at the end -->
      <div ref="messagesEndRef" class="h-1 w-full" />
    </div>

    <!-- Scroll to bottom button -->
    <div
      v-if="!shouldAutoScroll"
      class="absolute bottom-4 right-4 z-10"
    >
      <UButton
        icon="i-heroicons-arrow-down"
        color="primary"
        variant="soft"
        size="sm"
        @click="() => { scrollToBottom(); }"
      >
        Scroll to bottom
      </UButton>
    </div>
  </div>
</template>
