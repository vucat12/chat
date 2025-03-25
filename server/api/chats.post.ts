export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const { input } = await readBody(event)
  const db = useDrizzle()

  let body
  try {
    body = await hubAI().run('@cf/facebook/bart-large-cnn', {
      input_text: input,
      max_length: 14
    })
  } catch {
    body = input
  }

  const chat = await db.insert(tables.chats).values({
    title: body.summary,
    userId: session.id
  }).returning().get()

  await db.insert(tables.messages).values({
    chatId: chat.id,
    role: 'user',
    content: input
  })

  return chat
})
