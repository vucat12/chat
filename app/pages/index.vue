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
    label: 'What are the advantages of using Nuxt UI Pro?',
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
  }
]
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'flex flex-col justify-center flex-1' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer>
        <ProseH1>How can I help you today?</ProseH1>

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

        <div class="mt-6 flex flex-wrap gap-2">
          <UBadge
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            color="neutral"
            variant="outline"
            class="cursor-pointer py-2 px-3 rounded-full hover:bg-(--ui-bg-muted)"
            @click="createChat(quickChat.label)"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
