import { randomUUID } from 'node:crypto'
import { sql, relations } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const chats = sqliteTable('chats', {
  id: text().primaryKey().$defaultFn(() => randomUUID()),
  title: text(),
  userId: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
}, t => [
  index('userIdIdx').on(t.userId)
])

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages)
}))

export const messages = sqliteTable('messages', {
  id: text().primaryKey().$defaultFn(() => randomUUID()),
  chatId: text().notNull().references(() => chats.id),
  role: text({ enum: ['user', 'assistant'] }).notNull(),
  content: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
}, t => [
  index('chatIdIdx').on(t.chatId)
])

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  })
}))
