<script setup lang="ts">
import { LazyModalConfirm } from '#components'

const route = useRoute()
const toast = useToast()
const overlay = useOverlay()

const deleteModal = overlay.create(LazyModalConfirm, {
  props: {
    title: 'Delete chat',
    description: 'Are you sure you want to delete this chat? This cannot be undone.'
  }
})

const { data: chats, refresh } = useFetch('/api/chats', {
  transform: data => data.map(chat => ({
    id: chat.id,
    label: chat.title ?? 'Untitled',
    to: `/chat/${chat.id}`,
    icon: 'i-lucide-message-circle',
    createdAt: chat.createdAt
  }))
})

watch(() => route.params.id, () => {
  refresh()
})

const { groups } = useChats(chats)

const items = computed(() => groups.value?.flatMap((group) => {
  return [{
    label: group.label,
    type: 'label' as const
  }, ...group.items.map(item => ({
    ...item,
    slot: 'chat' as const
  }))]
}))

async function deleteChat(id: string) {
  const shouldDelete = await deleteModal.open()
  if (!shouldDelete) {
    return
  }

  await $fetch(`/api/chats/${id}`, { method: 'DELETE' })

  toast.add({
    title: 'Chat deleted',
    description: 'Your chat has been deleted',
    icon: 'i-lucide-trash'
  })

  refresh()

  if (route.params.id === id) {
    navigateTo('/')
  }
}
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSearch
      placeholder="Search chats..."
      :groups="[{
        id: 'links',
        items: [{
          label: 'New chat',
          to: '/',
          icon: 'i-lucide-square-pen'
        }]
      }, ...groups]"
    />

    <UDashboardSidebar collapsible resizable class="bg-(--ui-bg-elevated)/50">
      <template #header="{ collapsed }">
        <NuxtLink to="/" class="flex items-end gap-1.5">
          <Logo class="h-8 w-auto shrink-0" />
          <span v-if="!collapsed" class="text-lg font-bold">Chat</span>
        </NuxtLink>

        <div v-if="!collapsed" class="flex items-center ms-auto">
          <UDashboardSearchButton collapsed />
          <UDashboardSidebarCollapse />
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="flex flex-col-reverse gap-1.5">
          <template v-if="collapsed">
            <UDashboardSearchButton collapsed />
            <UDashboardSidebarCollapse />
          </template>

          <UButton
            v-bind="collapsed ? { icon: 'i-lucide-plus' } : { label: 'New chat' }"
            variant="subtle"
            block
            to="/"
          />
        </div>

        <UNavigationMenu
          :items="items"
          :collapsed="collapsed"
          orientation="vertical"
          :ui="{ link: 'overflow-hidden' }"
        >
          <template #chat-leading="{ item }">
            <UIcon v-show="collapsed" :name="item.icon" class="shrink-0 size-5 text-(--ui-primary) group-data-[state=open]:text-(--ui-primary)" />
          </template>

          <template #chat-trailing="{ item }">
            <div class="flex -mr-1.25 translate-x-full group-hover:translate-x-0 transition-transform">
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="xs"
                class="text-(--ui-text-muted) hover:text-(--ui-primary) hover:bg-(--ui-bg-accented)/50 focus-visible:bg-(--ui-bg-accented)/50 p-0.5"
                @click.stop.prevent="deleteChat((item as any).id)"
              />
            </div>
          </template>
        </UNavigationMenu>
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
