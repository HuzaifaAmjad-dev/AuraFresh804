import "dotenv/config"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "@/lib/schema"
import bcrypt from "bcryptjs"

// Use DIRECT_URL for scripts, bypasses pgBouncer
const client = postgres(process.env.DIRECT_URL!)
const db = drizzle(client, { schema })

async function main() {
  const hashedPassword = await bcrypt.hash("aizaz123", 12)

  await db.insert(schema.users).values({
    id: crypto.randomUUID(),
    name: "Admin",
    email: "admin@aurafresh804.com",
    password: hashedPassword,
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  console.log("✅ Admin user created!")
  process.exit(0)
}

main()