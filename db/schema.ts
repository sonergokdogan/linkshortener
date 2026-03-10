import { integer, pgTable, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const links = pgTable('links', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  shortCode: varchar('short_code', { length: 12 }).notNull().unique(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('links_user_id_idx').on(table.userId),
  shortCodeIdx: index('links_short_code_idx').on(table.shortCode),
}));

export const clicks = pgTable('clicks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  linkId: integer('link_id').notNull().references(() => links.id, { onDelete: 'cascade' }),
  clickedAt: timestamp('clicked_at').notNull().defaultNow(),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
}, (table) => ({
  linkIdIdx: index('clicks_link_id_idx').on(table.linkId),
}));

export const linksRelations = relations(links, ({ many }) => ({
  clicks: many(clicks),
}));

export const clicksRelations = relations(clicks, ({ one }) => ({
  link: one(links, {
    fields: [clicks.linkId],
    references: [links.id],
  }),
}));
