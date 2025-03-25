<script setup lang="ts">
const route = useRoute()

const { data: chats, refresh } = useFetch('/api/chats', {
  transform: data => data.map(chat => ({
    label: chat.title ?? 'Untitled',
    to: `/chat/${chat.id}`
  }))
})

watch(() => route.params.id, () => {
  refresh()
})

const items = computed(() => chats.value?.length
  ? [{
      label: 'Recent',
      type: 'label' as const
    }, ...chats.value]
  : []
)
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar collapsible resizable class="bg-(--ui-bg-elevated)/50">
      <template #header="{ collapsed }">
        <NuxtLink v-if="!collapsed" to="/" class="flex items-center gap-1.5">
          <Logo class="h-8 w-auto shrink-0" />
          <span class="text-lg font-bold font-mono">Chat</span>
        </NuxtLink>

        <UDashboardSidebarCollapse class="ms-auto" />
      </template>

      <template #default="{ collapsed }">
        <UButton
          v-bind="collapsed ? { icon: 'i-lucide-plus' } : { label: 'New chat' }"
          block
          to="/"
        />

        <UNavigationMenu :items="items" :collapsed="collapsed" orientation="vertical" />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :label="collapsed ? '' : 'Login'"
          icon="i-lucide-log-in"
          color="neutral"
          variant="ghost"
          class="w-full"
        />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
