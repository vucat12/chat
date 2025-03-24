<script setup lang="ts">
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      class="bg-(--ui-bg-elevated)/25"
      :ui="{ footer: 'lg:border-t lg:border-(--ui-border)' }"
    >
      <template #header="{ collapsed }">
        Chat
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
