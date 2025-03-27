<script setup lang="ts">
const input = ref('')
const loading = ref(false)

const { model } = useLLM()

async function onSubmit() {
  loading.value = true

  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: {
      input: input.value
    }
  })

  navigateTo(`/chat/${chat.id}`)
}
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'flex flex-col justify-center flex-1' }">
    <template #header>
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
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
