<script lang="ts">
import type { UseChatHelpers } from '@ai-sdk/vue'

interface ChatMessagesProps {
  messages: UseChatHelpers['messages']['value']
}
</script>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import { useWindowVirtualizer } from '@tanstack/vue-virtual'

const props = defineProps<ChatMessagesProps>()

const parentRef = ref<HTMLElement | null>(null)

const parentOffsetRef = ref(0)

onMounted(() => {
  parentOffsetRef.value = parentRef.value?.offsetTop ?? 0
})

const virtualizerOptions = computed(() => {
  return {
    count: props.messages.length,
    estimateSize: () => 68,
    // overscan: 10,
    scrollMargin: parentOffsetRef.value,
    getItemKey: (index: number) => {
      return props.messages[index]?.id ?? index
    },
    initialRect: { width: 0, height: 10000 }
  }
})

const virtualizer = useWindowVirtualizer(virtualizerOptions)

const virtualItems = computed(() => virtualizer.value.getVirtualItems())

const [DefineMessageTemplate, ReuseMessageTemplate] = createReusableTemplate<{ message: ChatMessagesProps['messages'][number] }>({
  props: {
    message: {
      type: Object as PropType<ChatMessagesProps['messages'][number]>,
      required: true
    }
  }
})

// virtualizer.value.shouldAdjustScrollPositionOnItemSizeChange = (item, _, instance) => {
//   return item.start < instance.scrollOffset && instance.scrollDirection === 'backward'
// }

function measureElement(el: HTMLElement) {
  if (!el) {
    return
  }

  virtualizer.value.measureElement(el)

  return undefined
}

onMounted(() => {
  // virtualizer.value.scrollToOffset(props.messages.length - 1)
})
</script>

<template>
  <DefineMessageTemplate v-slot="{ message }">
    <div :class="message.role === 'assistant' ? 'me-auto' : 'ms-auto'">
      <MDC :value="message.content" />
    </div>
  </DefineMessageTemplate>

  <button @click="virtualizer.scrollToIndex(50000)">
    scroll to the end
  </button>

  <div
    ref="parentRef"
    class="relative w-full flex-1 flex flex-col gap-4"
    :style="{
      height: `${virtualizer.getTotalSize()}px`
    }"
  >
    <div
      v-for="item in virtualItems"
      :key="(item.key as string)"
      :ref="measureElement"
      :data-index="item.index"
      :style="{
        '--start': `${item.start - virtualizer.options.scrollMargin}px`
      }"
      class="absolute top-0 left-0 w-full translate-y-[var(--start)]"
    >
      <ReuseMessageTemplate :message="messages[item.index]!" />
    </div>
    <!-- <div v-if="error" class="flex items-center justify-center gap-2">
      <div class="text-red-500">
        {{ 'An error occurred' }}
      </div>
      <UButton
        color="neutral"
        variant="subtle"
        size="xs"
        @click="reload()"
      >
        retry
      </UButton>
    </div> -->
  </div>
</template>
