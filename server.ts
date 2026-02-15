import app from "./src/app";
import { env } from "./src/config/env";
import { prisma } from "./src/config/prisma";

const server = app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
  console.log(`Environemnt ${env.NODE_ENV}`);
});

const gracefulShutdown = async () => {
  console.log("Shutting down gracefully....");
  server.close(async () => {
    console.log("Http Server Closed.");

    await prisma.$disconnect();
    console.log("database disconnected.");

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("Forced Shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
