export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const { input } = await readBody(event)
  const db = useDrizzle()

  let title
  try {
    const { response } = await hubAI().run('@cf/meta/llama-3-8b-instruct', {
      stream: false,
      messages: [{
        role: 'system',
        content: `\n
        - you will generate a short title based on the first message a user begins a conversation with
        - ensure it is not more than 30 characters long
        - the title should be a summary of the user's message
        - do not use quotes or colons
        - do not use markdown, just plain text`
      }, {
        role: 'user',
        content: input
      }]
    })

    console.log('response', response)

    title = response
  } catch {
    title = input
  }

  const chat = await db.insert(tables.chats).values({
    title,
    userId: session.id
  }).returning().get()

  await db.insert(tables.messages).values({
    chatId: chat.id,
    role: 'user',
    content: input
  })

  return chat
})
