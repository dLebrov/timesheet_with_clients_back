import { Prisma } from '@prisma/client';

type CustomClientsCreateArgs = Prisma.clientsCreateArgs & {
  context?: {
    user?: {
      id: number;
    };
  };
};

type CustomServicesCreateArgs = Prisma.servicesCreateArgs & {
  context?: {
    user?: {
      id: number;
    };
  };
};

export const prismaExtensions = Prisma.defineExtension((prisma) => {
  return prisma.$extends({
    query: {
      clients: {
        create({ args, query }) {
          const customArgs = args as CustomClientsCreateArgs;
          const userId = customArgs.context?.user?.id;
          if (userId) {
            customArgs.data.userId = userId;
          }
          return query(customArgs);
        },
      },
      services: {
        create({ args, query }) {
          const customArgs = args as CustomServicesCreateArgs;
          const userId = customArgs.context?.user?.id;
          if (userId) {
            customArgs.data.userId = userId;
          }
          return query(customArgs);
        },
      },
    },
  });
});
