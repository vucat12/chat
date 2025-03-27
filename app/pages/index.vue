<script setup lang="ts">
const input = ref('')
const loading = ref(false)

const { model } = useLLM()

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: { input: prompt }
  })

  navigateTo(`/chat/${chat.id}`)
}

function onSubmit() {
  createChat(input.value)
}

const quickChats = [
  {
    label: 'Why use Nuxt UI Pro?',
    icon: 'i-logos-nuxt-icon'
  },
  {
    label: 'Help me create a Vue composable',
    icon: 'i-logos-vue'
  },
  {
    label: 'Tell me more about UnJS',
    icon: 'i-logos-unjs'
  },
  {
    label: 'Why should I consider VueUse?',
    icon: 'i-logos-vueuse'
  },
  {
    label: 'Tailwind CSS best practices',
    icon: 'i-logos-tailwindcss-icon'
  }
]
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'flex flex-col justify-center flex-1 max-w-(--ui-container) mx-auto' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <h1 class="text-3xl sm:text-4xl text-(--ui-text-highlighted) font-bold">
        How can I help you today?
      </h1>

      <UChatPrompt
        v-model="input"
        :status="loading ? 'streaming' : 'ready'"
        class="[view-transition-name:chat-prompt]"
        @submit="onSubmit"
      >
        <template #footer>
          <ModelSelect v-model="model" />
        </template>
      </UChatPrompt>

      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="quickChat in quickChats"
          :key="quickChat.label"
          :icon="quickChat.icon"
          :label="quickChat.label"
          size="sm"
          color="neutral"
          variant="outline"
          class="rounded-full"
          @click="createChat(quickChat.label)"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
