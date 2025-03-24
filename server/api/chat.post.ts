import { streamText } from 'ai'
import { createWorkersAI } from 'workers-ai-provider'

defineRouteMeta({
  openAPI: {
    description: 'Chat with AI.',
    tags: ['ai']
  }
})

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const workersAI = createWorkersAI({ binding: hubAI() })

  return streamText({
    model: workersAI('@cf/meta/llama-3.1-8b-instruct'),
    system: 'You are a helpful assistant that can answer questions and help with Nuxt UI and Nuxt UI Pro v3.',
    messages
  }).toDataStreamResponse({
    headers: {
    }
  })
})
