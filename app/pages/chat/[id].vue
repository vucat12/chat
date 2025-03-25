<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const { model } = useLLM()
const route = useRoute()

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
</script>

<template>
  <UDashboardPanel id="chat">
    <template #body>
      <UContainer class="w-full">
        <UChatMessages :messages="messages" :status="status" />
      </UContainer>
    </template>

    <template #footer>
      <UContainer class="w-full">
        <UChatPrompt
          v-model="input"
          :status="status"
          :error="error"
          :reload="reload"
          :stop="stop"
          class="[view-transition-name:chat-prompt] rounded-b-none bg-(--ui-bg)"
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
