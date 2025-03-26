<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const route = useRoute()
const { model } = useLLM()

const { data: chat } = await useFetch(`/api/chats/${route.params.id}`)
if (!chat.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
}

const { messages, input, handleSubmit, reload, stop, status, error } = useChat({
  id: chat.value.id,
  api: `/api/chats/${chat.value.id}`,
  initialMessages: chat.value.messages.map(message => ({
    id: message.id,
    content: message.content,
    role: message.role
  })),
  body: {
    model: model.value
  }
})

onMounted(() => {
  if (chat.value?.messages.length === 1) {
    reload()
  }
})

const { container, shouldAutoScroll, scrollToBottom } = useChatScroll(messages, status)

console.log('container.value', container.value)
</script>

<template>
  <UDashboardPanel id="chat">
    <template #body>
      <UContainer class="flex-1 flex flex-col">
        <button @click="scrollToBottom">
          Scroll to bottom
        </button>
        <UChatMessages
          :messages="messages"
          :status="status"
          :should-auto-scroll="shouldAutoScroll"
          :scroll-to-bottom="scrollToBottom"
          class="py-8 flex-1"
        />

        <!-- <UChatPrompt
          v-model="input"
          :status="status"
          :error="error"
          :reload="reload"
          :stop="stop"
          class="!sticky bottom-0 inset-x-0 max-w-(--ui-container) mx-auto [view-transition-name:chat-prompt] rounded-b-none z-10 backdrop-blur-lg"
          @submit="handleSubmit"
        >
          <template #footer>
            <ModelSelect v-model="model" />
          </template>
        </UChatPrompt> -->
      </UContainer>
    </template>

    <template #footer>
      <UContainer>
        <UChatPrompt
          v-model="input"
          :status="status"
          :error="error"
          :reload="reload"
          :stop="stop"
          class="[view-transition-name:chat-prompt] rounded-b-none"
          @submit="handleSubmit"
        >
          <template #footer>
            <ModelSelect v-model="model" />
          </template>
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
