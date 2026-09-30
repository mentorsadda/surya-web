process.on("uncaughtException", (err) => {
  console.error("FATAL Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

import "./server/index.mjs";
