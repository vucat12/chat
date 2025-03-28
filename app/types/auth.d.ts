// auth.d.ts
declare module '#auth-utils' {
  interface User {
    name: string
    email: string
    avatar: string
    username: string
    provider: 'github'
    providerId: string
  }
}

export {}
