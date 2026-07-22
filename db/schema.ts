import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const assets = sqliteTable("assets", {
  id: text("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  quantity: real("quantity").notNull(),
  currency: text("currency").notNull(),
  buyPrice: real("buy_price").notNull(),
  price: real("price").notNull(),
  previousClose: real("previous_close").notNull(),
  status: text("status"),
});
