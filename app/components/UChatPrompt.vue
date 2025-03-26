<script lang="ts">
import type { UseChatHelpers } from '@ai-sdk/vue'

interface ChatPromptProps extends Partial<Pick<UseChatHelpers, 'stop' | 'reload'>> {
  status?: 'submitted' | 'streaming' | 'ready' | 'error'
  error?: Error
}

interface ChatPromptEmits {
  (e: 'submit', event: Event): void
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<ChatPromptProps>(), {
  status: 'ready'
})
const emit = defineEmits<ChatPromptEmits>()

const input = defineModel<string>()

const submitButtonProps = computed(() => {
  return ({
    ready: {
      icon: 'i-lucide-arrow-up',
      type: 'submit' as const
    },
    submitted: {
      icon: 'i-lucide-square',
      color: 'neutral' as const,
      variant: 'subtle' as const,
      onClick() {
        props.stop?.()
      }
    },
    streaming: {
      icon: 'i-lucide-square',
      color: 'neutral' as const,
      variant: 'subtle' as const,
      onClick() {
        props.stop?.()
      }
    },
    error: {
      icon: 'i-lucide-circle-alert',
      variant: 'subtle' as const,
      onClick() {
        props.reload?.()
      }
    }
  })[props.status]
})

function onSubmit(e: Event) {
  if (!input.value) {
    return
  }

  e.preventDefault()
  emit('submit', e)
}
</script>

<template>
  <form class="relative flex flex-col items-stretch gap-2 p-2.5 w-full rounded-[calc(var(--ui-radius)*2)] bg-(--ui-bg-elevated)/50 ring ring-(--ui-border)" @submit.prevent="onSubmit">
    <UTextarea
      v-model="input"
      placeholder="Type your message here..."
      variant="none"
      autoresize
      autofocus
      :disabled="Boolean(error)"
      :rows="1"
      :ui="{ base: 'resize-none' }"
      class="items-start"
      @keydown.enter.exact.prevent="onSubmit"
    >
      <div class="flex items-center justify-end gap-1.5">
        <UButton :disabled="!input" v-bind="submitButtonProps" />
      </div>
    </UTextarea>

    <div class="flex items-center gap-1.5">
      <slot name="footer" />
    </div>
    <!-- <UInput
      v-model="input"
      placeholder="Type here..."
      class="w-full"
      :disabled="Boolean(error)"
    />
    <UButton
      v-if="isLoading"
      icon="i-lucide-square"
      color="neutral"
      @click="stop"
    />
    <UButton
      v-else
      icon="i-lucide-send"
      type="submit"
      color="neutral"
    /> -->
  </form>
</template>
