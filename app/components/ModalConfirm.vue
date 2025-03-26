<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()

const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :ui="{
      footer: 'justify-end'
    }"
    :close="false"
    :dismissible="false"
    @update:open="console.log('open', $event)"
  >
    <template #footer>
      <UButton
        color="neutral"
        variant="ghost"
        label="Cancel"
        @click="emit('close', false)"
      />
      <UButton label="Delete" @click="emit('close', true)" />
    </template>
  </UModal>
</template>
