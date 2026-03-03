import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const shortLinks = pgTable("short_links", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  originalUrl: text("original_url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  title: text("title"),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
