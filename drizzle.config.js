/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/lib/server/db/schema.js",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: "file:sqlite.db",
  },
};
