import { Prisma } from '@prisma/client'

export type UserRow = Prisma.usersGetPayload<{
  select: {
    id: true
    first_name: true
    last_name: true
    username: true
  }
}>
