import { PrismaClient } from "@prisma/client";

//# This approach to initializing Prisma Client is for Next.js
// It ensures that there's only one instance of Prisma Client in development and a new one for each serverless function invocation in production

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
