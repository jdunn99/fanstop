import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      log: [
        {
          emit: "event",
          level: "query",
        },
      ],
    });
  }
  prisma = global.cachedPrisma;

  // @ts-ignore
  prisma.$on("query", async (e: any) => {
    console.log(`${e.query} ${e.params}`);
  });
}

export const db = prisma;
