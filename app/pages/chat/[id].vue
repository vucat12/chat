<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const route = useRoute()
const toast = useToast()
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
  },
  onResponse(response) {
    if (response.headers.get('X-Chat-Title')) {
      refreshNuxtData('chats')
    }
  },
  onError(error) {
    const { message } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error
    toast.add({
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  }
})

onMounted(() => {
  if (chat.value?.messages.length === 1) {
    reload()
  }
})
</script>

<template>
  <UDashboardPanel id="chat" class="relative" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
        <UChatMessages :messages="messages" :status="status" class="lg:pt-(--ui-header-height) pb-4 sm:pb-6" />

        <UChatPrompt
          v-model="input"
          :status="status"
          :error="error"
          :reload="reload"
          :stop="stop"
          class="!sticky bottom-0 inset-x-0 [view-transition-name:chat-prompt] rounded-b-none z-10 backdrop-blur"
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
