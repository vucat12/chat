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
      variant: 'subtle' as const,
      onClick() {
        props.stop?.()
      }
    },
    streaming: {
      icon: 'i-lucide-square',
      variant: 'subtle' as const,
      onClick() {
        props.stop?.()
      }
    },
    error: {
      icon: 'i-lucide-rotate-ccw',
      color: 'error' as const,
      variant: 'soft' as const,
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

  emit('submit', e)
}

const textarea = useTemplateRef('textarea')

function blur() {
  textarea.value?.textareaRef?.blur()
}

defineShortcuts({
  '/': () => {
    textarea.value?.textareaRef?.focus()
  }
})
</script>

<template>
  <form
    class="relative flex flex-col items-stretch gap-2 p-2.5 w-full rounded-[calc(var(--ui-radius)*2)] bg-(--ui-bg-elevated)/50 ring ring-(--ui-border)"
    @submit.prevent="onSubmit"
  >
    <UTextarea
      ref="textarea"
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
      @keydown.esc="blur"
    >
      <div class="flex items-center justify-end gap-1.5">
        <UButton :disabled="!input && status === 'ready'" color="neutral" v-bind="submitButtonProps" />
      </div>
    </UTextarea>

    <div class="flex items-center gap-1.5">
      <slot name="footer" />
    </div>
  </form>
</template>
