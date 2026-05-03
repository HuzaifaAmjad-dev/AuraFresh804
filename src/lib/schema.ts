import {
    pgTable, text, timestamp, boolean, decimal,
    integer, pgEnum, uniqueIndex
  } from "drizzle-orm/pg-core"
  import { relations } from "drizzle-orm"
  import { createId } from "@paralleldrive/cuid2"
  // Enums
  export const roleEnum = pgEnum("Role", ["ADMIN", "CUSTOMER"])
  export const genderEnum = pgEnum("Gender", ["MALE", "FEMALE", "UNISEX"])
  export const orderStatusEnum = pgEnum("OrderStatus", [
    "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"
  ])
  export const paymentStatusEnum = pgEnum("PaymentStatus", ["UNPAID", "PAID", "REFUNDED"])
  
  
  // Users
  export const users = pgTable("users", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified"),
    image: text("image"),
    password: text("password"),
    role: roleEnum("role").default("CUSTOMER"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  })
  
  // Accounts
  export const accounts = pgTable("accounts", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  })
  
  // Sessions
  export const sessions = pgTable("sessions", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
  })
  // Verification Tokens
  export const verificationTokens = pgTable("verification_tokens", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  })
  
  // Categories
  export const categories = pgTable("categories", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    image: text("image"),
    isDeleted: boolean("isDeleted").default(false),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  })
  
  // Products
  export const products = pgTable("products", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    comparePrice: decimal("comparePrice", { precision: 10, scale: 2 }),
    images: text("images").array().default([]),
    stock: integer("stock").default(0),
    isActive: boolean("isActive").default(true),
    isFeatured: boolean("isFeatured").default(false),
    isDeleted: boolean("isDeleted").default(false),
    categoryId: text("categoryId").notNull().references(() => categories.id, { onDelete: "cascade" }),
    volume: text("volume"),
    gender: genderEnum("gender").default("UNISEX"),
    topNotes: text("topNotes").array().default([]),
    middleNotes: text("middleNotes").array().default([]),
    baseNotes: text("baseNotes").array().default([]),
    occasion: text("occasion"),
    season: text("season"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  })
  
  // Orders
  export const orders = pgTable("orders", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    orderNumber: text("orderNumber").notNull().unique(),
    userId: text("userId").references(() => users.id),
    status: orderStatusEnum("status").default("PENDING"),
    paymentStatus: paymentStatusEnum("paymentStatus").default("UNPAID"),
    paymentMethod: text("paymentMethod").default("COD"),
    payerName: text("payerName"),
    amountSent: decimal("amountSent", { precision: 10, scale: 2 }),
    paymentScreenshot: text("paymentScreenshot"),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    notes: text("notes"),
    customerName: text("customerName").notNull(),
    customerEmail: text("customerEmail"),
    customerPhone: text("customerPhone").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    province: text("province").notNull(),
    postalCode: text("postalCode"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  })
  
  // Order Items
  export const orderItems = pgTable("order_items", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    orderId: text("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: text("productId").notNull().references(() => products.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  })
  
  // Order Status Logs
  export const orderStatusLogs = pgTable("order_status_logs", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    orderId: text("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
    status: orderStatusEnum("status").notNull(),
    note: text("note"),
    createdAt: timestamp("createdAt").defaultNow(),
  })


export const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
    accounts: many(accounts),
    sessions: many(sessions),
  }))
  
  export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products),
  }))
  
  export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
      fields: [products.categoryId],
      references: [categories.id],
    }),
    orderItems: many(orderItems),
  }))
  
  export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, { fields: [orders.userId], references: [users.id] }),
    items: many(orderItems),
    statusLogs: many(orderStatusLogs),
  }))
  
  export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
    product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  }))
  
  export const orderStatusLogsRelations = relations(orderStatusLogs, ({ one }) => ({
    order: one(orders, { fields: [orderStatusLogs.orderId], references: [orders.id] }),
  }))
  
  export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
  }))
  
  export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
  }))