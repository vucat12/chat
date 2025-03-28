export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user }) {
    const db = useDrizzle()
    const session = await getUserSession(event)

    let dbUser = await db.query.users.findFirst({
      where: (users, { eq }) => and(eq(users.provider, 'github'), eq(users.providerId, user.id))
    })
    if (!dbUser) {
      dbUser = await db.insert(tables.users).values({
        id: session.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar_url,
        username: user.login,
        provider: 'github',
        providerId: user.id
      })
    }

    await setUserSession(event, {
      user: dbUser
    })

    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  }
})
