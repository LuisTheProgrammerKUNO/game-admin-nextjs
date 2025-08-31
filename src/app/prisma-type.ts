import { Prisma } from '@prisma/client';

type UserRow = Prisma.UserGetPayload<{
  select: {
    id: true;
    first_name: true;
    last_name: true;
    requestDeletion: true;
    users_sync: { select: { email: true; name: true } };
  };
}>;
