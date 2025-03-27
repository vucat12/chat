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
  <UDashboardPanel id="chat" class="overflow-y-auto">
    <UDashboardNavbar class="sticky top-0 border-b-0 z-10 bg-(--ui-bg)/75 backdrop-blur-lg w-full lg:hidden">
      <template #right>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-plus"
          to="/"
        />
      </template>
    </UDashboardNavbar>

    <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
      <UChatMessages
        :messages="messages"
        :status="status"
        class="py-8"
      />

      <UChatPrompt
        v-model="input"
        :status="status"
        :error="error"
        :reload="reload"
        :stop="stop"
        class="!sticky bottom-0 inset-x-0 [view-transition-name:chat-prompt] rounded-b-none z-10 backdrop-blur-lg"
        @submit="handleSubmit"
      >
        <template #footer>
          <ModelSelect v-model="model" />
        </template>
      </UChatPrompt>
    </UContainer>

    <!-- <template #footer>
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
    </template> -->
  </UDashboardPanel>
</template>
